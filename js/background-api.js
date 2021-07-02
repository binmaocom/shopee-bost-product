var API_KEY = 'AIzaSyBjAAUMsxbTAjBPNeO4xSfYPINWnx-_SKQ';
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
var SPREADSHEET_ID = '1bIykQLHdpojqOR8NhzGBY3P2ZSlNikQp8_5frUXaLzc';
var SPREADSHEET_TAB_NAME = 'BostProduct';
console.log('Loading to get the data');



function onGAPILoad() {
  gapi.client.init({
    // Don't pass client nor scope as these will init auth2, which we don't want
    // clientId: CLIENT_ID,
    // scope: SCOPES,
    apiKey: API_KEY,
    discoveryDocs: DISCOVERY_DOCS,
  }).then(function () {
    console.log('gapi initialized')
    func_get_list_product_to_run();
  }, function(error) {
    console.log('error', error)
    // alert("Vui lòng kiểm tra lại kết nối với GoogleSheet");
  });
}

function getMeRandomElements(sourceArray, neededElements) {
  sourceArray.sort(function() {return 0.5 - Math.random()})
  var result = [];
  for (var i = 0; i < neededElements; i++) {
    result.push(sourceArray[i]);
  }
  return result;
    for (var i = 0; i < neededElements; i++) {
        result.push(sourceArray[Math.floor(Math.random()*sourceArray.length)]);
    }
    return result;
}

function func_get_list_product_to_run(){
  chrome.storage.local.get(['SPREADSHEET_ID','SPREADSHEET_TAB_NAME'], function (result) {
    SPREADSHEET_ID = result.SPREADSHEET_ID;
    SPREADSHEET_TAB_NAME = result.SPREADSHEET_TAB_NAME;
    if(SPREADSHEET_ID && SPREADSHEET_TAB_NAME){

      // Get token
      chrome.identity.getAuthToken({interactive: true}, function(token) {
        // Set token in GAPI library
        gapi.auth.setToken({
          'access_token': token,
        });

        var params = {
          spreadsheetId: SPREADSHEET_ID,  // Please set the Spreadsheet ID.
          range: SPREADSHEET_TAB_NAME+'!A:A',  // Please set the range as a1Notation.
        };
        var request = gapi.client.sheets.spreadsheets.values.get(params);
        var list_products = [];
        request.then(function(response) {
          console.log(response.result.values);
          response.result.values.forEach(function(item, index){
            // console.log(item[0], index);
            list_products.push(item[0]);
          })
          console.log(list_products);
          var new_list_products = getMeRandomElements(list_products, 5);
          var shopee_list_products = new_list_products.toString();
          console.log(shopee_list_products);

          chrome.storage.local.set({'shopee_list_products': shopee_list_products}, function() {
            console.log('shopee_list_products is set to ' + shopee_list_products);
          });
        }, function(reason) {
        console.error('error: ' + reason.result.error.message);
          // alert("Vui lòng kiểm tra lại SPREADSHEET_ID và SPREADSHEET_TAB_NAME");
        });

      });
    }

  });
}

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    func_get_list_product_to_run();

    // Wait for response
    return true;
  }
);
