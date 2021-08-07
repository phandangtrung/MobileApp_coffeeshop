import axios from 'axios';
import {serport} from '../config/port';

export default axios.create({
  baseURL: serport,
  headers: {
    Authorization: 'Bearer API_KEY',
  },
});
