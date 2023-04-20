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

// V2 monitor clipboard?
// Stage 3: if UTM in clipboard, read and then edit?

// Stage 4, link to website db?



//works but requires user permission
//    read clipboard
//    navigator.permissions.query({name: "clipboard-read"}).then((result) => {
//      if (result.state === "granted" || result.state === "prompt") {
//        window.focus();
//        clipboard = navigator.clipboard.readText().then(() => {
//            console.log("successfully read value to clipboard: " + clipboard);
//        }, (error) => {
//            console.log("failed to read value to clipboard: " + error);
//        });
//      }
//    });



//Failed attempts
//function updateClipboard(){
//    let copyFrom = document.createElement('input');
//    copyFrom.type = 'url';
//    copyFrom.value = window.clipboardData.getData("text/plain");
//    if (!copyFrom.checkValidity()) {
//        console.log("copied value isn't a url: " + copyFrom.value);
//        return;
//    } else {
//        console.log("copied value is a url: " + copyFrom.value)
//    }
//}

//  contextmenu event listener that didn't work
//    window.addEventListener("contextmenu", (event) => {
////        check if we have a link in the selection
//        console.log("grabbing anchorNode and focusNode");
//        const selection = window.getSelection();
//        console.log(selection.anchorNode);
//        console.log(selection.focusNode);
//        if (selection.anchorNode) {
//            console.log(selection.anchorNode);
//        } else {
//            console.log("can't find anchornode for selection")
//        }
//        const range = selection.getRangeAt(0);
//        if (range) {
//            if (range.anchorNode){
//                if (range.anchorNode.parentNode){
//                   const parent_href = range.anchorNode.parentNode.href;
//                   console.log("parent href is " + parent_href );
//                }
//                const anchor_href = range.anchorNode.href;
//                console.log("anchor_href is " + anchor_href);
//            } else {
//                console.log("can't find anchor node")
//            }
//
//            if (range.startContainer.parentNode.tagName === 'A') {
//            console.log("alternate way of grabbing anchor tag");
//            console.log("StartContainer " + range.startContainer.parentNode.href);
//
//            } else if (range.endContainer.parentNode.tagName === 'A'){
//            console.log("alternate way of grabbing anchor tag");
//            console.log("EndContainer " + range.endContainer.parentNode.href);
//
//            }
//        } else {
//            console.log("something went wrong")
//        }



//        console.log(selection.toString());
//        assess whether there's only one URL in parent node

//        self testing indicates it takes about 1-2 seconds to copy a link if there's no dilly-dallying
//        setTimeout(copyURL, 4000, selection.toString())
//    });

//    window.addEventListener("focus", async function(event) {
//         await navigator.permissions.query({name: "clipboard-read"}).then((result) => {
//            if (result.state === "granted" || result.state === "prompt") {
//                copyFrom.value = navigator.clipboard.readText();
//                if (!copyFrom.checkValidity()) {
//                    console.log("copied value isn't a url: " + copyFrom.value);
//                    return;
//                } else {
//                    console.log("copied value is a url: " + copyFrom.value)
//        //            add set for identified urls already
//                    copyFrom.value = trimURL(copyFrom.value);
//                    console.log("trimmed_url is " + copyFrom.value);
//
//                    document.body.appendChild(copyFrom);
//
//                    copyFrom.select()
//                    document.execCommand('copy');
//
//                    copyFrom.blur();
//                    document.body.removeChild(copyFrom);
//
//                    }
//            }
//        });
//    }, false);

//Option 2: Paste Dynamically
//Pros: Don't need readtext permission, avoids Copy Link Address problem
//Cons: Open windows seem to throw it off/doesn't work on certain sites yet (Gmail, FB), won't work outside browser

//function pasteClipboard(){
//
////    let copyFrom = document.createElement('input');
////    copyFrom.type = 'url';
//
//    window.addEventListener("paste", (event) => {
//        event.preventDefault();
//
//        let paste = (event.clipboardData || window.clipboardData).getData("text/plain");
//        let trimmed = trimURL(paste);
////        const selection = document.getSelection();
////        if (!selection.rangeCount) return false;
////        selection.deleteFromDocument();
////
//
////        let copyFrom = document.createElement('input');
////        copyFrom.type = 'url';
////        copyFrom.value = trimmed;
////
////        document.body.appendChild(copyFrom);
////
////        copyFrom.select()
////        document.execCommand('copy');
////
////        copyFrom.blur();
////        document.body.removeChild(copyFrom);
////
//
//        setTimeout(function() {
//            document.execCommand("insertHTML", false, trimmed);
//            }, 50);
////        selection.collapseToEnd();
////        event.preventDefault();
//
//
////        const selection = document.getSelection();
////        console.log(selection.toString());
////        if (!selection.rangeCount) return false;
////        selection.deleteFromDocument();
////        selection.getRangeAt(0).insertNode(document.createTextNode(trimmed));
////        selection.collapseToEnd();
//        event.preventDefault();
//
//        });
//
//
//    }