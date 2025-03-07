import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./BlogGrid.css";

function BlogGrid({ posts = [], activePage = 1 }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const postsPerPage = 6;
  const startIndex = (activePage - 1) * postsPerPage;

  // Đảm bảo posts là mảng hợp lệ
  const validPosts = Array.isArray(posts) ? posts : [];

  // Lọc bài viết theo danh mục
  const filteredPosts =
    selectedCategory === "All"
      ? validPosts
      : validPosts.filter((post) => post.category === selectedCategory);

  // Lấy danh mục từ bài viết
  const categories = ["All", ...new Set(validPosts.map((post) => post.category))];

  // Hàm loại bỏ thẻ HTML
  function stripHTML(htmlString) {
    return htmlString.replace(/<[^>]+>/g, "");
  }

  return (
    <div className="blog-grid-container">
      <div className="category-filter">
        <label>Filter by Category: </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="blog-grid">
        {filteredPosts.length > 0 ? (
          filteredPosts
            .slice(startIndex, startIndex + postsPerPage)
            .map((post) => (
              <div key={post.id} className="blog-card">
                <img src={post.image} alt={post.title} />
                <h3>{post.title}</h3>
                <p>{post.category}</p>

                {post.tags && (
                  <p className="blog-tags">
                    Tags:{" "}
                    {post.tags.split(",").map((tag) => (
                      <span key={tag} className="tag">
                        {tag.trim()}
                      </span>
                    ))}
                  </p>
                )}

                {/* Hiển thị excerpt: cắt 100 ký tự sau khi xóa thẻ HTML */}
                <p>
                  {post.content
                    ? stripHTML(post.content).slice(0, 100)
                    : "No content available"}
                  ...
                </p>

                {/* Điều hướng đến trang chi tiết */}
                <Link to={`/blog/${post.blogId}`} className="read-more">
                  Read More
                </Link>
              </div>
            ))
        ) : (
          <p>No posts found in this category.</p>
        )}
      </div>
    </div>
  );
}

export default BlogGrid;
