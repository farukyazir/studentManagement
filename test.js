import mongoose from "mongoose";

export const assignStudents = async (req, res) => {
    try {
        const { mentorId } = req.params;
        const { studentIds } = req.body;

        // 1. Check mentor ID
        if (!mongoose.isValidObjectId(mentorId)) {
            return res.status(400).json({
                message: "Invalid mentor ID"
            });
        }

        // 2. Check studentIds
        if (!Array.isArray(studentIds) || studentIds.length === 0) {
            return res.status(400).json({
                message: "Please provide student IDs"
            });
        }

        // 3. Check whether mentor exists
        const mentor = await Mentor.findById(mentorId);

        if (!mentor) {
            return res.status(404).json({
                message: "Mentor not found"
            });
        }

        // 4. Validate student IDs
        const invalidIds = studentIds.filter(
            id => !mongoose.isValidObjectId(id)
        );

        if (invalidIds.length > 0) {
            return res.status(400).json({
                message: "Invalid student IDs",
                invalidIds
            });
        }

        // 5. Remove duplicate IDs
        const uniqueStudentIds = [...new Set(studentIds)];

        // 6. Assign only students without an existing mentor
        const result = await Student.updateMany(
            {
                _id: { $in: uniqueStudentIds },
                mentor: null
            },
            {
                $set: {
                    mentor: mentorId
                }
            }
        );

        // 7. Send response
        res.status(200).json({
            message: "Students assigned successfully",
            mentor: mentor.name,
            assignedCount: result.modifiedCount,
            skippedCount: uniqueStudentIds.length - result.modifiedCount
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};