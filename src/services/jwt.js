const jwt = require('jwt-simple');
const moment = require('moment');

module.exports.createToken = function (user) {
	let payload = {
		...user,
		iat: moment().unix(),
		exp: moment().add(30, 'days').unix,
	};
	return jwt.encode(payload, 'clave-secreta-para-generar-el-token');
};
