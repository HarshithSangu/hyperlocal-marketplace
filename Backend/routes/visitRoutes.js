const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { createVisit } = require("../controllers/visitController");

router.post("/", auth, createVisit);

module.exports = router;
