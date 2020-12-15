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
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          onChange={onChange}
          type="text"
          autoFocus
          placeholder="Display Name"
          value={newDisplayName}
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{ marginTop: 10 }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
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

export default Profile;
