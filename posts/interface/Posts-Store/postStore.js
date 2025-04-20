import fs from "fs/promises";
import path from "path";

class PostStore {
  constructor(filepath) {
    this.filepath = path.resolve(filepath);
  }

  async _verifyFile() {
    try {
      await fs.access(this.filepath);
    } catch (e) {
      // If the file doesn't exist, create it with an empty object
      await fs.writeFile(this.filepath, JSON.stringify({}));
    }
  }

  async _readFile() {
    await this._verifyFile();
    try {
      const data = await fs.readFile(this.filepath, "utf-8");
      return JSON.parse(data);
    } catch (e) {
      console.error("Error reading file:", e);
      return {};
    }
  }

  async _writeFile(data) {
    await this._verifyFile();
    try {
      await fs.writeFile(this.filepath, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error("Error writing file:", e);
      throw e;
    }
  }

  async createPost(post) {
    await this._verifyFile();
    try {
      const posts = await this._readFile();
      const { uuid, ...rest } = post;
      posts[uuid] = {
        ...rest,
        createdAt: new Date().toISOString(),
      };
      await this._writeFile(posts);
      console.log("Post created successfully!");
    } catch (e) {
      console.error("Failed to create post:", e);
      throw e;
    }
  }
}

export default PostStore;
