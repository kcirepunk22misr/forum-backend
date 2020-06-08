const mongoose = require('mongoose');
const app = require('./app');

// Settings
app.set('port', process.env.PORT || 3000);

mongoose.Promise = global.Promise;
mongoose
	.connect('mongodb://localhost:27017/forum', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then(() => {
		// Crear el servidor
		console.log('Conexion Exitosa');
		app.listen(app.get('port'), () => {
			console.log('Server on port');
		});
	})
	.catch((err) => console.log(err));
