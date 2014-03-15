define(['lib/jquery', 'lib/backbone-min', 'modules/DataTransfer', 'modules/Utils'], function($, Backbone, DataTransfer, Utils) {

    /* Info Panel */
    $('#save').on('click', function(){
        DataTransfer.saveData()
    });

    $('#info-toggle').on('click', function(){
        $('body').toggleClass('open');
        $('#custom-styles').removeAttr('style');
    });
    $('#fork').on('click', function(){
        $('#fork-info').toggle().css('display', 'block');
    });
    $('#fork-info').on('keyup', function(e){
        if(e.keyCode == 13){
            $.ajax({
                type : "POST",
                url : '/fork',
                data : {
                    archiveName : window.location.pathname.replace('/', ''),
                    newName : $('#fork-info').val()
                },
                success : function(data){
                    Utils.feedback('Forked', function(){
                        window.location = '/' + $('#fork-info').val();
                    });
                }
            });
        }
    });


    $('#custom-styles').on('focus', function(){
        $(document).on('keydown', addTabFormat);
    });

    $('#custom-styles').on('blur', function(){
        $(document).off('keydown', addTabFormat);
    });
    function addTabFormat(e){
        if(e.keyCode === 9) {
            e.preventDefault();
            var prevVal = e.target.value,
                prevStart = e.target.selectionStart,
                begin = prevVal.slice(0, prevStart),
                end = prevVal.slice(prevStart, prevVal.length);
            e.target.value = begin + "    " + end;
            e.target.selectionEnd = prevStart + 4;
        }
    }

});






