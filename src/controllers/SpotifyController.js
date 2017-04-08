var Promise = require('bluebird')
var SpotifyWebApi = require('spotify-web-api-node')

var spotify = new SpotifyWebApi({
  clientId : '825e1197b7f340c4926adb5a09971567',
  clientSecret : '1986b3ad3f9b4893a456de9c25aa94a0',
  redirectUri : 'http://www.example.com/callback'
})
function SpotifyController(){
  this.baseurl = "https://api.spotify.com";
}

SpotifyController.prototype.getTrack = function(trackid){
  return new Promise(function(resolve, reject){
    spotify.getTrack(trackid).then(function(json){
      resolve({
        albumart: json["body"]["album"]["images"][0],
        title: json["body"]["name"],
        artist: json["body"]["artists"][0]["name"],
        album: json["body"]["album"]["name"],
        id: trackid
      });
    }).catch(function(error){
      reject(error);
    });
  });
}

module.exports = SpotifyController;
