define('modules/Item', ['lib/jquery', 'lib/backbone-min'], function($, Backbone) {

    var ItemModel = Backbone.Model.extend({
        defaults: {
            meta : 'Tags',
            headline : 'Headline',
            media : {
                photo : null,
                draw : null
            },
            description : 'Description'
        },
        initialize: function(){
        }
    });

    var ItemView = Backbone.View.extend({
        initialize: function() {
            console.log(this)
            this.$el.find('.meta, .headline, .description').attr('contenteditable', 'true');
        },
        events: {
            "focus [contenteditable]" : "startEdit",
            "blur [contenteditable]" : "endEdit",
            "click .photo" : "enablePhoto",
            "click .draw" : "enableDraw"
        },
        render: function() {
            var template = _.template($("#section_template").html(), this.model.toJSON());
            this.$el.append(template);
            this.$el.find('.meta, .headline, .description').attr('contenteditable', 'true');
            setTimeout(function() {
                $('section.new').removeClass('new');
            }, 250);
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
            var edit = $(e.target),
                placeholder = edit.attr('data-placeholder');
            if( edit.text() === placeholder || edit.text() === '') {
                edit.text(placeholder);
                edit.addClass('new')
            } else {
                edit.html(edit.text());
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

    return {
        Item : null,
        newBlankEntry: function(el) {
            var model = new ItemModel();
            this.Item = new ItemView({el: el, model : model});
            this.Item.render();
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
            this.Item = new ItemView({el:section, model:model});
        }

    }
});