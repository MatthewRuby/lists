
/*
 * GET home page.
 */

exports.index = function(req, res){
	var fs = require('fs'),
		name = req.path.replace('/', ''),
		data;

	if(fs.existsSync("./" + name + ".json")) {
		data = JSON.parse( fs.readFileSync("./" + name + ".json", "utf-8") );
	} else {
		data = {};
	}
	if(data) {

		console.log( data )

		res.render('article', { "collection" : data	} );

	} else {

		res.render('index', { "collection" : [

				{
					head : "headline",
					image  : "image",
					desc : "description"
				}
				
			]	
		});

	}

	
};

exports.save = function(req, res){

	var fs = require('fs'),
		myData = req.body.list,
		name  = req.body.name,
		outputFilename = name + '.json';

	fs.writeFile(outputFilename, JSON.stringify(myData, null, 4), function(err) {
	    if(err) {
	      console.log(err);
	    } else {
	      console.log("JSON saved to ");
	    }
	});

	res.send({"success" : "success"});
};