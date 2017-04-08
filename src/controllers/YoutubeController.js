var Youtube = require('youtube-node')
var Promise = require('bluebird')
var youtubeStream = require('youtube-audio-stream');
var lame = require('lame');
var Speaker = require('speaker');
var url = require('url');

Promise.config({
  cancellation: true
})

var yt = new Youtube()

yt.setKey('AIzaSyDsT40WzGiAqoKS6byVHcrQeG4b7zS-Cqk')

YoutubeController = function(queue){
  this.queue = queue
  this.isPlaying = false;
  this.nowPlaying = null;
  this.stream = null;
}

function getTrack(trackid){
  return new Promise(function(resolve, reject){
    yt.getById(trackid, function(error, result){
      if(error){
        reject(error)
      }else{
        resolve({
          id: trackid,
          albumart: result["items"][0]["snippet"]["thumbnails"]["default"],
          title: result["items"][0]["snippet"]["title"],
          artist: "artist",
          album: "album",
          rating: 0
        })
      }
    })
  })
}

function playTrack(track){
  return new Promise(function(resolve, reject, onCancel){
    try{
      decoder = new lame.Decoder();
      console.log("Playing: " + track["title"])
      audioStream = youtubeStream('https://www.youtube.com/watch?v=' + track["id"]).pipe(decoder);
      audioStream.on('format', function (format) {
        speaker = new Speaker(format);
        this.pipe(speaker).on('finish', function(){
          resolve();
        }).on('error', function(error){
          reject(error);
        });
      });
      onCancel(function(){
        speaker.close();
      })
    }
    catch(exception){
      reject(exception)
    }
  })
}

function addTrack(track){
  this.queue.addToQueue(track)
  if(!this.isPlaying){
    this.start();
  }
}

function nextSong(){
  this.stream.cancel();
  this.start();
}

function start(){
  console.log("Starting playback..")
  var track = this.queue.removeFirstTrack();
  if(track != null){
    var _this = this;
    this.isPlaying = true;
    this.nowPlaying = track;
    this.stream = this.playTrack(track).then(function(){
      _this.start()
    }).catch(function(exception){
      console.log(exception);
      _this.nowPlaying = null;
      _this.isPlaying = false;
    })
  }else{
    console.log("No tracks in queue")
    this.isPlaying = false;
    this.nowPlaying = null;
  }
}

YoutubeController.prototype = {
  getTrack: getTrack,
  addTrack: addTrack,
  playTrack: playTrack,
  start: start,
  nextSong: nextSong
}

module.exports = YoutubeController;
