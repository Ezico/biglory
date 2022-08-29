import "./NewPost.scss";
// import Sidebar from "../../components/sidebar/Sidebar";
// import Navbar from "../../components/navbar/Navbar";
// import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
// import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { useState } from "react";

// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const NewPost = ({ inputs }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [embedLink, setEmbedLink] = useState("");

  const handleAddPost = async (e) => {
    e.preventDefault();
    try {
      const res = await addDoc(collection(db, "Videos"), {
        Title: title,
        Featured: isFeatured,
        Embeded: embedLink,
        timeStamp: serverTimestamp(),
      });
      console.log(res);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="inner">
      <div className="form-wrapper">
        <h1>
          <center>Add New Video Post</center>
        </h1>
        <form className="form">
          <label htmlFor="title">Video Title</label>
          <input
            onChange={(e) => setTitle(e.target.value)}
            id="title"
            type="text"
            className="title"
          />
          <label htmlFor="emb-link">Video embed Link</label>
          <textarea
            onChange={(e) => setEmbedLink(e.target.value)}
            id="emb-link"
            type="textarea"
            className="textarea"
          />
          <label htmlFor="featured">Featured</label>
          <select
            name="featured"
            id="featured"
            onChange={(e) => setIsFeatured(e.target.value)}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
          <input onClick={handleAddPost} type="submit" value="Submit" />
        </form>
      </div>
    </div>
  );
};

export default NewPost;
