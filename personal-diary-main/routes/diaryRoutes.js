const express = require('express');
const router = express.Router();
const controller = require('../controllers/diaryController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware); // all routes below require auth

// 🔹 Specific routes first
router.get("/search", controller.searchDiaries); // search route
router.get("/user/:userId", controller.getDiariesByUserId);
router.get("/user/:userId/date/:date", controller.getByUserAndDate);
router.get("/user/:userId/mood/:moodType", controller.getByUserAndMood);

// 🔹 CRUD routes
router.get("/", controller.getAll);
router.get("/:id", controller.getOne); // dynamic route at the end
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
