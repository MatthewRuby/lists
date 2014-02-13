require.config({
  paths: {
    angular: '/javascripts/lib/angular.min'
  }
});

define([
    'angular',
    'MainCtrl'
], function(Angular, MainCtrl){
  console.log('begin')

  new MainCtrl(Angular)

});