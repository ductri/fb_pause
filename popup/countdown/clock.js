// Create Countdown
var Countdown = {
  
  // Backbone-like structure
  $el: $('.countdown'),
  
  // Params
  countdown_interval: null,
  total_seconds     : 0,

  hours_dom   : $('.countdown').find('.bloc-time.hours .figure'),
  minutes_dom : $('.countdown').find('.bloc-time.min .figure'),
  seconds_dom: $('.countdown').find('.bloc-time.sec .figure'),

  // Initialize the countdown  
  init: function() {

    // DOM
		this.$ = {
    	hours  : this.$el.find('.bloc-time.hours .figure'),
    	minutes: this.$el.find('.bloc-time.min .figure'),
    	seconds: this.$el.find('.bloc-time.sec .figure')
   	};

    // Init countdown values
    this.values = {
	      hours  : this.$.hours.parent().attr('data-init-value'),
        minutes: this.$.minutes.parent().attr('data-init-value'),
        seconds: this.$.seconds.parent().attr('data-init-value'),
    };
    
    // Initialize total seconds
    this.total_seconds = this.values.hours * 60 * 60 + (this.values.minutes * 60) + this.values.seconds;

    // Animate countdown to the end 
    this.count();
  },
  
  count: function() {
    
    var that    = this,
        $hour_1 = this.$.hours.eq(0),
        $hour_2 = this.$.hours.eq(1),
        $min_1  = this.$.minutes.eq(0),
        $min_2  = this.$.minutes.eq(1),
        $sec_1  = this.$.seconds.eq(0),
        $sec_2  = this.$.seconds.eq(1);
    
        this.countdown_interval = setInterval(function() {

        if(that.total_seconds > 0) {

            --that.values.seconds;              

            if(that.values.minutes >= 0 && that.values.seconds < 0) {

                that.values.seconds = 59;
                --that.values.minutes;
            }

            if(that.values.hours >= 0 && that.values.minutes < 0) {

                that.values.minutes = 59;
                --that.values.hours;
            }

            // Update DOM values
            // Hours
            that.checkHour(that.values.hours, $hour_1, $hour_2);

            // Minutes
            that.checkHour(that.values.minutes, $min_1, $min_2);

            // Seconds
            that.checkHour(that.values.seconds, $sec_1, $sec_2);

            --that.total_seconds;
        }
        else {
            clearInterval(that.countdown_interval);
        }
    }, 1000);    
  },
  
  animateFigure: function($el, value) {
    
     var that         = this,
		     $top         = $el.find('.top'),
         $bottom      = $el.find('.bottom'),
         $back_top    = $el.find('.top-back'),
         $back_bottom = $el.find('.bottom-back');

    // Before we begin, change the back value
    $back_top.find('span').html(value);

    // Also change the back bottom value
    $back_bottom.find('span').html(value);

    // Then animate
    TweenMax.to($top, 0.8, {
        rotationX           : '-180deg',
        transformPerspective: 300,
	      ease                : Quart.easeOut,
        onComplete          : function() {

            $top.html(value);

            $bottom.html(value);

            TweenMax.set($top, { rotationX: 0 });
        }
    });

    TweenMax.to($back_top, 0.8, { 
        rotationX           : 0,
        transformPerspective: 300,
	      ease                : Quart.easeOut, 
        clearProps          : 'all' 
    });    
  },
  
  checkHour: function(value, $el_1, $el_2) {
    
    var val_1       = value.toString().charAt(0),
        val_2       = value.toString().charAt(1),
        fig_1_value = $el_1.find('.top').html(),
        fig_2_value = $el_2.find('.top').html();

    if(value >= 10) {

        // Animate only if the figure has changed
        if(fig_1_value !== val_1) this.animateFigure($el_1, val_1);
        if(fig_2_value !== val_2) this.animateFigure($el_2, val_2);
    }
    else {

        // If we are under 10, replace first figure with 0
        if(fig_1_value !== '0') this.animateFigure($el_1, 0);
        if(fig_2_value !== val_1) this.animateFigure($el_2, val_1);
    }    
  },

  set_countdown_value: function(hour_value, minute_value, second_value=0) {
    this.hours_dom.parent().attr('data-init-value', hour_value);
    this.minutes_dom.parent().attr('data-init-value', minute_value);
    this.seconds_dom.parent().attr('data-init-value', second_value);

    this.checkHour(hour_value, this.hours_dom.eq(0), this.hours_dom.eq(1));

    // Minutes
    this.checkHour(minute_value, this.minutes_dom.eq(0), this.minutes_dom.eq(1));

    // Seconds
    this.checkHour(second_value, this.seconds_dom.eq(0), this.seconds_dom.eq(1));
  }
};

var start_button = $('#start');
var reset_button = $('#reset');
var hour_input = $('#hour');
var minute_input = $('#minute');

$('#start').click(function() {
    hour_value = parseInt(hour_input.val());
    minute_value = parseInt(minute_input.val());
    counting_from(hour_value, minute_value);
});

$('#reset').click(function() {
    // Sending counting signal to background script
     browser.runtime.sendMessage({code: 'RESET'});

    // Counting on the popup
    if (Countdown.countdown_interval !== null) {
        console.log('counter countdown_interval is not null');
        clearInterval(Countdown.countdown_interval);
        Countdown.set_countdown_value(1, 0);
    }
});

function counting_from(hour_value, minute_value) {
    total_seconds = hour_value*3600 + minute_value*60;

    // Sending counting signal to background script
    console.log('Sending SET_CLOCK with duration: ' + total_seconds);
    browser.runtime.sendMessage({code: 'SET_CLOCK', duration: total_seconds});

    // Counting on the popup
    if (Countdown.countdown_interval !== null) {
        console.log('counter countdown_interval is not null');
        clearInterval(Countdown.countdown_interval);
    }
    console.log(hour_value +':'+ minute_value);

    // Let's go !
    Countdown.set_countdown_value(hour_value, minute_value);
    Countdown.init();
}

function get_state_x(page) {
    state = page.get_state();
    console.log("Sync state with background script: ");
    console.log(state);
    if (state.is_blocking === true) {
        current_hours = Math.floor(state.total_seconds/3600);
        current_minutes = Math.floor((state.total_seconds - 3600*current_hours)/60);
        current_seconds = state.total_seconds - 3600*current_hours - 60*current_minutes;
        console.log("Sync clock with background script. " + current_hours + ":" + current_minutes + ":" + current_seconds);
        Countdown.set_countdown_value(current_hours, current_minutes, current_seconds);
        Countdown.init();
    }
}

backgroundWindow = browser.runtime.getBackgroundPage();
backgroundWindow.then(get_state_x);

