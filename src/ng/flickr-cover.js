var app = angular.module('flickr-cover',['templates']);


app.directive('flickrImg',['FlickrImagesSearch','FlickrImage','utils',
                   function(FlickrImagesSearch,  FlickrImage,  utils){
  return {
    restrict:'A',
    scope:{search:"@",author:"="},
    link:function(scope,elt,attr){
      FlickrImagesSearch.get(attr.search)
      .then(function(images){

        FlickrImage(utils.randomElt(images).id).then(function(data){
          elt.css('background-image',"url("+data.url+")");
          console.log(data)
          scope.author = data.author;
        });
      })
    }      
  };
}]);

app.service('utils',[function(){
    this.randomElt = function(items){
      return items[Math.floor(Math.random()*items.length)];
    }
}])


/**
 * Flickr get contents from search
 */

app.constant('flickrApiKey',"__FLICKR_API_KEY__")
app.service('FlickrImagesSearch',['$http','$q','flickrApiKey',
                          function($http,  $q,  flickrApiKey){
  this.get = function(search){
    var defrd = $q.defer();
    var requestUrl = "https://api.flickr.com/services/rest/"+
                     "?method=flickr.photos.search&api_key="+flickrApiKey+
                     "&text="+search+"&format=json&nojsoncallback=1"

    $http.get(requestUrl)
    .then(function(response){
      defrd.resolve(response.data.photos.photo)
    });
    return defrd.promise;
  };
}])


app.factory('FlickrImage',['$http','$q','flickrApiKey',
                   function($http,  $q,  flickrApiKey){
    var defrd = $q.defer();
  return function(flickrImageId){
    var requestUrl = "https://api.flickr.com/services/rest/"+
                 "?method=flickr.photos.getInfo&api_key="+flickrApiKey+
                 "&photo_id="+flickrImageId+"&format=json&nojsoncallback=1";

    $http.get(requestUrl).then(function(response){
      var photoResp = response.data.photo;
      console.log(photoResp)
      var photo = {
        url:"https://farm"+photoResp.farm+".staticflickr.com/"+photoResp.server+"/"+photoResp.id+"_"+photoResp.secret+"."+photoResp.originalformat,
        author:{
          name:photoResp.owner.username,
          profile:"https://www.flickr.com/photos/"+photoResp.owner.path_alias || photoResp.owner.username,
          pic:"https://flickr.com/buddyicons/"+photoResp.owner.nsid+".jpg"
        },
        title:photoResp.title._content,
        description:photoResp.description._content
      };
      defrd.resolve(photo)
    });
    return defrd.promise;
  }
}])