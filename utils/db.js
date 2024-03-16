//db.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

// Construct the MongoDB URI using environment variables
const dbUri = process.env.MONGO_DB_ADDRESS;
const uri = dbUri.replace("<password>", process.env.MONGO_PASSWORD);
let client = null;

// Map to hold the instances of different databases
let dbInstances = new Map();


// Initialize the MongoDB client
if (process.env.SKIP_DB_INIT !== 'true') {
    client = new MongoClient(uri);

}

// Connect to MongoDB and return the requested database instance
// dbType should be either "wallet" for the wallet database
// or the Discord server ID for server-specific databases
async function connectDB(dbType) {
    if (!dbInstances.has(dbType)) {
        await client.connect();
        const dbInstance = client.db(dbType === 'wallet' ? process.env.MONGO_DB_NAME : dbType);
        dbInstances.set(dbType, dbInstance);
    }
    return dbInstances.get(dbType);
}

// Save a wallet entry in the database
async function saveEntry(dbType, collection,entry) {
    const db = await connectDB(dbType);
    const result = await db.collection(collection).insertOne(entry);
    if(dbType === 'wallet'){
        console.log(`New Wallet created for ${entry.user} with public key ${entry.publicKey}`);
    }
}

// Find a wallet by ID
async function findEntryByID(dbType, collection,id) {
    const db = await connectDB(dbType);
    const result = await db.collection(collection).findOne({ _id: id });

    if (result) {
        if(dbType === 'wallet'){
            console.log(`Found a wallet in the collection for user with the id '${id}':`);
        }
        return result;
    } else {
        if(dbType === 'wallet'){
            console.log(`No wallet found for user with the id '${id}'`);
        }
        return false;
    }
}

async function removeEntry(dbType, collection, id) {
    const db = await connectDB(dbType);
    await db.collection(collection).deleteOne({ _id: id });
    // Optionally, log the removal for debugging or auditing purposes
    if(dbType === 'wallet'){
        console.log(`Entry for ${id} removed from the ${collection} collection.`);
    }
}

process.on('SIGINT', async () => {
    await client.close();
    process.exit();
});

// Export the functions for use in other files
module.exports = { saveEntry, findEntryByID, removeEntry };
