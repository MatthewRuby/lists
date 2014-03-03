
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
			res.render('index', { "collection" : data } );
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
    	collection.find({name : name}).toArray(function(err, results) {
		    console.dir(results);
		    var data = results.length ? results[0].data : {},
		    	styles = results.length ? results[0].styles : {};
			res.render('article', { "collection" : data, "styles" : styles } );
		    db.close();
    	});

	});
	
};


exports.archive = function(req, res){
	var MongoClient = require('mongodb').MongoClient,
		format = require('util').format,
		myData = req.body.list,
		name  = req.body.name,
		styles = req.body.styles;

		console.log(styles)

	for (var i = myData.length - 1; i >= 0; i--) {
		var metaRaw = myData[i].meta;
			metaList = myData[i].meta.replace(' ', '').split(','),
			ids = [],
			classes = [],
			attrs = [];
		
		myData[i].meta = {};
		myData[i].meta.raw = metaRaw;

		for (var j = metaList.length - 1; j >= 0; j--) {
			if( metaList[j][0] === '#' ) {
				ids.push( metaList[j].replace('#', '') );
			} else if ( metaList[j][0] === '.' ) {
				classes.push( metaList[j].replace('.', '') );
			} else {
				attrs.push( metaList[j] );
			}
		};

		myData[i].meta.ids = ids.join(' ');
		myData[i].meta.classes = classes.join(' ');
		myData[i].meta.attrs = attrs.join(' ');
	};

  	MongoClient.connect('mongodb://127.0.0.1:27017/Essay', function(err, db) {
    	if(err) throw err;

    	var collection = db.collection('Essay');
    	collection.findOne({name : name}, function(err, results) {
    		if(!results){
    			collection.insert({name : name, data : myData, styles : styles}, function(err, docs) {
    				res.send({"success" : "success"});
		    		db.close();
		    	});
    		} else {
    			collection.update({name : name}, {$set: {data : myData, styles : styles}}, {w:1}, function(err) {
		    		if (err) console.warn(err.message);
		    		else console.log('successfully updated');
		    		res.send({"success" : "success"});
		    	});
    		}
    	});
    	
	});
}
