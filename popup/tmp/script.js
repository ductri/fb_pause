function timepicker(){
  function createCircleOfDivs(num, radius, offsetX, offsetY, className, add, teilbar) {
     var x, y;
     for (var n = 0; n < num; n++) {
       x = radius * Math.cos(n / num * 2 * Math.PI);
       y = radius * Math.sin(n / num * 2 * Math.PI);
       var div = document.createElement("div");
       div.className = className;
       if(teilbar == 1){
         if(n+3 > 12){
          div.textContent = n+3-12+add;
         }else{
          div.textContent = n+3+add; 
         }
       }else{

         if(n % teilbar == 0){
           if(n+15 >= 60){
             div.setAttribute("data-value", n+15-60);
            div.textContent = n+15-60+add;
           }else{
            div.setAttribute("data-value", n+15);
            div.textContent = n+15+add; 
           }
         }else{
           if(n+15 >= 60){
             div.setAttribute("data-value", n+15-60);
            div.textContent = "⋅";
           }else{
            div.setAttribute("data-value", n+15);
            div.textContent = "\u00B7"; 
           }
         }
       }

       div.style.left = (x + offsetX) + "px";
       div.style.top = (y + offsetY) + "px";
       $(".timepicker .circle")[0].appendChild(div);
     }
   }
    var currentTime = new Date();
  function selectHours(){
    $(".timepicker .circle").html("");
    createCircleOfDivs(12, 101, 105, 105, "hour",0,1);
    createCircleOfDivs(12, 64, 110, 110, "hour2",12,1);
    $(".timepicker .circle").append('<div class="mid"></div>');
    $(".timepicker .top .active").removeClass("active");
    $(".timepicker .top .h").addClass("active");
    $(".hour, .hour2").on("mouseup", function(){
      $(".timepicker .top .h").text(  ($(this).text().length > 1 ) ?  $(this).text() : "0"+$(this).text() );
      selectMinutes();
  }); 
    
  }
  function selectMinutes(){
    $(".timepicker .circle").html("");
    $(".timepicker .top .active").removeClass("active");
    $(".timepicker .top .m").addClass("active");
    createCircleOfDivs(60, 101, 115, 115, "min",0,5);
    $(".timepicker .circle .min").on("mouseup", function(){
        $(".timepicker .top .m").text(  ($(this).attr("data-value").length > 1) ? $(this).attr("data-value") : "0"+$(this).attr("data-value")  );
    });
  }
  selectHours();
  $(".timepicker .top .h").text(currentTime.getHours());
  $(".timepicker .top .m").text(currentTime.getMinutes());
  
  $(".timepicker .top span").click(function(){
    if(!$(this).hasClass("active")){
      if($(this).hasClass("h")){
        selectHours();
      }else{
        selectMinutes();
      }
    }
  });
  $(".timepicker .action.ok").click(function(){
     var selectedTime = $(".timepicker .top .h").text()+":"+$(".timepicker .top .m").text();
    alert(selectedTime);
  });
  $(".timepicker .action.cancel").click(function(){
    //Cancel
  });
  
}
timepicker();