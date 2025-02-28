import React from "react";
import BlogCard from "../BlogCard/BlogCard"; // Đường dẫn tương đối chính xác
import "./BlogGrid.css";
import { Link } from "react-router-dom";

function BlogGrid({ posts, activePage }) {
  const postsPerPage = 6; // Số bài viết hiển thị trên mỗi trang
  const startIndex = (activePage - 1) * postsPerPage;
  const displayedPosts = posts.slice(startIndex, startIndex + postsPerPage);

  return (
    <div className="blog-grid">
      {displayedPosts.map((post) => (
        <div key={post.id} className="blog-card">
          <img src={post.imageUrl} alt={post.title} />
          <h3>{post.title}</h3>
          <p>{post.date} - {post.category}</p>
          <p>{post.excerpt}</p>
          <Link to={`/blog/${post.id}`} className="read-more">Read More</Link>
        </div>
      ))}
    </div>
  );
}

export default BlogGrid;