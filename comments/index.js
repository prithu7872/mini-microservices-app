import express from "express";
import bodyParser from "body-parser";
import fs from "fs/promises";
import path from "path";
import cors from "cors";

const app = express();
const filePath = path.resolve("./Files/commentsStorage.json");

app.use(bodyParser.json());
app.use(cors());

async function _verifyFile() {
  try {
    await fs.access(filePath);
    const data = await fs.readFile(filePath, "utf-8");
    if (data === "") await fs.writeFile(filePath, JSON.stringify({}));
  } catch (e) {
    // If the file doesn't exist, create it with an empty object
    console.log("File doesn't exist, creating it...");
    // Ensure the directory exists
    const directory = path.dirname(filePath);
    await fs.mkdir(directory, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify({}));
  }
}

async function _readCommentsByPostId(postId) {
  await _verifyFile();
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const comments = JSON.parse(data);
    return comments[postId] || [];
  } catch (e) {
    console.error("Error reading file:", e);
    throw e;
  }
}

async function _writeCommentsByPostId({ postId, commentId, name, comment }) {
  await _verifyFile();
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const comments = JSON.parse(data);
    const postComments = comments[postId] || [];
    postComments.push({ commentId, name, comment });
    comments[postId] = postComments;
    await fs.writeFile(filePath, JSON.stringify(comments, null, 2));
    return { commentId, comment };
  } catch (e) {
    console.error("Error writing file:", e);
    throw e;
  }
}

app.get("/get/:id/comments", async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await _readCommentsByPostId(postId);
    res.json(comments);
  } catch (error) {
    console.error("Error getting comments:", error);
    res.status(500).send("Server error");
  }
});

app.post("/post/:id/comments", async (req, res) => {
  try {
    const postId = req.params.id; // Changed from postId to id to match route parameter
    const commentId = crypto.randomUUID();
    const { name, comment } = req.body;
    console.log({ " name ": name, " comment ": comment });
    if (!comment) {
      return res.status(400).send("Comment is required");
    }
    const result = await _writeCommentsByPostId({
      postId,
      commentId,
      name,
      comment,
    });
    console.log(result);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error posting comment:", error);
    res.status(500).send("Server error");
  }
});

app.listen(4000, () => {
  console.log("listening on port 4000");
});
