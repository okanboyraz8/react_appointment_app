// React Hooks
import React, { useEffect } from 'react';

// React Router Dom Part
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Pages Part
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Admin from './pages/Admin/Admin';
import Moderator from './pages/Moderator/Moderator';
import User from './pages/User/User';
import Appointment from './pages/User/Appointment';

// Initialize bringInfos as a named "bringInfos"
import { bringInfos } from './features/admin/adminSlice';

// useSelector: to access state || useDispatch: to run "bringInfos"
import { useSelector, useDispatch } from 'react-redux';

// Building the ToastContainer from react-toastify
import { ToastContainer } from 'react-toastify'


function App() {

  const adminStorage = JSON.parse(localStorage.getItem('admin'))

  const { isSuccess } = useSelector((state) => state.adminState)

  const dispatch = useDispatch();

  useEffect(() => {

    if (adminStorage) {
      dispatch(bringInfos(adminStorage.uid))
    }

  }, [isSuccess])

  return (
    <div className='body'>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/moderator" element={<Moderator />} />
          <Route path="/user" element={<User />} />
          <Route path="/appointment" element={<Appointment />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
