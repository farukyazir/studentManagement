import mongoose from "mongoose";

const StudentSchema = mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowerCase:true
        },
        mentor:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Mentor",
            default:null
        },
        previousMentor:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Mentor",
            default:null
        }
    }
)


const Student = mongoose.model("Student",StudentSchema)
export default Student