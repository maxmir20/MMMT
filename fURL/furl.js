

function trimURL(tabs){
    const url = tabs[0].url
    // search for query parameters
    const path_split = url.split('?')
    if  (path_split.length < 2) {
        
    } 
  }

// Example
const url = getURL()

browser.tabs
    .query({currentWindow: true, active: true})
    .then(trimURL, onError);
    
