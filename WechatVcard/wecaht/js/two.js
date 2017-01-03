
$(document).ready(function() {
        //$('#two-images').qrcode({width: 256, height: 256, text: "\"MECARD:TEL:"+$(".vcard_data_phone").val()+";URL:"+$(".vcard_data_site").val()+";EMAIL:"+ $(".vcard_data_email").val()+";NOTE:"+ $(".vcard_data_fax").val()+";N:"+ $("#vcard_data_name").val()+";ORG:"+$(".vcard_data_company").val()+";TIL:"+$(".vcard_data_phone").val()+";ADR:"+$(".vcard_data_address").val()+";"});      
        $(".create-card").on('click',function() {
                $("#two-images").css("display","block");
                $("#notice").css("display","block");
                $("#notice p").css("display","block");
                $("#opa").css("display","block");
                $("#url_code").css("display","none");
        $("#qrqrcode").css("display","none");
                $(".qrcode_").css("display","none");
                $("#more_container").css("display","none");
        });      
        $("#bottom_more").on('click', function(event) {
               $("#more_container").toggle();
               $("#opa").toggle();
               $("#share_").css("display","none");
        $("#qrqrcode").css("display","none");
               $("#shadow_").css("display","none");
                $("#notice").css("display","none");
                $("#notice p").css("display","none");

                opa = $("#opa").css("display");
                if(opa=='block'){
               $("#more_container").css("display","block");
                 }if(opa=='none'){
               $("#more_container").css("display","none");
                }



        });
        $(".share_item").on('click', function(event) {
            $("#shadow_").css("display","block");
            $("#share_").toggle();
                $(".qrcode_").css("display","none");
            // $(".share_item").unbind(); 
        $("#qrqrcode").css("display","none");
            $("#notice").css("display","none");
            $("#notice p").css("display","none");
            $("#more_container").css("display","none");
        });
       $("#shadow_").on('click', function(event) {
        $("#shadow_").css("display","none");
        $("#opa").css("display","none");
        $("#qrqrcode").css("display","none");
         $("#share_").css("display","none");
         $("#notice").css("display","none");
        $("#more_container").css("display","none");
       });
        $("#share_").on('click', function(event) {
        $("#shadow_").css("display","none");
        $("#qrqrcode").css("display","none");
        $("#opa").css("display","none");
         $("#share_").css("display","none");
         $("#notice").css("display","none");
        $("#more_container").css("display","none");
       });
        $(".icon_showme").on('click',  function(event) {
                $("#qrqrcode").css("display","block");

            $("#more_container").css("display","none");


        });
       $(".icon_showqrcode").on('click', function(event) {
            $("#more_container").css("display","none");
            $("#two-images").css("display","none");
            $('#url_code').css("display","block");
                $(".qrcode_").css("display","none");
            $('#url_code').html("");
            $('#url_code').qrcode({
                width: 500,
                height: 500,
                correctLevel:0,
                 text:window.location.href,
             });
            var img = document.createElement('img');
            img.setAttribute('src', document.getElementById('url_code').children[0].toDataURL("image/png"));
            img.setAttribute('style', 'background: #fff; padding: 20px;height:256px;width:256px;');
            document.getElementById('url_code').appendChild(img);
            document.getElementById('url_code').children[0].setAttribute('style', 'display: none;');
                $("#notice").css("display","block");
                $("#notice p").css("display","block");
            $("#shadow_").css("display","block");
                
                $("#opa").css("display","block");
                $("#share_").css("display","none");
       });
    
    
        
        
        $("#add_qq").on('click', function(event) {
                $("#notice").css("display","block");
                $("#notice p").css("display","block");
                $("#opa").css("display","block");
                $("#qq_").css("display","block");
                $("#share_").css("display","none");
                $("#url_code").css("display","none");
        });

    $("#add_wechat").on('click', function(event) {
                $("#notice").css("display","block");
                $("#notice p").css("display","block");
                $("#opa").css("display","block");
                $("#wechat_").css("display","block");
                $("#url_code").css("display","none");
                $("#share_").css("display","none");
        });
 $("#opa").on('click', function(event) {
                $("#notice").css("display","none");
                $("#notice p").css("display","none");
                $("#opa").css("display","none");
        $("#qrqrcode").css("display","none");
                $("#wechat").css("display","none");
                $("#two-images").css("display","none");
                $("#more_container").css("display","none");
 });

 function GetQueryString(name)
        {
             var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
             var r = window.location.search.substr(1).match(reg);
             if(r!=null)return  unescape(r[2]); return null;
        }
       var id =  GetQueryString("id");
                $.ajax({
                    url: './select.php',
                    type: 'post',
                    dataType: 'json',
                    data: {
                        'id' :id ,
                    },
                })
                .done(function(data) {
                    $("#vcard_data_name").html(data.vcardInfo.name);
                    $(".vcard_data_appointment").html(data.vcardInfo.job);
                    $(".vcard_data_company").html(data.vcardInfo.company);
                    $(".vcard_data_mobile").html(data.vcardInfo.mobile);
                    $(".vcard_data_phone").html(data.vcardInfo.tel);
                    $(".vcard_data_fax").html(data.vcardInfo.fax);
                    $(".vcard_data_email").html(data.vcardInfo.email);
                    $(".vcard_data_site a").html(data.vcardInfo.url);
                    $(".vcard_data_site a").attr("href",data.vcardInfo.url);
                    $(".vcard_data_weibo").html(data.vcardInfo.weibo);
                    $(".vcard_data_qq").html(data.vcardInfo.qq);
                    $("#qq_ img").attr("src",data.vcardInfo.qq_url);
                    $(".vcard_data_wechat").html(data.vcardInfo.wechat);
                    $("#wechat_ img").attr("src",data.vcardInfo.wechat_url);
                    $(".vcard_data_address").html(data.vcardInfo.address);
                    $(".vcard_data_introduce").html(data.vcardInfo.description);
                    $("#headimg").attr("src", data.vcardInfo.headimg);
                    document.title = data.vcardInfo.name+"的电子名片!";
                    tt = data.vcardInfo.headimg;
                    tt= tt.trim();
                    shareData = {
                        "title":data.vcardInfo.name+"的微信专属名片!",
                        "imgUrl":tt,
                        "desc":data.vcardInfo.company+","+data.vcardInfo.job,
                    };

                    // setTimeout(function(){
                        
                    // }, 2000);

                     // $(".generate_qrcode").attr("data", "MECARD:TEL:"+data.vcardInfo.mobile+";URL:"+data.vcardInfo.url+";EMAIL:"+ data.vcardInfo.email+";NOTE:"+data.vcardInfo.tel+";N:"+ data.vcardInfo.name+";ORG:"+data.vcardInfo.company+";TIL:"+data.vcardInfo.job+";ADR:"+data.vcardInfo.address+";");
                     function toUtf8(str) {    
                                var out, i, len, c;    
                                out = "";    
                                len = str && str.length;    
                                for(i = 0; i < len; i++) {    
                                        c = str.charCodeAt(i);    
                                        if ((c >= 0x0001) && (c <= 0x007F)) {    
                                            out += str.charAt(i);    
                                        } else if (c > 0x07FF) {    
                                            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));    
                                            out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));    
                                            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));    
                                        } else {    
                                            out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));    
                                            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));    
                                        }    
                                }    
                                return out;    
                        } 

                     $('#two-images').qrcode({
                        width: 500,
                        height: 500,
                        correctLevel:0,
                         text:"MECARD:TEL:"+toUtf8(data.vcardInfo.mobile)+";URL:"+toUtf8(data.vcardInfo.url)+";EMAIL:"+ toUtf8(data.vcardInfo.email)+";NOTE:"+toUtf8(data.vcardInfo.tel)+";N:"+ toUtf8(data.vcardInfo.name)+";ORG:"+toUtf8(data.vcardInfo.company)+";TIL:"+toUtf8(data.vcardInfo.job)+";ADR:"+toUtf8(data.vcardInfo.address)+";"}
                    );
                        var img = document.createElement('img');
                        img.setAttribute('src', document.getElementById('two-images').children[0].toDataURL("image/png"));
                        img.setAttribute('style', 'background: #fff; padding: 20px;height:256px;width:256px;');
                        document.getElementById('two-images').appendChild(img);
                        document.getElementById('two-images').children[0].setAttribute('style', 'display: none;');



                        $(".vcard_data_txt").each(function(index, el) {
                            var str = ($(this).find("span").eq(1).text().trim());
                            if (str === '') {
                                $(this).hide();
                            }
                        });

                        if(!$("#qq_  img").attr("src")){ 
                            $("#add_qq").css("display","none");
                         }

                          if(!$("#wechat_  img").attr("src")){
                            $("#add_wechat").css("display","none");
                         }

                })
                .fail(function(data) {
                    console.log("error");
                })
                .always(function(data) {
                    console.log("complete");
                });

        
});