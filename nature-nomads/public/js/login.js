/* eslint-disable */
import axios from 'axios';

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
    alert(e.response.data.message);
  }
};
