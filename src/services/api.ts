import axios from 'axios';
import { AXIOS_TIMEOUT_ERROR_MESSAGE, DEFAULT_TIME_OUT } from '../constants/app';

export default axios.create({
    baseURL: `https://sandbox.101digital.io`,
    timeout: DEFAULT_TIME_OUT,
    timeoutErrorMessage: AXIOS_TIMEOUT_ERROR_MESSAGE,
});
