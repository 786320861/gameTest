/**
 * Created by sunqian on 2016/1/26.
 */
$(function(){
    $(".carousel").carousel({

    });
    $(".carousel2").gun();
    $("#dotNav").fixedNav({
        "monitor": true,
        "anchorElement": "li",
        "navAnchor": false,
        "navId": "header",
        "monitorArr": ["sectionOne","sectionTwo","sectionThree", "sectionFour"],
        "navControl": "arrowNav"
    });
    /*调用弹出层*/
    $("#footer li").each(function(index,dom){
        $(dom).click(function(){
            showWeixinModal();
        });
    });
    $(".modalClose").click(function () {
        closeModal();
    });
});

/*
* 弹出层，使用的同一弹出层
* */
function showWeixinModal(){
    $("#modalBg").show();
    $(".modalShow").show();
}
function closeModal(){
    $("#modalBg").hide();
    $(".modalShow").hide();
}