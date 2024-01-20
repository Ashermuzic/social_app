import React, { useState } from "react";
import "./update.scss";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Update = ({ setOpenUpdate, user }) => {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);

  const [texts, setTexts] = useState({
    name: "city",
    city: "",
    website: "",
  });

  const handleChange = (e) => {
    setTexts((prev) => ({
      ...prev,
      [e.target.name]: [e.target.value],
    }));
  };

  const upload = async (file) => {
    try {
      // cant directly send file , we need a form data
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (user) => {
      return makeRequest.put("/users", user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
    },
  });

  const handelClick = async (e) => {
    e.preventDefault();
    let coverUrl;
    let profileUrl;

    coverUrl = cover ? await upload(cover) : user.coverPic;
    profileUrl = profile ? await upload(profile) : user.profilePic;

    mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl });
    setOpenUpdate(false);
  };

  return (
    <div className="update">
      update
      <div className="wrapper">
        <form action="">
          <input type="file" onChange={(e) => setCover(e.target.files[0])} />
          <input type="file" onChange={(e) => setProfile(e.target.files[0])} />
          <input type="text" name="name" onChange={handleChange} />
          <input type="text" name="city" onChange={handleChange} />
          <input type="text" name="website" onChange={handleChange} />
          <button onClick={handelClick}>Update</button>
        </form>
      </div>
      <button onClick={() => setOpenUpdate(false)}>X</button>
    </div>
  );
};

export default Update;
