import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import CSS của ReactQuill
import "./BlogManage.css";

const BlogManage = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: "",
    subtitle: "",
    content: "",
    tags: "",
    image: "",
    category: "",
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("http://localhost:5200/api/Blog/get-all");
      if (response.data?.success && Array.isArray(response.data.data.$values)) {
        setBlogs(response.data.data.$values);
      } else {
        console.error("API không trả về mảng hợp lệ:", response.data);
      }
    } catch (err) {
      console.error("Lỗi khi gọi API:", err);
    }
  };

  // Xử lý duyệt bài viết
  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5200/api/Blog/approve/${id}`);
      alert(`Bài viết ${id} đã được duyệt!`);
      fetchBlogs();
    } catch (error) {
      console.error("Lỗi khi duyệt bài:", error);
    }
  };

  // Xử lý xóa bài viết
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5200/api/Blog/delete/${id}`);
      alert(`Bài viết ${id} đã bị xóa!`);
      fetchBlogs();
    } catch (error) {
      console.error("Lỗi khi xóa bài:", error);
    }
  };

  // Mở modal chỉnh sửa
  const openEditModal = (blog) => {
    setSelectedBlog(blog);
    setNewBlog({
      title: blog.title,
      subtitle: blog.subtitle || "",
      content: blog.content,
      tags: blog.tags,
      image: blog.image,
      category: blog.category,
    });
    setModalIsOpen(true);
  };

  // Mở modal tạo bài viết mới
  const openCreateModal = () => {
    setSelectedBlog(null);
    setNewBlog({ title: "", subtitle: "", content: "", tags: "", image: "", category: "" });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Xử lý tạo / cập nhật bài viết
  const handleCreateOrUpdateBlog = async () => {
    try {
      const blogData = {
        title: newBlog.title,
        subtitle: newBlog.subtitle,
        content: newBlog.content, // Nội dung đã được nhập dưới dạng HTML qua ReactQuill
        tags: newBlog.tags,
        image: newBlog.image,
        category: newBlog.category,
      };

      if (selectedBlog) {
        await axios.put(`http://localhost:5200/api/Blog/update/${selectedBlog.blogId}`, blogData);
        alert("Cập nhật bài viết thành công!");
      } else {
        await axios.post("http://localhost:5200/api/Blog/create", blogData);
        alert("Tạo bài viết mới thành công!");
      }

      closeModal();
      fetchBlogs();
    } catch (error) {
      console.error("Lỗi khi xử lý bài viết:", error);
      alert("Lỗi khi xử lý bài viết!");
    }
  };

  return (
    <div className="blog-management">
      <h2>Blog Management</h2>
      <button className="create-blog-btn" onClick={openCreateModal}>
        Add New Blog
      </button>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Tags</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.blogId}>
              <td>{blog.title}</td>
              <td>{blog.category}</td>
              <td>{blog.tags}</td>
              <td>{blog.status}</td>
              <td>
                <button onClick={() => openEditModal(blog)}>Edit</button>
                <button onClick={() => handleApprove(blog.blogId)}>Approve</button>
                <button onClick={() => handleDelete(blog.blogId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal nhập bài viết với layout định sẵn và các class tùy chỉnh */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Manage Blog">
        <h2 className="modal-title">{selectedBlog ? "Chỉnh Sửa Bài Viết" : "Viết Bài Mới"}</h2>
        <div className="modal-form">
          <label className="modal-label">Title:</label>
          <input
            type="text"
            placeholder="Enter the blog title"
            className="modal-input"
            value={newBlog.title}
            onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
          />
          <label className="modal-label">Subtitle:</label>
          <input
            type="text"
            placeholder="Enter the blog subtitle (optional)"
            className="modal-input"
            value={newBlog.subtitle}
            onChange={(e) => setNewBlog({ ...newBlog, subtitle: e.target.value })}
          />
          <label className="modal-label">Content:</label>
          {/* Sử dụng ReactQuill để nhập nội dung có định dạng */}
          <ReactQuill
            theme="snow"
            value={newBlog.content}
            onChange={(content) => setNewBlog({ ...newBlog, content })}
            placeholder="Enter the blog content here..."
            className="modal-quill"
          />
          <label className="modal-label">Tags:</label>
          <input
            type="text"
            placeholder="Comma separated tags"
            className="modal-input"
            value={newBlog.tags}
            onChange={(e) => setNewBlog({ ...newBlog, tags: e.target.value })}
          />
          <label className="modal-label">Image URL:</label>
          <input
            type="text"
            placeholder="Enter image URL"
            className="modal-input"
            value={newBlog.image}
            onChange={(e) => setNewBlog({ ...newBlog, image: e.target.value })}
          />
          <label className="modal-label">Category:</label>
          <input
            type="text"
            placeholder="Enter blog category"
            className="modal-input"
            value={newBlog.category}
            onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
          />
          <div className="edit-button-group">
            <button onClick={handleCreateOrUpdateBlog}>
              {selectedBlog ? "Update" : "Create"}
            </button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BlogManage;
