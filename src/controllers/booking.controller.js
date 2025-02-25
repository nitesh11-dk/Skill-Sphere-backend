import Booking from "../models/booking.model.js";
import User from "../models/user.model.js";

export const createBooking = async (req, res) => {

  try {
      const { type, provider, skillsToLearn, availabilityDate, availabilityTime, inAvailabilityTime, isBarterExchange, barterSkill } = req.body;

      if (!type || !provider || !skillsToLearn || !availabilityDate || !inAvailabilityTime || !availabilityTime) {
          return res.status(400).json({ message: "Missing required fields." });
      }

      // Check if provider and requester are same
      if (provider.toString() === req.user._id.toString()) {
          return res.status(400).json({ 
              success: false, 
              message: "Provider and requester cannot be the same person."
          });
      }

      const currentDate = new Date();
      const selectedDate = new Date(availabilityDate);
  
      // Ensure the availability date is in the future
      if (selectedDate <= currentDate) {
        return res.status(400).json({ success: false, message: "Availability date must be in the future." });
      }

      // Validate availabilityTime
      const validTimeSlots = ["morning", "afternoon", "evening", "night"];
      if (!validTimeSlots.includes(availabilityTime)) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid time slot. Must be morning(8-11), afternoon(12-4), evening(4-7) or night(8-11)"
        });
      }

      const userSkills = await User.findById(req.user._id).populate('skills');
      const skillTitles = userSkills.skills.map(skill => skill.title);

      const booking = new Booking({
          type,
          provider,
          requester: req.user._id,
          skillsToLearn,
          availabilityDate: new Date(availabilityDate),
          availabilityTime,
          isBarterExchange,
          inAvailabilityTime,
          barterSkillOptions: skillTitles,
          barterSkill
      });

      await booking.save();
      await User.findByIdAndUpdate(req.user._id, { $push: { bookings: booking._id } });
      const populatedBooking = await booking.populate("provider requester");

      res.status(201).json({ message: "Booking created successfully", success: true, data: populatedBooking });
  } catch (err) {
      res.status(500).json({ success: false, message: "An error occurred while creating the booking", error: err.message });
  }
};



export const getOfferingBookings = async (req, res) => {
    try {
        const userId = req.user._id;
        const bookings = await Booking.find({ provider: userId }).populate('provider requester');

        if (!bookings.length) {
            return res.status(201).json({ message: "No offering bookings found for this user" });
        }

        res.status(200).json({ success: true, message: "Offering bookings retrieved successfully", data: bookings });
    } catch (err) {
        res.status(500).json({ success: false, message: "An error occurred while retrieving offering bookings", error: err.message });
    }
};

export const getRequesterBookings = async (req, res) => {
    try {
        const userId = req.user._id;
        const bookings = await Booking.find({ requester: userId, type: "requesting" }).populate('provider requester');

        if (!bookings.length) {
            return res.status(404).json({ message: "No bookings found for this user" });
        }

        res.status(200).json({ success: true, message: "Bookings retrieved successfully", data: bookings });
    } catch (err) {
        res.status(500).json({ success: false, message: "An error occurred while retrieving bookings", error: err.message });
    }
};

export const respondToBooking = async (req, res) => {
    try {
      const { bookingId, action,barterSkill} = req.body;
      const userId = req.user._id;
  
      if (!bookingId || !action || !barterSkill) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      const booking = await Booking.findById(bookingId);
  
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
  
      if (booking.provider.toString() !== userId.toString()) {
        return res.status(403).json({ message: "You are not authorized to respond to this booking" });
      }
  
      if (action == 'reject') {
        booking.status = 'rejected';
        await booking.save();
        return res.status(200).json({ success: true, message: "Booking rejected successfully" });
      } else if (action == 'accept') {
        booking.status = 'accepted';
        booking.barterSkill =barterSkill;
        await booking.save();
        return res.status(200).json({ success: true, message: "Booking accepted successfully" });
      } else {
        return res.status(400).json({ error: "Invalid action" });
      }
    } catch (err) {
      res.status(500).json({ success: false, message: "An error occurred while responding to the booking", error: err.message });
    }
  };


  export const scheduleBookingDate = async (req, res) => {
    try {
      const { bookingId, date } = req.body;
      const userId = req.user._id;
  
      if (!bookingId || !date) {
        return res.status(400).json({ error: "Booking ID and date are required" });
      }
  
      // Find the booking by ID
      const booking = await Booking.findById(bookingId);
  
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
  
      // Check if the user is the provider and if the booking is accepted
      if (booking.provider.toString() !== userId.toString()) {
        return res.status(403).json({ message: "You are not authorized to schedule this booking" });
      }
  
      if (booking.status !== "accepted") {
        return res.status(400).json({ message: "Booking must be accepted before scheduling a date" });
      }
  
      // Update the booking date
      booking.date = date;
      booking.status = "scheduled"; // Optional new status to track scheduled bookings
      await booking.save();
  
      res.status(200).json({ success: true, message: "Booking date scheduled successfully", data: booking });
    } catch (err) {
      res.status(500).json({ success: false, message: "An error occurred while scheduling the booking date", error: err.message });
    }
  };
  

  // Mark booking as completed
export const completeBooking = async (req, res) => {
    try {
      const { bookingId } = req.body;
      const booking = await Booking.findById(bookingId);
  
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
  
      booking.status = 'completed';
      await booking.save();
      res.status(200).json({ success: true, message: "Booking marked as completed" });
    } catch (err) {
      res.status(500).json({ success: false, message: "An error occurred while marking the booking as completed", error: err.message });
    }
  };