var Promise = require('bluebird');
var utils = require('./utils.js');
Promise.promisifyAll(utils);


module.exports = function(app, express) {

	app.get('/', function(req, res) {
		res.redirect('/index.html');
	});

	app.post('/login', function(req, res) {
		utils.checkUserAsync(req.body.username, req.body.password)
		.then(function(result) {
			req.session.regenerate(function() {
				req.session.user = req.body.username;
				utils.sendUserStateInfoAsync(req.body.username)
				.then(function(userObj) {
					res.send(userObj);
				});
			})
		})
		.catch(function(err) {
			res.send('error ' + err);
		})
	});

	app.get('/login', function(req, res) {
		if(req.session.user) {
			utils.sendUserStateInfoAsync(req.session.user)
			.then(function(infoObj) {
				res.send(infoObj);
			});
		} else {
			res.send('Invalid User');
		}
	});


	app.post('/signup', function(req, res) {
	    utils.makeNewUserAsync(req.body.username, req.body.password)
	    .then(function(result) {
	        req.session.regenerate(function() {
	            req.session.user = req.body.username;
	            utils.sendUserStateInfoAsync(req.body.username)
	            .then(function(infoObj) {
	            	res.send(infoObj);
	            });
	        })
	    })
	    .catch(function(err) {
	        res.send('error ' + err);
	    })
	});

	app.get('/logout', function(req, res) {
		if(req.session.user) {
			req.session.destroy( function(err){
				res.send('You have been logged out. See you next time!');
			});
		} else {
			res.send('You are already logged out.');
		}
	});

	app.post('/meals', function(req, res) {
	    var newMeal = req.body.meal;
	    if (typeof req.body.meal === 'string') {
	    	newMeal = JSON.parse(req.body.meal)
	    }
	    utils.makeNewMealAsync(newMeal)
	    .then(function(newMeal) {
				res.send(newMeal);
	    })
	    .catch(function(err) {
	        res.send('error ' + err);
	    })
	});

	app.get('/meals', function(req, res) {
		if(req.session.user) {
			utils.checkMealsByUserAsync(req.session.username)
			.then(function(meals) {
				res.send(meals);
			});
		} else {
			res.send('Please Log in to check meals.');
		}
	});

	app.post('/search', function(req, res) {
		console.log('query req: ', req.body);
		if (!req.body.query) return res.send('Invalid query');
		var query = req.body.query.trim();
		utils.getSearchResponseAsync(query)
		.then(function(result) {
			res.send(result);
		})
		.catch(function(err) {
			res.send('error ' + err);
		});
	});

  app.post('/food_id', function(req, res) {
    if (!req.body['food_id']) return res.send('Invalid id');
    var id = req.body['food_id'].trim();
    utils.getFoodItemAsync(id)
    .then(function(foodItem) {
      res.send(foodItem)
    })
    .catch(function(err) {
      res.send('error ' + err);
    });
  });
}
