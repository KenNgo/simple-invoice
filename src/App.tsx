import type { FC } from 'react';
import 'antd/dist/reset.css';
import './App.css';
import LoginPage from './pages/LoginPage/LoginPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import InvoiceListPage from "./pages/InvoiceListPage/InvoiceListPage";
import NoPage from "./pages/NoPage/NoPage";

const App: FC = () => (
  <BrowserRouter>
    <Routes>
      <Route index element={<LoginPage />} />
      <Route path='/home' element={<PrivateRoute component={InvoiceListPage} />} />
      <Route path="*" element={<NoPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;