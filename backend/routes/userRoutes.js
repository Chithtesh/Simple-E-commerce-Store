const express = require("express");
const router = express.Router();
const { getUsers, getUserById } = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/", protect, admin, getUsers);
router.get("/:id", protect, admin, getUserById);

module.exports = router;
