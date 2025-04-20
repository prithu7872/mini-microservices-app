import express from "express";
import bodyParser from "body-parser";
const app = express();
import PostStore from "./interface/Posts-Store/postStore.js";
const filePath = "./Files/postsStorage.json";
app.use(bodyParser.json());
app.get("/get", (req, res) => {
  const getStore = new PostStore(filePath);
  getStore._readFile().then((data) => {
    res.send(data);
  });
});
app.post("/post", (req, res) => {
  const uuid = crypto.randomUUID();
  var response;
  try {
    const { name, title, body } = req.body;
    try {
      const prdStore = new PostStore(filePath);
      response = prdStore.createPost({ name, title, body, uuid });
      res.status(201).send(response);
    } catch (e) {
      res.status(400).send(response);
    }
  } catch (e) {
    res.status(400).send("Invalid req body");
  }
});
app.listen(3000, () => {
  console.log("listening on port 3000");
});
