var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var path = require('path');
var app = express();
var port = process.env.PORT || 4000;

// mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/tastebuds');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// register models
var Food = require('./api/models/foodModel');
var User = require('./api/models/userModel');
var Order = require('./api/models/orderModel');

var options = { 
	dotfiles: 'ignore', 
	etag: false,
	extensions: ['htm', 'html'],
	index: false
};

// app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public') , options  ));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


app.use(session({
	secret: "AVERYBIGSECRETSTRING",
	resave: false,
	saveUninitialized: true
}));

// routes
var foodRoutes = require('./api/routes/foodRoutes');
foodRoutes(app);
var userRoutes = require('./api/routes/userRoutes');
userRoutes(app);
var orderRoutes = require('./api/routes/orderRoutes');
orderRoutes(app);
var adminRouter = require('./api/routes/adminRouter');
adminRouter(app);

app.listen(port, function () {
	console.log('server listening on http://localhost:' + port);
});