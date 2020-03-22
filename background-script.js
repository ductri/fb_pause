"use strict";

// Global variables for the whole system state
var state = {is_blocking: false, total_seconds: -1}
var countdown_interval = null;

function global_handler(message) {
    console.log("From bg:");
    console.log("Code: " + message.code);
    switch (message.code) {
        case "SET_CLOCK":
            console.log("from background script: receive signal of setting clock");
            state.is_blocking = true;
            state.total_seconds = message.duration;
            count();
            break;

        case "RESET":
            state.is_blocking = false;
            clearInterval(countdown_interval);
            break;

        case "GET_STATUS":
            browser.tabs.query({currentWindow: true, active: true}).then(send_state_to_tab);
            break;
    }
}

function send_state_to_tab(tabs) {
    console.log("from background: sending state");
    console.log("tabs: " + tabs);
    for (let tab of tabs) {
        console.log("send to tab id " + tab.id);
        browser.tabs.sendMessage(tab.id, {is_blocking: state.is_blocking, total_seconds: state.total_seconds});
    }
}

function get_state() {
    return state;
}

function count() {
    countdown_interval = setInterval(function() {
        if (state.is_blocking === true && state.total_seconds > 0) {
            --state.total_seconds;
        }
        else {
            console.log("from background script: set blocking off");
            clearInterval(countdown_interval);
            state.is_blocking = false;
        }
    }, 1000);
}

browser.runtime.onMessage.addListener(global_handler);

