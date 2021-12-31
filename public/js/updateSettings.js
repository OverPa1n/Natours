import axios from 'axios';
import { showAlert } from './alerts';

//type is either 'password' or 'data'
export const updateUserData = async (data, type) => {
  try {
    const action = type === 'password' ? 'updatePassword' : 'updateMe'
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/${action}`,
      data
    })

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully`)
    } else {
      showAlert('error', res.data)
    }

  } catch (e) {
    showAlert('error', e.response.message)
  }
}
