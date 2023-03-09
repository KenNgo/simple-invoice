import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './LoginPage.scss';

const LOGIN_API_URL = 'https://sandbox.101digital.io/token?tenantDomain=carbon.super';
const CLIENT_ID = 'oO8BMTesSg9Vl3_jAyKpbOd2fIEa';
const CLIENT_SECRET = '0Exp4dwqmpON_ezyhfm0o_Xkowka';
const GRANT_TYPE = 'password';
const SCOPE = 'openid'

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  let navigate = useNavigate();

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    const data = new URLSearchParams();
    data.append('client_id', CLIENT_ID);
    data.append('client_secret', CLIENT_SECRET);
    data.append('grant_type', GRANT_TYPE);
    data.append('scope', SCOPE);
    data.append('username', username);
    data.append('password', password);
    await axios.post(LOGIN_API_URL, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => {
        // login success
        setLoading(false);
        console.log('Login success ',response.data);
        sessionStorage.setItem("isAuthenticated", "true");
        navigate("/home");
      })
      .catch((error) => {
        // Login fail
        if (error) {
          setErrorMessage(error?.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(()=> {
    sessionStorage.setItem("isAuthenticated", "false");
  }, []);

  return (
    <div className="login-container">
      <Form className="login-form" onFinish={handleSubmit}>
        <h2>Login</h2>
        <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
          <Input value={username} onChange={handleUsernameChange} />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password value={password} onChange={handlePasswordChange} />
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <Form.Item className='button-wrapper'>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
        </Form.Item>
        {errorMessage?.length ? (
          <Form.Item>
            <label className='error-message'>{errorMessage}</label>
        </Form.Item>
        ) : ('')}
      </Form>
    </div>
  );
};

export default LoginPage;
