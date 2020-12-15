import React, { useState } from "react";
import { dbService, storageService } from "../fBase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const FbPost = ({ fbPostObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newPost, setNewPost] = useState(fbPostObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("delete this?");
    if (ok) {
      await dbService.doc(`fbPosts/${fbPostObj.id}`).delete();
      await storageService.refFromURL(fbPostObj.attachmentUrl).delete();
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
    <div className="fbPost">
      {editing && isOwner ? (
        <>
          <form onSubmit={onSubmit} className="container fbPostEdit">
            <input
              onChange={onChange}
              type="text"
              placeholder="Revise your mind"
              value={newPost}
              required
              autoFocus
              className="formInput"
            />
            <input type="submit" value="Edit" className="formBtn" />
          </form>
          <button onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </button>
        </>
      ) : (
        <>
          <h4>{fbPostObj.text}</h4>
          {fbPostObj.attachmentUrl ? (
            <img src={fbPostObj.attachmentUrl} alt="photoPost" />
          ) : null}
          {isOwner ? (
            <>
              <div className="fbPost__actions">
                <span onClick={onDeleteClick}>
                  <FontAwesomeIcon icon={faTrash} />
                </span>
                <span onClick={toggleEditing}>
                  <FontAwesomeIcon icon={faPencilAlt} />
                </span>
              </div>
            </>
          ) : null}
        </>
      )}
    </div>
  );
};

export default FbPost;
