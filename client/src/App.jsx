// App.jsx
import './styles/main.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//Universal Header
import WargamingNavBar from './components/header/WGHeader';

//Home Page
import HomePage from './components/HomePage';

//Login Page
import LoginPage from './components/LoginPage';

//Stats Page
import StatsPage from './components/StatsPage';

export default function App() {
  return (
    <BrowserRouter>
      <WargamingNavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/stats" element={<StatsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
