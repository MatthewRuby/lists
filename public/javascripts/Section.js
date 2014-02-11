// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){
    
    SectionView = Backbone.View.extend({
        initialize: function(){
            this.render();
        },
        render: function(){
            var template = _.template( $("#section_template").html(), {} );
            this.el.html( template );
        },
        events: {
            "blur .image" : "displayImage"
        },
        displayImage: function(){
            console.log(this);
        }
    });
    
    var section_view = new SectionView({ el: $("#search_container") });

    return section_view

});