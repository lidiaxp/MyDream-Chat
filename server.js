var express  = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),

    // Mongoose Schema definition
    Schema = new mongoose.Schema({
      id       : String, 
      nome     : String,
      estado   : String
    }),

    Todo = mongoose.model('Todo', Schema);

/*
 * I’m sharing my credential here.
 * Feel free to use it while you’re learning.
 * After that, create and use your own credential.
 * Thanks.
 *
 * MONGOLAB_URI=mongodb://example:example@ds053312.mongolab.com:53312/todolist
 * 'mongodb://example:example@ds053312.mongolab.com:53312/todolist'
 */
mongoose.connect(process.env.MONGOLAB_URI, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});

express()
  // https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters
  .use(bodyParser.json()) // support json encoded bodies
  .use(bodyParser.urlencoded({ extended: true })) // support encoded bodies

  .get('/sensor', function (req, res) {
    // http://mongoosejs.com/docs/api.html#query_Query-find
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Methods", "Origin, Content-Type, X-Auth-Token");
    Todo.find( function ( err, todos ){
      res.json(200, todos);
    });
  })

  .post('/sensor', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Methods", "Origin, Content-Type, X-Auth-Token");
    var todo = new Todo( req.body );
    todo.id = todo._id;
    // http://mongoosejs.com/docs/api.html#model_Model-save
    todo.save(function (err) {
      res.json(200, todo);
    });
  })

  .get('/sensor/:nome', function(req, res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Methods", "Origin, Content-Type, X-Auth-Token");
    Todo.findOne({
      nome: req.params.nome
    })
    .exec(function(err, sensor){
      if(err){
        res.send('err has ocurred');
      }else{
        res.json(sensor.estado);
      }
    })
  })

  .put('/sensor/:nome', function(req, res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Methods", "Origin, Content-Type, X-Auth-Token");
    Todo.findOneAndUpdate({
      nome: req.params.nome
    },
    {$set: {estado: req.body.estado}},
    {upsert: true},
    function(err, sensor){
      if(err){
        res.send('err has ocurred');
      }else{
        res.json(sensor);
      }
    })
  })

.delete('/sensor/:nome', function(req, res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Methods", "Origin, Content-Type, X-Auth-Token");
  Todo.findOneAndRemove(
    {nome: req.params.nome},
    function(err, sensor){
      if(err){
        res.send('err has ocurred');
      } else{
        res.send(sensor);
      }
    })
  })

  .use(express.static(__dirname + '/'))
  .listen(process.env.PORT || 5000);
