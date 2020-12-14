import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "../fBase";
import FbPost from "components/FbPost";

const Home = ({ userObj }) => {
  const [fbPost, setFbPost] = useState("");
  const [fbPosts, setFbPosts] = useState([]);
  const [attachment, setAttachment] = useState("");
  useEffect(() => {
    dbService
      .collection("fbPosts")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const fbPostArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFbPosts(fbPostArray);
      });
  }, []);
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
    <div>
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
      <div>
        {fbPosts.map((fbPost) => (
          <FbPost
            key={fbPost.id}
            fbPostObj={fbPost}
            isOwner={fbPost.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
