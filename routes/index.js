
/*
 * GET home page.
 */

exports.index = function(req, res){
	var MongoClient = require('mongodb').MongoClient,
		format = require('util').format;

  	MongoClient.connect('mongodb://127.0.0.1:27017/Essay', function(err, db) {
    	if(err) throw err;
    	var collection = db.collection('Essay');
    	collection.find().toArray(function(err, results) {
		    var data = results.length ? results : {};

			res.render('index', {
				name : data.name,
				collection : data
			});

		    db.close();
    	});
	});
};

exports.named = function(req, res){
	var MongoClient = require('mongodb').MongoClient,
		format = require('util').format,
		name = req.path.replace('/', '');

  	MongoClient.connect('mongodb://127.0.0.1:27017/Essay', function(err, db) {
    	if(err) throw err;

    	var collection = db.collection('Essay');
    	collection.findOne({name : name}, function(err, results) {

		    var data = results ? results : {};

			res.render('article', {
				Entries : data.Entries
			});

		    db.close();
    	});

	});

};


exports.archive = function(req, res){
	var MongoClient = require('mongodb').MongoClient,
		format = require('util').format,
		name  = req.body.name,
		entry = req.body.entry;

	for (var i = entry.items.length - 1; i >= 0; i--) {
		var item = entry.items[i];
			metaRaw = item.meta;
			metaList = item.meta ? item.meta.replace(' ', '').split(',') : '',
			ids = [],
			classes = [],
			attrs = [];

		item.meta = {};
		item.meta.raw = metaRaw;

		for (var j = metaList.length - 1; j >= 0; j--) {
			if( metaList[j][0] === '#' ) {
				ids.push( metaList[j].replace('#', '') );
			} else if ( metaList[j][0] === '.' ) {
				classes.push( metaList[j].replace('.', '') );
			} else {
				attrs.push( metaList[j] );
			}
		};

		item.meta.ids = ids.join(' ');
		item.meta.classes = classes.join(' ');
		item.meta.attrs = attrs.join(' ');
	};

  	MongoClient.connect('mongodb://127.0.0.1:27017/Essay', function(err, db) {
    	if(err) throw err;

    	var collection = db.collection('Essay');
    	collection.findOne({name : name}, function(err, results) {
    		if(!results){

    			var arr = [entry];
    			collection.insert({name : name, Entries : arr }, function(err, docs) {
    				res.send({"success" : "success"});
		    		db.close();
		    	});

    		} else {

    			collection.update({name : name}, {$push: {Entries : entry }}, {w:1}, function(err) {
		    		if (err) console.warn(err.message);
		    		else console.log('successfully updated');
		    		res.send({"success" : "success"});
		    	});

    		}
    	});

	});
}



exports.fork = function(req, res){
    var MongoClient = require('mongodb').MongoClient,
        format = require('util').format,
        archiveName  = req.body.archiveName,
        newName  = req.body.newName;

    MongoClient.connect('mongodb://127.0.0.1:27017/Essay', function(err, db) {
        if(err) throw err;

        var collection = db.collection('Essay');
        collection.findOne({name : archiveName}, function(err, results) {
            if(!results){
                res.send({"error" : "error"});
            } else {

                var entries = results.Entries;
                for (var i = entries.length - 1; i >= 0; i--) {
                    entries[i].forked = archiveName;
                };
                collection.insert({name : newName, Entries : results.Entries }, function(err, docs) {
                    res.send({"success" : "success"});
                    db.close();
                });
            }
        });

    });
}


exports.fs_upload = function(req, res){
    var fs = require('fs'),
        im = require('imagemagick');
        console.log(req)
        console.dir(req.files)
/*
    fs.readFile(req.files.image.path, function (err, data) {

        var imageName = req.files.image.name

        /// If there's an error
        if(!imageName){

            console.log("There was an error")
            res.redirect("/");
            res.end();

        } else {

           var newPath = __dirname + "/uploads/fullsize/" + imageName;

          var thumbPath = __dirname + "/uploads/thumbs/" + imageName;

          /// write file to uploads/fullsize folder
          fs.writeFile(newPath, data, function (err) {

            /// write file to uploads/thumbs folder
              im.resize({
                  srcPath: newPath,
                  dstPath: thumbPath,
                  width:   200
                }, function(err, stdout, stderr){
                  if (err) throw err;
                  console.log('resized image to fit within 200x200px');
                });

               res.redirect("/uploads/fullsize/" + imageName);

          });
        }
    });
*/
}