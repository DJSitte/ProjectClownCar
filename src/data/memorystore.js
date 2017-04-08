function MemoryStore(){
  this.queue = new Array();
}

MemoryStore.prototype.addToQueue = function (track){
  track.rating = 0;
  this.queue.push(track);
}

MemoryStore.prototype.getQueue = function(){
  return this.queue.slice();
}

MemoryStore.prototype.rateTrack = function(id, rating){
  console.log("id: " + id);
  var track = this.queue.find(function(element){
    console.log("element id:" + element.id);
    return element.id == id;
  });
  console.log(track);
  track.rating += rating;
}

module.exports = MemoryStore;
