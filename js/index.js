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
});