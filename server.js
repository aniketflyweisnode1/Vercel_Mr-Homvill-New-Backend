const express = require("express");
const http = require("http");
const connectDB = require('./src/config/database.js');
const cors = require('cors');
const routes = require('./src/routes/index.js');
const app = express();
const port = 3088
const server = http.createServer(app);
app.use(cors());
app.use(express.json());
connectDB();
app.use('/api', routes);
server.listen(port, async () => {
    console.log(`app is running on port`, port)
});