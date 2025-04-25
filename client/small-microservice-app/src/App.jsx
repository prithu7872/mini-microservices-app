import PostCreate from "./postCreate";
import React from "react";
import PostList from "./PostList";
function App() {

  return (
    <>
      <PostCreate />
      <hr className="w-full h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
      <PostList/>
    </>
  );
}

export default App;

