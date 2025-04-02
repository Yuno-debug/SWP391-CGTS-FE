import React, { useState, useEffect } from "react";
import axios from "axios";
import { lazy, Suspense } from "react";
import Modal from "react-modal";
import "react-quill/dist/quill.snow.css";
import "./BlogManage.css";

// Lazy load ReactQuill for client-side only
const ReactQuill = lazy(() => import("react-quill"));

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
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("http://localhost:5200/api/Blog/get-all");
      if (response.data?.success && Array.isArray(response.data.data.$values)) {
        setBlogs(response.data.data.$values);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5200/api/Blog/approve/${id}`);
      fetchBlogs();
    } catch (error) {
      console.error("Error approving blog:", error);
    }
  };

  const handleDisapprove = async (id) => {
    try {
      await axios.put(`http://localhost:5200/api/Blog/disapprove/${id}`);
      fetchBlogs();
    } catch (error) {
      console.error("Error disapproving blog:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5200/api/Blog/delete/${id}`);
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const openEditModal = (blog) => {
    setSelectedBlog(blog);
    setNewBlog({ ...blog });
    setModalIsOpen(true);
    setErrors({});
  };

  const openCreateModal = () => {
    setSelectedBlog(null);
    setNewBlog({ title: "", subtitle: "", content: "", tags: "", image: "", category: "" });
    setModalIsOpen(true);
    setErrors({});
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedBlog(null);
    setNewBlog({ title: "", subtitle: "", content: "", tags: "", image: "", category: "" });
    setErrors({});
  };

  const validateForm = () => {
    let tempErrors = {};

    if (!newBlog.title.trim()) {
      tempErrors.title = "Title cannot be empty";
    } else if (newBlog.title.length < 3) {
      tempErrors.title = "Title must be at least 3 characters long";
    }

    if (!newBlog.subtitle.trim()) {
      tempErrors.subtitle = "Subtitle cannot be empty";
    } else if (newBlog.subtitle.length < 5) {
      tempErrors.subtitle = "Subtitle must be at least 5 characters long";
    }

    if (!newBlog.content.trim() || newBlog.content === "<p><br></p>") {
      tempErrors.content = "Content cannot be empty";
    } else if (newBlog.content.length < 20) {
      tempErrors.content = "Content must be at least 20 characters long";
    }

    if (!newBlog.tags.trim()) {
      tempErrors.tags = "Tags cannot be empty";
    } else if (!/^[a-zA-Z0-9\s,]+$/.test(newBlog.tags)) {
      tempErrors.tags = "Tags can only contain letters, numbers, spaces, and commas";
    }

    if (!newBlog.image.trim()) {
      tempErrors.image = "Image URL cannot be empty";
    } else if (!/^(http|https):\/\/[^ "]+$/.test(newBlog.image)) {
      tempErrors.image = "Please enter a valid URL (e.g., http://example.com/image.jpg)";
    }

    if (!newBlog.category.trim()) {
      tempErrors.category = "Category cannot be empty";
    } else if (newBlog.category.length < 3) {
      tempErrors.category = "Category must be at least 3 characters long";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0; // Returns true if no errors
  };

  const handleCreateOrUpdateBlog = async () => {
    if (!validateForm()) {
      return; // Stop if validation fails
    }

    try {
      if (selectedBlog) {
        await axios.put(`http://localhost:5200/api/Blog/update/${selectedBlog.blogId}`, newBlog);
      } else {
        await axios.post("http://localhost:5200/api/Blog/create", newBlog);
      }
      closeModal();
      fetchBlogs();
    } catch (error) {
      console.error("Error saving blog:", error);
    }
  };

  // Filter blogs based on search query
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.tags.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Config ReactQuill
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline"],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "font",
    "list",
    "bold",
    "italic",
    "underline",
    "link",
    "image",
  ];

  return (
    <div className="blog-management">
      <h2>Blog Management</h2>
      <div className="action-bar">
        <div className="add-search-group">
          <button className="create-blog-btn" onClick={openCreateModal}>
            <span>+</span> Add New Blog
          </button>
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search by title, category, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Image</th> {/* New Image column */}
              <th>Title</th>
              <th>Category</th>
              <th>Tags</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs.map((blog, index) => (
              <tr key={blog.blogId}>
                <td>{index + 1}</td>
                <td>
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="blog-table-image"
                  />
                </td> {/* Display image */}
                <td>{blog.title}</td>
                <td>{blog.category}</td>
                <td>{blog.tags}</td>
                <td>{blog.status}</td>
                <td>
                  <button onClick={() => openEditModal(blog)}>Edit</button>
                  <button onClick={() => handleApprove(blog.blogId)}>Approve</button>
                  <button onClick={() => handleDisapprove(blog.blogId)}>Disapprove</button>
                  <button onClick={() => handleDelete(blog.blogId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal 
        isOpen={modalIsOpen} 
        onRequestClose={closeModal} 
        contentLabel="Manage Blog"
        className="blog-modal"
        overlayClassName="blog-modal-overlay"
      >
        <h2>{selectedBlog ? "Edit Blog" : "New Blog"}</h2>
        <div className="form-group">
          <input
            type="text"
            value={newBlog.title}
            onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
            placeholder="Title"
          />
          {errors.title && <span className="error">{errors.title}</span>}
        </div>
        <div className="form-group">
          <input
            type="text"
            value={newBlog.subtitle}
            onChange={(e) => setNewBlog({ ...newBlog, subtitle: e.target.value })}
            placeholder="Subtitle"
          />
          {errors.subtitle && <span className="error">{errors.subtitle}</span>}
        </div>
        <div className="form-group">
          <Suspense fallback={<div>Loading editor...</div>}>
            <ReactQuill
              theme="snow"
              value={newBlog.content}
              onChange={(content) => setNewBlog((prev) => ({ ...prev, content }))}
              modules={modules}
              formats={formats}
              style={{ height: "200px", marginBottom: "35px" }}
            />
          </Suspense>
          {errors.content && <span className="error">{errors.content}</span>}
        </div>
        <div className="form-group">
          <input
            type="text"
            value={newBlog.tags}
            onChange={(e) => setNewBlog({ ...newBlog, tags: e.target.value })}
            placeholder="Tags (e.g., health, tips)"
          />
          {errors.tags && <span className="error">{errors.tags}</span>}
        </div>
        <div className="form-group">
          <input
            type="text"
            value={newBlog.image}
            onChange={(e) => setNewBlog({ ...newBlog, image: e.target.value })}
            placeholder="Image URL (e.g., http://example.com/image.jpg)"
          />
          {errors.image && <span className="error">{errors.image}</span>}
        </div>
        <div className="form-group">
          <input
            type="text"
            value={newBlog.category}
            onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
            placeholder="Category"
          />
          {errors.category && <span className="error">{errors.category}</span>}
        </div>
        <div className="modal-buttons">
          <button className="create-btn" onClick={handleCreateOrUpdateBlog}>
            {selectedBlog ? "Update" : "Create"}
          </button>
          <button className="cancel-btn" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default BlogManage;