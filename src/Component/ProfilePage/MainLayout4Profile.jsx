import React from 'react';
import MainLayout4Profile from '../layouts/MainLayout4Profile';
import Profile from './Profile'; // Component nội dung trang Profile

const ProfilePage = (isLoggedIn) => {// hoặc lấy từ context, redux, localStorage

  return (
    <MainLayout4Profile isLoggedIn={isLoggedIn}>
      <Profile />
    </MainLayout4Profile>
  );
};

export default ProfilePage;
