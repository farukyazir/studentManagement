import express from "express";
import { addMentor, assignStudent, studentAssign } from "../controllers/mentorController.js";

const router = express.Router();


router.post("/",addMentor);
router.put("/:mentorId/assign-students",assignStudent)
router.get("/:mentorId/students",studentAssign)





export default router