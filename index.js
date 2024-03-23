const express = require('express');
const blogRouter = require('./routes/blogs.route');
const cors = require('cors');
var cron = require('node-cron');


const PORT = process.env.PORT || 3001;
const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use("/blogs", blogRouter);



app.get('/', (req, res) => {
    res.send("WORKING")
})

app.listen(PORT, () => {
    console.log("Server started at port", PORT);
})


