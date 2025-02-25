import connectDb from "./dbconfig.js";
import User from "../models/user.model.js";

const demoUsers = [
  {
    username: "ayush",
    email: "ayush@example.com",
    fullName: "Ayush",
    avatar: "http://example.com/avatar/ayush.jpg",
    password: "password123",
  },
  {
    username: "Akshay",
    email: "akshay@example.com",
    fullName: "Akshay",
    avatar: "http://example.com/avatar/ayush.jpg",
    password: "password123",
  },
  {
    username: "siddhant",
    email: "siddhant@example.com",
    fullName: "Siddhant",
    avatar: "http://example.com/avatar/siddhant.jpg",
    password: "password123",
  },
];

const insertDemoUsers = async () => {
  try {
    const hashedUsers = await Promise.all(
      demoUsers.map(async (user) => {
        const newUser = new User(user);
        await newUser.save();
        return newUser;
      })
    );
    console.log("Demo users inserted successfully!");
  } catch (error) {
    console.error("Error inserting demo users:", error);
  }
};

const initDb = async () => {
  await connectDb();
  await insertDemoUsers();
  process.exit(0);
};

initDb();
