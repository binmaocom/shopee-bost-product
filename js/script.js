/*
All action on the frontend
*/
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
                    + 'https://banhang.shopee.vn/portal/product/list/active?page=1&bi_action=auto_bost'+'&searchType=id&keyword='+localStorage.getItem('danhsach_sp')
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
                      window.location.href = 'https://banhang.shopee.vn/portal/product/list/active?page=1&bi_action=auto_bost'+'&searchType=id&keyword='+localStorage.getItem('danhsach_sp');
                    }
                })
            }else{
                //====reload each 10 minutes====
                $('body').addClass('bi-hide-screen');
                $('body').prepend('<h1 class="khong-dong-tab">Không đóng tab này</h1>');
                setTimeout(function(){
                    // window.location.reload();
                    window.location.href = 'https://banhang.shopee.vn/portal/product/list/active?page=1&bi_action=auto_bost'+'&searchType=id&keyword='+localStorage.getItem('danhsach_sp');
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

            function auto_click_to_up_product(){
                var intval_check_product = setInterval(function(){
                    if(jQuery('.shopee-checkbox__input').length > 0){
                        if($('.count-cool').length < 5){
                            clearInterval(intval_check_product);
                            var total_products = jQuery('.shopee-checkbox__input').length;

                            var intval_check_product_by_index = setInterval(function(){
                                if($('.count-cool').length == 5){
                                    window.location.reload();
                                    auto_click_to_up_product();
                                }

                                var current_product_div = jQuery('.product-item, .product-list-card').eq(parseInt(Math.floor(Math.random() * (total_products-0) )));
                                
                                if($('.is-boot').length == total_products){
                                    // window.location.reload();
                                    // clearInterval(intval_check_product_by_index);
                                    $('.is-boot').removeClass('is-boot');
                                }
                                if(current_product_div.length){
                                    if(current_product_div.find('.boost-button-text').length == 0){
                                        if(current_product_div.find('.product-image-overlay').length == 0){
                                            clearInterval(intval_check_product_by_index);
                                            alert('Để tool chạy không gặp lỗi vui lòng không thao tác trên tab hiện tại và load lại trang. Sau đó mở tab khác để làm việc như bình thường!');
                                        }
                                    }
                                    if(!current_product_div.hasClass('is-boot')){
                                        current_product_div.addClass('is-boot');
                                        if(
                                            current_product_div.find('.product-image-overlay').length == 0
                                            && current_product_div.find('.boost-button-text').length > 0
                                            && current_product_div.find('.count-cool').length == 0
                                        ){                                        
                                            var real_api = current_shop_token_id.replace(
                                                'https://banhang.shopee.vn/api/v2/login/?'
                                                ,'https://banhang.shopee.vn/api/v3/product/boost_product/?version=3.1.0&'
                                            );
                                            current_product_div.find('.boost-button-text').addClass('count-cool');
                                            up_product_to_top(real_api, current_product_div.find('.shopee-checkbox__input').val());
                                            console.log(current_product_div.find('.shopee-checkbox__input').val());
                                        }
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


