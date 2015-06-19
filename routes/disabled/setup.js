/**
@author Michael Murphy
*/
var admin = require.main.require('./model/admin')(app.db);
app.get('/setup', function(req, res) {
   res.render('admin/setup', {user: false});
});

app.post('/setup', function(req, res, next) {
   var login =  new admin.Identity(req.body.username, req.body.password);
   app.db.users.find(login, function(err, res) {
      if (!res[0]) {
         var user = new admin.User(req.body.first, req.body.last);
         user.username = login.username;
         user.password = login.password;
         app.db.users.insert(user, {w: 1}, function(err, res){
            if (err) {
               console.log(err);
               throw err;
            }
            console.log(res);
            console.log("Create user: ", res[0]._id);

         });
      }
   });
   res.redirect('/')
});