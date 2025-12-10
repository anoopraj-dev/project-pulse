
export const authorizeRoles = (...allowedRoles) =>{
    return (req,res,next) => {
        if(!allowedRoles.includes(req.user.role)){
            console.log('no authorized roles')
            return res.status(403).json({
                success:false,
                message:'Access Denied! '
            })
        }

        next();
    }
}