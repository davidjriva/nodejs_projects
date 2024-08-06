/* eslint-disable */
import axios from 'axios';
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

    if (res.status === 200) {
      // Return user to home page
      location.assign('/');
    }
  } catch (e) {
    console.log("LOGIN ERROR")
    showAlert('error', e.response.data.message);
  }
};
