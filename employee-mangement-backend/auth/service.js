const User=require('../model/User');
const Employee=require('../model/Employee');
const bcrypt=require('bcrypt');
const {v4:uuidv4}=require('uuid');
const { generateToken } = require('../util/jwt');
const {setExAsync}=require('../redis');

const registerUser=async(body)=>{
    const {name,email,password,role,department,joiningDate,projects}=body;
    const existingUser=await User.findOne({email});
    if(existingUser){
        throw new Error('User already exists!');
    }
    const hashedPassword=await bcrypt.hash(password,10);
    const user=await User.create({_id:uuidv4(),name,email,password:hashedPassword,role,department,joiningDate,projects});
    await user.save();
    if(role==='employee'){
        await Employee.create({_id:uuidv4(),userId:user._id,department,joiningDate:Date.now(),projects});
    }
    return user;
}

const loginUser=async(email,password)=>{
    const user=await User.findOne({email});
    console.log(user);
    if(!user){
        throw new Error('User not found!');
    }
    const isPasswordCorrect=await bcrypt.compare(password,user.password);
    console.log(isPasswordCorrect);
    if(!isPasswordCorrect){
        throw new Error('Invalid password!');
    }
    const token=await generateToken(user._id);
    return token;
}

const logoutUser = async (token) => {
    try {
      // Add token to blacklist in Redis (expires in 24 hours)
      await setexAsync(`blacklist:${token}`, 86400, 'true');
      return { message: 'Logged out successfully' };
    } catch (error) {
      console.error('Error blacklisting token:', error);
      throw new Error('Logout failed');
    }
  };

module.exports={
    registerUser,
    loginUser,
    logoutUser
}