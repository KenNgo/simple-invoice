import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { useNavigate } from "react-router-dom";
import './LoginPage.scss';
import { LoginService } from '../../services/LoginService';

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
    LoginService(username, password).then(accessToken => {
      setLoading(false);
      sessionStorage.setItem("isAuthenticated", "true");
      sessionStorage.setItem('access_token', accessToken);
      navigate("/home");
    }).catch(error => {
      if (error) {
        setErrorMessage(error?.message);
      }
    }).finally(() => {
      setLoading(false);
    });;
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
