const jwt = require("jsonwebtoken");
const User = require ("../models/user");

const auth = async (req,res,next) => {
    console.log('auth middlewere');
    try {
        const token = req.header("Authorization").replace("Bearer ","");
        const jwtSecret = "stringToEncodeJWT";
        const decoded = jwt.verify(token, jwtSecret );
        const user = await User.findOne({_id:decoded._id, "tokens.token":token});
        if(!user){
            throw new Error()
        }
        //Setting the user on the request for after next() user
        req.user = user;        
        req.token = token;
        next();
    } catch (error) {
        res.status(401).send({error:"Please authenticate"})
    }
};

module.exports = auth;
