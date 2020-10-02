const express = require('express');
const bodyParser = require('body-parser');


const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all((req,res,next)=>{
	res.statusCode = 200;
	res.setHeader('Content-Type','text/html');
	next();
})

.get((req,res,next)=>{
	res.end("Will send all the leaders to you.")

})

.post((req,res,next)=>{
	res.end("Will add the leader: " +req.body.name +
		'with details: '+req.body.description);

})

.put((req,res,next)=>{
	res.statusCode = 403;
	res.end('This operation is not available');

})

.delete((req,res,next)=>{
	res.end('Deleting all the leaders');

});

leaderRouter.route('/:leaderId')
.get((req,res,next) => {
    res.end('Will send details of the Leader: ' + req.params.leaderId +' to you!');
})

.post((req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on promo: '+ req.params.leaderId);
})

.put((req, res, next) => {
  res.write('Updating the leader: ' + req.params.leaderId + '\n');
  res.end('Will update the leader: ' + req.body.name + 
        ' with details: ' + req.body.description);
})

.delete((req, res, next) => {
    res.end('Deleting leader: ' + req.params.leaderId);
});


module.exports = leaderRouter;
