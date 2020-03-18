last_checked_time = 1;
browser.runtime.onMessage.addListener(global_handler);

function global_handler(message) {
    console.log("From bg:");
    console.log(message.tabID);
    browser.tabs.sendMessage(message.tabID, {"last_checked_time": last_checked_time});
    last_checked_time += 1;
}

