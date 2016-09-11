
angular.module('ng-wrappers',[])
.service('Moment',['$window',function($window){
  return $window.moment;
}])



.service('_',['$window',function($window){
  return $window._;
}])

