const express = require('express');

const router = express.Router();
const userControllers = require('../controllers/userControllers');

router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.createNewUser);
router
  .route('/:id')
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = router;
