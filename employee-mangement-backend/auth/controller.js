const authService=require('./service');
const User=require('../model/User');

const register=async(req,res)=>{
    try{
        const user=await authService.registerUser(req.body);
        res.status(201).json(user);
    }catch(error){
        res.status(500).json({message:error.message});
    }
};

const login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        console.log(email,password);
        const token=await authService.loginUser(email,password);
        res.status(200).json({token});
    }catch(error){
        res.status(401).json({message:error.message});
    }
};

const logout = async (req, res) => {
    try {
      const token = req.headers.authorization;
      const result = await authService.logoutUser(token);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

module.exports={
    register,
    login,
    logout
}