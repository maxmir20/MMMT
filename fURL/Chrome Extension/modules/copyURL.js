export function copy(url){
    console.log("starting copyurl")
    console.log(url);
//    add URL element and confirming that we have a valid URL
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

    document.body.appendChild(copyFrom);
    copyFrom.select()
    document.execCommand('copy');
    copyFrom.blur();
    document.body.removeChild(copyFrom);

}

export function trimURL(url){
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

}

console.log("copying address bar");
