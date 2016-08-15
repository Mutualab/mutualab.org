var app = angular.module('mutualab.org',
    ['templates','flickr-cover','ui.scrollpoint']);

app.directive('mtSvg',[function(){
  return {
      restrict : 'A',
      scope:{src:"@"},
      template:'<ng-include src="src"></ng-include>' 
  };
}]);




app.directive('readMore', function() {
  return {
    scope: {},
    restrict: 'EA',
    transclude: true,
    templateUrl: 'read-more.html'
  };
});


