
/*
 * GET home page.
 */

exports.index = function(req, res){
	var fs = require('fs'),
		name = req.path.replace('/', ''),
		data;

	if(fs.existsSync("./public/feed/" + name + ".json")) {
		data = JSON.parse( fs.readFileSync("./public/feed/" + name + ".json", "utf-8") );
	} else {
		data = [
			{
				identifiers: 'Identifiers',
  			headline: 'Headline',
  			description: 'Description',
  			media: 'Media'
			}
		];
	}

	res.render('index', { "collection" : data	} );

};



exports.save = function(req, res){

	var fs = require('fs'),
		myData = req.body.list,
		name  = req.body.name,
		outputFilename = "./public/feed/" + name + '.json';

	fs.writeFile(outputFilename, JSON.stringify(myData, null, 4), function(err) {
	    if(err) {
	      console.log(err);
	    } else {
	      console.log("JSON saved to ");
	    }
	});

	res.send({"success" : "success"});
};