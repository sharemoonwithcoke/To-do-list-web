// App.jsx
import { useState } from 'react';
import Header from './components/Header/Header';
import LoginForm from './components/Login/LoginForm';
import Dashboard from './pages/Dashboard';
import Stats from './pages/Stats';
import Rankings from './pages/Rankings';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = (userData) => {
    // 存储token到localStorage
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
    setUser(userData.user);
  };

  const handleLogout = () => {
    // 清除token
    localStorage.removeItem('token');
    setUser(null);
    setCurrentPage('dashboard'); 
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'stats':
        return <Stats user={user} />;
      case 'rankings':
        return <Rankings user={user} />;
      default:
        return <Dashboard user={user} />;
    }
  };

  return (
    <div className="app">
      {user ? (
        <>
          <Header 
            user={user} 
            onLogout={handleLogout}
            currentPage={currentPage}
            onPageChange={handlePageChange} 
          />
          {renderPage()}
        </>
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;

