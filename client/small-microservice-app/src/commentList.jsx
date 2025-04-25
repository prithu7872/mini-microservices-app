import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";

const fetchComments = async (id) =>
  (await axios.get(`http://localhost:4000/get/${id}/comments`)).data;

const ListComments = ({ id }) => {
  const [comments, setComments] = useState([]);
  const [count , setCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchComments(id);
        setComments(data);
        setCount((count)=>count+1);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id]);

  const renderedComments = Object.values(comments).map((comment) => (
            <div key={comment.commentId} className="border-b border-gray-200 flex items-center space-x-0.5">
              <dl className="px-4 py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Comment Id
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {comment.commentId}
                </dd>
              </dl>
              <dl className="px-4 py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {comment.name}
                </dd>
              </dl>
              <dl className="px-4 py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Body</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {comment.comment}
                </dd>
              </dl>
            </div>
          )
  );

  return (
    <div className="bg-white max-w-xl shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          User Comments
        </h3>
        {renderedComments ?? <p>No Comments found</p>}
      </div>
    </div>
  );
};

export default ListComments;
