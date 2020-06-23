const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const config = require('config');
const serverless = require('serverless-http');
var multer = require('multer');
var upload = multer();

// Initialize the app
const app = express();

//don't show the log when it is test
if(config.util.getEnv('NODE_ENV') !== 'test') {
    //use morgan to log at command line
    app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

// Middlewares
// Form Data Middleware
app.use(bodyParser.urlencoded({
    extended: true
}));

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));

// Json Body Middleware
app.use(bodyParser.json({
    limit: '2mb'
}));

// Cors Middleware
app.use(cors());

// Use the passport Middleware
app.use(passport.initialize());
// Bring in the Passport Strategy
require('./config/passport')(passport);

// Seting up the static directory
app.use(express.static(path.join(__dirname, 'public')));


// Bring in the Users & Todo route
const users = require('./routes/api/user');
app.use('/api/app/authentication', users);
const phone = require('./routes/api/phone');
app.use('/api/app/authentication', phone);


const whoami = require('./routes/api/whoami');
app.use('/', whoami);

// Product API
const product = require('./routes/api/product');
app.use('/api/app/product', product);

// Transaction API
const transaction = require('./routes/api/transaction');
app.use('/api/app/transaction', transaction);

// Geolocation API
const geolocation = require('./routes/api/geolocation');
app.use('/api/app/geolocation', geolocation);

// Asset API
const asset = require('./routes/api/asset');
app.use('/api/app/asset', asset);

// Stock API
const stock = require('./routes/api/stock');
app.use('/api/app/stock', stock);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

module.exports = app; // for testing
module.exports.handler = serverless(app); // for lambda serverless app
