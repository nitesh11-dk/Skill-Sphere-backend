import {Review} from "../models/review.mode.js"; // Correctly import the Review model from the appropriate file
import User from "../models/user.model.js";


export const addreview = async (req, res) => {
  try {
    const { rating, comment,userId } = req.body;

    const newReview = new Review({
      rating,
      comment,
      reviewer:req.user.fullName,
    });

    await newReview.save();
    await User.findByIdAndUpdate(userId, { $push: { reviews: newReview._id } });
    
    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: newReview,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Error creating review",
      error,
    });
  }
};
