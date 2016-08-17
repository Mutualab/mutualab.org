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




app.directive('clickTrigger',function(){
  return {
    scope:{
      "clickTrigger":"@?"
    },
    link:function(scope,elt,attr){
      target = null
      if( scope.clickTrigger ){
        target = angular.element(scope.clickTrigger).get(0)
      }else{
        target = elt.find('a').get(0)
      }

      elt.click(function(){target.click()})
    }
  }
});