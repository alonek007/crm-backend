const {Pool} = require('pg')
const pool = new Pool({
    user: 'alonek007',
    password:'test',
    host: 'localhost',
    port: 5432,
    database: 'crm'
});


async function testC() {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log("Connected");
        console.log(result);
    }
    catch(err) {
        console.log('connection failed');
        console.log(err);
    }
}

testC();
module.exports = pool