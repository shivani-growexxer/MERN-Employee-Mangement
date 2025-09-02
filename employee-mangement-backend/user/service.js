const Employee=require('../model/Employee');
const User = require('../model/User');
const {getAsync,setExAsync, delAsync}=require('../redis');

const invalidateCache = async (userId) => {
    try {
      // Clear specific user cache
      await delAsync(`user:${userId}`);
      console.log(`User cache cleared for userId: ${userId}`);
      
      // Clear all employee list caches (since user data might be in them)
      const keys = await client.keys('employees:*');
      if (keys.length > 0) {
        await Promise.all(keys.map(key => delAsync(key)));
        console.log('Employee list cache cleared');
      }
    } catch (error) {
      console.error('Error invalidating cache:', error);
    }
  };

const updateEmployeeRole=async(userId,role)=>{
    const user = await User.findOne({ _id: userId, isDeleted: false });
    if (!user) {
        throw new Error('User not found');
    }
    user.role = role;
    await user.save();
    await invalidateCache(userId);
    return user;
}

const deleteUser=async(userId)=>{
    const user = await User.findOne({ _id: userId, 
        isDeleted: false });
    if (!user) {    
        throw new Error('User not found');
    }
    if(user.role==='manager' || user.role==='hr'){
        throw new Error('Cannot delete manager or HR');
    }
    user.isDeleted = true;
    user.leavingDate=new Date();
    await user.save();
    try{
        await delAsync(`user:${userId}`);
    }catch(error){
        throw new Error(`Error deleting user: ${error.message   }`);
    }
    return true;
};

const getAllEmployees=async(currentUserId,options)=>{
    const {page=1,limit=9,search='',sortBy='createdAt',order='desc'}=options;
    
    const cacheKey =`employees:${page}:${limit}:${search}:${sortBy}:${order}`;
    
    const cachedData=await getAsync(cacheKey);
    if(cachedData){
        console.log('Cached data::',cachedData);
        return JSON.parse(cachedData);
    }

    console.log('No cached data::');
    const pageNum=parseInt(page);
    const limitNum=parseInt(limit);
    const skip=(pageNum-1)*limitNum;

    let matchStage={_id:{$ne:currentUserId}};

    if(search){
        matchStage.$or=[
            {name:{$regex:search, $options:'i'}},
            {email:{$regex:search, $options:'i'}}
        ]
    }

    console.log(JSON.stringify(matchStage));

    let sortObj={};
    if(sortBy){
        sortObj[sortBy] = order === 'asc' ? 1 : -1;
    }
    try{
        const pipeline=[
            {$match:matchStage},{
                $lookup:{
                    from:'employees',
                    let:{userId:'$_id'},
                    pipeline:[
                        {
                            $match:{
                                $expr:{
                                    $eq:['$$userId','$userId']
                                }
                            }
                        }
                    ],
                    as:'employeeDetails'
                }
            },
            {$project:{password:0}},{$sort:sortObj},{
                $facet:{
                    data:[
                        {$skip:skip},
                        {$limit:limitNum}
                    ],
                    totalCount:[
                        {$count:'total'}
                    ]
                }
            }
        ];
        const result=await User.aggregate(pipeline);
        const employees=result[0].data;
        const totalEmployees = result[0].totalCount[0]?.total || 0;
        const totalPages = Math.ceil(totalEmployees / limitNum);
        const hasNext = pageNum < totalPages;
        const hasPrev = pageNum > 1;

        const response= {
        employees,
        pagination:{
            currentPage: pageNum,
            totalPages,
            totalEmployees,
            hasNext,
            hasPrev,
            limit: limitNum
        }
    };

    await setExAsync(cacheKey,300,JSON.stringify(response));
    console.log('Cached data');
    return response;
    }catch(error){
        throw new Error(`Error fetching employees: ${error.message}`);
    }
}

const getLoggedInUserData = async (userId) => {
    const cacheKey =`user:${userId}`;
    try{
        const cachedData=await getAsync(cacheKey);
        if(cachedData){
            return JSON.parse(cachedData);
        }
        const user = await User.findById(userId).select('-password');
        if (!user) {
            throw new Error('User not found');
        }

        let response;
        if (user.role === 'employee') {
            const employeeDetails = await Employee.findOne({ userId });
            response= { ...user.toObject(), employeeDetails: [employeeDetails] };
        }else{
            response= user.toObject();
        }

        await setExAsync(cacheKey,600,JSON.stringify(response));
        console.log('Cached data');
        return response;
        }catch(error){
            throw new Error(`Error fetching logged in user data: ${error.message}`);
        }
};

module.exports={updateEmployeeRole,deleteUser,getAllEmployees,getLoggedInUserData};