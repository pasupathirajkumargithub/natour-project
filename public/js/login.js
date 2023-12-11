import axios from 'axios';
import { showAlert } from './alert';

export const login = async (mail, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/user/logIn',
      data: { mail, password },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'logIn successfully..!');
      window.setTimeout(() => {
        location.assign('/');
      }, 2000);
    }
    console.log(res);
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/user/logout',
    });

    if ((res.data.status = 'success')) location.reload(true);
  } catch (error) {
    console.log(error);
    showAlert('error', 'Error loging out plerse try again ! ');
  }
};
