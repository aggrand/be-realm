exports = async function(nextOpen){
  console.log(nextOpen)
  // Find the name of the MongoDB service you want to use (see "Linked Data Sources" tab)
  var serviceName = "mongodb-atlas";

  // Update these to reflect your db/collection
  var dbName = "berealm";
  var collName = "schedule";

  // Get a collection from the context
  var collection = context.services.get(serviceName).db(dbName).collection(collName);
  
  let delta =  1 * 5 * 1000 // 5 secs
  let curTime = new Date();
  
  var res = await collection.deleteOne({"openTime": {$gt: curTime}});
  
  // if called without a date, will set one in 5 seconds
  if (!(nextOpen instanceof Date)) {
      nextOpen = new Date(curTime.getTime() + delta);
  }

  /*// randomly choose a time for tomorrow
  // TODO between business hours?
  // TODO not garbage
  delta =  1 * 10 * 1000 // 10 secs
  curTime = (new Date()).getTime();
  newNextOpen = new Date(curTime + delta);*/

  await collection.insertOne({openTime: nextOpen})

  console.log("set next open time to", nextOpen);
  return "successful scheduling";
};