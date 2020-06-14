
const MongoClient = require('mongodb').MongoClient;
let client;
let users;

async function main(){
    const uri = "mongodb+srv://jameel:7XmCaziQiVV5eoAJ@cluster0-asmlf.mongodb.net/vehicles-store?retryWrites=true&w=majority";
    client = new MongoClient(uri,  {useUnifiedTopology: true});

 
    try {
        // Connect to the MongoDB cluster
        await client.connect();
 		users =  await client.db().collection('users');

 
    } catch (e) {
        console.error(e);
    }
}

const getUser = async (email) => {
	const query = { "email": email};
	const user = await users.findOne(query);
	return user;
}

const addUser = async (userInfo) => {
	users.insertOne(userInfo);
}

main().catch(console.error);


module.exports = {
	getUser,
	addUser,
}