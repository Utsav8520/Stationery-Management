const express = require('express');
const riderController = require('../controllers/rider.controller');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(['ADMIN']));

router.post('/', riderController.createRider);
router.get('/', riderController.getRiders);
router.get('/:id', riderController.getRiderById);
router.put('/:id', riderController.updateRider);
router.delete('/:id', riderController.deleteRider);

module.exports = router;
