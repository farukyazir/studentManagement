import mongoose from "mongoose";

const mentorSchema = mongoose.Schema(
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
        }
    }
)

const Mentor = mongoose.model("Mentor",mentorSchema);
export default Mentor