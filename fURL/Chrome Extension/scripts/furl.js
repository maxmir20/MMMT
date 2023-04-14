//Stage 0 Access URL via temp DOM

// V1 on click
// Stage 1 Copy URL and trim UTM (edge cases for http and outmost)

function copyURL(){
//  access the href so we can get the URL (replace with what's in clipboard)
    console.log("starting copyURL");
    let url = window.location.href;

//    check if we have a valid url
    let copyFrom = document.createElement('input');
    copyFrom.type = 'url';
    copyFrom.value = url;
    console.log(copyFrom.value);
    if (!copyFrom.checkValidity()) {
        console.log("copied value isn't a url");
        return;
    } else {
        console.log("copied value is a url: " + copyFrom.value)
    }

//  trim the url of any utm elements
    copyFrom.value = trimURL(url);
    console.log("trimmed_url is " + copyFrom.value);

// Stage 2 Using Clipboard API, copy to clipboard

//  Alternate: as described here: https://george.mand.is/2020/04/making-a-simple-chrome-extension-in-2020-to-copy-urls-from-open-tabs/
// and here: https://stackoverflow.com/questions/71008190/copying-to-clipboard-in-a-content-script

    document.body.appendChild(copyFrom);

    copyFrom.select()
    document.execCommand('copy');

    copyFrom.blur();
    document.body.removeChild(copyFrom);


//    copyFrom = document.createElement("textarea");
//    copyFrom.textContent = trimmed_url;
//    let copyFrom = document.createElement("input");
//    copyFrom.type = 'url;'
//    copyFrom.value = trimmed_url;
//    console.log(copyFrom)


////    copy to clipboard with console log + permission (NOT WORKING)
//    await navigator.permissions.query({name: "clipboard-write"}).then((result) => {
//      if (result.state === "granted" || result.state === "prompt") {
//        window.focus();
//        navigator.clipboard.writeText(trimmed_url).then(() => {
//            console.log("successfully wrote url to clipboard");
//        }, (error) => {
//            console.log("failed to write url to clipboard: " + error);
//        });
//      }
//    });

}


// V2 monitor clipboard?
// Stage 3: if UTM in clipboard, read and then edit?

// Stage 4, link to website db?

function trimURL(url){
//    const url = tabs[0].url
    // search for query parameters
    const utm_params = new Set(["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid"]);


    let path_split = url.split('?')
    console.log("path split is: " + path_split);
    let updated_params = "";
    if  (path_split.length > 1) {
        let query_params = path_split[1].split('&');
        console.log("query params are: " + query_params);

        for (let i=0; i < query_params.length; i++) {
            let [key, value] = query_params[i].split('=');
            console.log("key: " + key + "| value: " + value);
            if (key && !(utm_params.has(key))) {
//              re-adding the parameter if it's not in our utm list
                updated_params += key + '=' + value;
            }
        }
    } else {
        console.log("no query parameters found")
    }
    console.log("updated params: " + updated_params);

    if (updated_params){
        updated_params = "?" + updated_params
    }
    return path_split[0] + updated_params;

//    return path_split;
  }


function isURL(text){

}

//// Example
//const url = getURL()
//(async()=>{
//    await copyURL();
//})();
copyURL();
//chrome.tabs
//    .query({currentWindow: true, active: true})
//    .then(copyURL, onError);
    
