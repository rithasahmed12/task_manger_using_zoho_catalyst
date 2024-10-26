import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TaskList from './components/TaskList';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';

const App = () => {
  const isLoggedIn = useSelector((state:any) => !!state.user.userInfoTh);

  return (
    <Routes>
      <Route 
        path="/app" 
        element={!isLoggedIn ? <LoginForm /> : <Navigate to="/app/dashboard" />} 
      />
      <Route 
        path="/app/signup" 
        element={!isLoggedIn ? <SignupForm /> : <Navigate to="/app/dashboard" />} 
      />
      <Route 
        path="/app/dashboard" 
        element={isLoggedIn ? <TaskList /> : <Navigate to="/app/" />} 
      />
    </Routes>
  );
};

export default App;