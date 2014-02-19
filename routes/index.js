
/*
 * GET home page.
 */

exports.index = function(req, res){
	var fs = require('fs'),
		name = req.path.replace('/', ''),
		data;

	if(fs.existsSync("./public/feeds/" + name + ".json")) {
		data = JSON.parse( fs.readFileSync("./public/feeds/" + name + ".json", "utf-8") );
	}
	if(data) {
		res.render('article', { "collection" : data	} );
	} else {
		res.render('article', {} );
	}

	
};

exports.save = function(req, res){

	var fs = require('fs'),
		myData = req.body.list,
		name  = req.body.name,
		outputFilename = './public/feeds/' + name + '.json';

	console.log(myData)

	fs.writeFile(outputFilename, JSON.stringify(myData, null, 4), function(err) {
	    if(err) {
	      console.log(err);
	    } else {
	      console.log("JSON saved");
	    }
	});

	res.send({"success" : outputFilename});
};