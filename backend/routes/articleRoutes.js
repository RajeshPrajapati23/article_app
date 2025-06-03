import express from "express";
import {
  createArticle,
  deleteArticleById,
  getByIdArticle,
  geteArticle,
  updateArticleByid,
} from "../controllers/articleController.js";
import { authenticate } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/add/article", authenticate, createArticle);
router.get("/get/article", authenticate, geteArticle);
router.get("/get/article/:id", authenticate, getByIdArticle);
router.post("/update/article", authenticate, updateArticleByid);
router.delete("/delete/article/:id", authenticate, deleteArticleById);

export default router;
