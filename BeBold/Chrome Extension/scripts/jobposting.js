//Part 0: upload stored template from extension (eventually replace with file upload)

//Part 1: look for LinkedIn Job Posting and capture list items
(function() {
    var scroll = document.querySelector('div[class*="jobs-description__content jobs-description-content"]')
    var details = document.getElementById("job-details");
    if (scroll != undefined){
        console.log('we made it!')
        scroll.scrollIntoView(true);
        return true
    }

})();

//Part 1.5 parse list items

//Part 2: access template and update contents (generate URI)

//Part 3: upload content to overleaf

/** Open the given url in the new tab */
function open_new_tab(url){
    chrome.tabs.create({ url: url });
}

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    /** Open the given url in the new tab */
    var linkUrl = info.linkUrl;
    //https://www.overleaf.com/docs?snip_uri=http://pathtoyourfile.tex&splash=none
    linkUrl = 'https://www.overleaf.com/docs?snip_uri=' + linkUrl +'&splash=none';
    open_new_tab(linkUrl);

});


const jobDetails = document.getElementById('job-details');

// Create a new <div> element to hold the copied <ul> elements
const liContainer = document.createElement('div');

// Loop through all the <ul> elements within job-details and copy them
for (let ul of jobDetails.getElementsByTagName('ul')) {
  for (let li of ul.getElementsByTagName('li')) {
    liContainer.appendChild(li.cloneNode(true));
  }
}

console.log(ulContainer);