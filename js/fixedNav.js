/*
* 滑动到某元素时，固定定位，加滚动监听
* this值指向锚点外层元素
* */
;
(function ($) {
    //$.tools = $.extend({version: "1.0"}, $.tools);
    $.fn.fixedNav = function (options) {
        var _default = {
            "monitor": false,   //是否有滚动监听效果
            "_class": "active", //导航的class，在滚动监听时，用到
            "anchorElement": "a", //操作的子元素标签名称
            "navAnchor": true,   //导航和锚点定位是否一致，如果不一致，传入导航的id
            "monitorArr": [] //监听元素的id数组，按照顺序传递
        };
        var _this = $(this);
        options = $.extend({}, _default, options);
        _this.each(function () {
            var self = $(this);
            var _class = options._class;
            $.extend(self, {

                /*检测是否是ie6，ie6不支持fixed，单独拎出来*/
                checkIe6: function () {
                    if (navigator.appName == "Microsoft Internet Explorer" && navigator.userAgent.indexOf("MSIE 6.0") > 0) {
                        return true;
                    } else {
                        return false;
                    }
                },
                /*获取元素所在位置*/
                getPos: function (dom) {
                    var _dom = $(dom);
                    var left = dom.offsetLeft,
                        top = dom.offsetTop,
                        _parent = dom.offsetParent;
                    while (_parent) {
                        left += _parent.offsetLeft;
                        top += _parent.offsetTop;
                        _parent = _parent.offsetParent;
                    }
                    return {
                        "left": left,
                        "top": top
                    };
                },

                getAnchorPos: function () {
                    var anchor = self.find("a"), id = [], poses = [];
                    anchor.each(function (i, d) {
                        var idi = $(d).attr("href");
                        id.push(idi);
                        poses.push(self.getPos($(idi).get(0)));
                    });
                    return {
                        id: id,
                        poses: poses
                    };
                },

                getAnchorArea: function (obj) {    //获取每个锚点所在区域
                    var id = obj.id,
                        poses = obj.poses,
                        l = id.length,
                        area = [];

                    for (var i = 0; i < l; i++) {
                        area[i] = {};
                        if (i == 0) {
                            area[i]["start"] = 0;
                            area[i]["end"] = poses[i + 1].top;
                        } else if (i == l - 1) {
                            area[i]["start"] = poses[i].top;
                            area[i]["end"] = $("body").height();
                        } else {
                            area[i]["start"] = poses[i].top;
                            area[i]["end"] = poses[i + 1].top;
                        }
                    }
                    return area;
                },
                setFix: function(ie6, mt ,left, st){
                    if (!ie6) {
                        self.css({
                            "position": "fixed",
                            "top": -mt + "px",
                            "left": left + "px",
                            "z-index": 10000
                        });
                    } else {
                        self.css({
                            "position": "absolute",
                            "top": st - mt + "px",
                            "left": left + "px",
                            "z-index": 10000
                        });
                    }
                },
                monitorExt: function(anchors, sth,_class){
                    var l, area;
                    if (!anchors) {
                        anchors = self.getAnchorPos();
                        l = anchors.id.length;
                        area = self.getAnchorArea(anchors);
                    }

                    if (l <= 1) {
                        return;  //如果长度<=1,不存在滚动监听
                    }
                    for (var i = 0; i < l; i++) {
                        var start = area[i].start,
                            end = area[i].end, idi = anchors.id[i];
                        if (sth >= start && sth < end) {
                            self.find("a").removeClass(_class).end().find("[href=" + idi + "]").addClass(_class);
                            break;
                        }
                    }
                },
                resetNav:function(){   //点击home键返回顶部的时候
                    self.find("a").removeClass(_class).eq(0).addClass(_class);
                },
                /*方法开始*/
                init: function () {
                    var _this = this;
                    var pos = self.getPos(self.get(0)),
                        navAnchor = options.navAnchor;
                    var top = pos.top,
                        left = pos.left,
                        sh = self.height(),         //自身的高度;
                        monitor = options.monitor,//是否有滚动监听效果
                        _class = options._class, st = $(window).scrollTop(),sth = st + sh,
                        mt = parseInt(self.css("margin-top"), 10),//上部外间距
                        ie6 = self.checkIe6();
                    if (monitor) {
                        var anchors = null,
                            l = null,
                            area = null;
                    }
                    /*页面初始化时，定义导航的位置*/
                    if (navAnchor && top <= sth) {
                        _this.setFix(ie6, mt ,left, st);
                        if(monitor){
                            _this.monitorExt(anchors, sth, _class);
                        }
                    }
                    $(window).bind("scroll", function () {
                        st = $(window).scrollTop();  //页面滚动的高度
                        sth = st + sh;
                        if (navAnchor && top <= sth) {
                            _this.setFix(ie6, mt ,left, st);
                            /*滚动监听效果开始*/
                            if (monitor) {
                                _this.monitorExt(anchors, sth, _class);
                            }
                            /*滚动监听效果结束*/
                        } else {
                            self.css({
                                "position": "static"
                            });
                        }
                    });
                    /*修改bug，按home键返回头部的时候，没有reset active nav*/
                    $(document).bind("keyup", function(e){
                        var evt = e || window.event,
                            code = evt.keyCode;
                        if(code==36){
                            self.resetNav();
                        }
                    });
                }
            });
            self.init();
        });
    }
})(jQuery);