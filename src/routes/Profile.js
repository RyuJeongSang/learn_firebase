import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import FbPost from "components/FbPost";
import { authService, dbService } from "../fBase";

const Profile = ({ refreshUser, userObj }) => {
  const [fbPosts, setFbPosts] = useState([]);
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };
  useEffect(() => {
    dbService
      .collection("fbPosts")
      .where("creatorId", "==", userObj.uid)
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const fbPostArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFbPosts(fbPostArray);
      });
  }, []);
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          placeholder="Display Name"
          value={newDisplayName}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
      <div>
        {fbPosts.map((fbPost) => (
          <FbPost
            key={fbPost.id}
            fbPostObj={fbPost}
            isOwner={fbPost.creatorId === userObj.uid}
          />
        ))}
      </div>
    </>
  );
};

export default Profile;
