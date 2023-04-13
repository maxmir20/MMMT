chrome.runtime.onInstalled.addListener(  async function() {
    const fileName = 'hello.txt';
    const url = chrome.runtime.getURL(fileName);
    fetch(url)
        .then(function(response){response.text()})
        .then(text => new Blob([text], { type: 'text/plain' }))
        .then(blob => {
          // Upload the file to chrome.storage.local
          const key = 'template';
          chrome.storage.local.set({ [key]: blob }, () => {
            console.log(`Uploaded file ${key}`);
          });
        });
    });

    
//    function uploadTexFile(text) {
//        var
//        chrome.storage.local.set({ 'helloworld': text }, function() {
//            console.log('Uploading stored template files.');
//            });
//    }


//    fetch(url)
//        .then(function(response) {
//            response.text().then(function(text) {
//                chrome.storage.local.set({ ['helloworld']: text }, function() {
//                console.log('Uploading stored template files.');
//                });
//            });
//        });
//    });