/* eslint-disable */
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { showAlert } from './alerts';

export const updateData = async (updatedName, updatedEmail) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://localhost:8000/api/v1/users/updateMe',
      data: {
        name: updatedName,
        email: updatedEmail,
      },
    });

    if (res.status === StatusCodes.OK) {
      showAlert('success', 'Data Updated Successfully!');
    }
  } catch (e) {
    showAlert('error', e.response.data.message);
  }
};
