exports = async function(arg){
  // https://www.mongodb.com/docs/atlas/app-services/functions/

  // Find the name of the MongoDB service you want to use (see "Linked Data Sources" tab)
  var serviceName = "mongodb-atlas";

  // Update these to reflect your db/collection
  var dbName = "berealm";
  var collName = "schedule";

  // Get a collection from the context
  var collection = context.services.get(serviceName).db(dbName).collection(collName);

  var findResult;
  try {
    // Get a value from the context (see "Values" tab)
    // Update this to reflect your value's name.
    var valueName = "value_name";
    var value = context.values.get(valueName);

    // Execute a FindOne in MongoDB 
    findResult = await collection.findOne({});

  } catch(err) {
    console.log("Error occurred while executing findOne:", err.message);

    return { error: err.message };
  }
  
  lastOpen = findResult.lastOpen;
  nextOpen = findResult.nextOpen;
  
  // if current time is before next open, do nothing
  if (new Date() < lastOpen) {
    return
  }
  
  await context.functions.execute("ReallyLaunchTheRocket", nextOpen);

  return;
};