require('dotenv').config()

const express = require('express')
const bcrypt = require('bcrypt')
const pool = require('./db/db.js')
const app = express();
port = process.env.PORT
const z = require('zod')
const jwt = require("jsonwebtoken")





app.use(express.json());





// zod schema 


const zodSchema = z.object({

name: z.string().trim().min(1, "Name is required"),
email: z.string().email("Invalid email address"),
password: z.string().min(6, "Password must be at least 6 characters"),

})










app.post("/register", async function(req, res) {
    try {


const validate = zodSchema.safeParse(req.body);

if(!validate.success) {
    return res.json({
        message: "randi ke bacche user "
    })
}




const hashedPassword = await bcrypt.hash(req.body.password, 10);
console.log(hashedPassword);
    //check email 

    const check = await pool.query("SELECT * FROM users WHERE email = $1 ", [req.body.email])

    if(check.rows.length > 0 ) {
        return res.status(400).json({
            message: "already registered"
        })
    }
    const insertQuery = 'INSERT INTO users(name, email,password ) Values($1, $2, $3)'
    const values = [req.body.name,req.body.email,hashedPassword];
    const result = await pool.query(insertQuery, values);
    res.status(201).json({
        message: "email and password saved "
    })
}







    catch(err) {
        console.error(err);
    }
})














ramp1301






app.post('/login', async function(req, res) {

    const validatelogin = zodSchema.safeParse(req.body)



    if (!validatelogin.success) {
    return res.json({
        message: "name and password err"
    }) 

    }
// check email 

const checkemail= await pool.query("SELECT * FROM users WHERE email = $1 ", [req.body.email])
if (checkemail.rows.length === 0 ) {
    return res.json({
        message: "not found "
    })
}
const user = checkemail.rows[0];

    const checkpass = await bcrypt.compare(req.body.password, user.password)
    if (!checkpass) {
        return res.json({
            message: "password not correct"
        })
    }

const payload = {
        userId: user.id
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })

    return res.send({ message: "login successful", token })




})


app.listen(port, function() { 
    console.log(`connected ${port}`)
});

