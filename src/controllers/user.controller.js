const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('../services/jwt');
const _ = require('underscore');
const fs = require('fs');
const path = require('path');

module.exports = UserController = {
	save: async (req, res) => {
		// Recoger los parametros de la peticion
		let { name, surname, email, password, role } = req.body;
		// Validar los datos
		const user = new User({
			name,
			surname,
			email,
			password: bcrypt.hashSync(password, 10),
			role,
		});

		user.save((err, usuarioDB) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					err,
				});
			}

			res.json({
				ok: true,
				usuario: usuarioDB,
			});
		});
	},
	login: async (req, res) => {
		// Recoger los parametros de la peticion
		let { email, password } = req.body;

		// Buscar usuarios que coincidan con el email
		try {
			const user = await User.findOne({ email: email });

			if (!user) throw { message: 'Email incorrecto' };

			if (!bcrypt.compareSync(password, user.password))
				throw { message: 'Password Incorrecto' };

			user.password = undefined;
			return res.json({
				ok: true,
				usuario: user,
				token: jwt.createToken(user),
			});
		} catch (err) {
			return res.status(400).json({
				ok: false,
				err,
			});
		}

		// Si lo encuentra

		// Comprobar la contraseña

		// Si es correcto

		// Generar token

		// Devolver los datos
	},
	update: async (req, res) => {
		// Crear middleware

		const body = _.pick(req.body, ['name', 'surname', 'email', 'role']);
		let _id = req.user._id;

		try {
			const user = await User.findOneAndUpdate({ _id }, body, {
				new: true,
				runValidators: true,
			});
			if (!user) throw { message: 'Error al actualizar usuario' };

			return res.json({
				ok: true,
				usuario: user,
			});
		} catch (err) {
			if (err.errors.email) {
				return res.status(400).json({
					ok: false,
					err,
					message: 'Este email ya existe',
				});
			}
			return res.status(400).json({
				ok: false,
				err,
			});
		}
	},
	uploadAvatar: async (req, res) => {
		// Configurar el modulo multiparty

		// recoger el fichero de la peticion
		let file_name = 'Avatar no subido...';
		// Comprobrar la extension (solo imagens)
		if (!req.file) {
			return res.status(404).json({
				ok: false,
				message: file_name,
			});
		}

		const EXT_VALIDAS = ['.png', '.jpg', '.jpeg', '.gif'];
		const FILE_EXT = path.extname(req.file.originalname);
		if (
			FILE_EXT != '.png' &&
			FILE_EXT != '.jpg' &&
			FILE_EXT != '.jpeg' &&
			FILE_EXT != '.gif'
		) {
			fs.unlinkSync(path.resolve(__dirname, `../../${req.file.path}`));
			return res.status(400).json({
				ok: false,
				message: `Solo se permite estas extensiones ${EXT_VALIDAS.join(' ')}`,
				file: FILE_EXT,
			});
		}

		let userId = req.user._id;

		try {
			const user = await User.findOneAndUpdate(
				{ _id: userId },
				{ image: req.file.filename },
				{ new: true, runValidators: true },
			);

			if (!user) throw { message: 'Error al guardar la imagen' };

			return res.json({
				ok: true,
				usuario: user,
			});
		} catch (err) {
			return res.json({
				ok: false,
				err,
			});
		}
	},
	avatar: (req, res) => {
		const FILE_NAME = req.params.fileName;
		const PATH_FILE = path.resolve(
			__dirname,
			`../../uploads/users/${FILE_NAME}`,
		);

		if (fs.existsSync(PATH_FILE)) {
			return res.sendFile(path.resolve(PATH_FILE));
		} else {
			return res.status(404).json({
				ok: false,
				message: 'La imagen no existe',
			});
		}
	},
	getUser: async (req, res) => {
		let id = req.params.id;
		try {
			const user = await User.findById(id).exec();

			return res.json({
				ok: true,
				usuario: user,
			});
		} catch (err) {
			if (err.kind) {
				return res.status(400).json({
					ok: false,
					message: 'No existe usuario con ese ID',
				});
			}
			return res.status(400).json({
				ok: false,
				err,
			});
		}
	},
	getTopics: async (req, res) => {
		try {
			const users = await User.find().exec();

			if (!users) throw { message: 'Error al buscar usuarios' };

			if ((await users).length === 0)
				throw { message: 'No hay usuarios registrados' };

			res.json({
				ok: true,
				usuarios: users,
			});
		} catch (err) {
			return res.status(400).json({
				ok: false,
				err,
			});
		}
	},
};
