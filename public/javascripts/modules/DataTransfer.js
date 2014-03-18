define(['lib/jquery', 'lib/backbone-min', 'modules/Utils'], function($, Backbone, Utils) {
    return {

        bHasEdit: true,
        setSavable : function(bEdit){
            this.bHasEdit = bEdit;
        },

        saveData: function(list) {
            var self = this;

            if(self.bHasEdit){
                $('#latest').attr('data-version', parseInt($('#latest').attr('data-version')) + 1);
                $.ajax({
                    type : "POST",
                    url : '/archive',
                    data : self.collectData(list),
                    success : function(data){
                //        Utils.feedback('Saving', null);
                    }
                });
            } else {
                Utils.feedback('Saving', null);
            }


        },

        collectData: function(list){
            var sections = $('#latest section'),
                items = [],
                name = window.location.pathname.replace('/', ''),
                styles_raw = $.trim($('#custom-styles').val()),
                prefix = '[data-version="' + $('#latest').attr('data-version') + '"]',
                styles_namespaced = styles_raw.replace(/([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/g, prefix + " \$1 {");


            _.each(list, function(item){
                items.push(item.model.attributes);
                // if(item.model.attributes.photo !== null){
                //     console.log(photo)
                // }
            });

            // console.log(temp)

/*
            for(var i = 0, end = sections.length; i < end; i++) {

                var m = {},
                    meta = this.saveFilter( $(sections[i]).find('.meta') ),
                    headline  = this.saveFilter( $(sections[i]).find('.headline') ),
                    description  = this.saveFilter( $(sections[i]).find('.description') );
                if(meta) {
                    m.meta = meta;
                }
                if(headline) {
                    m.headline = headline;
                }
                if(description) {
                    m.description = description;
                }
                // if( $(sections[i]).find('.upload_form').length > 0 ){
                //     var form = sections[i].getElementsByTagName('form')[0],
                //         file = form.getElementsByTagName('input')[0].files[0],
                //         formData = new FormData();
                //     formData.append("files", file);
                //     console.log(file)
                //     console.log(formData)
                //     upload(formData)
                // }

                items.push(m);
            }
*/
            var data = {
                name : name,
                entry : {
                    "Version" : parseInt($('#latest').attr('data-version')),
                    "styles_raw" : encodeURIComponent(styles_raw),
                    "styles_namespaced" : encodeURIComponent(styles_namespaced),
                    "items" : items
                }
            }
            return data;
        },

        uploadFile: function (formData){
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
        },

        saveFilter: function(el){
            var value = false;
            if( $(el).html() !== $(el).attr('data-placeholder') || $(el).html() != '' ) {
                value = $(el).html();
            }
            return value
        }

    }
});