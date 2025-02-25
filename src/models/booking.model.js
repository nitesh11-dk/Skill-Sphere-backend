  import mongoose from "mongoose";

  const bookingSchema = new mongoose.Schema(
    {
      type: {
        type: String,
        enum: ["offering", "requesting"],
        required: true,
      },
      provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        validate: {
          validator: function(value) {
            return value.toString() !== this.provider.toString();
          },
          message: "Provider and requester cannot be the same person"
        }
      },
      skillsToLearn: {
          type: String,
          required: true,
        },
        availabilityDate: {
          type: Date,
          required: true,
          validate: {
            validator: function (value) {
              return value > new Date(); // Ensures the date is in the future
            },
            message: "Availability date must be in the future."
          }
        },
        availabilityTime: {
          type: String,
          enum: ["morning", "afternoon", "evening", "night"],
          required: true,
          validate: {
            validator: function(value) {
              const timeRanges = {
                morning: "8:00-11:00",
                afternoon: "12:00-16:00", 
                evening: "16:00-19:00",
                night: "20:00-23:00"
              };
              return Object.keys(timeRanges).includes(value);
            },
            message: "Invalid time slot. Must be morning(8-11), afternoon(12-4), evening(4-7) or night(8-11)"
          }
        },
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected", "completed"],
        default: "pending",
      },
      isBarterExchange: {
        type: Boolean,
        default: false,
      },
      barterSkillOptions:[
        {
          type : String ,
          required:true
        },
      ],
      barterSkill: {
        type: String,
      },
      inAvailabilityTime: {
        type: Boolean, // Array of unavailable time slots in "HH:mm"
        default:true
      },
      taskSchedule: 
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "TaskSchedule",
          default: null,
        },
    },
    {
      timestamps: true,
    }
  );

  export default mongoose.model("Booking", bookingSchema);
