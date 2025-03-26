import React, { useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../Pagination";
import "./BlogGrid.css";

function BlogGrid({ posts = [], activePage = 1 }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(activePage);

  const postsPerPage = 6;
  const startIndex = (currentPage - 1) * postsPerPage;

  const validPosts = Array.isArray(posts) ? posts : [];

  const filteredPosts =
    selectedCategory === "All"
      ? validPosts
      : validPosts.filter((post) => post.category === selectedCategory);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const categories = ["All", ...new Set(validPosts.map((post) => post.category))];

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
              <Link key={post.id} to={`/blog/${post.blogId}`} className="blog-card">
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

                <p>
                  {post.content
                    ? stripHTML(post.content).slice(0, 100)
                    : "No content available"}
                  ...
                </p>
              </Link>
            ))
        ) : (
          <p>No posts found in this category.</p>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          activePage={currentPage}
          setActivePage={setCurrentPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}

export default BlogGrid;