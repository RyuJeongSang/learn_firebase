import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "../fBase";

const PostFactory = ({ userObj }) => {
  const [fbPost, setFbPost] = useState("");
  const [attachment, setAttachment] = useState("");
  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const fbPostObj = {
      text: fbPost,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await dbService.collection("fbPosts").add(fbPostObj);
    setFbPost("");
    setAttachment("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setFbPost(value);
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    if (theFile) {
      reader.readAsDataURL(theFile);
    }
    if (!theFile) {
      setAttachment("");
    }
  };
  const onClearAttachmentClick = () => setAttachment("");
  return (
    <form onSubmit={onSubmit}>
      <input
        value={fbPost}
        onChange={onChange}
        type="text"
        placeholder="What's on your mind"
        maxLength={120}
        required
      />
      <input type="file" accept="image/*" onChange={onFileChange} />
      <input type="submit" value="Bring Out!" />
      {attachment ? (
        <div>
          <img src={attachment} width="50px" height="50px" alt="photos" />
          <button onClick={onClearAttachmentClick}>Clear</button>
        </div>
      ) : null}
    </form>
  );
};

export default PostFactory;
