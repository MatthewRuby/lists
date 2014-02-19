
/*
 * GET home page.
 */

exports.index = function(req, res){
	var fs = require('fs'),
		name = req.path.replace('/', ''),
		data;

	if(fs.existsSync("./public/feeds/" + name + ".json")) {
		data = JSON.parse( fs.readFileSync("./public/feeds/" + name + ".json", "utf-8") );
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
		outputFilename = './public/feeds/' + name + '.json';

	fs.writeFile(outputFilename, JSON.stringify(myData, null, 4), function(err) {
	    if(err) {
	      console.log(err);
	    } else {
	      console.log("JSON saved");
	    }
	});

	res.send({"success" : outputFilename});
};