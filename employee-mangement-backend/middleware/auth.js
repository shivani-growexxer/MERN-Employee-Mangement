const User=require('../model/User');
const { verifyToken } = require('../util/jwt');
const {getAsync,setExAsync}=require('../redis');

const authenticateToken=async(req,res,next)=>{
    try{
    const token=req.headers.authorization;
    console.log("token:",token);
    if(!token){
        return res.status(401).json({message:'Unauthorized'});
    }
    console.log("12::",token)
    const isBlacklisted = await getAsync(`blacklist:${token}`);
    console.log("13::",isBlacklisted)
    if (isBlacklisted) {
      console.log("14::",isBlacklisted)
      return res.status(401).json({ message: 'Token has been revoked' });
    }
    const decoded=await verifyToken(token);
    console.log("decode:",decoded);

    const cachedUser=await getAsync(`user:${decoded.userId}`);
    let user;

    if(cachedUser){
        user=JSON.parse(cachedUser);
        console.log('User retrieved from Redis cache');
    }else{
        user=await User.findById(decoded.userId);
        if (user) {
          // Cache user data for 10 minutes
          await setExAsync(`user:${decoded.userId}`, 600, JSON.stringify(user));
          console.log('User data cached in Redis');
        }
    }

    if(!user){
        return res.status(401).json({ 
            message: 'Invalid token - user not found',
            error: 'INVALID_TOKEN'
        });
    }
    req.user=user;
    next();
  }catch(error){
    return res.status(500).json({ 
        message: 'Authentication error',
        error: 'AUTH_ERROR'
      });
}
}

const authorizeRole=(allowedRoles)=>{
    return (req, res, next) => {
        if (!req.user) {
          console.log("Authentication required");
          return res.status(401).json({ 
            message: 'Authentication required',
            error: 'NOT_AUTHENTICATED'
          });
        }
    
        if (!allowedRoles.includes(req.user.role)) {
          return res.status(403).json({ 
            message: `Access denied. Required roles: ${allowedRoles.join(', ')}. Your role: ${req.user.role}`,
            error: 'INSUFFICIENT_PERMISSIONS'
          });
        }
        next();
      };
}

module.exports={
    authenticateToken,
    authorizeRole
}