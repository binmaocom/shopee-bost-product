var API_KEY = 'AIzaSyBjAAUMsxbTAjBPNeO4xSfYPINWnx-_SKQ';
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
var SPREADSHEET_ID = '1bIykQLHdpojqOR8NhzGBY3P2ZSlNikQp8_5frUXaLzc';
var SPREADSHEET_TAB_NAME = 'BostProduct';
var list_products = [];
var shopee_list_products = '';

function onGAPILoad() {
	gapi.client.init({
		// Don't pass client nor scope as these will init auth2, which we don't want
		// clientId: CLIENT_ID,
		// scope: SCOPES,
		apiKey: API_KEY,
		discoveryDocs: DISCOVERY_DOCS,
	}).then(function () {
		console.log('gapi initialized')
		// func_get_list_product_to_run();
	}, function(error) {
		console.log('error', error)
		$('.connect-status').append("<p>Vui lòng kiểm tra lại kết nối với GoogleSheet</p>");
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
		
		request.then(function(response) {
			console.log(response.result.values);
			$('.connect-status').append("<p>Kết nối thành công</p>");
			if(response.result.values){
				response.result.values.forEach(function(item, index){
					// console.log(item[0], index);
					list_products.push(item[0]);
				})
				console.log(list_products);
	          	var new_list_products = getMeRandomElements(list_products, 5);
	          	shopee_list_products = new_list_products.toString();
	          	console.log(shopee_list_products)

				chrome.storage.local.set({'shopee_list_products': shopee_list_products}, function() {
					console.log('1.shopee_list_products is set to ' + shopee_list_products);
				});
			}else{
				$('.connect-status').append("<p>Vui lòng nhập danh sách sản phẩm cần chạy trước khi nhấn nút Đẩy sản phẩm</p>");
			}
		}, function(reason) {
		console.error('error: ' + reason.result.error.message);
			$('.connect-status').append("<p>Vui lòng kiểm tra lại SPREADSHEET_ID và SPREADSHEET_TAB_NAME</p>");
		});

	});
}
function get_link_id_to_click_up_button(list_prd_to_up){
    var list_prd_to_up_arr = list_prd_to_up.split(',');
    var item = list_prd_to_up_arr[Math.floor(Math.random()*list_prd_to_up_arr.length)];
    return item;
}
jQuery(document).ready(function($){
	chrome.storage.local.get(['SPREADSHEET_ID','SPREADSHEET_TAB_NAME', 'shopee_list_products'], function(items){
		console.log(items);
	    $('.SPREADSHEET_ID').val(items.SPREADSHEET_ID);
	    $('.SPREADSHEET_TAB_NAME').val(items.SPREADSHEET_TAB_NAME);
	    shopee_list_products = items.shopee_list_products;
	});
	$('.btn-day-sp').click(function(event){
		event.preventDefault();
		localStorage.setItem('danhsach_sp', shopee_list_products);
		chrome.tabs.create({
		    url: "https://banhang.shopee.vn/portal/product/list/active?page=1&bi_action=auto_bost&searchType=id&keyword="+get_link_id_to_click_up_button(shopee_list_products)
		}, function(tab) {  });
	});
	$('.btn-ket-noi-tk').click(function(event){
		event.preventDefault();
		if($('.SPREADSHEET_ID').val() == ''){
			$('.connect-status').append("<p>Vui lòng nhập vào SPREADSHEET_ID</p>");
			return;
		}
		if($('.SPREADSHEET_TAB_NAME').val() == ''){
			$('.connect-status').append("<p>Vui lòng nhập vào SPREADSHEET_TAB_NAME</p>");
			return;
		}
		SPREADSHEET_ID = $('.SPREADSHEET_ID').val();
		SPREADSHEET_TAB_NAME = $('.SPREADSHEET_TAB_NAME').val();
		chrome.storage.local.set({'SPREADSHEET_ID': SPREADSHEET_ID}, function() {
          console.log('SPREADSHEET_ID is set to ' + SPREADSHEET_ID);
        });
		chrome.storage.local.set({'SPREADSHEET_TAB_NAME': SPREADSHEET_TAB_NAME}, function() {
          console.log('SPREADSHEET_TAB_NAME is set to ' + SPREADSHEET_TAB_NAME);
        });
		func_get_list_product_to_run();
	});
})

chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
    	func_get_list_product_to_run();
    	// Wait for response
    	return true;
  	}
);
