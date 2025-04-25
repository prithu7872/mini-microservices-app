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
      // Create the file with an empty object  
      await fs.writeFile(this.filepath, JSON.stringify({}));  
    }  
  }  

  async _readFile() {  
    await this._verifyFile();  
    try {  
      const data = await fs.readFile(this.filepath, "utf-8");  
      // If the file is empty, return an empty object  
      if (!data.trim()) {  
        return {};  
      }  
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
      // Read the existing posts as an object  
      const posts = await this._readFile();  
      
      const { uuid, ...rest } = post;  
      
      // Add the new post to the posts object  
      posts[uuid] = {  
        ...rest,  
        createdAt: new Date().toISOString(),  
      };  

      // Write the updated posts back to the file  
      await this._writeFile(posts);  
      
      console.log("Post created successfully!", uuid);  
      return { uuid, ...rest };  
    } catch (e) {  
      console.error("Failed to create post:", e);  
      throw e;  
    }  
  }  

  // Optional: method to get all posts with their IDs  
  async getAllPosts() {  
    const posts = await this._readFile();  
    return Object.entries(posts).map(([id, post]) => ({  
      id,  
      ...post  
    }));  
  }  
}  

export default PostStore;  