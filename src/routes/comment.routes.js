const { Router } = require('express');
const { auth } = require('../middlewares/auth');
const commentController = require('../controllers/comment.controller');
const router = Router();

router.post('/comment/topic/:topicId', auth, commentController.add);
router.put('/comment/:commentId', auth, commentController.update);
router.delete('/comment/:topicId/:commentId', auth, commentController.delete);

module.exports = router;
