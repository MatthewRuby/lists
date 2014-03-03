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
        console.log(this.$el)
        this.$el.find('.meta, .headline, .media, .description').attr('contenteditable', 'true');
    },
    events: {
        "focus [contenteditable]" : "startEdit",
        "blur [contenteditable]" : "endEdit"
    },
    render: function(){
        var template = _.template( $("#section_template").html(), this.model.toJSON() );
        this.$el.append( template );
    },
    startEdit: function(e){
      console.log('startEdit')
      e.target.innerText = e.target.innerHTML;
    },
    endEdit: function(e){
      console.log('endEdit')
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
        var section = new SectionView({ el : $('#main'), model : new SectionModel });
        section.render();
    }
});


var sections = $('section'),
    list = [];
for(var i = 0, end = sections.length; i < end; i++){
    list.push( new SectionView({ el : $(sections[i]), model : new SectionModel }) );
}


var page = new SectionList();



var newSect = new NewSection({ el : $("#new") });




var Save = Backbone.View.extend({
    events: {
        "click" : "saveData"
    },
    saveData: function(){

        var sections = $('#main section'),
            arr = [],
            name = window.location.pathname.replace('/', ''),
            styles = $('#custom-styles').val();

        for(var i = 0, end = sections.length; i < end; i++) {
            var m = {
                meta : $(sections[i]).find('.meta').text(),
                headline : $(sections[i]).find('.headline').html(),
                description : $(sections[i]).find('.description').html(),
                media : $(sections[i]).find('.media img').attr('src')
            };
            arr.push(m);
        }

        $.ajax({
            type : "POST",
            url : '/archive',
            data : { 
                "name" : name,
                "list" : arr,
                "styles" : encodeURIComponent(styles)
            },
            success : function(data){
                console.log( data );

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



/*
app
    setup static 
    insert new
    save updates
*/