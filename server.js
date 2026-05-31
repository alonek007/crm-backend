const express = require('express')
const bcrypt = require('bcrypt')
const pool = require('./db/db.js')
const app = express();
port = 3000
const z = require('zod')





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





















app.post('/login', async function(req, res) {
const {email, password} = req.body;
   const check = await pool.query("SELECT * FROM users WHERE email = $1 ", [email])

    if(check.rows.length > 0 ) {
        res.status(400).json({
            message: "already registered"
        })
    }
})
app.listen(port, function() { 
    console.log(`connected ${port}`)
});

