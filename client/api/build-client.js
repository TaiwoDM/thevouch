import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // We are on the server

    return axios.create({
      baseURL: 'www.thevouch-msc-fyp.shop',
      headers: req.headers,
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseURL: '/',
    });
  }
};
