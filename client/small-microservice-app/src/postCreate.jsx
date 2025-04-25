import React, { useState } from "react";
import axios from "axios";

const PostCreate = () => {
  const [form, setForm] = useState({ name: "", title: "", body: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await axios.post("http://localhost:3000/post", form);
      setForm({ name: "", title: "", body: "" });
    } catch (e) {
      prompt(e);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">Create a Post</h2>
      <form key="formCreate" className="space-y-4" onSubmit={handleSubmit}>
        <label className="mb-2 text-gray-700" htmlFor="name">
          Name:
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="block w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </label>
        <label className="mb-2 text-gray-700" htmlFor="title">
          Title:
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Post Title"
            className="block w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </label>
        <label className="mb-2 text-gray-700" htmlFor="body">
          Body:
          <textarea
            name="body"
            value={form.body}
            onChange={handleChange}
            placeholder="Write your post"
            className="block w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 h-32"
          />
        </label>
        <button
          type="submit"
          disabled={!form.name || !form.title || !form.body}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default PostCreate;
