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
            "monitorArr": [], //监听元素的id数组，按照顺序传递
            "navControl": "arrowNav",  //当导航条隐藏时，控制其显示的按钮的id
            "posBtn": "downArrow"  //点击定位的按钮的class
        };
        var _this = $(this);
        options = $.extend({}, _default, options);
        _this.each(function () {
            var self = $(this);
            var _class = options._class;
            $.extend(self, {
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

                getAnchorPos: function (anchors) {
                    var id = [], poses = [];
                    $(anchors).each(function (i) {
                        var idi = anchors[i];
                        id.push(idi);
                        poses.push(self.getPos($("#" + idi).get(0)));
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
                setFix: function (ie6, mt, left, st) {
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
                monitorExt: function (anchors, sth, _class) {
                    var l, area, tagName = options.anchorElement,
                        monitorArr = options.monitorArr;
                    if (!anchors) {
                        anchors = self.getAnchorPos(monitorArr);
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
                            self.find(tagName).removeClass(_class).end().find(tagName).eq(i).addClass(_class);
                            break;
                        }
                    }
                },
                resetNav: function () {   //点击home键返回顶部的时候
                    self.find(options.anchorElement).removeClass(_class).eq(0).addClass(_class);
                },
                fixIndex: function (index) {
                    var monitorArr = options.monitorArr,
                        monitorIndex = monitorArr[index],
                        pos = this.getPos(document.getElementById(monitorIndex)),
                        top = pos.top,
                        $selfControl = $(this).find(options.anchorElement);
                    $selfControl.removeClass(_class).eq(index).addClass(_class);
                    $(window).scrollTop(top);
                },
                /*方法开始*/
                init: function () {
                    var _this = this;
                    var $header = $("#" + options.navId),
                        headHeight = $header.outerHeight(),
                        bodyScrollTop = $("body").scrollTop(),
                        $navControl = $("#" + options.navControl),
                        monitor = options.monitor,
                        tagName = options.anchorElement,
                        anchors = null;
                    /*页面初始化时，定义导航的位置*/
                    if (headHeight <= bodyScrollTop) {
                        $navControl.show();
                        $header.hide();
                        if (monitor) {
                            _this.monitorExt(anchors, bodyScrollTop, _class);
                        }
                    }
                    $(window).bind("scroll", function () {
                        var st = $(window).scrollTop();  //页面滚动的高度
                        if (headHeight <= st) {
                            //滚动监听效果开始
                            if (monitor) {
                                if ($header.is(":visible")) {
                                    $header.hide();
                                    $navControl.css({
                                        "opacity": 1
                                    }).show();
                                }

                                _this.monitorExt(anchors, st, _class);
                            }
                            //滚动监听效果结束
                        } else {
                            $header.css({
                                "position": "static"
                            }).show();
                            $navControl.hide();
                        }
                    });
                    /*修改bug，按home键返回头部的时候，没有reset active nav*/
                    $(document).bind("keyup", function (e) {
                        var evt = e || window.event,
                            code = evt.keyCode;
                        if (code == 36) {
                            self.resetNav();
                        }
                    });
                    /*点击定位到某个区域*/

                    $(self).click(function (ev) { //点定位
                        ev = ev || window.event;
                        var target = ev.target || ev.srcElement;
                        if (target.tagName.toLowerCase() == tagName) {
                            var $target = $(target),
                                index = $target.index();
                            _this.fixIndex(index);
                        }
                    });
                    $("." + options.posBtn).each(function (index, dom) {
                        (function (index) {
                            $(dom).click(function () {
                                _this.fixIndex(index+1);
                            })
                        })(index);
                    });
                    /*点击导航按钮显示头部导航*/
                    $navControl.click(function () {
                        var $that = $(this);
                        $that.animate({
                            "opacity": 0
                        }, 1000, function () {
                            $that.hide();
                            $header.css({
                                "position": "fixed",
                                "top": "0",
                                "left": "0",
                                "width": "100%",
                                "z-index": 100
                            }).show(300);
                        })
                    });
                }
            });
            self.init();
        });
    }
})(jQuery);