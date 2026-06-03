function auth(req,res,next) {
    const token = req.headers.authorization.split(" ")[1]

if (!token){
        return res.json({
            message: "no token provided"
})
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    }
    catch(err) {
        return res.json({
            message: "invalid token"
        })
    }
}
}


module.exports = auth