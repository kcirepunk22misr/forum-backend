const { Schema, model } = require('mongoose');

let CommentSchema = new Schema({
	content: String,
	date: {
		type: Date,
		default: Date.now,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
});
module.exports = model('Comment', CommentSchema);
