import axios from 'axios';

const LOGIN_API_URL = 'https://sandbox.101digital.io/token?tenantDomain=carbon.super';
const CLIENT_ID = 'oO8BMTesSg9Vl3_jAyKpbOd2fIEa';
const CLIENT_SECRET = '0Exp4dwqmpON_ezyhfm0o_Xkowka';
const GRANT_TYPE = 'password';
const SCOPE = 'openid';

export async function LoginService(username: string, password: string) {
    const data = new URLSearchParams();
    data.append('client_id', CLIENT_ID);
    data.append('client_secret', CLIENT_SECRET);
    data.append('grant_type', GRANT_TYPE);
    data.append('scope', SCOPE);
    data.append('username', username);
    data.append('password', password);
    return await axios.post(LOGIN_API_URL, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(response => response?.data?.access_token);
}