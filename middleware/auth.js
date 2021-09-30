//const config = require('config');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: `.env.${process.env.NODE_ENV}`})


module.exports = function(req, res, next){
	const token = req.header('x-auth-token');

		//Check if not token 
	if(!token){
		return res.status(401).json({errors: [{msg: 'No token, authorization denied'}]});
	}
	//Verify token
	try{
		const decoded = jwt.verify(token, process.env.jwtSecret);

		req.user = decoded.user;
		next();
	}catch(err){
		res.status(401).json({errors: [{msg: err.message}]});
	}
}