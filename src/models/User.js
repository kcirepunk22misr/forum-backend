const { Schema, model } = require('mongoose');
const mongooseValidor = require('mongoose-unique-validator');

let UserSchema = new Schema({
	name: {
		type: String,
		required: [true, 'El nombre es obligatorio'],
		trim: true,
	},
	surname: {
		type: String,
		required: [true, 'El apellido es obligatorio'],
		trim: true,
	},
	email: {
		type: String,
		required: [true, 'El email es obligatorio'],
		lowercase: true,
		unique: true,
		trim: true,
	},
	password: {
		type: String,
		required: [true, 'El apellido es obligatorio'],
		trim: true,
	},
	image: String,
	role: {
		type: String,
	},
});

UserSchema.methods.toJSON = function () {
	let user = this;
	let userObject = user.toObject();
	delete userObject.password;
	return userObject;
};

UserSchema.plugin(mongooseValidor, { message: '{PATH} ya existe' });

module.exports = model('User', UserSchema);
