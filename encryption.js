const key = 'real secret keys should be long and random';
 
// Create an encryptor:
const encryptor = require('simple-encryptor')(key);

function miliseconds(hrs)
{
    return((hrs*60*60)*1000);
}


module.exports = {
	generateToken: (account) => {
		const objToken = {
			uid: account,
			expiration: Date.now() + miliseconds(2), // expiration after 2 hours
		}
		return encryptor.encrypt(objToken);
	},
	getTokenParts:  (token) =>  {
		return JSON.parse(JSON.stringify(encryptor.decrypt(token)));
	},
	generateHashPassword: (str) => {
	  // simple hash
	  return str.split('').reduce((prevHash, currVal) =>
	    (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);
	},
};