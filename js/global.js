function timeline(el) {

    if ($(el)[0] && !$(el).hasClass("owl-next") && !$(el).hasClass("owl-prev")){
        var position = $(el).offset();
        $('#timetable').find('.timeline').css('margin-left', ''+position.left+'px');

    }else{

        if($(el).hasClass("owl-next") || $(el).hasClass("owl-prev")){
            setTimeout(function(){ 
                var position = $('.time').find('a.directLink.active').offset();
                $('#timetable').find('.timeline').css('margin-left', ''+position.left+'px');
            }, 200);
        }

        if(!$(el).hasClass("owl-next") && !$(el).hasClass("owl-prev")){
            var position = $('.time').find('a.directLink.active').offset();
            $('#timetable').find('.timeline').css('margin-left', ''+position.left+'px');
        }
        
    }
};

var initPhotoSwipe = function(gallerySelector) {

    // parse slide data (url, title, size ...) from DOM elements 
    // (children of gallerySelector)
    var parseThumbnailElements = function(el) {
        var thumbElements = $(el).find('figure'),
            items = [],
            $figureEl,
            linkEl,
            size,
            item;


        for(var i = 0; i < thumbElements.length; i++) {

            $figureEl = $(thumbElements[i]); // <figure> element
            var $link = $figureEl.find('a:eq(0)');
			size = $link.data('size').split('x');

            // create slide object
            item = {
                src: $link.attr('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };



            if($figureEl.find('figcaption').length != 0) {
                item.title = $figureEl.find('figcaption').html(); 
            }
            
            item.msrc = $figureEl.find('img').attr('src');

            item.el = $figureEl[0]; // save link to element for getThumbBoundsFn
            items.push(item);
        }

        return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function(e) {
        e.preventDefault();

        var eTarget = e.target || e.srcElement;

        console.log(gallerySelector);

        var clickedGallery = $(eTarget).parents('.owl-carousel')[0];
        var index = $(eTarget).parents('.owl-item').index();

        console.log(index);

        if(index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
        params = {};

        if(hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');  
            if(pair.length < 2) {
                continue;
            }           
            params[pair[0]] = pair[1];
        }

        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        if(!params.hasOwnProperty('pid')) {
            return params;
        }
        params.pid = parseInt(params.pid, 10);
        return params;
    };

    var openPhotoSwipe = function(index, galleryElement, disableAnimation) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {
            index: index,

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            getThumbBoundsFn: function(index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = $(window).scrollTop(),
                    rect = thumbnail.getBoundingClientRect(); 

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            }

        };

        if(disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = $( gallerySelector + ' figure');

    for(var i = 0, l = galleryElements.length; i < l; i++) {
        $(galleryElements[i]).attr('data-pswp-uid', i+1);
    }

    $(document).on('click', gallerySelector + ' a', onThumbnailsClick);

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if(hashData.pid > 0 && hashData.gid > 0) {
        openPhotoSwipe( hashData.pid - 1 ,  galleryElements[ hashData.gid - 1 ], true );
    }
};

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};


$(document).ready(function(){
	$('.no-js').removeClass('no-js');
	var w = $(window).width();

	/**
	 * Galerie Initialisierung
	 */
    initPhotoSwipe('.owl-carousel');
    initPhotoSwipe('.lightboxWrap');


	/**
	 * Galerie
	 */
	var w = $(window).width()
    $('#gallery .lazyOwl').each(function () {
        if(w < 960) {
            var img = $(this).data('mobile-src');
             $(this).attr('data-src', img);
        }
    });


	$('#gallery').owlCarousel({
		singleItem: true,
		lazyLoad: true,
		addClassActive: true,
		navigation: false,
		pagination: false,
		mouseDrag: false,
		autoPlay: 8000,
		transitionStyle: 'fade',
		autoHeight: false
	});


	/**
	 * Bildslider im Content
	 */

	$('.multiplePics').owlCarousel({
		items: 				2,
		itemsDesktop: 		[1199,2],
		itemsDesktopSmall: 	[979,2],
		itemsTablet: 		[768,2],
		itemsTabletSmall:	false,
		itemsMobile: 		[479,1],
		lazyLoad: 			true,
		addClassActive: 	true,
		baseClass: 			'multiplePics',
		autoHeight: 		false,
        navigation:         true,
        navigationText:     ["<",">"]
	});

	$('.singlePic').owlCarousel({
		singleItem: true,
        navigation: true,
        navigationText: ["<",">"],
        pagination: false,
		lazyLoad: true,
		addClassActive: true,
		baseClass: 'singlePic',
        
	});


    /* Historie Timeline */
    if ($(".time")[0]){
            timeline();
        $( ".time .directLink" ).hover(function() {
            timeline(this);
        }, function() {
            timeline();
        });
    }

    $('.owl-timeline').owlCarousel({
        addClassActive: true,
        mouseDrag: true,
        items: 8,
        itemsDesktopSmall: 6,
        itemsTablet: 5,
        itemsMobile: 3,
        pagination: false,
        rewindNav: false,
        navigation : true,
        navigationText : ["<span><</span>","<span>></span>"],
        scrollPerPage: true,
        transitionStyle: 'fade',
        afterInit: function(el){ 

            var act = $('.owl-timeline').find('.directLink.active').data('attr');
            $('.owl-timeline').trigger('owl.jumpTo', (act-1));
            timeline(); 

            $(".owl-next").click(function(){
                timeline(this);
            })

            $(".owl-prev").click(function(){
                timeline(this);
            })
        },
    });



	/**
	 * NAVIGATION
	 */
	$("#navMain").stick_in_parent({
		parent: 'body'
	});

	if(w < 1500){
		$("#navMain").trigger("sticky_kit:detach");
	}

	$(window).resize(function(e){
		w = $(window).width();
		if(w < 1500){
			$("#navMain").trigger("sticky_kit:detach");
		} else {
			$("#navMain").stick_in_parent({
				parent: 'body'
			});
		}
	});

	$('#navMain li:has(ul)').doubleTapToGo();


	/**
	 * Responsive Toggle Element Functions
	 */
	var $search = $('#navMain .searchvty');
    $(document).on('click', '.search-trigger', function(e){
        if(!$search.hasClass('opened')){
            $search.show();
        } else {
            $search.hide();
        }
        $('.nav-is-visible').removeClass('nav-is-visible');
		$search.toggleClass('opened');

		e.preventDefault();
	});

	$(document).on('click', '.nav-trigger', function(e){
        $('#navMain #searchvty').removeClass('opened');
		$(this).toggleClass('nav-is-visible');
		$('html').toggleClass('nav-is-visible');
		$(this).parents('#navMain').toggleClass('nav-is-visible');
		e.preventDefault();
	});

	

	/**
	 * Collapse Contents on Mobile
	 */
	if(w <= 768){
		$('.accmobile').each(function(e){
			if($(this).attr('title') != ''){
				var $trigger = $('<a href="#" class="accmobileTrigger btn col12"><span class="icon">+</span>' + $(this).attr("title") + '</a>');
                $(this).hide();
				$trigger.insertBefore($(this));

				$trigger.click(function(e){
					e.preventDefault();
					$(this).next().slideToggle();
				});
			}
		});
	}

    /**
     * iOS Search Focus Bugfix
     */
    if(/iPhone|iPad|iPod/i.test(navigator.userAgent)){
        $('html').addClass('ios');
        var $wrap = $('.pageWrap'),
            $logo = $('#logohome');
        $wrap.touchmove(function(e){
            logoDebounce();
        });

        var logoDebounce = debounce(function() {
            if($wrap.scrollTop() > 5){
                $logo.fadeOut(250);
            } else {
               $logo.fadeIn(250);
            }
        }, 250);
    }

    $('#share-wrapper a').click(function(e){
        
        if($(this).parent().hasClass('follow')){
            $(this).attr('target','_blank');
        } else if(!$(this).parent().hasClass('mail')){
            var openLink = $(this).attr('href');
            window.open(openLink,'Share on Social Media','width=400,height=400,top=100,left=100');
            e.preventDefault();
        }
    });

});
