function copy_address(){

    let url = window.location.href;
    console.log(url);
//    import copyURL and run
    (async () => {
        const src = chrome.runtime.getURL("modules/copyURL.js");
        const copyURL = await import(src);
        console.log(copyURL);
        copyURL.copy(url);
    })();

}

console.log("copying address bar");
copy_address();