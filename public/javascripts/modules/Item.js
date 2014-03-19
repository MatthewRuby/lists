define('modules/Item', ['lib/jquery', 'lib/backbone-min', 'modules/Drawing'], function($, Backbone, Drawing) {

    var ItemModel = Backbone.Model.extend({
        initialize: function(){}
    });

    var ItemView = Backbone.View.extend({
        initialize: function() {
            var self = this;
            this.$el.find('.meta, .headline, .description').attr('contenteditable', 'true');

            this.$el.find('.media-btn').on('click', function(){
                $(this).toggleClass('active');
                self.$el.find('.media-controls').toggleClass('active');
            });

            this.$el.find('.photo').on('click', function(){
                self.enablePhoto(self.$el, self.model);
            });
            this.$el.find('.draw').on('click', function(){
                self.enableDraw(self.$el, self.model);
            });
            this.$el.find('.clear').on('click', function(){
                self.clearMedia(self.$el, self.model);
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
            el.find('.file').trigger('click');
            el.find('.media').removeClass('new');
            el.find('.file').on('change', function(){
                var input = this;
                if (input.files && input.files[0]) {
                    var reader = new FileReader(),
                        xhr = new XMLHttpRequest(),
                        formData = new FormData();
                    formData.append('file', input.files[0]);
                    xhr.open("POST", "/photo_upload");
                    xhr.send(formData);
                    xhr.onload = function (e) {
                        var res = JSON.parse(xhr.response)
                        model.set({ media: {
                            photo: res.filePath,
                            draw: el.find('.paper').html(),
                        }});
                        if(el.find('.media-wrap img').length){
                            el.find('.media-wrap img').attr('src', res.filePath);
                        } else {
                            el.find('.media-wrap').append('<img src="' + res.filePath + '">');
                        }

                    }
                }
            });

        },

        enableDraw : function(el, model) {
            var paper = el.find('.paper');
            if(!paper.length){
                el.find('.media-wrap').append('<svg class="paper" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink"http://www.w3.org/1999/xlink" attributeType="XML"></svg>');
                paper = el.find('.paper');
            }
            el.find('.media-wrap').addClass('hasDrawing');
            new Drawing(paper);
            paper.on('mouseup', function(){
                model.set({ media: {
                    draw: paper.html(),
                    photo : el.find('.media-wrap img').attr('src'),
                }});
                new Drawing(paper);
            });

        },

        clearMedia: function(el, model) {
            el.find('.media-wrap').html('');
            model.set({ media: {photo: null, draw: null} });
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
                    photo : section.find('.media-wrap img').attr('src'),
                    draw : null
                },
                description : section.find('.description').html()
            });
            var item = new ItemView({el:section, model:model});
            return item;
        }

    }
});