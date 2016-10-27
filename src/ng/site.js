var app = angular.module('mutualab.org',
    ['config', 'templates','flickr-cover','ui.scrollpoint','chat-wrapper','booking-form']);





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


app.directive('navTo', ['smoothNav',function(smoothNav) {
  return {
    scope: {navTo:"@"},
    restrict: 'EA',
    link:function(scope,elt,attr){
      var target = angular.element(scope.navTo).get(0);
      elt.attr('href',elt.attr('href')+scope.navTo);
      if( target ){
        elt.click(function(evt){          
          smoothNav.move(target)
          evt.preventDefault();
          return false;
        });
      }
    }
  };
}]);

//New directive for modal window on booking-form
app.directive('modalDialog', function() {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true, 
    transclude: true, 
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width)
        scope.dialogStyle.width = attrs.width;
      scope.hideModal = function() {
        scope.show = false;
      };
    },
    templateUrl: 'modal-window.html' 
  };
});

app.service('smoothNav',['$window',function($window) {
  this.move = function(to, adjust) {
    var animation, distance, pixel, speed, targetTop;
    if (adjust == null) {
      adjust = 0;
    }
    pixel = 2200;
    adjust = adjust !== null ? adjust : 150;
    if (angular.element(to).get(0)) {
      targetTop = angular.element(to).offset().top - adjust;
      distance = Math.abs(angular.element(document.body).scrollTop() - targetTop);
      speed = (distance / pixel) * 1000;
      animation = angular.element('html, body').animate({
        scrollTop: targetTop
      }, speed);
      return angular.element($window).bind('mousewheel', function() {
        return animation.stop();
      });
    }
  };
  return this;
}]);


app.directive('clickTrigger',['$window', function($window){
  return {
    scope:{
      "clickTrigger":"@?"
    },
    link:function(scope,elt,attr){
      var target = null
      if( scope.clickTrigger ){
        target = angular.element(scope.clickTrigger).get(0)
      }else{
        target = elt.find('a').get(0)
      }

      var clickHandler = ("ontouchstart" in $window ? "tap" : "click")
      elt.on(clickHandler, function(evt){
        target.click()
      })
    }
  }
}]);

app.filter('trusted', ['$sce', function($sce) {
  return function(htmlstring) {
    return $sce.trustAsHtml(htmlstring);
  };
}]);
