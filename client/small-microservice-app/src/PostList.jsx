import React, { useState, useEffect} from "react";
import axios from "axios";
import CommentCreate from "./commentCreate";
const PostList = () => {
  const [posts, setPosts] = useState([]);
  // Simple page reload function
  const handleRefresh = () => {
    window.location.reload();
  };
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/get");
        setPosts(data);
      } catch (e) {
        console.error(e.message);
      }
    };
    fetchPosts();
  }, []);
  const renderedPosts = Object.values(posts).map((post) => (
            <div key={post.id} className="px-4 py-5 sm:px-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">Created a new post !</h2>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Post Id
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {post.id}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {post.name}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Title</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {post.title}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Body</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {post.body}
                    </dd>
                  </div>
                </dl>
              </div>
              <div><CommentCreate postId={post.id} /></div>
            </div>
          )
  );
  return (
    <div className="bg-white max-w-xl shadow overflow-hidden sm:rounded-lg">
      <div>
        <button
          onClick={handleRefresh}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Refresh Page
        </button>
      </div>
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          User Posts
        </h3>
        {renderedPosts ?? <p>No posts found</p>}
      </div>
    </div>
  );
};

export default PostList;
