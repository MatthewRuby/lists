var SectionModel = Backbone.Model.extend({
    defaults: {
        meta : 'meta-data',
        headline : 'Headline',
        media : 'Media',
        description : 'Description'
    },
    initialize: function(){
        console.log("New Section Model Created");
    }
});


SectionView = Backbone.View.extend({
    initialize: function(model){
    },
    events: {
        "focus [contenteditable]" : "startEdit",
        "blur [contenteditable]" : "endEdit"
    },
    render: function(){
        var template = _.template( $("#section_template").html(), this.model.toJSON() );
        $( template ).insertBefore('#new');
        setTimeout(function(){
            $('section.new').removeClass('new');
        }, 250);
    },
    startEdit: function(e){
        console.log('startEdit')
        $(e.target).removeClass('new');
        if($(e.target).attr('data-placeholder') === e.target.innerText) {
            e.target.innerText = '';
        } else {
            e.target.innerText = e.target.innerHTML;
        } 
    },
    endEdit: function(e){
      console.log('endEdit')

      if($(e.target).attr('data-placeholder') === e.target.innerText || e.target.innerText === '') $(e.target).addClass('new')

      var obj = {};
        obj[e.target.className] = e.target.innerText;
      this.model.set(obj);

      if(e.target.className === 'media') {
        var str = e.target.innerText,
            ext = str.slice( str.lastIndexOf('.'), str.length );

        if( ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.gif') {
            var im = new Image();
            im.src = str;

            im.onload = function() {
                e.target.innerText = '';
                $(e.target).append(im);
            }

            im.onerror = function() {
                e.target.innerText = '';
                console.log('error')
            }

        }
        
      } else {
        e.target.innerHTML = e.target.innerText;
      }

      
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

$('#latest').find('.meta, .headline, .media, .description').attr('contenteditable', 'true');

var page = new SectionList();

var newSect = new NewSection({ el : $("#new") });



function saveFilter(el){
    var value = false;
    if( $(el).html() !== $(el).attr('data-placeholder') ) {
        value = $(el).html();
    }
    return value
}


var Save = Backbone.View.extend({
    events: {
        "click" : "saveData"
    },
    saveData: function(){

        var sections = $('#latest section'),
            items = [],
            name = window.location.pathname.replace('/', ''),
            styles = $('#custom-styles').val();

        $('#latest').attr('data-version', parseInt($('#latest').attr('data-version')) + 1)

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
            if( $(sections[i]).find('.media img') ){
                m.media = $(sections[i]).find('.media img').attr('src')                
            }

            items.push(m);
        }

        var data = { 
            name : name,
            entry : {
                "Version" : parseInt($('#latest').attr('data-version')),
                "styles" : encodeURIComponent(styles),
                "items" : items
            }
        }

        console.log(data)

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


$('#info-toggle').on('click', function(){
    $('body').toggleClass('open');
    $('#custom-styles').removeAttr('style');
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