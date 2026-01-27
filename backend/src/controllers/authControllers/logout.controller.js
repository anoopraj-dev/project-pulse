
export const userLogout = async (req,res) =>{

    
    
    res.clearCookie('token',{
        httpOnly: true,
        sameSite: 'strict'
    });

    return res.status(200).json({success: true, message: 'Logged out successfully!'})
}
