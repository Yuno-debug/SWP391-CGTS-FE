import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./BlogDetail.css";

function BlogDetail({ posts }) {
  const { id } = useParams();
  const post = posts.find((p) => p.id === parseInt(id));

  // State lưu danh sách bình luận
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  if (!post) {
    return <h2 className="error-message">404 - Article does not exist!</h2>;
  }

  // Xử lý gửi bình luận
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() !== "") {
      setComments([...comments, newComment]); // Thêm bình luận vào danh sách
      setNewComment(""); // Xóa nội dung input sau khi gửi
    }
  };

  return (
    <div className="blog-detail">
      <img src={post.imageUrl} alt={post.title} className="blog-image" />
      <h1 className="blog-title">{post.title}</h1>
      <p className="blog-meta">📅 {post.date} | 🏷 {post.category}</p>
      <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />

      {/* Phần bình luận */}
      <div className="comments-section">
        <h3>💬 Bình luận</h3>
        {comments.length === 0 ? (
          <p className="no-comments">Chưa có bình luận nào.</p>
        ) : (
          <ul className="comment-list">
            {comments.map((comment, index) => (
              <li key={index} className="comment-item">{comment}</li>
            ))}
          </ul>
        )}

        {/* Form nhập bình luận */}
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Nhập bình luận của bạn..."
            className="comment-input"
          />
          <button type="submit" className="comment-button">Gửi</button>
        </form>
      </div>

      <button onClick={() => window.history.back()} className="back-button">← Back</button>
    </div>
  );
}

export default BlogDetail;
