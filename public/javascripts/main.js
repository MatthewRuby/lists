require.config({
  paths: {
    jquery: 'lib/jquery',
    underscore: 'lib/underscore-min',
    backbone: 'lib/backbone-min'
  }
});

define([
    'jquery',
    'underscore',
    'backbone',
    'section'
], function($, _, Backbone, Section){

    var initialize = function(){

        console.log(Backbone)
    $('#new').on('click', function(){

        var section = new SectionView();
        // section.initialize();

    });


  }

  return {
    initialize: initialize
  };

});