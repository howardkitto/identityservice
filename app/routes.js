module.exports = function(app, passport, Identity) {

//==================================================================
// routes

// Define a middleware function to be used for every secured routes
var auth = function(req, res, next){
  if (!req.isAuthenticated()) 
  	res.send(401);
  else
  	next();
};

app.get('/', function(req, res){
  res.render('index', { title: 'Express' });
});

//app.get('/identity', auth, function(req, res){
app.get('/identity', function(req, res){
  Identity.find(function(err, identity) {
      console.log(identity);
        res.send(identity);
      });
});
    
app.get('/identity/:id', auth, function(req, res){
   var id = '';
   
    if(req.params.id === 'undefined')
    {
    id = req.user._id;
    }
    else
    {
    id = req.params.id;
    }
    
    Identity.findOne({'_id' : id},
                    function(err, identity){
        res.send(identity);
    });

    console.log(id);
});

app.post('/identity', function(req, res) {
        console.log(req.body);
        
    
        var identity = new Identity();
        identity.local = req.body;
        identity.local.password = identity.generateHash(req.body.password);

        identity.save(function(err) {
            if (err){
                res.send(err);
            }
            else {
            console.log(identity);
            passport.authenticate('local')(req, res, function ()            {
            res.send(identity);
            });
            }
        });
        
    });
    
app.put('/identity/:id', function(req, res){
    var id = req.params.id;
    console.log(req.body);
//    var updatedPassword = req.body.password;
    Identity.findOneAndUpdate({_id: id}, 
                    {local:{
                     name: req.body.local.name, 
                    email: req.body.local.email, 
                    username: req.body.local.username 
                    }},
                    function(err, doc) {
      res.json(doc);
    });     
});    

app.delete('/identity/:id', function(req, res){
     var id = req.params.id;
    Identity.remove({'_id' : id}, function(err, doc){res.send('Deleted');})
    
});

// route to test if the user is logged in or not
app.get('/loggedin', function(req, res) {
  res.send(req.isAuthenticated() ? req.user : '0');
});

// route to log in
app.post('/login', passport.authenticate('local'), function(req, res) {
//  res.send(req.user);
    res.send('Logged In!');
});

// route to log out
app.post('/logout', function(req, res){
  req.logOut();
  res.send(200);
});
    
//reset password
app.post('/passwordReset', function(req, res){
//    var identity = Identity.findOneAndUpdate({_id :req.body.id}, 
//    identity.local.password = Identity.generateHash(req.body.newPassword);
//    console.log(identity);
    res.send('boom');
    
})
//==============================================================

app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
            successRedirect : '#/profile',
            failureRedirect : '/'
        }));

}