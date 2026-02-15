const express = require('express');
const authRoutes = require('./routes/auth.routes');
const cookieParser = require('cookie-parser');
const musicRoutes = require('./routes/music.route');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3001", 
    credentials: true,
  }),
);


app.use('/api/auth',authRoutes); // because we have to add api/auth before the auth routes , so that we can access the auth routes with the prefix api/auth

app.use('/api/music',musicRoutes);

module.exports = app;


