const { Router } = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

const blogRouter = Router();

const MONGO_URL = `mongodb+srv://inhallupdatebackup:ZcTL0dObZBxSuCP1@cluster0.sooi3mv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

let client = new MongoClient(MONGO_URL, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

client.connect().then(connectedClient => {
    console.log("Connected");
    client = connectedClient;
}).catch(err => {
    console.log(err)
})


blogRouter.get('/fetch-categories', async (req, res) => {
    try {
        const categories = await client.db("INHALL_OFFICIAL_WEBSITE").collection("CATEGORIES").find({}).toArray();
        res.json(categories)
    } catch (err) {
        throw (err)
    }
})

blogRouter.get("/get-latest-blogs", async (req, res) => {
    try {
        const latestBlog = await client.db("BLOGS").collection("SNIPPET_ALL").find().sort({ date: 1 }).toArray();
        res.json(latestBlog);
    } catch (err) {
        throw (err)
    }
})

blogRouter.get('/blog-by-category', async (req, res) => {
    try {
        const { category } = req.query;
        const categoryBlogs = await client.db("BLOGS").collection(`SNIPPET_${category}`).find({}).toArray();
        res.json(categoryBlogs);
    } catch (err) {
        throw (err);
    }
})

blogRouter.get('/get-blog', async (req, res) => {
    const { slug } = req.query;
    try {
        const categoryBlogs = await client.db("BLOGS").collection(`ALL`).findOne({ slug });
        res.json(categoryBlogs);
    } catch (err) {
        throw err;
    }
})

blogRouter.post('/add-blog', async (req, res) => {
    const blog = req.body;
    const blogSnippet = { ...req.body, content: "" }
    try {
        await client.db("BLOGS").collection("ALL").insertOne(blog);
        await client.db("BLOGS").collection(req.body.category.toUpperCase()).insertOne(blog);
        await client.db("BLOGS").collection("SNIPPET_ALL").insertOne(blogSnippet);
        await client.db("BLOGS").collection(`SNIPPET_${req.body.category.toUpperCase()}`).insertOne(blogSnippet);
        res.send("Done");
    } catch (err) {
        throw (err)
    }
})

blogRouter.get('/get-more-blogs', async (req, res) => {
    try {
        const moreBlog = await client.db("BLOGS").collection("ALL").find().sort({ date: 1 }).limit(10).toArray();
        res.json(moreBlog);
    } catch (err) {
        throw (err);
    }
})

process.on('exit', async () => {
    await client.close()
})


module.exports = blogRouter;