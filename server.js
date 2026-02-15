const connectDB = require('./src/database/db');
require('dotenv').config()
const PORT = process.env.PORT || 5000;   
// chage from 3000 to 5000

const app = require('./src/app');

connectDB();

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
