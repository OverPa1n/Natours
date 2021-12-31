
const Stripe = require('stripe');
const stripe = Stripe('pk_test_51KCI4PJ87soacI47nZPF1myt727CaP8owKDD9ZzwQy9rXMybIBKgHoDjoLwf6Hwup4RPtpHoFgPKadTFqkmXxWl600ppPMwV8B');
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const currentSession = await axios(`http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`, {
      method: 'GET'
    });

    // 2) Redirect to payment
    await redirect(currentSession.data.session.url)

  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};

const redirect = async (url) => {
  return window.location = url;
}
