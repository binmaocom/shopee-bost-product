/*
All action on the frontend
*/
function get_link_id_to_click_up_button(list_prd_to_up){
    var list_prd_to_up_arr = list_prd_to_up.split(',');
    var item = list_prd_to_up_arr[Math.floor(Math.random()*list_prd_to_up_arr.length)];
    return item;
}
chrome.storage.local.get('shopee_list_products', function(items){
    //  items = [ { "phasersTo": "awesome" } ]
    localStorage.setItem('danhsach_sp', items.shopee_list_products);
    console.log(items);
    time_to_click = '';
    if(items['shopee_list_products']){    
        shopee_list_products = items['shopee_list_products'];

        $(document).ready(function($){
            if(!window.location.href.includes('bi_action=auto_bost')){
                $('body').append('<div class="bi-ext-day-sp"><a class="shopee-button shopee-button--primary shopee-button--small" target="_blank" '
                    +'href="'
                    + 'https://banhang.shopee.vn/portal/product/list/active?page=1&bi_action=auto_bost'+'&searchType=id&keyword='+get_link_id_to_click_up_button(localStorage.getItem('danhsach_sp'))
                    +'">Đẩy SP</a>'
                    +'<!--<a class="shopee-button shopee-button--primary shopee-button--small btn-nhap-sp" href>Nhập danh sách ID sản phẩm</a>-->'
                    +'<a class="shopee-button shopee-button--primary shopee-button--small btn-cai-dat-sheetID"'
                    +' target="_blank" href="chrome-extension://lnplnjdlbpjlhfboajjeligjohholgpi/option.html">Cài đặt</a>'
                    +'</div>');
                $('.btn-nhap-sp').click(function(event){
                    event.preventDefault();
                    var danhsach_sp = prompt("Nhập danh sách ID sản phẩm", "3657952059,8245313316,8845322657,9145291398");
                    if (danhsach_sp != null) {
                      // alert(danhsach_sp);
                      localStorage.setItem('danhsach_sp', danhsach_sp);
                      window.location.href = 'https://banhang.shopee.vn/portal/product/list/active?page=1&bi_action=auto_bost'+'&searchType=id&keyword='+get_link_id_to_click_up_button(localStorage.getItem('danhsach_sp'));
                    }
                })
            }else{
                //====reload each 10 minutes====
                $('body').addClass('bi-hide-screen');
                $('body').prepend('<h1 class="khong-dong-tab">Không đóng tab này</h1>');
                setTimeout(function(){
                    // window.location.reload();
                    window.location.href = 'https://banhang.shopee.vn/portal/product/list/active?page=1&bi_action=auto_bost'+'&searchType=id&keyword='+get_link_id_to_click_up_button(localStorage.getItem('danhsach_sp'));
                }, 600*1000);
            }
            var current_shop_token_id = '';
            chrome['runtime']['sendMessage']({
                'action': 'current_shop_token_id'
            }, function(res) { 
                current_shop_token_id = res;
                console.log(res);

            });
            function up_product_to_top(api, product_id){
                fetch(api, {
                  "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5,en-GB;q=0.4",
                    "content-type": "application/json;charset=UTF-8",
                  },
                  "credentials": 'include', // include, *same-origin, omit
                  "referrer": "https://banhang.shopee.vn/portal/product/list/all",
                  "referrerPolicy": "strict-origin-when-cross-origin",
                  "body": "{\"id\":"+product_id+"}",
                  "method": "POST",
                  "mode": "cors"
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                }); 
            }
            //======auto click to đẩy sản phẩm
            var san_pham_da_day = false;
            function auto_click_to_up_product(){
                var intval_check_product = setInterval(function(){
                    if(jQuery('.eds-checkbox__input').length > 1){
                        if($('.eds-checkbox__input').length > 0){
                            clearInterval(intval_check_product);
                            var total_products = jQuery('.eds-checkbox__input').length -1;

                            var intval_check_product_by_index = setInterval(function(){
                                if($('.eds-checkbox__input').length == 1 || san_pham_da_day){
                                    // window.location.reload();
                                    // localStorage.setItem('danhsach_sp', items.shopee_list_products);
                                    window.location.href = 'https://banhang.shopee.vn/portal/product/list/active?page=1&bi_action=auto_bost'+'&searchType=id&keyword='+get_link_id_to_click_up_button(localStorage.getItem('danhsach_sp'));
                                    auto_click_to_up_product();
                                }

                                var current_product_div = jQuery('.eds-checkbox__input').eq(1);
                                
                                if($('.is-boot').length == total_products){
                                    // window.location.reload();
                                    // clearInterval(intval_check_product_by_index);
                                    $('.is-boot').removeClass('is-boot');
                                }
                                if(current_product_div.length){
                                    if(current_product_div.find('.boost-button-text').length == 0){
                                        if(false && current_product_div.find('.product-image-overlay').length == 0){
                                            clearInterval(intval_check_product_by_index);
                                            alert('Để tool chạy không gặp lỗi vui lòng không thao tác trên tab hiện tại và load lại trang. Sau đó mở tab khác để làm việc như bình thường!');
                                        }
                                    }
                                    if(!san_pham_da_day && !current_product_div.hasClass('is-boot')){
                                        san_pham_da_day = true;
                                        current_product_div.addClass('is-boot');                             
                                        var real_api = current_shop_token_id.replace(
                                            'https://banhang.shopee.vn/api/v2/login/?'
                                            ,'https://banhang.shopee.vn/api/v3/product/boost_product/?version=3.1.0&'
                                        );
                                        var data_product_id =  $('.eds-checkbox__input').eq(1).val();
                                        up_product_to_top(real_api, data_product_id);
                                        console.log(data_product_id);
                                    }
                                }
                            }, 5000);
                        }
                    }
                }, 10000);
            }

            if(window.location.href.includes('bi_action=auto_bost')){
                auto_click_to_up_product();
            }
        });

    }else{
        alert("Vui lòng kết nối với GoogleSheet trước");
        window.location.href = "chrome-extension://lnplnjdlbpjlhfboajjeligjohholgpi/option.html";
    }
});


