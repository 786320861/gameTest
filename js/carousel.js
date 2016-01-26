/**
 * Created by sunqian on 2016/1/26.
 * 暂时没有自定义上一页、下一页、缩略图按钮，默认与页面布局一样
 */

(function ($) {
    $.tools = $.tools || {};
    $.tools.defaultVal = {
        "interval": 3000,
        "curIndex": 0,
        "duration": 1000
    };
    function Carousel(dom, options) {
        this.options = $.extend($.tools.defaultVal, options);
        this.dom = dom;
        this.curIndex = this.options.curIndex;
        this.children = $(this.dom).children();
        this.total = this.children.length;
        this.$dot = $(this.dom).next(".control");
    }
    Carousel.prototype.showIndexFrame = function (index) {
        var self = this,
            dom = self.dom,
            $children = this.children,
            duration = this.options.duration,
            interval = this.options.interval,
            curIndex = this.curIndex;
        $children.eq(curIndex).animate({
            "opacity": 0
        }, duration/2, function(){
            $children.eq(index).animate({
                "opacity": 1
            }, duration/2,function(){
                self.curIndex = index;
                dom.frameTimer = setInterval(function(){
                    self.nextFrame();
                }, interval);
            });
        });
    };
    Carousel.prototype.nextFrame = function () {
        var curIndex = this.curIndex,
            self = this,
            duration = this.options.duration,
            $dot = this.$dot;
        console.log("***************");
        console.log(curIndex);
        console.log(self.total);
        this.children.eq(curIndex).animate({
            "opacity": 0
        }, (duration/2), function(){
            self.curIndex = (self.curIndex + 1) % self.total;
            self.children.eq(self.curIndex).animate({
                "opacity": 1
            },duration/2, function(){
                $dot.children().removeClass("active").eq(self.curIndex).addClass("active");
            });
        });
    };
    Carousel.prototype.init = function () {
        var _this = this,
            self = this.dom,
            interval = this.options.interval;
        self.frameTimer = setInterval(function(){
            _this.nextFrame();
        }, interval);
        this.$dot.mouseover(function(ev){
            var event = ev || window.event,
                target = event.target || event.srcElement;
            if(target.tagName.toLowerCase() == "li"){
                var $target = $(target),
                    index = $target.index();
                $target.siblings("li").removeClass("active").end().addClass("active");
                clearInterval(self.frameTimer);
                _this.showIndexFrame.apply(_this, [index]);
            }
        });
    };

    $.fn.carousel = function (options) {
        var self = this,
            $self = $(self);
        $self.each(function (index, dom) {
            var carousel = new Carousel(dom, options);
            carousel.init();
        });
    }
})(jQuery);