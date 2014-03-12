define(function() {

	var template = '<section class="new">'
		template += '<h1 class="headline new" data-placeholder="Headline"contenteditable>Headline</h1>';
		template += '<div class="media new" data-placeholder="Media" contenteditable>';
		template += '<div class="media-wrap"></div><button class="photo">photo</button><button class="draw">draw</button></div>';
		template += '<p class="description new" data-placeholder="Description" contenteditable>Description</p>';
		template += '<b class="meta new" data-placeholder="meta-data" contenteditable>meta-data</b>';
		template += '</section >';

      return template;

})