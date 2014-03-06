
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

	console.log(entry)

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
