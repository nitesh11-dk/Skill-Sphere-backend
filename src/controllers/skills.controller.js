import Skill from "../models/skills.model.js";
import User from "../models/user.model.js";

export async function updateUserSkills(req, res) {
  try {
    const userId = req.user._id;
    const newSkills = req.body.skills; // Array of {title, category} objects

    if (!Array.isArray(newSkills)) {
      return res.status(400).json({
        success: false,
        message: "Skills must be provided as an array"
      });
    }

    // Get current user with their skills
    const user = await User.findById(userId).populate('skills');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const currentSkillIds = user.skills.map(skill => skill._id.toString());
    const updatedSkills = [];
    const skillsToAdd = [];

    // Process each skill in the new skills array
    for (const skillData of newSkills) {
      const { title, category } = skillData;

      // Check if skill already exists in database (case insensitive)
      let skill = await Skill.findOne({
        title: { $regex: new RegExp(`^${title}$`, 'i') },
        category: { $regex: new RegExp(`^${category}$`, 'i') }
      });

      // If skill doesn't exist in database, create it
      if (!skill) {
        skill = await new Skill({ title, category }).save();
      }

      skillsToAdd.push(skill._id);
      updatedSkills.push(skill);
    }

    // Update user's skills array
    // This will add new skills and remove skills that are not in the new array
    const updatedUser = await User.findByIdAndUpdate(userId, {
      $set: { skills: skillsToAdd }
    }, { new: true }).populate('skills');

    res.status(200).json({
      success: true,
      message: "User skills updated successfully",
      data: {
        added: updatedSkills.filter(skill => !currentSkillIds.includes(skill._id.toString())),
        removed: user.skills.filter(skill => !skillsToAdd.includes(skill._id.toString())),
        current: updatedUser.skills,
        user: {
          name: updatedUser.name,
          email: updatedUser.email,
          skills: updatedUser.skills
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating user skills",
      error: error.message
    });
  }
}
