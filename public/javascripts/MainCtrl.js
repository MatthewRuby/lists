function MainCtrl($scope, $http) {
  $scope.sections = [
    {
      identifiers : 'Identifiers',
      headline : 'Headline',
      description : 'Description',
      media : {
        placeholder : 'Media'
      }
    }
  ];

  $scope.newSection = function() {
    console.log('new section')
    $scope.sections.push(
      {
        identifiers : 'Identifiers',
        headline : 'Headline',
        description : 'Description',
        media : 'Media'
      }
    );
  };
 
  $scope.startText = function(event) {
    console.log('startText')
    event.target.innerHTML = "";
  };

  $scope.endText = function(event) {
    console.log('endText')

    var name = event.target.className.match(/image/g);
    if(name) {
      this.insertImage(event);
    }

  };

  $scope.insertImage = function(event){
    console.log('insertImage')
    event.target.innerHTML = '<img src="' + event.target.innerText + '">';
  };
 
  $scope.archive = function() {
    console.log('archive')
    var name = window.location.pathname.replace('/', '')

    $http.post('/save', { 
      "name" : name,
      "list" : this.sections
    }).success(function(data) {
      console.log(data)
    });
    
  };

}