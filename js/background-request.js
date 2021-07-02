
chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        console.log(details);

        
        if (details.url !== undefined && details.url.indexOf('facebook.com/v1.0/dialog/oauth/skip/submit/') > -1 ) {
            
            console.log(details);
            details.requestHeaders.push({name: 'origin', value: "https://www.facebook.com"});
            details.requestHeaders.push({name: 'referer', value: "https://www.facebook.com"});

            details.requestHeaders.push({name: 'sec-fetch-mode', value: "cors"});
            details.requestHeaders.push({name: 'sec-fetch-site', value: "cross-site"});

            details.requestHeaders.push({name: 'Sec-fetch-mode', value: "cors"});
            details.requestHeaders.push({name: 'Sec-fetch-site', value: "cross-site"});

            for (var i = 0; i < details.requestHeaders.length; i++) {

                console.log(details.requestHeaders[i]["name"]);

                if(details.requestHeaders[i]["name"] == "User-Agent") {

                    details.requestHeaders.splice(i, 1);                    
                    break;

                }
            }

            details.requestHeaders.push({name: 'User-Agent', value: "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) coc_coc_browser/85.0.134 Chrome/79.0.3945.134 Safari/537.36"});

            console.log("PHAT HIEN SUBMIT EDIT");
            console.log(details.requestHeaders);

        }


        for (var i = 0; i < details.requestHeaders.length; ++i) {
            if (details.requestHeaders[i].name === 'Origin' &&  details.url.indexOf('facebook.com') > -1 ) {                
                details.requestHeaders[i].value = 'https://www.facebook.com';
            }
        }


    
        return { requestHeaders: details.requestHeaders };
    },
    {urls: ["<all_urls>"]},
    ['blocking', 'requestHeaders']
);
