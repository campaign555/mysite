(function () {
    $.fn.extend({
        sliderBox: function (options) {
            options.parent = this || $('body');
            new Slider(options);
            return this;
        }
    })

    function Slider(opt) {
        var opts = $.extend({
            timeInterval: 4000,
            images: '[]'
        }, opt);
        this.time = opts.timeInterval;
        this.img = opts.images;
        this.parent = opts.parent;
        this.init();
    }

    Slider.prototype.init = function () {
        this.timer;
        this.nowIndex = 0;
        this.imgFlag = true;
        this.ttFlag = true;
        this.len = this.img.length;
        this.w = this.parent.width();
        this.h = this.parent.height();
        this.ceateDom();
        this.autoMove();
        this.bindEvent();
    }

    Slider.prototype.ceateDom = function () {
        var imgStr = '',
            ttStr = '',
            orderStr = '',
            w = this.w,
            h = this.h,
            len = this.len;
        this.img.forEach(function (e) {
            imgStr += '<li><a href="' + e.href + '" target="_blank"><img src="' + e.src + '"></a></li>';
            ttStr += '<li><a href="' + e.href + '" target="_blank">' + e.title + '</a></li>';
            orderStr += '<li></li>';
        });
        imgStr += '<li><a href="' + this.img[0].href + '" target="_blank"><img src="' + this.img[0].src + '"></a></li>';
        $('<ul class="img-box"></ul>', this.parent).html(imgStr).appendTo(this.parent)
        $('<ul class="tt-box"></ul>', this.parent).html(ttStr).appendTo(this.parent);
        $('ul.img-box', this.parent).css('width', w * (len + 1) + 'px');
        $('ul.img-box li', this.parent).css({ height: h , width: w });
        $('<ul class="order"></ul>', this.parent).html(orderStr).appendTo(this.parent);
        $('<div class="btn"></div>', this.parent).html('<a href="javascript:void(0)" class="prev">&lt;</a>\
                                           <a href="javascript:void(0)" class="next">&gt;</a>')
            .appendTo(this.parent);
        $('ul.order li:first-child', this.parent).addClass('active');
        $('ul.tt-box li:first-child', this.parent).addClass('active').animate({ top: 0 });
    }
    Slider.prototype.autoMove = function () {
        var self = this;
        clearTimeout(self.timer);
        self.timer = setTimeout(function () {
            self.moveTo('next');
            self.autoMove();
        }, self.time)
    }

    Slider.prototype.moveTo = function (dir) {
        var self = this;
        if (self.imgFlag == true) {
            self.imgFlag = false;
            if (dir == 'next') {
                self.nowIndex++;
                if (self.nowIndex == self.len) {
                    self.nowIndex = 0;
                    $('.img-box',self.parent).animate({
                        left: -self.w * self.len + 'px',
                    }, function () {
                        $('.img-box',self.parent).css('left', 0)
                        self.imgFlag = true;
                    })
                } else {
                    self.move();
                }
            } else {
                if (self.nowIndex == 0) {
                    self.nowIndex = self.len;
                    $('.img-box',self.parent).css('left', -self.w * self.nowIndex + 'px')
                    self.nowIndex--;
                    self.move();
                }
                else {
                    self.nowIndex--;
                    self.move();
                }
            }
            self.orderChange();
            self.titleChange();
        }

    }
    Slider.prototype.move = function () {
        var self = this;
        $('.img-box', self.parent).animate({
            left: -self.w * self.nowIndex + 'px',
        }, function () {
            self.imgFlag = true;
        })

    }
    Slider.prototype.bindEvent = function () {
        var self = this;
        $('.order li', self.parent).add('.btn a', self.parent).click(function () {
            if ($(this).attr('class') == 'prev') {
                self.moveTo('prev');
            } else if ($(this).attr('class') == 'next') {
                self.moveTo('next');
            } else {
                self.nowIndex = $(this).index()
                self.move();
                self.orderChange();
                self.titleChange();
            }
        })
        self.parent.hover(function () {
            clearTimeout(self.timer)
        }, function () {
            self.autoMove();
        })
    }

    Slider.prototype.orderChange = function () {
        var self = this;
        $('.order .active', self.parent).removeClass('active');
        $('.order li', self.parent).eq(this.nowIndex).addClass('active');
    }
    Slider.prototype.titleChange = function () {
        var self = this;
        $('.tt-box .active', self.parent).removeClass('active').animate({ top: '60px' })
        $('.tt-box li', self.parent).eq(self.nowIndex).addClass('active').animate({ top: '0' }, function () {
        });

    }

})()