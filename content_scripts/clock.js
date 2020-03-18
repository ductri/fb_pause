/**
* Check and set a global guard variable.
* If this content script is injected into the same page again,
* it will do nothing next time.
*/

console.log("From content script");
browser.runtime.onMessage.addListener(global_handler_listener);
console.log('popup script');

function global_handler_listener(message) {
    console.log("From browser action");
    console.log(message);
}




