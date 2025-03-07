import React from "react";
import { Link } from "react-router-dom";
import "./BlogCard.css";

function BlogCard({ post }) {
  return (
    <div className="blog-card">
      <img 
        src={post.image || "/default-thumbnail.jpg"} 
        alt={post.title} 
      />
      <div className="blog-card-content">
        <div className="blog-card-meta">
          <span>{post.category || "Uncategorized"}</span>
        </div>
        <h3>{post.title}</h3>
        <div className="blog-card-excerpt">
          <p>{post.content ? post.content.slice(0, 100) + "..." : "No content available"}</p>
        </div>
        {post.tags && (
          <div className="blog-card-tags">
            {post.tags.split(",").map((tag, index) => (
              <span key={index} className="tag">{tag.trim()}</span>
            ))}
          </div>
        )}
        {/* Dùng Link để điều hướng đến chi tiết bài viết */}
        <Link to={`/blog/${post.blogId}`} className="blog-card-link">
          Read More
        </Link>
      </div>
    </div>
  );
}

export default BlogCard;
