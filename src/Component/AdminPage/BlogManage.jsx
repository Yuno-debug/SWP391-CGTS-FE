import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
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
  };

  const openCreateModal = () => {
    setSelectedBlog(null);
    setNewBlog({ title: "", subtitle: "", content: "", tags: "", image: "", category: "" });
    setModalIsOpen(true);
  };

  const closeModal = () => setModalIsOpen(false);

  const handleCreateOrUpdateBlog = async () => {
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

  return (
    <div className="blog-management">
      <h2>Blog Management</h2>
      <button className="create-blog-btn" onClick={openCreateModal}>Add New Blog</button>
      <div className="table-container">
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
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Manage Blog">
        <h2>{selectedBlog ? "Edit Blog" : "New Blog"}</h2>
        <input type="text" value={newBlog.title} onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })} placeholder="Title" />
        <input type="text" value={newBlog.subtitle} onChange={(e) => setNewBlog({ ...newBlog, subtitle: e.target.value })} placeholder="Subtitle" />
        <ReactQuill theme="snow" value={newBlog.content} onChange={(content) => setNewBlog({ ...newBlog, content })} />
        <input type="text" value={newBlog.tags} onChange={(e) => setNewBlog({ ...newBlog, tags: e.target.value })} placeholder="Tags" />
        <input type="text" value={newBlog.image} onChange={(e) => setNewBlog({ ...newBlog, image: e.target.value })} placeholder="Image URL" />
        <input type="text" value={newBlog.category} onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })} placeholder="Category" />
        <button className= "create" onClick={handleCreateOrUpdateBlog}>Update</button>
        <button className= "cancel" onClick={closeModal}>Cancel</button>
      </Modal>
    </div>
  );
};

export default BlogManage;
