const { Router } = require('express');
const topicController = require('../controllers/topic.controller');
const { auth } = require('../middlewares/auth');
const router = Router();

router.get('/topic/:id', topicController.getTopic);
router.get('/topics/:page?', topicController.getTopics);
router.get('/user-topics/:user', topicController.getTopicsByUser);
router.get('/search/:search', topicController.search);
router.post('/topic', auth, topicController.save);
router.put('/topic/:id', auth, topicController.update);
router.delete('/topic/:id', auth, topicController.detele);

module.exports = router;
