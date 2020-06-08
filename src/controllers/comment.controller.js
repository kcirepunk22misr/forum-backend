const Topic = require('../models/Topic');
const _ = require('underscore');

module.exports = {
	add: async (req, res) => {
		let id = req.params.topicId;

		try {
			const topic = await Topic.findById(id);

			if (!topic.length === 0) throw { message: 'No existe topic con ese ID' };

			const { content } = req.body;

			if (!content) throw { message: 'No has escrito ningun comentario' };

			let comment = {
				user: req.user._id,
				content,
			};

			topic.comments.push(comment);
			await topic.save();

			res.json({
				ok: true,
				topic,
			});
		} catch (err) {
			if (err.kind) {
				return res.status(404).json({
					ok: false,
					message: 'No se encontro ningun topic con ese ID',
				});
			}

			return res.status(400).json({
				ok: false,
				message: 'Error al agregar comentario',
				err,
			});
		}
	},
	update: (req, res) => {
		/* Conseguir id de comentario que llega de la url */
		let commentId = req.params.commentId;
		/* Recoger datos y validar */
		const { content } = req.body;

		if (!content) {
			return res.status(400).json({
				ok: false,
				message: 'No has escrito ningun comentario',
			});
		}
		/* Find and update de subdocumento */
		Topic.findOneAndUpdate(
			{ 'comments._id': commentId },
			{ $set: { 'comments.$.content': content } },
			{ new: true },
			(err, topicUpdate) => {
				if (err) {
					return res.status(500).json({
						ok: false,
						err,
					});
				}

				if (!topicUpdate) {
					return res.status(400).json({
						ok: false,
						message: 'No se encontro topic con ese id',
					});
				}

				return res.status(200).json({
					ok: true,
					topic: topicUpdate,
				});
			},
		);

		/* Devolver los datos */
	},
	delete: (req, res) => {
		/* Sacar el id del topic y del comentario */
		let topicId = req.params.topicId;
		let commentId = req.params.commentId;

		/* Buscar el topic */
		Topic.findById(topicId, (err, topic) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					err,
				});
			}

			if (!topic) {
				return res.status(400).json({
					ok: false,
					message: 'No se encontro topic con ese id',
				});
			}
			/* Seleccionar el subdocumento */
			let comment = topic.comments.id(commentId);
			/* Borrar el comentario */
			if (comment) {
				comment.remove();

				topic.save((err, topicDB) => {
					if (err) {
						return res.status(500).json({
							ok: false,
							err,
						});
					}
					return res.json({
						ok: true,
						topic,
					});
				});
			} else {
				res.status(400).json({
					ok: false,
					message: 'No existe el comentario',
				});
			}
		});
	},
};
