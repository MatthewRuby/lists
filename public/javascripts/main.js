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
        'lib/swipe-req',
        'modules/Page',
        'modules/Item',
        'modules/DataTransfer'
    ],
    function($, _, Backbone, swipe, Page, Item, DataTransfer) {

        Page.init();

        var sections = $('#latest section'),
            list = [];

        _.each(sections, function(section){
            var item = Item.setupEntry( $(section) )
            list.push( item );
        });

        $('#new').on('click', function(){
            var section = document.createElement('section');
            section.setAttribute('class', 'new');
            $('#latest').find('.item-wrap').append(section);
            list.push( Item.newBlankEntry( $(section) ) );
        });

        $('#save').on('click', function(){
            DataTransfer.saveData(list)
        });


});