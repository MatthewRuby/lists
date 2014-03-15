define([
    'lib/jquery',
    'lib/backbone-min',
    'lib/swipe',
    'modules/InfoPanel',
    'modules/DataTransfer',
    'modules/Utils'],
    function($, Backbone, Swipe, InfoPanel, DataTransfer, Utils) {

        return {

            init : function(){
                if($('#latest').length < 1){
                    $('.swipe-wrap').append('<div id="latest" class="version" data-version="0"><div class="item-wrap"></div><button id="new">new item</button></div>');
                }
                this.initCarousel();
            },

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