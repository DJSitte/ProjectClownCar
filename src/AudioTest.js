var YoutubeController = require('./controllers/YoutubeController.js')
var MemoryStore = require('./data/memorystore.js')
var yc = new YoutubeController(new MemoryStore());

yc.getTrack('6e-sCFZlM1s').then(function(track){
  yc.addTrack(track);
})
yc.getTrack('CQuaeupNr0Q').then(function(track){
  yc.addTrack(track);
  yc.start();
})
