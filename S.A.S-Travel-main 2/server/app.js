// load environment variables from .env or elsewhere
require('dotenv').config();
const express = require('express');
const router = express.Router();
const app = express();
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const bp = require("body-parser");
// const { auth } = require('express-openid-connect');
const { db } = require("./models");
app.use(express.json());
var { expressjwt: jwt } = require('express-jwt');
var jwks = require('jwks-rsa');
const jwtAuthz = require("express-jwt-authz");
const passport = require('passport');



// // middleware obtained from Auth0 API
// var jwtCheck = jwt({
//   secret: jwks.expressJwtSecret({
//       cache: true,
//       rateLimit: true,
//       jwksRequestsPerMinute: 5,
//       jwksUri: 'https://dev-1wgxpps6aa71rifj.us.auth0.com/.well-known/jwks.json'
// }),
// audience: 'https://localhost/3000',
// issuer: 'https://dev-1wgxpps6aa71rifj.us.auth0.com/',
// algorithms: ['RS256']
// });
// const checkPermission = jwtAuthz(["read:messages"], {
//   customScopeKey: "permissions",
//   checkAllScopes: true,
// });


// const {
//   AUTH0_SECRET,
//   AUTH0_BASE_URL,
//   AUTH0_CLIENT_ID,
//   AUTH0_ISSUER_BASE_URL
// } = process.env;


//   const config = {
//     authRequired: false,
//     auth0Logout: true,
//     SECRET: AUTH0_SECRET,
//     baseURL: AUTH0_BASE_URL,
//     clientID: AUTH0_CLIENT_ID,
//     issuerBaseURL: AUTH0_ISSUER_BASE_URL

  // }

//Allow CORS requests
app.use(cors());
app.use(bp.json())
// logging middleware
app.use(morgan('dev'));
// parsing middleware for form input data & json
app.use(express.urlencoded({ extended: false }));
// app.use(bp.urlencoded({extended: false}));
app.use(express.json());
// app.use(auth(config));





app.use(express.static(path.join(__dirname, '../dist')));


app.use(passport.initialize());
require("./middleware/passport")(passport);

app.use('/api/users', require("./routes/users"));


app.use('/api/entries', require("./routes/entries"));

app.get("/home", (req, res) => {
  res.send("Welcome our travel Journal..");
});

// app.get("/api/entries", (req, res) => {
//   res.send(entries);
// });

// 404 handler
app.use((req, res) => {
  res.status(404).send({error: '404 - Not Found', message: 'No route found for the requested URL'});
});

// error handling middleware
app.use((error, req, res, next) => {
  console.error('SERVER ERROR: ', error);
  if(res.statusCode < 400) res.status(500);
  res.send({error: error.message, name: error.name, message: error.message, table: error.table});
});




// const URI = process.env.URL;
const PORT = process.env.PORT || 8000;

const init = async () => {
  try {
    await db.sync();

    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error)
  }
};

init();

