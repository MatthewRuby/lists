
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('index', { "collection" : [

			{
				head : "headline",
				image  : "image",
				desc : "description"
			}
			
		]	
	});
};