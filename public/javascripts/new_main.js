requirejs.config({
    shim: {
        'lib/jquery': {
            exports: '$'
        },
        'lib/underscore-min': {
            exports: '_'
        },
        'lib/backbone-min': {
            deps: ['lib/underscore-min', 'lib/jquery'],
            exports: 'Backbone'
        }
    }
});

require(['lib/jquery',
        'lib/underscore-min',
        'lib/backbone-min',
        'lib/swipe-req'
    ],
    function($, _, Backbone, swipe) {
        console.log(Backbone)
    //    Page.initCarousel()

});