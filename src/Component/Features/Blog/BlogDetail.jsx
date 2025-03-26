import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./BlogDetail.css";
import NavBar from "../../HomePage/NavBar/NavBar";
import Footer from "../../HomePage/Footer/Footer";

function BlogDetail({ posts = [] }) {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [prevPost, setPrevPost] = useState(null);
  const [nextPost, setNextPost] = useState(null);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        // Lấy chi tiết bài blog hiện tại
        const blogResponse = await axios.get(`http://localhost:5200/api/Blog/${id}`);
        if (blogResponse.data.success) {
          const blogData = blogResponse.data.data;
          setBlog(blogData);

          // Tính thời gian đọc
          const wordCount = stripHTML(blogData.content).split(/\s+/).length;
          const time = Math.ceil(wordCount / 200);
          setReadingTime(time);

          // Lấy tất cả bài blog từ API
          const allPostsResponse = await axios.get(`http://localhost:5200/api/Blog/get-all`);
          if (allPostsResponse.data.success) {
            // Truy cập vào $values để lấy mảng bài blog
            const allPosts = allPostsResponse.data.data.$values || allPostsResponse.data.data;
            console.log("Tất cả bài blog:", allPosts);
            console.log("Danh mục bài hiện tại:", blogData.category);

            // Lọc bài cùng danh mục (trừ bài hiện tại)
            if (Array.isArray(allPosts) && blogData.category) {
              const related = allPosts.filter((post) => {
                const isSameCategory =
                  post.category &&
                  blogData.category &&
                  post.category.trim().toLowerCase() === blogData.category.trim().toLowerCase();
                const isNotCurrentPost = post.blogId.toString() !== id.toString();
                console.log(`Bài: ${post.title}, Danh mục: ${post.category}, Khớp: ${isSameCategory}`);
                return isSameCategory && isNotCurrentPost;
              });
              console.log("Bài liên quan:", related);
              setRelatedPosts(related);
            } else {
              console.log("Không có bài hoặc danh mục để lọc");
              setRelatedPosts([]);
            }

            // Cài đặt bài trước và bài sau
            if (Array.isArray(allPosts)) {
              const currentIndex = allPosts.findIndex((post) => post.blogId.toString() === id.toString());
              setPrevPost(currentIndex > 0 ? allPosts[currentIndex - 1] : null);
              setNextPost(currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null);
            }
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setRelatedPosts([]);
      }
    };

    fetchBlogDetail();
  }, [id]);

  function stripHTML(htmlString) {
    return htmlString.replace(/<[^>]+>/g, "");
  }

  if (!blog) return <h2 className="loading-message">Loading...</h2>;

  return (
    <>
      <NavBar />
      <div className="blog-detail-container">
        <div className="blog-header">
          <h1 className="blog-title">{blog.title}</h1>
          <div className="blog-meta">
            <p>
              <strong>Category:</strong> {blog.category}
            </p>
            <p>
              <strong>Author:</strong> Admin
            </p>
            <p>
              <strong>Reading Time:</strong> {readingTime} min
            </p>
          </div>
        </div>

        {/* Back to Blog Link */}
        <div className="blog-back-link">
          <Link to="/blog" className="nav-link back">
            ← Back to Blog
          </Link>
        </div>

        {/* Main layout with content and related posts sidebar */}
        <div className="blog-layout">
          {/* Main Content */}
          <div className="blog-main">
            <img className="blog-image" src={blog.image} alt={blog.title} />
            <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>

          {/* Related Posts Sidebar */}
          {relatedPosts.length > 0 ? (
            <aside className="related-posts-sidebar">
              <div className="related-posts">
                <h3>Related Posts in {blog.category}</h3>
                <ul className="related-posts-list">
                  {relatedPosts.map((post) => (
                    <li key={post.blogId} className="related-post-item">
                      <Link to={`/blog/${post.blogId}`} className="related-post-link">
                        {/* Nếu có hình ảnh, hiển thị thumbnail */}
                        {post.image && (
                          <img
                            src={post.image}
                            alt={post.title}
                            className="related-post-thumbnail"
                          />
                        )}
                        <span className="related-post-title">{post.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          ) : (
            <aside className="related-posts-sidebar">
              <div className="related-posts">
                <h3>Related Posts in {blog.category}</h3>
                <p>No related posts found.</p>
              </div>
            </aside>
          )}
        </div>

        {/* Navigation */}
        <div className="blog-navigation">
          {prevPost && (
            <Link to={`/blog/${prevPost.blogId}`} className="nav-link prev">
              ← Previous: {prevPost.title}
            </Link>
          )}
          {nextPost && (
            <Link to={`/blog/${nextPost.blogId}`} className="nav-link next">
              Next: {nextPost.title} →
            </Link>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default BlogDetail;