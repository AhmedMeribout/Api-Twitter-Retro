import express from "express";
import multer from "multer";
import {
  createTweet,
  getAllTweets,
  getTweetById,
  updateTweet,
  deleteTweet,
} from "../controllers/tweets.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets/post");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const postStorage = multer({ storage: storage });

// CREATE TWEET
router.post("/",verifyToken , postStorage.single("image"),createTweet);
router.delete("/:id", verifyToken, deleteTweet);

// GET Tweet
router.get("/", verifyToken, getAllTweets);
router.get("/:id", verifyToken, getTweetById);

// UPDATE
router.patch("/:tweetId", verifyToken, updateTweet);

export default router;