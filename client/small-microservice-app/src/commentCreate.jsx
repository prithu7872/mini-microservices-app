import React, { useState } from "react";
import axios from "axios";
import ListComments from "./commentList";
const CommentCreate = ({ postId }) => {
  const [form, setForm] = useState({ name: "", comment: "" });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      // Handle the submission logic here
      console.log("Comment submitted for post:", postId, form);
      const response = await axios.post(
        `http://localhost:4000/post/${postId}/comments`,
        form
      );
      console.log(response);
      setForm({ name: "", comment: "" });
    } catch (e) {
      console.error(e.message);
    }
  };
  return (
    <div >
      <form key={postId} className="space-y-4">
        <h3 className="mt-4 text-lg font-medium text-gray-700">
          Please leave a Comment
        </h3>
        <div className="bg-white px-4 py-5  sm:gap-4 sm:px-6">
          <label className="text-sm font-medium text-gray-500" htmlFor="name">
            Name :
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="block w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </label>
        </div>
        <div className="bg-gray-50 px-4 py-5  sm:gap-4 sm:px-6">
          <label
            className="text-sm font-medium text-gray-500"
            htmlFor="comment"
          >
            Comment Box :
            <textarea
              name="comment"
              value={form.comment}
              onChange={handleChange}
              placeholder="Write your Comment"
              className="block w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 h-32"
            />
          </label>
        </div>
        <div className="bg-white px-4 py-5 sm:gap-4 sm:px-6">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!form.name || !form.comment}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Comment!
          </button>
        </div>
      </form>
      <ListComments id={postId} />
    </div>
  );
};
export default CommentCreate;
