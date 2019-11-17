const express = require("express");

const router = express.Router();

// router.get("/hello_world", (request, response) => {
//   // the request object represents the request being made
//   // it has information on whos trying to access the resource
//   // what http verb is being used
//   // query params

//   // the response object contains a bunch of methods that allow a server to create
//   // a reponse to the request

//   // response.send will attatch the provided string to the body of html and send it back to the client
//   // it also kills the connection
//   response.send('Hello, adsfadsfsa');
// })

router.get("/", (req, res) => {
  res.render('welcome');
})

// // contact us
// router.get("/contact_us", (req, res) => {
//   res.render('contactUs');
// })

// router.get("/thank_you", (req, res) => {
//   // console.log(req.query); //we can access the query by using req.query;
//   // res.send(req.query); 

//   // render method can take an optiona second argument
//   // this is an object where keys of the objects become local variables
//   // which are available within the template
//   res.render('thankYou', {
//     hello: 'bunny',
//     name: req.query.name,
//     favouriteColor: req.query.favouriteColor,
//     message: req.query.message,
//     favouriteDay: req.query.favouriteDay
//   });
// })

const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 7;
router.post("/sign_in", (req, res) => {
  // res.cookie is used to set the SET-COOKIE header telling a browser to store a cookie with information
  res.cookie('username', req.body.username, { maxAge: new Date(COOKIE_MAX_AGE)})
  res.redirect('/');
})

router.post("/sign_out", (req, res) => {
  res.clearCookie("username"); // will remove the cookie
  res.redirect("/");
})

module.exports = router;