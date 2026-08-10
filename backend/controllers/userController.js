import User from "../models/userModel.js";
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET= 'your_jwt_secret_here';
const TOKEN_EXPIRES= '24h';

const createToken = (userId) =>
    jwt.sign({id: userId},JWT_SECRET, {expoerIn: TOKEN_EXPIRES}); //TOKEN IS CREATED

//Register a user 
export async function registerUser(req,res){
    const{name,email,password}= req.body; //filled by user
    if(!name || !email || password){                          // check 
        return res.status(400).json({
            success: false,
            message: "ALL FIELDS ARE REQUIRED."
        });
    }
    if(!validator.isEmail(email)){
        return res.status(400).json({
            success: false,
            message: "Invalid email"
        });
    }
    if(password.length<8){
        return res.status(400).json({
            success: false,
            message: "Password must be of atleast of 8 characters"
        });
    }
    try {
    if(await User.findOne({email})){
        return res.status(400).json({
            success: false,
            message: "User already present"
        });
        
    }
    const hashed = await bcrypt.hash(password,10);
    const user= await User.create({name,email,password: hashed});
    const token=createToken(user._id)            // token
    res.status(201).json({
        success: true,
        token,
        user:{ id: user._id, name: user.name, email: user.email}
    });
    }
    catch (err){
        console.error(err);
        re.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
}




// to login a user




// to change user password
// to change user password
export async function updatePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password invalid or too short."
    });
  }
  try {
    const user = await User.findById(req.user.id).select("password");
    if(!user){
        return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Current Password is incorrect."
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully."
    });
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
   