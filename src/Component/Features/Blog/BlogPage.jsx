import React, { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import BlogGrid from "./BlogGrid";
import BlogDetail from "./BlogDetail";
import Navbar from "../../HomePage/NavBar/NavBar";
import Footer from "../../HomePage/Footer/Footer";

function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5200/api/Blog/get-all")
      .then((response) => {
        console.log("Fetched Blog Data:", response.data);
        // Safely access data and $values, then filter for Active posts only
        const fetchedPosts = response.data?.data?.$values || response.data?.data || [];
        const activePosts = fetchedPosts.filter((post) => post.status === "Active");
        setPosts(activePosts);
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
      <Navbar isLoggedIn={true} />
      <Routes>
        <Route path="/" element={<BlogGrid posts={posts} />} />
        <Route path="/blog/:id" element={<BlogDetail posts={posts} />} />
      </Routes>
      <Footer />
    </>
  );
}

export default BlogPage;