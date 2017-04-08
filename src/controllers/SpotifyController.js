var request = require('request-promise')
var Promise = require('bluebird')

function SpotifyController(){
  this.baseurl = "https://api.spotify.com";
}

SpotifyController.prototype.getTrack = function(trackid){
  var options = {
    uri: this.baseurl+"/v1/tracks/" + trackid
  }
  return new Promise(function(resolve, reject){
    request(options).then(function(res){
      var json = JSON.parse(res);
      resolve({
        albumart: json["album"]["images"][0],
        title: json["name"],
        artist: json["artists"][0]["name"],
        album: json["album"]["name"],
        id: trackid
      });
    }).catch(function(error){
      reject(error);
    });
  });
}

module.exports = SpotifyController;
