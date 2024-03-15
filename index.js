const express = require('express');
const blogRouter = require('./routes/blogs.route');
const cors = require('cors');

const PORT = process.env.PORT || 3001;
const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use("/blogs", blogRouter);


app.listen(PORT, () => {
    console.log("Server started at port", PORT);
})