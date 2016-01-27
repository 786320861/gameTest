/**
 * Created by sunqian on 2016/1/27.
 * 没有多余功能，目前只能适用本页面
 */

(function ($) {
    $.tools = $.tools || {};
    $.tools.defaultVal = {
        "interval": 3000,
        "duration": 1000
    };
    function Gun(dom, options) {
        this.options = $.extend($.tools.defaultVal, options);
        this.dom = dom;
        this.arr = [
            {"z-index": 6, "width": "1126px", "top": "0px", "left": "0px"},
            {"z-index": 5, "width": "706px", "top": "90px", "left": "530px"},
            {"z-index": 4, "width": "576px", "top": "140px", "left": "810px"},
            {"z-index": 4, "width": "576px", "top": "140px", "left": "-280px"},
            {"z-index": 5, "width": "706px", "top": "90px", "left": "-130px"}
        ];
    }
    /*传递一个回调函数*/
    Gun.prototype.nextFrame = function (callback) {
        var that = this,
            dom = this.dom,
            $children = $(dom).children(),
            arr = this.arr;
        var $clone = $children.eq(0).clone();
        $(dom).append($clone).children().eq(0).remove();
        $children = $(dom).children();
        var len = $children.length;
        for(var i=0; i<len; i++){
            $children.eq(i).
                animate(arr[i], 200, function(){
                    if(callback){
                        callback.apply(that);
                    }
                });
        }
    };
    Gun.prototype.init = function () {
        var _this = this,
            self = this.dom,
            $children = $(self).children(),
            len = $children.length,
            arr = this.arr;
        for(var i=0; i < len; i++){
            $children.eq(i).css(arr[i]);
        }
        /*添加绑定事件*/
        $(self).click(function () {
            clearInterval(self.gunTimer);   //停止动画
            _this.nextFrame(_this.timer);
        });
        /*开定时器*/
        _this.timer();
    };
    Gun.prototype.timer = function(){
        var _this = this,
            self = this.dom,
            interval = this.options.interval;
        clearInterval(self.gunTimer);
        self.gunTimer = setInterval(function(){
            _this.nextFrame.apply(_this);
        },interval);
    };
    $.fn.gun = function (options) {
        var self = this,
            $self = $(self);
        $self.each(function (index, dom) {
            var gun = new Gun(dom, options);
            gun.init();
        });
    }
})(jQuery);