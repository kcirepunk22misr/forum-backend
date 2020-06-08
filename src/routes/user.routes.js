const { Router } = require('express');
const userController = require('../controllers/user.controller');
const { auth } = require('../middlewares/auth');
const multer = require('../lib/multer');
const router = Router();

router.get('/user/:id', userController.getUser);
router.get('/users', userController.getTopics);
router.get('/avatar/:fileName', userController.avatar);
router.post('/register', userController.save);
router.post('/login', userController.login);
router.post(
	'/upload-avatar',
	[auth, multer.single('image')],
	userController.uploadAvatar,
);
router.put('/update', auth, userController.update);

module.exports = router;
