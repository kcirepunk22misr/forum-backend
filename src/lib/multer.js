const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const path = require('path');

var storage = multer.diskStorage({
	destination: 'uploads/users',
	filename: (req, file, cb) => {
		cb(null, uuidv4() + path.extname(file.originalname));
	},
});
// destination: (req, file, cb) => {
//     cb(null, path.resolve(__dirname, '../uploads')),
// },
// filename: (req, file) => {
//     cb(null, file.fieldname + '-' + new Date().getMilliseconds())
// }
module.exports = multer({ storage });
