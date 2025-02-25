import TaskSchedule from "../models/taskScheduled.model.js";
import BookingModel from "../models/booking.model.js";
// Create a new task schedule
export const createTaskSchedule = async (req, res) => {
  try {
    const { title,booking_id, description, date, startTime, duration, meetingId="" } = req.body;

    // Validate required fields
    if (!title || !description || !date || !startTime || !duration ) {
      return res.status(400).json({ 
        success: false,
        message: "Missing required fields" 
      });
    }

    // Validate date is in future
    const scheduleDate = new Date(date);
    if (scheduleDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Schedule date must be in the future"
      });
    }

    // Create new task schedule
    const taskSchedule = new TaskSchedule({
      title,
      description,
      date: scheduleDate,
      startTime,
      duration,
      meetingId
    });

    await taskSchedule.save();

    const booking = await BookingModel.findById(booking_id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    booking.taskSchedule = taskSchedule._id;
    await booking.save();
    
    res.status(201).json({
      success: true,
      message: "Task schedule created successfully",
      data: taskSchedule
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error creating task schedule",
      error: err.message
    });
  }
};






// Get all bookings by specific user
export const getUserTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await BookingModel.find({ 
      $or: [{ provider: userId }, { requester: userId }] 
    }).populate('taskSchedule');

    if (!bookings.length) {
      return res.status(404).json({
        success: false,
        message: "No bookings found for this user"
      });
    }
    const taskSchedules = bookings.map(booking => booking.taskSchedule);
    return res.status(200).json({
      success: true,
      message: "User task schedules retrieved successfully",
      data: taskSchedules
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving user bookings",
      error: err.message
    });
  }
};













// Get all task schedules
export const getAllTaskSchedules = async (req, res) => {
  try {
    const taskSchedules = await TaskSchedule.find();
    res.status(200).json({
      success: true,
      data: taskSchedules
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching task schedules",
      error: err.message
    });
  }
};

// Get task schedule by ID
export const getTaskScheduleById = async (req, res) => {
  try {
    const taskSchedule = await TaskSchedule.findById(req.params.id);
    if (!taskSchedule) {
      return res.status(404).json({
        success: false,
        message: "Task schedule not found"
      });
    }
    res.status(200).json({
      success: true,
      data: taskSchedule
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching task schedule",
      error: err.message
    });
  }
};

// Update task schedule
export const updateTaskSchedule = async (req, res) => {
  try {
    const { title, description, date, startTime, duration, meetingId } = req.body;
    
    // Validate date if provided
    if (date) {
      const scheduleDate = new Date(date);
      if (scheduleDate <= new Date()) {
        return res.status(400).json({
          success: false,
          message: "Schedule date must be in the future"
        });
      }
    }

    const taskSchedule = await TaskSchedule.findByIdAndUpdate(
      req.params.id,
      { title, description, date, startTime, duration, meetingId },
      { new: true, runValidators: true }
    );

    if (!taskSchedule) {
      return res.status(404).json({
        success: false,
        message: "Task schedule not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Task schedule updated successfully",
      data: taskSchedule
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating task schedule",
      error: err.message
    });
  }
};

// Delete task schedule
export const deleteTaskSchedule = async (req, res) => {
  try {
    const taskSchedule = await TaskSchedule.findByIdAndDelete(req.params.id);
    
    if (!taskSchedule) {
      return res.status(404).json({
        success: false,
        message: "Task schedule not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Task schedule deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting task schedule",
      error: err.message
    });
  }
};
