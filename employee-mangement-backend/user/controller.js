const userService=require('./service');
const User = require('../model/User');
const Employee = require('../model/Employee');

const updateEmployeeRole = async (req, res) => {
    try {
      const { userId,role } = req.body;
      const updatedEmployee = await userService.updateEmployeeRole(userId, role);
      res.status(200).json({
        message: 'Employee role updated successfully',
        employee: updatedEmployee
      });
    } catch (error) {
      res.status(error.message.includes('not found') ? 404 : 400).json({ 
        message: error.message 
      });
    }
  };

const deleteEmployee=async(req,res)=>{
    try{
        const {userId}=req.body;
        await userService.deleteUser(userId);
        res.status(200).json({message:'Employee deleted successfully'});
    }catch(error){
        res.status(error.message.includes('not found') ? 404 : 400).json({ 
            message: error.message 
          });
    }
}

const getAllEmployees=async(req,res)=>{
    try{
        const currentUserId = req.user._id;
        const options = {
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
        sortBy: req.query.sortBy,
        order: req.query.order
        };
        const result=await userService.getAllEmployees(currentUserId,options);
        res.status(200).json({data:result.employees,pagination:result.pagination});
    }catch(error){
        res.status(error.message.includes('not found') ? 404 : 400).json({ 
            message: error.message 
          });
    }
}

const getLoggedInUserData = async (req, res) => {
  try {
    const userId = req.user._id;
    const result=await userService.getLoggedInUserData(userId);
    res.status(200).json({
      result
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data', error: error.message });
  }
};

module.exports={
    updateEmployeeRole,
    deleteEmployee,
    getAllEmployees,
    getLoggedInUserData
};