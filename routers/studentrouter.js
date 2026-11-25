import express from "express"
import { addStudent, assignMentor, getUnassignedStudents } from "../controllers/studentController.js";
import { getPreviousMentor } from "../controllers/mentorController.js";

const router = express.Router();


router.post("/",addStudent);
router.get("/unassigned", getUnassignedStudents);
router.put("/:studentId/assign-mentor",assignMentor)
router.get("/:studentId/previous-mentor", getPreviousMentor);

export default router