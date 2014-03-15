define(['lib/jquery', 'lib/backbone-min'], function($, Backbone) {
    return {
        feedback: function (message, callback){
            $('#modal').text(message);
            $('body').addClass('beginMessage');
            setTimeout(function(){
                $('body').removeClass('beginMessage');
                $('body').addClass('finishMessage');
                setTimeout(function(){
                    $('body').removeClass('finishMessage');
                    callback();
                }, 1500);
            }, 100);
        }
    }
});