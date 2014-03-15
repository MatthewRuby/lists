define('modules/Entry', ['lib/jquery', 'modules/Item'], function($, Item) {

    return function(){
        var sections = $('#latest section'),
            list = [];
        _.each(sections, function(section){
            list.push( Item.setupEntry( $(section) ) );
        });
    }

});