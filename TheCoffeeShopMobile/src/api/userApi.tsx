import axios from 'axios';
import {serport} from '../config/port';

export default axios.get({
  baseURL: serport,
  headers: {
    Authorization: 'Bearer API_KEY',
  },
});
