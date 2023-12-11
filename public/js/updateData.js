import axios from 'axios';
import { showAlert } from './alert';

exports.updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:3000/api/v1/user/updateMyPassword'
        : 'http://127.0.0.1:3000/api/v1/user/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if ((res.data.status = 'success')) {
      showAlert('success', `${type.toUpperCase()} updated successfully..!`);
      window.setTimeout(() => {
        location.reload(true);
      }, 2000);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
