const jwt = require('jsonwebtoken');

const generateToken=(userId)=>{
    return jwt.sign({userId},process.env.SECRET_KEY,{expiresIn:'1h'});
}

const verifyToken=(token)=>{
    return jwt.verify(token,process.env.SECRET_KEY);
}

module.exports={
    generateToken,
    verifyToken
}