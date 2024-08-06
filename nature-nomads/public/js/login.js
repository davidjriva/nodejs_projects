/* eslint-disable */
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:8000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.status === StatusCodes.OK) {
      // Return user to home page
      location.assign('/');
    }
  } catch (e) {
    showAlert('error', e.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:8000/api/v1/users/logout',
    });

    if (res.status === StatusCodes.OK) {
      location.reload(true); // Force a reload from server and NOT browser cache
      location.assign('/');
    }
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
};
