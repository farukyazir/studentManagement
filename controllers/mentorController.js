import mongoose, { isValidObjectId } from "mongoose";
import Mentor from "../models/mentor.Schema.js";
import Student from "../models/student.Schema.js";

export const addMentor = async (req,res)=>{
    try{
        const {name,email}=req.body;
        const newMentor =await  Mentor.create({
            name,
            email
        })
        res.status(201).json({message:"Mentor Added successfully",mentors:newMentor })

    }catch(error){
        res.status(500).json({error:error.message})

    }
}

export const assignStudent = async (req,res)=>{
    const {mentorId} = req.params
    const {studentIds}=req.body

    if(!mongoose.isValidObjectId(mentorId)){
        return res.status(400).json({message:"invalid mentor id"})
    }

    if(!Array.isArray(studentIds) || studentIds.length=== 0 ){
        return res.status(400).json({message:"please provide student ids"})
    }

    const mentor = await Mentor.findById(mentorId)
    if(!mentor){
        return res.status(400).json({message:"mentor not found"})
    }

    const invalidIds =  studentIds.filter((id)=>!mongoose.isValidObjectId(id))
    if(invalidIds.length>0){
        return res.status(400).json({message:"invalid student id"})
    }
    const uniqueStudentIds = [...new Set(studentIds)];

    const result = await Student.updateMany(
        {
            mentor:null,
            _id:{$in:uniqueStudentIds}
        },
        {
            $set:{
                mentor:mentorId
            }
        }
    )
    res.status(200).json({
        message :"students assigned successfully",
        mentor:mentor.name,
        assignedCount:result.modifiedCount,
        skippedCount:uniqueStudentIds.length-result.modifiedCount
    })

}

export const studentAssign = async (req,res)=>{
    const {mentorId}=req.params
    try{
        if(!mongoose.isValidObjectId(mentorId)){
            return res.status(400).json({
                message:"invalid mentor id"
            })
        }
        const mentor = await Mentor.findById(mentorId);
        if(!mentor){
            return res.status(404).json({
                message:"mentor not found"
            })
        }

        const students = await Student.find({mentor:mentorId})
        res.status(200).json({
            mentor:mentor.name,
            count:students.length,students
        })

    }catch(error){
        return res.status(500).json({
            error:error.message
        })

    }
}

export const getPreviousMentor = async (req, res) => {
    try {
        const { studentId } = req.params;
        if (!mongoose.isValidObjectId(studentId)) {
            return res.status(400).json({
                message: "Invalid student ID"
            });
        }
        const student = await Student.findById(studentId)
            .populate("previousMentor", "name email");
        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }
        if (!student.previousMentor) {
            return res.status(200).json({
                message: "No previous mentor found for this student",
                student: student.name,
                previousMentor: null
            });
        }
        res.status(200).json({
            student: student.name,
            previousMentor: student.previousMentor
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};