var app = angular.module('mutualab.org',[]);

app.directive('mtSvg',[function(){
  return {
      restrict : 'A',
      scope:{src:"@"},
      template:'<ng-include src="src"></ng-include>' 
  };
}]);