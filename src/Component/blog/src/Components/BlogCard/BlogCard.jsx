import React from "react";
import "./BlogCard.css";

function BlogCard({ post }) {
  return (
    <div className="blog-card">
      <img src={post.imageUrl} alt={post.title} />
      <div className="blog-card-content">
        <div className="blog-card-meta">
          <span>{post.date}</span>
          <span>{post.category}</span>
        </div>
        <h3>{post.title}</h3>
        <div className="blog-card-excerpt">
          <p>{post.excerpt}</p>
        </div>
        <a href="#" className="blog-card-link">Read More</a>
      </div>
    </div>
  );
}

export default BlogCard;