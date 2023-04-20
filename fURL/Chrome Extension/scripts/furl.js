//Stage 0 Access URL via temp DOM

// V1 on click
// Stage 1 Copy URL and trim UTM (edge cases for http and outmost)

function copyURL(url){

    //  access the href so we can get the URL (replace with what's in clipboard)
    console.log("starting copyURL");
    console.log(url);

//    let url = window.location.href;

//    check if we have a valid url
    let copyFrom = document.createElement('input');
    copyFrom.type = 'url';
    copyFrom.value = url;
    if (!copyFrom.checkValidity()) {
        console.log("copied value isn't a url: " + copyFrom.value);
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


//Option 1: Change Copy Dynamically
//Pros: Don't need readtext permission, will work outside of browser
//Cons: Doesn't trigger for Copy Link Address (security issues), Don't work for href yet


function readClipboard(){
    console.log("creating event listener for copy");

    let copyFrom = document.createElement('input');
    copyFrom.type = 'url';

    window.addEventListener("copy", (event) => {
        const selection = window.getSelection();
        console.log(selection.toString());
        event.clipboardData.setData("text/plain",
        trimURL(selection.toString()));

        event.preventDefault();
    });

    console.log("creating event listener for right click");

    window.addEventListener("contextmenu", (event) => {
//        Check that right click is clicked
        if (event.button !== 2) {
            return;
        }
        console.log("detected right click");
        const selection = window.getSelection();
        console.log("old selection");
        console.log(selection);

        selection.removeAllRanges();

        const range = document.caretRangeFromPoint(event.clientX, event.clientY);
        range.expand('word');

        selection.addRange(range);
        console.log("new selection");
        console.log(selection);

        let i = 0;
        let currNode = selection.anchorNode.parentNode
        while (currNode) {
            console.log("currNode is");
            console.log(currNode);
            if (currNode.href) {
                console.log("found href");
                setTimeout(function () {
                    console.log("checking if document is focused");
                    if (document.hasFocus()) {
                        copyURL(currNode.href);
                    } else {
                        console.log("document not in focus");
                    }
                }, 3000);
//                copyURL(currNode.href);
                break;
            } else {
            currNode = currNode.parentNode;
//            i += 1;
            }
        }

//        console.log(selection.getRangeAt(0));
    });
}
console.log("running script");
readClipboard();

    