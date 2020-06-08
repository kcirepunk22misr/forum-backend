const Topic = require('../models/Topic');
const _ = require('underscore');

module.exports = {
	save: async (req, res) => {
		let { title, content, code, lang } = req.body;

		const topicSchema = new Topic({
			title,
			content,
			code,
			lang,
			user: req.user._id,
		});

		try {
			const topic = await topicSchema.save();

			return res.json({
				ok: true,
				topic,
			});
		} catch (err) {
			return res.status(400).json({
				ok: false,
				err,
			});
		}
	},
	getTopics: (req, res) => {
		/* Cargar la libreria de paginacion (MODELO)*/

		/* Recoger la pagina actual */
		let page = req.params.page || 1;

		/* Indicar las opciones de paginacion */
		let options = {
			sort: { date: -1 },
			populate: 'user',
			limit: 5,
			page,
		};

		/* Find paginado */
		Topic.paginate({}, options, (err, result) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					err: {
						err,
						message: 'Error al hacer la consulta',
					},
				});
			}

			if (!result) {
				return res.status(404).json({
					ok: false,
					message: 'No hay topic',
				});
			}

			res.json({
				ok: true,
				topics: result.docs,
				totalDocs: result.totalDocs,
				totalPages: result.totalPages,
			});
		});
	},
	getTopicsByUser: async (req, res) => {
		/* Conseguir el id del usuario */
		let userId = req.params.user;
		/* Find con la condicion de usuario */

		try {
			const topics = await Topic.find({ user: userId })
				.populate('user')
				.sort([['date', 'descending']])
				.exec();

			if (!topics) throw { message: 'Error al buscar temas' };

			return res.json({
				ok: true,
				topics,
			});
		} catch (err) {
			return res.status(400).json({
				ok: false,
				message: 'No hay temas para mostrar',
			});
		}
	},
	getTopic: async (req, res) => {
		/* Sacar el id del topic */
		let topicId = req.params.id;

		/* Find por id del topic */
		try {
			let topic = await Topic.findById(topicId).populate('user').exec();
			if (!topic) throw { message: 'No se encontro topic con ese id' };
			return res.json({
				ok: true,
				topic,
			});
		} catch (err) {
			return res.status(400).json({
				ok: false,
				err,
				message: 'No hay topic para mostrar',
			});
		}
	},
	update: async (req, res) => {
		/* Recoger el id del topic  */
		let topicId = req.params.id;
		/* Recoger los datos que llguen de post */
		let body = _.pick(req.body, ['title', 'content', 'code', 'lang']);

		/* Find and update del topic */
		try {
			const topicUpdate = await Topic.findOneAndUpdate(
				{ _id: topicId, user: req.user._id },
				body,
				{
					new: true,
					runValidators: true,
				},
			)
				.populate('user')
				.exec();

			return res.json({
				ok: true,
				topic: topicUpdate,
			});
		} catch (err) {
			return res.json({
				ok: false,
				err: 'No existe ese ID del topic',
			});
		}
	},
	detele: async (req, res) => {
		let topicId = req.params.id;

		try {
			const topicDelete = await Topic.findOneAndDelete({
				_id: topicId,
				user: req.user._id,
			});

			if (!topicDelete) throw { message: 'ID del topic no existe' };

			return res.json({
				ok: true,
				topic: topicDelete,
			});
		} catch (err) {
			return res.status(400).json({
				ok: false,
				err,
				message: 'Error al borrar topic',
			});
		}
	},
	search: (req, res) => {
		/* Sacar el string a buscar */
		let seatchString = req.params.search;
		/* Find or */
		Topic.find({
			$or: [
				{ title: { $regex: seatchString, $options: 'i' } },
				{ content: { $regex: seatchString, $options: 'i' } },
				{ code: { $regex: seatchString, $options: 'i' } },
				{ lang: { $regex: seatchString, $options: 'i' } },
			],
		})
			.sort([['date', 'descending']])
			.exec((err, topics) => {
				/* Devolver */

				if (err) {
					return res.status(500).json({
						ok: false,
						err,
					});
				}

				if (!topics) {
					return res.status(404).json({
						ok: false,
						message: 'No hay temas disponibles',
					});
				}

				return res.json({
					ok: true,
					topics,
				});
			});
	},
};
