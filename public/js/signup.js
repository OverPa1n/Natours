import axios from 'axios';
import {showAlert} from './alerts';

export const signup = async (data) => {
  try {
    const {name, email, password, passwordConfirm} = data;

    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm
      }
    })

    console.log(res);

    if (res.data.status === 'success') {
      showAlert('success','You successfully sign up!')
    }
  }catch (e) {
    showAlert('error', e.response.data.message);
  }
}
