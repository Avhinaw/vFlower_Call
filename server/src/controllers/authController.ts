import User  from "../models/user";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken";


export const register = async (req: Request, res: Response) => {

    const {name, email, password} = req.body; // destructure the elements getting from the client side

    try{
        const userExists = await User.findOne({email});
        if(userExists) return res.status(400).json({message: "User Already existed"});
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({name, email, password: hashedPassword});

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id.toString()),
        });
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ message: "Internal server error" });
      }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id.toString()),
      message: `thanks user ${user.name}`,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};