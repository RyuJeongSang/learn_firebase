import React, { useEffect, useState } from "react";
import { dbService } from "../fBase";
import FbPost from "components/FbPost";
import PostFactory from "../components/PostFactory";

const Home = ({ userObj }) => {
  const [fbPosts, setFbPosts] = useState([]);

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

  return (
    <div className="container">
      <PostFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
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
