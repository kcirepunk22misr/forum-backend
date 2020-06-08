const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Comment = require('./Comment').schema;

// Modelo de TOPIC
let TopicSchema = new Schema({
	title: {
		type: String,
		required: [true, 'El titulo es obligatorio'],
	},
	content: {
		type: String,
		required: [true, 'EL contenido es obligatorio'],
	},
	lang: {
		type: String,
		required: [true, 'El lenguaje es obligatorio'],
	},
	code: String,
	data: {
		type: Date,
		default: Date.now,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	comments: [Comment],
});

/* Cargar paginacion */
TopicSchema.plugin(mongoosePaginate);

module.exports = model('Topic', TopicSchema);
