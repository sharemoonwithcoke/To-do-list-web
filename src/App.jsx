// App.jsx
import { useState } from 'react';
import Header from './components/Header/Header';
import LoginForm from './components/Login/LoginForm';
import Dashboard from './pages/Dashboard';
import CalendarView from './pages/CalendarView';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [authId, setAuthId] = useState('');
  const [currentView, setCurrentView] = useState('calendar'); // 'calendar' or 'tasks'

  const handleLogin = (user, id) => {
    setUsername(user);
    setAuthId(id);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUsername('');
    setAuthId('');
    setIsLoggedIn(false);
    setCurrentView('calendar');
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const renderMainContent = () => {
    switch (currentView) {
      case 'calendar':
        return <CalendarView username={username} authId={authId} />;
      case 'tasks':
        return <Dashboard username={username} authId={authId} />;
      default:
        return <CalendarView username={username} authId={authId} />;
    }
  };

  return (
    <div className="app">
      {isLoggedIn ? (
        <>
          <Header 
            username={username} 
            onLogout={handleLogout}
            currentView={currentView}
            onViewChange={handleViewChange} 
          />
          {renderMainContent()}
        </>
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;

