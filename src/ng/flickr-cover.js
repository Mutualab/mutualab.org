var app = angular.module('flickr-cover',['templates']);

/**
 * Flickr get contents from search
 */

app.constant('flickrApiKey',"__FLICKR_API_KEY__")


app.directive('flickrImg',['FlickrImagesSearch','FlickrImage','FlkrUtils',
                   function(FlickrImagesSearch,  FlickrImage,  FlkrUtils){
  return {
    restrict:'A',
    scope:{search:"@",author:"="},
    link:function(scope,elt,attr){
      FlickrImagesSearch.get(attr.search)
      .then(function(images){
        FlickrImage(FlkrUtils.randomElt(images).id).then(function(data){
          elt.css('background-image',"url("+data.url+")");
          scope.author = data.author;
        });
      })
    }      
  };
}]);


app.service('FlkrUtils',[function(){
    this.randomElt = function(items){
      return items[Math.floor(Math.random()*items.length)];
    }
}])


app.service('FlickrImagesSearch',['$http','$q','flickrApiKey',
                          function($http,  $q,  flickrApiKey){
  this.get = function(search){
    var defrd = $q.defer();
    var requestUrl = "https://api.flickr.com/services/rest/"+
                     "?method=flickr.photos.search&api_key="+flickrApiKey+
                     "&text="+search+"&format=json&nojsoncallback=1&license=1,2,3,4,5,6,7"

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
      //console.log(photoResp)
      //
      var userSlug;
      if( !!photoResp.owner.path_alias &&  photoResp.owner.path_alias != 'null') 
           userSlug = photoResp.owner.path_alias;
      else userSlug = photoResp.owner.nsid;

      console.log(photoResp)
      var photo = {
        url:"https://farm"+photoResp.farm+".staticflickr.com/"+photoResp.server+"/"+photoResp.id+"_"+photoResp.secret+"_b."+photoResp.originalformat,
        author:{
          name:photoResp.owner.realname,
          profile:"https://www.flickr.com/photos/"+userSlug,
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