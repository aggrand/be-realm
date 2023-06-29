exports = async function(nextOpen){
  // Find the name of the MongoDB service you want to use (see "Linked Data Sources" tab)
  var serviceName = "mongodb-atlas";

  // Update these to reflect your db/collection
  var dbName = "berealm";
  var collName = "schedule";

  // Get a collection from the context
  var collection = context.services.get(serviceName).db(dbName).collection(collName);

  // randomly choose a time for tomorrow
  // TODO between business hours?
  // TODO not garbage
  delta =  5 * 60 * 1000 // 5 min
  newNextOpen = new Date(nextOpen.getTime() + delta)
  console.log("nextOpen is", nextOpen)
  
  await collection.updateOne({}, {nextOpen: newNextOpen, lastOpen: nextOpen})

  return;
};