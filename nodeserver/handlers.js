const fs = require('fs');
const encryption = require('./encryption');
const database = require('./db_api');
const https = require('https');

const loginHandler = function(req, res) {
  const {email, password} = req.body;
  const user = database.getUser(email);

  if(!user || password != user.password) return res.status(401).send('Bad credentials');
  const token = encryption.generateToken(email);
  res.send({token});
}

const signupHandler = function(req, res) {
  const body = req.body;
  const {firstName, lastName = '', email, password}  = req.body;

  const user = database.getUser(email);
  if(user) {
	return res.status(409).send('Email already exists');
  }
  const userInfo = {
  	firstName,
  	lastName,
  	password,
  }

  database.addUser(email, userInfo)
  const token = encryption.generateToken(email);
  res.send({token});
}

const makeHttpGetRequest = function (url, parser, filterBy, hasMoreFn) {
  let data = '';
  return new Promise(resolve => {
    https.get(url, (resp) => {

      resp.on('data', (chunk) => {
        data += chunk.toString();
      });

      // The whole response has been received.
      resp.on('end', () => {
        const jsonResult = JSON.parse(data);
        let items = []
        if(filterBy){
          // process the data we have recieved, and filter out results
          // that doesn't match the search text.
          items = parser(jsonResult).filter(filterBy);
        }
        else {
          items = parser(jsonResult);
        }
        // check if we don't have more results 
        const  hasMore = hasMoreFn? hasMoreFn(parser(jsonResult)): false;
        resolve({hasMore, items});
      });
    }).on("error", (err) => {
      // console.log("Error: " + err.message);
      // handle error
    });
  });
}

// Creates a promise, the promise represent a page for manufacturers.
// The promise resolved when all the data is received.
// The resolved value is {hasMore: boolean, items: Array<filtered result>}
const getPageOfManufacturers = function(url, term) {
  const parser = (httpRes) => httpRes.Results;
  const filterBy = (res) => {
    return (
      (res.Mfr_CommonName && res.Mfr_CommonName.toLowerCase().includes(term)) 
        || 
      (res.Mfr_Name && res.Mfr_Name.toLowerCase().includes(term))
    )
  }
  const hasMoreFn = (mappedResult) => mappedResult.length > 0;
  return makeHttpGetRequest(url, parser, filterBy, hasMoreFn)
}



// Get all manufacturers. The API doesn't support search.
// We need to filter results in our server.
// The API return pages to 100 results. This function calls sequentially
// the every time with page+1. This API waits to recieve the full result of
// page number {page} before invoking page number {page+1}.
// We detect no more pages by checking empty result.
const getAllManufacturersHandler = async function (req, res){
  let {term} = req.query;
  term = term.toLowerCase();

  let page = 1;
  let hasMore = true;
  let result = [];


  // For simplicity, we don't need to go over ~200 pages,
  // and we don't need more than the first 10 results.
  while (hasMore && page <= 5 && result.length < 10){
    let url = `https://vpic.nhtsa.dot.gov/api/vehicles/getallmanufacturers?format=json&page=${page}`;
    let promiseResult = await getPageOfManufacturers(url, term.toLowerCase());

    // update the result from the request number {page}
    result = result.concat(promiseResult.items);

    // has more results? increment the page
    if(promiseResult.hasMore){
      page++;
    }
    else { // No more results? return the response
      hasMore = false;
    }
  } 
  
  // let's assume the API will work and no failuers
  res.status(200).json({items : result, message: "Manufacturers fetched successfully"});
}

const getMakeForManufacturerHandler = async function (req, res){
  const {man_id} = req.params;
  let {term} = req.query;
  term = term.toLowerCase();

  let url = `https://vpic.nhtsa.dot.gov/api/vehicles/GetMakeForManufacturer/${man_id}?format=json`;
  const parser = (httpRes) => httpRes.Results;
  const filterBy = (res) => res.Make_Name && res.Make_Name.toLowerCase().includes(term);

  const promiseResult = await makeHttpGetRequest(url, parser, filterBy);
  
  // let's assume the API will work and no failuers
  res.status(200).json({"items" : promiseResult.items, message: "Make fetched successfully"});
}

const getModelsForMakeHandler = async function(req, res) {
  const {make} = req.params;
  let {term} = req.query;
  term = term.toLowerCase();
  
  let url = `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${make}?format=json`;
  const parser = (httpRes) => httpRes.Results;
  const filterBy = (res) => res.Model_Name && res.Model_Name.toLowerCase().includes(term);
  
  const promiseResult = await makeHttpGetRequest(url, parser, filterBy);
  
  // let's assume the API will work and no failuers
  res.status(200).json({items : promiseResult.items, message: "Models fetched successfully"});  
}

const placeorderHandler = function(req,res) {
  const {manId, makeId, modelId} = req.body;
  res.status(200).json({message : "Order was placed successfully"});  
}

module.exports = {
	loginHandler,
	signupHandler,
	getAllManufacturersHandler,
  getMakeForManufacturerHandler,
  getModelsForMakeHandler,
  placeorderHandler,
}