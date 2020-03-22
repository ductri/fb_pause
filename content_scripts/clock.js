/*
The content script is only in charge of blocking the page whenever it is told by the background script.
*/

console.log("From content script");

function global_listener(message) {
    console.log("is_blocking: " + message.is_blocking);
    if (message.is_blocking === true) {
        block_page();
    }
}

function block_page() {
    /*
     * CSS to hide everything on the page,
     * except for elements that have the "beastify-image" class.
     */
    console.log("content script is blocking the page");

    document.addEventListener("DOMContentLoaded", ready);
    function ready() {
        window.stop();
        body = document.getElementsByTagName('body')[0];
        head = document.getElementsByTagName('head')[0];
        head.innerHTML = '';
        body.innerHTML = '';

        stylesheet_url = browser.runtime.getURL("content_scripts/cards/style.css");
        console.log('stypesheet_url');
        console.log(stylesheet_url);
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = stylesheet_url;
        head.appendChild(link);

      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        console.log('receiving');
        if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText);
            xml_string = `<div><div id="content">${data.content} </div>   |    <div id="author">     ${data.author} </div></div>`;
            quote_html = new DOMParser().parseFromString(xml_string, "text/xml").firstChild;
            body.appendChild(quote_html);
        }
      };
      console.log('sending');
      xhttp.open("GET", "https://api.quotable.io/random", true);
      xhttp.send();
    }
}

function asking_state() {
    browser.runtime.sendMessage({code: "GET_STATUS"});
}

browser.runtime.onMessage.addListener(global_listener);
asking_state();
