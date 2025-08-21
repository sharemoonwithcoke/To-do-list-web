// App.jsx
import { useState } from 'react';
import Header from './components/Header/Header';
import LoginForm from './components/Login/LoginForm';
import Dashboard from './pages/Dashboard';
import Stats from './pages/Stats';
import Rankings from './pages/Rankings';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = (user) => {
    setUsername(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUsername('');
    setIsLoggedIn(false);
    setCurrentPage('dashboard'); 
  };



  
const handlePageChange = (page) => {
  setCurrentPage(page);
 
 
};

 
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard username={username} />;
      case 'stats':
        return <Stats />;
      case 'rankings':
        return <Rankings />;
      default:
        return <Dashboard username={username} />;
    }
  };

  return (
    <div className="app">
      {isLoggedIn ? (
        <>
          <Header 
            username={username} 
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

