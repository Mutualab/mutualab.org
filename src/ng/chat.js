/**
* kwikchat-wrapper Module
*
* Description
*/
var app = angular.module('chat-wrapper', [])


app.service('Akwik', ['$window',function($window){
    var akwik = window.akwik = window.akwik || [];
    if (!akwik.initialize) {
        console.log("Initializing chatkwik");
        if (akwik.invoked) window.console && console.error && console.error("ChatKwik snippet included twice.");
        else {
            akwik.invoked = !0;
            akwik.load = function(t) {
                var e = document.createElement("script");
                e.type = "text/javascript";
                e.async = true;
                akwik.chathost="https://app.chatkwik.com";
                akwik.cdnhost="https://cdn.chatkwik.com";
                akwik.referrer = document.referrer;
                akwik.siteId = t;
                if (typeof $ != "undefined") {
                    akwik.prev$=$;
                }
                //akwik.scriptLocation = "https:///widget/client.js?siteId=" + t + "&wtype=2";
                akwik.scriptLocation =  akwik.cdnhost + "/cdn/clientjs/" + t;
                e.src = akwik.scriptLocation;
                //console.log("akwik:", akwik.scriptLocation, akwik, akwik.siteId, akwik.chathost);
                var n = document.getElementsByTagName("script")[0];
                n.parentNode.insertBefore(e, n)
            };
            akwik.SNIPPET_VERSION = "1.1";
            akwik.prefs = {"initialState":"minimized","attention_grabber":"Bonjour comment pouvons-nous vous aider ?"};
            setTimeout(function() {
                akwik.load("1bba73b5d2e6130a79de8bf505d42da4fb6947c3bf57cfbeccca296f6c3319c3");
            }, (500 + 1))
        }
    }
    return akwik;

}]);


app.service('HFchat',['$window',function($window){

    $window.HFCHAT_CONFIG = {
         EMBED_TOKEN: "8092b980-709b-11e6-900b-997fe1d11a60",
         ACCESS_TOKEN: "6daf3f3eaa8f440ea36696b3fc931ee8",
         HOST_URL: "https://happyfoxchat.com",
         ASSETS_URL: "https://d1l7z5ofrj6ab8.cloudfront.net/visitor"
     };

    var HappyFoxChat = {}
    $window.HFCHAT_CONFIG.onload = function(){
      HappyFoxChat.wdgt = this;
      HappyFoxChat.wdgt.collapseChatbox()
    };
  
    var scriptTag = document.createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.async = true;
    scriptTag.src = window.HFCHAT_CONFIG.ASSETS_URL + '/js/widget-loader.js';

    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(scriptTag, s);
    return HappyFoxChat
    
}])

app.directive('chatContainer', ['Akwik',function(Akwik) {
  return {
    link: function(scope, elt, attr) {
      elt = elt.find('.akwik');
      //console.log('akwik'+ elt.text())
    }
  };
}]);
  