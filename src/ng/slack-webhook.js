angular.module('slack-webhook',['config'])
.service('SlackWebhook',[
            '$q', 'Config','$window',
  function(  $q,   Config,  $window){
    var srv = this;

    //$http()
    srv.post=function(payload){
      return $q(function(resolve,reject){
        var request = $window.jQuery.ajax(
          {
              url:Config.slackWebhook, 
              method:"post",
              data:JSON.stringify(payload),
              dataType: 'text',
              header: {'Content-Type': 'application/json'}             
          });
        request.done(resolve)
        request.fail(reject)
      });
    };

    return srv;  
}]);