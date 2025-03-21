import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./BlogDetail.css";
import NavBar from "../../HomePage/NavBar/NavBar"; // Adjust the import path as needed
import Footer from "../../HomePage/Footer/Footer"; // Adjust the import path as needed

function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:5200/api/Blog/${id}`);
        if (response.data.success) {
          setBlog(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải blog:", error);
      }
    };

    fetchBlogDetail();
  }, [id]);

  if (!blog) return <h2 className="loading-message">Loading...</h2>;

  return (
    <>
      <NavBar />
      <div className="blog-detail">
        <h1 className="blog-title">{blog.title}</h1>
        <p className="blog-category"><strong>Category:</strong> {blog.category}</p>
        <img className="blog-image" src={blog.image} alt={blog.title} />

        {/* Render nội dung bài viết với HTML */}
        <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>
      <Footer />
    </>
  );
}

export default BlogDetail;
