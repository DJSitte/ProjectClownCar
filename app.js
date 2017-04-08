var express = require('express')
var MemoryStore = require('./src/data/memorystore.js')
var SpotifyController = require('./src/controllers/SpotifyController.js')
var YoutubeController = require('./src/controllers/YoutubeController.js')
var bodyParser = require('body-parser')

var app = express();
app.use(bodyParser.json())

var memstore = new MemoryStore();
var sc = new YoutubeController(memstore);

// memstore.addToQueue({
//   albumart: "url",
//   title: "title",
//   artist: "artist",
//   album: "album",
//   votes: 0,
//   id: "testtrack"
// })
app.get('/', function (req, res) {
  res.send('Hello World!')
});

app.get('/queue', function (req, res){
  res.send(memstore.getQueue());
});

app.post('/queue', function(req, res){
  if(typeof req.body.source !== 'undefined' & typeof req.body.id !== 'undefined'){
    if(req.body.source == 1){
      sc.getTrack(req.body.id).then(function(track){
        sc.addTrack(track);
        res.sendStatus(200);
      }).catch(function(json){
        console.log(json);
        res.sendStatus(500);
      })
    }else{
      res.sendStatus(500);
    }
  }else{
    res.sendStatus(400);
  }
})

app.post('/rate', function(req, res){
  if(typeof req.body.id !== 'undefined' & typeof req.body.rating != 'undefined'){
    memstore.rateTrack(req.body.id, req.body.rating);
    res.sendStatus(200);
  }else{
    res.sendStatus(400);
  }
})

app.get('/nowPlaying', function(req, res){
  res.send(sc.nowPlaying);
})

app.post('/nextSong', function(req, res){
  sc.nextSong();
  res.sendStatus(200);
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
