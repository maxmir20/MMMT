//import { copyURL } from '../scripts/furl.js';

async function getCurrentTab(){
    let queryOptions = {active: true, lastFocusedWindow: true};
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab.id;
}

function closeWindow(){
    window.close()
}

function reportExecuteScriptError(error) {
    document.querySelector("#error-content").classList.remove("hidden");
    console.error(`Failed to capture URL: ${error}`);
  }
(async()=> {
    chrome.tabs.update({ active: true });

    let tabID = await getCurrentTab();

    chrome.scripting.executeScript({
        target : {tabId: tabID, allFrames : true },
        files: ["scripts/copy_address_bar.js"]
        });
})();
