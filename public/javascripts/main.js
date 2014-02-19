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
            this.render();
        },
        events: {
        "focus [contenteditable]" : "startEdit",
          "blur [contenteditable]" : "endEdit"
      },
        render: function(){
          console.log(this.el);
          if( this.el ){
            console.log('has el')
          } else {
            var template = _.template( $("#section_template").html(), this.model.toJSON() );
              this.wrap.append( template );
          }

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
            e.target.innerHTML = '<img src="' + e.target.innerText + '">';
          } else {
            e.target.innerHTML = e.target.innerText;
          }

          
        }
    });

    var SectionList = Backbone.Collection.extend({
      model: SectionModel
  });

    var sections = $('section'),
      list = [];
    for(var i = 0, end = sections.length; i < end; i++){
      list.push( new SectionView({ el : $(sections[i]), model : new SectionModel }) );
    } 

  var page = new SectionList();



    // var sect = new SectionView({el : $('#main'), model : new SectionModel });


/*

  app = collection of views

*/



    var Button = Backbone.View.extend({
      events: {
            "click" : "newSection"
        },
        newSection: function(){
          var section = new SectionView({wrap : $('#main'), model : new SectionModel });
        }
    });
    var button = new Button({ el : $("#new") });


    var Save = Backbone.View.extend({
      events: {
            "click" : "saveData"
        },
        saveData: function(){

          var sections = $('#main section'),
          arr = [];

        for(var i = 0, end = sections.length; i < end; i++) {
          var m = {
            identifiers : $(sections[i]).find('.identifiers').text(),
            headline : $(sections[i]).find('.headline').html(),
            description : $(sections[i]).find('.description').html(),
            media : $(sections[i]).find('.media img').attr('src')
          };
          arr.push(m);
        }

        console.log(window.location)

        var name = window.location.pathname.replace('/', '')

        $.ajax({
          type : "POST",
          url : '/save',
          data : { 
            "name" : name,
            "list" : arr
          },
          success : function(data){
            console.log( data );
          }
        })
        }

    });
    var save = new Save({ el : $("#save"), collection : page });