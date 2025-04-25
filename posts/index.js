import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";
import crypto from "crypto";
const app = express();
import PostStore from "./interface/Posts-Store/postStore.js";
const filePath = "./Files/postsStorage.json";
app.use(bodyParser.json());
app.use(cors());
app.get("/get", (req, res) => {
  const getStore = new PostStore(filePath);
  getStore.getAllPosts().then((data) => {
    res.send(data);
  });
});
app.post("/post", async (req, res) => {
  try {
    const { name, title, body } = req.body;

    // Validate request body
    if (!name || !title || !body) {
      return res.status(400).send({
        error: "Missing required fields: name, title, and body are required",
      });
    }

    const uuid = crypto.randomUUID();

    // First create the post locally
    const prdStore = new PostStore(filePath);
    const localResponse = await prdStore.createPost({
      name,
      title,
      body,
      uuid,
    });

    if (!localResponse) {
      return res.status(500).send({ error: "Failed to create post locally" });
    }

    // Then emit the event
    try {
      const eventResponse = await axios.post("http://localhost:4005/events", {
        type: "PostCreated",
        data: { uuid, name, title, body },
      });

      // Check if event was successfully emitted
      if (eventResponse.status !== 200 && eventResponse.status !== 201) {
        console.error(
          "Event bus responded with unexpected status:",
          eventResponse.status
        );
        return res.status(500).send({ error: "Failed to emit event" });
      }
      const result = {
        post: localResponse,
        event: eventResponse.data,
      };

      // Return both local and event responses
      res.status(201).send(result);
      console.log("Event emitted successfully  ", result);
    } catch (eventError) {
      console.error("Error emitting event:", eventError);
      // Even if event emission fails, we still return the created post
      res.status(201).send({
        post: localResponse,
        eventError: "Failed to emit event",
      });
    }
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(400).send({ error: "Failed to create post" });
  }
});
app.listen(3000, () => {
  console.log("listening on port 3000");
});
