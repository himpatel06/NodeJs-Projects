const jwt = require('jsonwebtoken');

const customer_auth = (req,res,next)=>{
    const token = req.header('authentication');

    if(!token)return res.status(401).json({ error: 'Access denied' });
    try {
        const decode = jwt.verify(token,'eVital');
        req.c_id = decode.c_id;
        req.name = decode.name;
        return next();
    }catch{
        return res.status(401).json({ error: 'Invalid Token' });
    }

}

const seller_auth = (req,res,next)=>{
    const token = req.header('authentication');

    if(!token)return res.status(401).json({ error: 'Access denied' });
    try {
        const decode = jwt.verify(token,'eVital');
        req.s_id = decode.s_id;
        req.name = decode.name;
        
        if(req.s_id)
        return next();
        else
        res.status(401).json({ error: 'Unauthorised user'});
    }catch{
        return res.status(401).json({ error: 'Invalid Tocken' });
    }

}
module.exports = {customer_auth,seller_auth};