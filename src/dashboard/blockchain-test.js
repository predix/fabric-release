'use strict';
/**
 * This example shows how to do the following in a web app.
 * 1) At initialization time, enroll the web app with the block chain.
 *    The identity must have already been registered.
 * 2) At run time, after a user has authenticated with the web app:
 *    a) register and enroll an identity for the user;
 *    b) use this identity to deploy, query, and invoke a chaincode.
 */

// To include the package from your hyperledger fabric directory:
//    var hfc = require('myFabricDir/sdk/node');
// To include the package from npm:
//      var hfc = require('hfc');
const hfc = require('hfc');

// Create a client chain.
// The name can be anything as it is only used internally.
const chain = hfc.newChain('targetChain');








// Handle a user request
function handleUserRequest(userName, chaincodeID, fcn, args) {
	// Register and enroll this user.
	// If this user has already been registered and/or enrolled, this will
	// still succeed because the state is kept in the KeyValStore
	// (i.e. in '/tmp/keyValStore' in this sample).
	var registrationRequest = {
		enrollmentID: userName,
		// Customize account & affiliation
		account: 'bank_js',
		affiliation: '00001'
	};
	chain.registerAndEnroll(registrationRequest, function (err, user) {
		if (err) {
			return console.log('ERROR: %s', err);
		}
		// Issue an invoke request
		var invokeRequest = {
			// Name (hash) required for invoke
			chaincodeID: chaincodeID,
			// Function to trigger
			fcn: fcn,
			// Parameters for the invoke function
			args: args
		};
		// Invoke the request from the user object.
		var tx = user.invoke(invokeRequest);
		// Listen for the 'submitted' event
		tx.on('submitted', function (results) {
			console.log('submitted invoke: %j', results);
		});
		// Listen for the 'complete' event.
		tx.on('complete', function (results) {
			console.log('completed invoke: %j', results);
		});
		// Listen for the 'error' event.
		tx.on('error', function (err) {
			console.log('error on invoke: %j', err);
		});
	});
}
// Main web app function to listen for and handle requests
function listenForUserRequests() {
	for (;;) {
		// WebApp-specific logic goes here to await the next request.
		// ...
		// Assume that we received a request from an authenticated user
		// 'userName', and determined that we need to invoke the chaincode
		// with 'chaincodeID' and function named 'fcn' with arguments 'args'.
		handleUserRequest(userName, chaincodeID, fcn, args);
	}
}




// Configure the KeyValStore which is used to store sensitive keys
// as so it is important to secure this storage.
// The FileKeyValStore is a simple file-based KeyValStore, but you
// can easily implement your own to store whereever you want.
chain.setKeyValStore(hfc.newFileKeyValStore('./keyValStore'));

// Set the URL for member services
chain.setMemberServicesUrl('grpc://localhost:7054');

// Add a peer's URL
chain.addPeer('grpc://localhost:7051');

// Enroll 'WebAppAdmin' which is already registered because it is
// listed in fabric/membersrvc/membersrvc.yaml with its one time password.
// If 'WebAppAdmin' has already been registered, this will still succeed
// because it stores the state in the KeyValStore
// (i.e. in '/tmp/keyValStore' in this sample).
chain.enroll('WebAppAdminJS', 'test', function (err, webAppAdmin) {
	if (err) {
		return console.log('ERROR: failed to register %s: %s', err);
	}
	// Successfully enrolled WebAppAdmin during initialization.
	// Set this user as the chain's registrar which is authorized to register other users.
	chain.setRegistrar(webAppAdmin);
	// Now begin listening for web app requests
	listenForUserRequests();
});
