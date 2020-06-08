const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'clave-secreta-para-generar-el-token';

module.exports.auth = function (req, res, next) {
	if (!req.headers.token) {
		return res.status(403).json({
			ok: false,
			message: 'Permisos denegado',
		});
	}

	let token = req.headers.token.replace([/['"]+/g, '']);

	try {
		let payload = jwt.decode(token, secret);
		if (payload.exp <= moment().unix()) {
			return res.status(404).json({
				ok: false,
				message: 'El token ha expirado',
			});
		}
		req.user = payload._doc;
	} catch (err) {
		return res.status(404).json({
			ok: false,
			message: 'El token no es valido',
		});
	}
	next();
};
