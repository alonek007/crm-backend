require('dotenv').config()

const express = require('express')
const bcrypt = require('bcrypt')
const pool = require('./db/db.js')
const app = express();
port = process.env.PORT
const z = require('zod')
const jwt = require("jsonwebtoken")
const auth = require('./middleware/auth.js')
const cors = require("cors")





app.use(cors())
app.use(express.json());





// zod schema 


const zodSchema = z.object({

name: z.string().trim().min(1, "Name is required"),
email: z.string().email("Invalid email address"),
password: z.string().min(6, "Password must be at least 6 characters"),

})


const loginSchema = z.object({
    email: z.string().trim().min(1,"Name is required"),
    password: z.string().min(6, "Password must be at least 6 characters")
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



















app.post('/login', async function(req, res) {

    const validatelogin = loginSchema.safeParse(req.body)



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



app.get("/me", auth, function(req, res) {
    res.json({
        user: req.user
    });
});





app.post("/leads",auth, async function(req,res,next){




const insertQuery = 'INSERT INTO leads (name, email, phone, user_id) Values($1, $2, $3, $4) RETURNING * ;'

const values = [req.body.name, req.body.email, req.body.phone, req.user.userId]
const result = await pool.query(insertQuery, values);
res.send(result.rows[0])





})




app.get("/leads", auth, async function(req, res, next){
    const ud = req.user.userId;
    const result = await pool.query('SELECT * from leads WHERE user_id = $1 ', [ud] )
    res.send(result.rows);

})


app.put("/leads/:id",auth, async function(req,res,next) {
    const result = await pool.query(" UPDATE leads SET name = $1, email = $2,phone = $3,status = $4 WHERE id = $5 RETURNING *;", [req.body.name,req.body.email, req.body.phone, req.body.status, req.params.id])
    res.json({
        message: "lead updated",
        lead: result.rows[0]
    })
})

app.delete("/leads/:id", auth, async function(req, res, next){
    const result = await pool.query(
    "DELETE FROM leads WHERE id = $1 RETURNING *",
    [req.params.id])

    res.json({
    message: "Lead deleted",
    lead: result.rows[0]
});
});


app.listen(port, function() { 
    console.log(`connected ${port}`)
});

