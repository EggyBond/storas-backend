// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set region 
AWS.config.update({region: 'ap-southeast-2'});

// Create listIdentities params 
var params = {
 IdentityType: "EmailAddress",
 MaxItems: 10
};

// Create the promise and SES service object
var listIDsPromise = new AWS.SES({apiVersion: '2010-12-01'}).listIdentities(params).promise();

// Handle promise's fulfilled/rejected states
listIDsPromise.then(
  function(data) {
    console.log(data.Identities);
  }).catch(
  function(err) {
    console.error(err, err.stack);
  });