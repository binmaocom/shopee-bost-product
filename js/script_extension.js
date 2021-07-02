/*
Background code of extension
*/
var current_shop_token_id = '';
chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {       
        if (details.url !== undefined && details.url.includes('https://banhang.shopee.vn/api/v2/login/?SPC_CDS=') ) {            
            console.log(details.url);
            current_shop_token_id = details.url;
            // console.log(details.requestHeaders);
        }    
        // return { requestHeaders: details.requestHeaders };
    },
    {urls: ["<all_urls>"]},
    ['blocking', 'requestHeaders']
);

chrome["tabs"]["getSelected"](null, function(data) {
    var data_result = data["url"];
    console["log"](data_result);
})
chrome['runtime']["onMessage"]["addListener"](function(data, temp, callback) {
    return data['action'] === 'getuid' && $['ajax']({
        'url': data['link'],
        'type': 'GET',
        'success': function(result) {
            result = pick('<form method="post" ', '</form>', result),
            callback(result);
        },
        'error': function() {
            console["log"]('lỗi');
        }
    }),
    data['action'] === 'getUserList' && $['ajax']({
        'url': data['link'],
        'type': 'get',
        'success': function(result) {
            callback(result);
        },
        'error': function(result) {
            callback(result);
        }
    }),
    data['action'] === 'getDataExtension' && $['ajax']({
        'url': data['link'],
        'type': 'get',
        'success': function(result) {
            callback(result);
        },
        'error': function(result) {
            callback(result);
        }
    }),
    data['action'] === 'current_shop_token_id' && callback(current_shop_token_id),
    !![];
})
function pick(str1, str2, data) {
    var result = data['split'](str1);
    if (!result[1])
        return '';
    var result_data = result[1]['split'](str2);
    return result_data[0];
}
function pick2(str1, str2, data) {
    var result = data['split'](str2)
      , result_data = result[0]['split'](str1)
      , result_data_end = result_data['pop']();
    if (result_data_end)
        return result_data_end;
    return '';
}
chrome['runtime']['onUpdateAvailable']["addListener"](function(data) {
    console["log"]('updating to version ' + data['version']),
    chrome['runtime']['reload']();
}),
chrome['runtime']['requestUpdateCheck'](function(data) {
    if (data == 'update_available')
        console['log']('update pending...');
    else {
        if (data == 'no_update')
            console['log']('no update found');
        else
            data == 'throttled' && console["log"]("Oops, I'm asking too frequently - I need to back off.");
    }
}),
chrome['browserAction']['onClicked']["addListener"](function(data) {
    return chrome['runtime']['openOptionsPage']();
});