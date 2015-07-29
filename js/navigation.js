if (typeof Object.create !== "function") {
    Object.create = function (obj) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}
(function ($, window, document) {
	var base;
    var Navigation = {
        init : function (options, el) {
            base = this;

            base.$elem = $(el);
            base.options = $.extend({}, $.fn.fbNavigation.options, base.$elem.data(), options);

            base.$overlay = $(base.options.overlay);
            base.$pageWrap = $(base.options.pageWrap);
            base.$navTrigger = $(base.options.headerButtons + ' .nav-trigger');

            base.userOptions = options;
            base.moveNavigation();
            base.bindEvents();
            base.response();
        },
        bindEvents: function(){
			base.$overlay.on('swiperight', base.closeNavigation); 
            /*$('.pageWrap').on("swiperight",function(event){
                     var $e = $(event.target);                   
                if(!$e.hasClass('owl-carousel') && $e.parents('.owl-carousel').length == 0) base.toggleNavigation();
                console.log($e.hasClass('owl-carousel'));
                console.log($e.parents('.owl-carousel').length);
            });*/
			base.$overlay.on('click', base.closeNavigation);
			base.$navTrigger.on('click', base.toggleNavigation);

			$(base.options.hasChildren +' > a').on('click', function(event){
				base.$openSub = $(this);
        		if( base.checkWindowWidth() == 'false') {
					base.openSubnavigation();
        			return false;
				}
			});


			$('.go-back').on('click', function(){
				base.$goBack = $(this);
				base.goBack();
				return false;
			});
        },
        response : function () {
            var smallDelay,
                lastWindowWidth;

            lastWindowWidth = $(window).width();

            base.resizer = function () {
                if ($(window).width() !== lastWindowWidth) {
                    window.clearInterval(base.autoPlayInterval);
                    window.clearTimeout(smallDelay);
                    smallDelay = window.setTimeout(function () {
                        lastWindowWidth = $(window).width();
                        base.moveNavigation();
                    }, base.options.refreshRate);
                }
            };
            $(window).resize(base.resizer);
        },
        checkWindowWidth: function(){
			var e = window, 
	            a = 'inner';
	        if (!('innerWidth' in window )) {
	            a = 'client';
	            e = document.documentElement || document.body;
	        }
	        if ( e[ a+'Width' ] >= base.options.breakpoint ) {
				return 'true';
			} else {
				return 'false';
			}
        },
        toggleNavigation: function(){
			if(base.$pageWrap.hasClass(base.options.visible) ) {
				base.closeNavigation();
			} else {
	            if (typeof base.options.beforeOpen === "function") {
	                base.options.beforeOpen.apply(this, [base.$elem]);
	            }
				base.$navTrigger.addClass(base.options.visible);
				$(base.options.firstLevel).addClass(base.options.visible);
				$(base.options.header).addClass(base.options.visible);
				base.$pageWrap.addClass(base.options.visible).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
					$('body').addClass('overflow-hidden');
				});
				base.$overlay.addClass(base.options.visible);

	            if (typeof base.options.afterOpen === "function") {
	                base.options.afterOpen.apply(this, [base.$elem]);
	            }
			}
			return false;
        },
        openSubnavigation: function(){
			if( base.$openSub.next('ul').hasClass('is-hidden') ) {
				//desktop version only
				base.$openSub.addClass('selected').next('ul').removeClass('is-hidden').end().parent(base.options.hasChildren).parent('ul').addClass('moves-out');
				base.$openSub.parent(base.options.hasChildren).siblings(base.options.hasChildren).children('ul').addClass('is-hidden').end().children('a').removeClass('selected');
				base.$overlay.addClass(base.options.visible);
			} else {
				base.$openSub.removeClass('selected').next('ul').addClass('is-hidden').end().parent(base.options.hasChildren).parent('ul').removeClass('moves-out');
				base.$overlay.removeClass(base.options.visible);
			}
        },
        goBack: function(){
            if (typeof base.options.beforeBack === "function") {
                base.options.beforeBack.apply(this, base.$elem);
            }

        	base.$goBack.parent('ul').addClass('is-hidden').parent(base.options.hasChildren).parent('ul').removeClass('moves-out');

            if (typeof base.options.afterBack === "function") {
                base.options.afterBack.apply(this, base.$elem);
            }
        },
        closeNavigation: function(){
            if (typeof base.options.beforeClose === "function") {
                base.options.beforeClose.apply(this, base.$elem);
            }
        	
        	$('*').removeClass(base.options.visible);

			$(base.options.pageWrap).removeClass(base.options.visible).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
				$('body').removeClass('overflow-hidden');
			});
            if (typeof base.options.afterClose === "function") {
                base.options.afterClose.apply(this, base.$elem);
            }
        },
        instantClose: function(){
			$('*').removeClass(base.options.visible);
			$('body').removeClass('overflow-hidden');
        },
        moveNavigation: function(){
	  		var desktop = base.checkWindowWidth();
	        if ( desktop == 'true') {
	        	base.closeNavigation();
				base.$elem.detach();
				base.$elem.insertBefore(base.options.headerButtons);
			} else {
				base.$elem.detach();
				base.$elem.insertAfter(base.options.pageWrap);
			}

        }

    };

    $.fn.fbNavigation = function (options) {
        return this.each(function () {
            if ($(this).data("fbnav-init") === true) {
                return false;
            }
            $(this).data("fbnav-init", true);
            var navi = Object.create(Navigation);
            navi.init(options, this);
            $.data(this, "fbNavigation", navi);
        });
    };

    $.fn.fbNavigation.options = {
		breakpoint: 960,
		visible: 'nav-is-visible',
		header: '#pageHead',
		overlay: '.cd-overlay',
		pageWrap: '.pageWrap',
		hasChildren: '.sub',
		headerButtons: '.header-buttons',
		firstLevel: '.nav-primary',
		secondLevel: '.nav-secondary',

        refreshRate : 200,
        baseWidth : window,
        beforeUpdate : false,
        afterUpdate : false,
        beforeInit : false,
        afterInit : false,

        beforeOpen: false,
        afterOpen: false,
        beforeClose: false,
        afterClose: false,
        beforeBack: false,
        afterBack: false
    };
}(jQuery, window, document));