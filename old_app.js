const express = require('express');
const knex = require("./db/client");
const bookshelf = require('bookshelf')(knex)
const path = require('path');
const favicon = require('static-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

// const rootRouter = require("./routes/root");
// const routes = require('./routes/index');
const gamesRouter = require('./routes/games').default;
// const users = require('./routes/users');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// // custom middleware to get username
// function getUsernameMiddleware(request, response, next) {
//   response.locals.username = request.cookies.username;
//   next();
// }

// app.use(methodOverride((req, res) => {
// if (req.body && req.body._method) {
//     const method = req.body._method
//     return method;
// }
// }))

// app.use(express.urlencoded({ extended: true }));
// app.use(getUsernameMiddleware);

// app.use('/', gamesRouter);
app.use('/games', gamesRouter);
// app.use(rootRouter);
// app.use('/users', users);

// // app.use(function(req, res, next) {
// //   const url = req.url;

// //   // check to see if user is trying to go to /contact_us
// //   if(url === '/contact_us') {
// //     // check to see if user is logged in
// //     if(res.locals.username) {
// //       next(); // if the user is logged in then they can visit /contact_us
// //     } else {
// //       res.redirect('/'); //otherwise they get redirected to the root path
// //     }
// //   }
// //   next();
// // })


// // catch 404 and forwarding to error handler
// // app.use(function(req, res, next) {
// //     var err = new Error('Not Found');
// //     err.status = 404;
// //     next(err);
// // });

// /// error handlers

// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//     app.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });

module.exports = app;

