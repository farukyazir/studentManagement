import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import mentorRouter from "./routers/mentorrouter.js"
import studentRouter from "./routers/studentrouter.js"
import connectDB from "./database/dbConfig.js";

const app =  express()
dotenv.config();
app.use(cors())
app.use(express.json())


connectDB()

app.use("/api/mentor",mentorRouter);
app.use("/api/student",studentRouter)

const PORT = process.env.PORT
app.listen(PORT,()=>{console.log(`server is running on port ${PORT}`)})
