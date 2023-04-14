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
    console.error(`Failed to execute furl content script: ${error}`);
  }
(async()=> {
    chrome.tabs.update({ active: true });

    let tabID = await getCurrentTab();

    chrome.scripting.executeScript({
        target : {tabId: tabID, allFrames : true },
        files: ["scripts/furl.js"]
        });
})();
//chrome.tabs.update({ active: true });
//(async() => {
//    let tab = await getCurrentTab();
//})
//let tab = await getCurrentTab();

//chrome.scripting.executeScript({
//    target : {tabId: tab.id },
//    file: ["scripts/furl.js"]
//    }, async function(results)
//        {
//          console.error(results[0])
//          console.error(results.length)
//          if (chrome.runtime.lastError || !results[0] || !results.length)
//            {
//                reportExecuteScriptError(TypeError);  // Permission error, tab closed, etc.
//            } else {
//                closeWindow()
//            }
//        });