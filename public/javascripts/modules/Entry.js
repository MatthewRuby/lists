define(['lib/jquery'], function($) {

    SectionView = Backbone.View.extend({
        initialize: function(model) {},
        events: {
            "focus [contenteditable]": "startEdit",
            "blur [contenteditable]": "endEdit"
        },
        render: function() {
            var template = _.template($("#section_template").html(), this.model.toJSON());
            $(template).insertBefore('#new');
            setTimeout(function() {
                $('section.new').removeClass('new');
            }, 250);
        },
        startEdit: function(e) {
            console.log('startEdit')
            $(e.target).removeClass('new');
            if ($(e.target).attr('data-placeholder') === e.target.innerText) {
                e.target.innerText = '';
            } else {
                e.target.innerText = e.target.innerHTML;
            }
        },
        endEdit: function(e) {
            console.log('endEdit')

            if ($(e.target).attr('data-placeholder') === e.target.innerText || e.target.innerText === '') $(e.target).addClass('new')

            var obj = {};
            obj[e.target.className] = e.target.innerText;
            this.model.set(obj);

            if (e.target.className === 'media') {
                var str = e.target.innerText,
                    ext = str.slice(str.lastIndexOf('.'), str.length);

                if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.gif') {
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

});