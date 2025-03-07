import React, { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import BlogGrid from "./BlogGrid";
import BlogDetail from "./BlogDetail";
import Navbar from "../../MemPage/NavBarLogin";
import Footer from "../../HomePage/Footer/Footer";

function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  axios.get("http://localhost:5200/api/Blog/get-all")
    .then((response) => {
      console.log("Fetched Blog Data:", response.data); // Kiểm tra log
      setPosts(response.data.data?.$values || []); // Lấy danh sách bài viết từ $values
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching blog posts:", error);
      setLoading(false);
    });
}, []);


  if (loading) return <h2>Loading...</h2>;

  return (
    <>
    <Navbar/>
    <Routes>
      <Route path="/" element={<BlogGrid posts={posts} />} />
      <Route path="/:id" element={<BlogDetail posts={posts} />} />
    </Routes>
    <Footer/>
    </>
  );
}

export default BlogPage;
