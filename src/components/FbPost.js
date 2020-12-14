import React, { useState } from "react";
import { dbService } from "../fBase";

const FbPost = ({ fbPostObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newPost, setNewPost] = useState(fbPostObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("delete this?");
    if (ok) {
      await dbService.doc(`fbPosts/${fbPostObj.id}`).delete();
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`fbPosts/${fbPostObj.id}`).update({
      text: newPost,
    });
    setEditing(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewPost(value);
  };
  return (
    <div key={fbPostObj.id}>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              onChange={onChange}
              type="text"
              placeholder="Revise your mind"
              value={newPost}
              required
            />
            <input type="submit" value="Edit" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{fbPostObj.text}</h4>
          {isOwner ? (
            <>
              <button onClick={onDeleteClick}>Delete</button>
              <button onClick={toggleEditing}>Edit</button>
            </>
          ) : null}
        </>
      )}
    </div>
  );
};

export default FbPost;
