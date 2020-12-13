import React, { useEffect, useState } from "react";
import { dbService } from "../fBase";

const Home = ({ userObj }) => {
  const [fbPost, setFbPost] = useState("");
  const [fbPosts, setFbPosts] = useState([]);

  useEffect(() => {
    dbService.collection("fbPosts").onSnapshot((snapshot) => {
      const fbPostArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFbPosts(fbPostArray);
    });
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.collection("fbPosts").add({
      text: fbPost,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    });
    setFbPost("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setFbPost(value);
  };
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
        <input type="submit" value="Bring Out!" />
      </form>
      <div>
        {fbPosts.map((fbPost) => (
          <div key={fbPost.id}>
            <h4>{fbPost.text}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
