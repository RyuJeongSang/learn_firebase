import React, { useEffect, useState } from "react";
import { dbService } from "../fBase";

const Home = () => {
  const [fbPost, setFbPost] = useState("");
  const [fbPosts, setFbPosts] = useState([]);
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.collection("fbPosts").add({
      fbPost,
      createdAt: Date.now(),
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
    <span>
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
    </span>
  );
};

export default Home;
