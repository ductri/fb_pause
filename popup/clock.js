/**
 * CSS to hide everything on the page,
 * except for elements that have the "beastify-image" class.
 */
const hidePage = `body > :not(.beastify-image) {
                    display: none;
                  }`;
browser.tabs.insertCSS({code: hidePage});

function sendMessage(tabs) {
    console.log(tabs);
    browser.runtime.sendMessage({"tabID": tabs[0].id});

}

browser.tabs.query({active: true, currentWindow: true}).then(sendMessage);


