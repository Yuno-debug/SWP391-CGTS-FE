import React from 'react';
import Header from '../../Component/HomePage/NavBar/NavBar';
import Footer from '../../Component/HomePage/Footer/Footer';
import Body from '../../Component/HomePage/Body/Body';

/**
 * MainLayout4Profile component dùng để bọc toàn bộ trang Profile
 * 
 * @param {boolean} hideBody Ẩn/Hiện phần Body chính (Banner, giới thiệu,...)
 * @param {boolean} isLoggedIn Trạng thái đăng nhập để điều chỉnh Header
 * @param {ReactNode} children Nội dung cụ thể của trang Profile
 */
const MainLayout4Profile = ({ hideBody = false, children, isLoggedIn }) => {
  return (
    <div className="main-layout">
      {/* Header nhận props isLoggedIn */}
      <Header isLoggedIn={isLoggedIn} />

      {/* Phần body có thể ẩn/hiện */}
      {!hideBody && <Body />}

      {/* Nội dung trang Profile sẽ được truyền qua children */}
      <div className="main-content">
        {children}
      </div>

      {/* Footer cố định */}
     
    </div>
  );
};

export default MainLayout4Profile;
