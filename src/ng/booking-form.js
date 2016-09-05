angular.module('mutualab.org')

.component('bookingForm', {
  controller:[
          '$location',
  function($location){
    var vm = this;
    $location.absUrl();
    var urlParams = $location.search();
    vm.params = urlParams;
    
    return vm;
  }],
  templateUrl:"booking-form.html"
});
