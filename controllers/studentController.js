import mongoose, { Mongoose } from "mongoose";
import Mentor from "../models/mentor.Schema.js";
import Student from "../models/student.Schema.js";

export const addStudent=async (req,res)=>{
    try{
        const {name,email}=req.body;
        const newStudent=await Student.create({
            name,
            email
        })
        res.status(201).json({message:"Student added successfully",students:newStudent})
    }catch(error){
        res.status(500).json({error:error.message})
    }
}

export const getUnassignedStudents = async (req, res) => {
    try {
        const students = await Student.find({ mentor: null });

        res.status(200).json({
            count: students.length,
            students
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

export const assignMentor = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { mentorId } = req.body;
        if (!mongoose.isValidObjectId(studentId)) {
            return res.status(400).json({
                message: "Invalid student ID"
            });
        }
        if (!mongoose.isValidObjectId(mentorId)) {
            return res.status(400).json({
                message: "Invalid mentor ID"
            });
        }
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }
        const mentor = await Mentor.findById(mentorId);
        if (!mentor) {
            return res.status(404).json({
                message: "Mentor not found"
            });
        }
        if (student.mentor) {
            student.previousMentor = student.mentor;
        }
        student.mentor = mentorId;
        
        await student.save();
        res.status(200).json({
            message: "Mentor assigned successfully",
            student,
            mentor:mentor.name
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};