define('modules/Item', ['lib/jquery', 'lib/backbone-min'], function($, Backbone) {


    var ItemModel = Backbone.Model.extend({
        initialize: function(){}
    });

    var ItemView = Backbone.View.extend({
        initialize: function() {
            var self = this;
            this.$el.find('.meta, .headline, .description').attr('contenteditable', 'true');
            this.$el.find('.photo').on('click', function(){
                self.enablePhoto(self.$el, self.model);
            });
            this.$el.find('.draw').on('click', function(){
                self.enableDraw(self.$el, self.model);
            });
        },
        events: {
            "focus [contenteditable]" : "startEdit",
            "blur [contenteditable]" : "endEdit"
        },
        render: function() {
            var template = _.template($("#section_template").html(), this.model.toJSON());
            this.$el.append(template);
            this.$el.find('.meta, .headline, .description').attr('contenteditable', 'true');
            setTimeout(function() {
                $('section.new').removeClass('new');
            }, 250);
            this.initialize();
        },
        startEdit: function(e){
            var edit = $(e.target);
            edit.removeClass('new');
            if(edit.text() === edit.attr('data-placeholder')) {
                edit.text('');
            } else {
                edit.text(edit.html());
            }
        },
        endEdit: function(e){
            console.log(this)
            var edit = $(e.target),
                placeholder = edit.attr('data-placeholder'),
                key = edit.attr('class');
            console.log(key)
            if( edit.text() === placeholder || edit.text() === '') {
                edit.text(placeholder);
                edit.addClass('new')
            } else {
                this.model.attributes[key] = edit.text();
                console.log(this.model.attributes[key])
                edit.html(edit.text());
            }
        },

        enablePhoto: function(el, model) {
            console.log('photo')
            el.find('.media').removeClass('new');
            var template = _.template( $("#upload_template").html(), {} );
            el.find('.media-controls').append( template );
            el.find('.file').on('change', function(){
                console.log('change')
                var input = this;
                console.log(input.files[0])

                if (input.files && input.files[0]) {
                    console.log('inside')
                    var reader = new FileReader(),
                        xhr = new XMLHttpRequest(),
                        formData = new FormData();

                    formData.append('file', input.files[0]);

                    xhr.open("POST", "/photo_upload");
                    xhr.send(formData);
                    xhr.onload = function (e) {
                        var res = JSON.parse(xhr.response)
                        model.set({ media : {photo : res.filePath} });
                        el.find('.media').prepend('<div class="media-wrap"><img src="uploads/full/' + res.filePath + '"></div>');
                    }

                }

            });

        },

        enableDraw : function(e) {

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

    return {
        newBlankEntry: function(el) {
            var model = new ItemModel();
            var item = new ItemView({el: el, model : model});
            item.render();
            return item;
        },

        setupEntry: function(section) {
            var model = new ItemModel({
                meta : section.find('.meta-data').text(),
                headline : section.find('.headline').html(),
                media : {
                    photo : null,
                    draw : null
                },
                description : section.find('.description').html()
            });
            var item = new ItemView({el:section, model:model});
            return item;
        }

    }
});