
angular.module('mutualab.org')

.directive('page', function() {
  return {
    rstrict:'AC',
    controllerAs: "$page",
    controller: [
              '$interval',
      function($interval) {
        var vm = this;
        var randBg= function(){ return Math.round(Math.random() * (4 - 0) + 0); }

        vm.bg = randBg();
        $interval(function(){
          vm.bg = randBg();
        },10000)
        
        return vm;
      }
    ]
  };
});
