define(['jquery', 'lib/swipe'], function($, Swipe) {

    return {

        initCarousel: function() {

            var carousel = Swipe.init($('#slider')[0], {
                startSlide: $('.version').length - 1,
                speed: 250,
                continuous: false,
                disableScroll: false,
                stopPropagation: false,
                callback: function(index, elem) {

                },
                transitionEnd: function(index, elem) {

                }
            });
            this.winControls(carousel);
        },

        winControls: function(c) {
            $('#prev').on('click', function() {
                c.prev();
            });
            $('#next').on('click', function() {
                c.next();
            });
        }

    }





});