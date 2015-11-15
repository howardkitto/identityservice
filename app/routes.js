//routes.js

var Identity = require('../app/models/identity');

module.exports = function(app) {
 
//Routes

app.post('/api/signup', function(req, res) {
        console.log(req.body);
        
        var identity = new Identity(req.body);

        identity.save(function(err) {
            if (err){
                res.send(err);
            }
            else {
            console.log(identity);

            res.send(identity);
            }
        });
        
    });

app.get('/api/identity', function(req, res) {
  Identity.find(function(err, identity) {
    res.send(identity);
  });
    
});

};