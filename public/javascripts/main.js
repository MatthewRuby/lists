var SectionModel = Backbone.Model.extend({
    defaults: {
        meta : 'meta-data',
        headline : 'Headline',
        media : {
            photo : null,
            draw : null,
            map : null
        },
        description : 'Description'
    },
    initialize: function(){
    }
});

/*
function SectionView(el){
    $(el).find('.meta, .headline, .description').attr('contenteditable', 'true');
}
SectionView.prototype = {

}
*/
var SectionView = Backbone.View.extend({
    initialize: function(model){
        this.$el.find('.meta, .headline, .description').attr('contenteditable', 'true');
    },
    events: {
        "focus [contenteditable]" : "startEdit",
        "blur [contenteditable]" : "endEdit",
        "click .photo" : "enablePhoto",
        "click .draw" : "enableDraw",
    },
    render: function(){
        var template = _.template( $("#section_template").html(), this.model.toJSON() );
        $( template ).insertBefore('#new');
        setTimeout(function(){
            $('section.new').removeClass('new');

        }, 250);
    },
    startEdit: function(e){
        $(e.target).removeClass('new');
        if(e.target.innerText === $(e.target).attr('data-placeholder')) {
            e.target.innerText = '';
        } else {
            e.target.innerText = e.target.innerHTML;
        }
    },
    endEdit: function(e){
        var text = e.target.innerText,
            placeholder = $(e.target).attr('data-placeholder');

        if( text === placeholder || text === '') {
            e.target.innerText = placeholder;
            $(e.target).addClass('new')
        } else {
            e.target.innerHTML = text;
        }

    },

    enablePhoto: function() {
        var self = this;

        this.$el.find('.media').removeClass('new');
        var template = _.template( $("#upload_template").html(), {} );
        this.$el.find('.media-controls').append( template );

        this.$el.find('.upload_form').on('change', function(){

            console.log('change')
            var input = $(this).find('.file')[0];
            console.log(input)

            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    self.$el.find('.media').prepend('<div class="media-wrap"><img src="' + e.target.result + '"></div>');
                }
                reader.readAsDataURL(input.files[0]);
            }
        });

    },

    enableAudio : function(e) {
        /*
        $('.media').removeClass('new').addClass('audio-contents');
        $('.media-wrap').html('<canvas id="analyser"></canvas><button id="record">record</button>');
        window.Recorder = Recorder;
        initAudio();
        $('.media').on('click', '#record', function(){
            toggleRecording(this)
        });
        */
    }
});



var SectionList = Backbone.Collection.extend({
    model: SectionModel
});

var NewSection = Backbone.View.extend({
    events: {
        "click" : "newSection"
    },
    newSection: function(){
        var section = new SectionView({ el : $('#latest'), model : new SectionModel });
        section.render();

        console.log(section)

    }
});


var sections = $('#latest section'),
    list = [];
for(var i = 0, end = sections.length; i < end; i++){
    list.push( new SectionView({ el : $(sections[i]), model : new SectionModel }) );
}

if($('#latest').length < 1){
    $('.swipe-wrap').append('<div id="latest" class="version" data-version="0"><button id="new">new item</button></div>');
}

var page = new SectionList();

var newSect = new NewSection({ el : $("#new") });



function saveFilter(el){
    var value = false;
    if( $(el).html() !== $(el).attr('data-placeholder') || $(el).html() != '' ) {
        value = $(el).html();
    }
    return value
}


var Save = Backbone.View.extend({
    events: {
        "click" : "saveData"
    },
    saveData: function(){
        $('#latest').attr('data-version', parseInt($('#latest').attr('data-version')) + 1);

        var sections = $('#latest section'),
            items = [],
            name = window.location.pathname.replace('/', ''),
            styles_raw = $.trim($('#custom-styles').val()),
            prefix = '[data-version="' + $('#latest').attr('data-version') + '"]',
            styles_namespaced = styles_raw.replace(/([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/g, prefix + " \$1 {");

        for(var i = 0, end = sections.length; i < end; i++) {

            var m = {},
                meta = saveFilter( $(sections[i]).find('.meta') ),
                headline  = saveFilter( $(sections[i]).find('.headline') ),
                description  = saveFilter( $(sections[i]).find('.description') );
            if(meta) {
                m.meta = meta;
            }
            if(headline) {
                m.headline = headline;
            }
            if(description) {
                m.description = description;
            }
            if( $(sections[i]).find('.upload_form').length > 0 ){
                var form = sections[i].getElementsByTagName('form')[0],
                    file = form.getElementsByTagName('input')[0].files[0],
                    formData = new FormData();
                formData.append("files", file);
                console.log(file)
                console.log(formData)
                upload(formData)
            }

            items.push(m);
        }

        var data = {
            name : name,
            entry : {
                "Version" : parseInt($('#latest').attr('data-version')),
                "styles_raw" : encodeURIComponent(styles_raw),
                "styles_namespaced" : encodeURIComponent(styles_namespaced),
                "items" : items
            }
        }

        $.ajax({
            type : "POST",
            url : '/archive',
            data : data,
            success : function(data){
                $('body').addClass('beginSave');
                setTimeout(function(){
                    $('body').removeClass('beginSave');
                    $('body').addClass('finishSave');
                    setTimeout(function(){
                        $('body').removeClass('finishSave');
                    }, 1500);
                }, 100);

            }
        });
    }
});
var save = new Save({ el : $("#save"), collection : page });


function upload(formData){
    $.ajax({
        type : "POST",
        url : '/photo_upload',
        data : formData,
        cache: false,
        contentType: false,
        processData: false,
        success : function(data){
            console.log(data)
            // m.media.photo =  data.path;
        }
    });
}

/* Info Panel */
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
                console.log(data)
                $('body').addClass('beginSave');
                setTimeout(function(){
                    $('body').removeClass('beginSave');
                    $('body').addClass('finishSave');
                    setTimeout(function(){
                        $('body').removeClass('finishSave');
                        window.location = '/' + $('#fork-info').val();
                    }, 1500);
                }, 100);
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




window.mySwipe = Swipe(document.getElementById('slider'), {
  startSlide: $('.version').length - 1,
  speed: 400,
  continuous: false,
  disableScroll: false,
  stopPropagation: false,
  callback: function(index, elem) {
    console.log('callback')
  },
  transitionEnd: function(index, elem) {

  }
});

$('#prev').on('click', function(){
    window.mySwipe.prev();
});
$('#next').on('click', function(){
    window.mySwipe.next();
});


















