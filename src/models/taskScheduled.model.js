import mongoose from "mongoose";

const taskScheduleSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    description:{
        type:String ,
        required:true
    },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String, // Storing in "HH:mm" 24-hour format
    required: true
  },
  duration: {
    type: Number, // Duration in minutes
    required: true
  },
  meetingId: {
    type: String,
  }
});

const TaskSchedule = mongoose.model("TaskSchedule", taskScheduleSchema);

export default TaskSchedule;
