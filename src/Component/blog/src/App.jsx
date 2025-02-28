import React, { useState } from 'react';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import BlogGrid from './Components/BlogGrid/BlogGrid';
import Pagination from './Components/Pagination/Pagination';
import Footer from './Components/Footer/Footer';
import BlogDetail from './Components/BlogDetail/BlogDetail';
import { Routes, Route } from 'react-router-dom';
import blogPosts from './data/blogPosts'; 

function App() {
  const [activePage, setActivePage] = useState(1);
  const postsPerPage = 6;
  const totalPages = Math.ceil(blogPosts.length / postsPerPage);

  return (
    <div className="growth-tracking-app">
      <Navbar />
      <main className="container">
        <Routes>
          {/* Trang danh sách bài viết */}
          <Route
            path="/"
            element={
              <>
                <h2>Latest Articles on Child Growth</h2>
                <BlogGrid posts={blogPosts} activePage={activePage} postsPerPage={postsPerPage} />
                <Pagination activePage={activePage} setActivePage={setActivePage} totalPages={totalPages} />
              </>
            }
          />
          {/* Trang chi tiết bài viết */}
          <Route path="/blog/:id" element={<BlogDetail posts={blogPosts} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
