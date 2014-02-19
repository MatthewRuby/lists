  var SectionModel = Backbone.Model.extend({
    defaults: {
            meta : 'meta-data',
            headline : 'Headline',
            media : 'Media',
            description : 'Description'
        },
        initialize: function(){}
    });

    SectionView = Backbone.View.extend({
        initialize: function(model){
            console.log( model );
            if(!model.isset){
                this.render();
            } else {
                this.$el.addClass('saved');
            }
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
            if(e.target.className === 'media') {
                e.target.innerText =  $(e.target).attr(src);
            } else {
                e.target.innerHTML = e.target.innerText;
            }

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
    console.log( sections.length )
    for(var i = 0, end = sections.length; i < end; i++){
        list.push( new SectionView({ el : $(sections[i]), model : new SectionModel, isset : true }) );
    } 


    var Button = Backbone.View.extend({
      events: {
            "click" : "newSection"
        },
        newSection: function(){
          var section = new SectionView({el : $('#main'), model : new SectionModel });
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

            _.each(sections, function(section){
                var m = {
                    meta : $(section).find('.meta').text().replace('meta-data', ''),
                    headline : $(section).find('.headline').html().replace('Headline', ''),
                    description : $(section).find('.description').html().replace('Description', ''),
                    media : $(section).find('.media img').attr('src')
                };
                arr.push(m);
            });

            $.ajax({
                type : "POST",
                url : '/save',
                data : { 
                    "name" : window.location.pathname.replace('/', ''),
                    "list" : arr
                },
                success : function(data){
                    console.log( data );
                }
            });

        }

    });
    var save = new Save({ el : $("#save") });