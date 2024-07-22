import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Import components
import Header from './components/Header';
import Footer from './components/Footer';

// Import pages
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Blogs from './pages/Blogs';
import Songs from './pages/Songs';
import MVs from './pages/MVs';
import Movies from './pages/Movies';
import Recipes from './pages/Recipes';

// Import auth service
import { isAuthenticated } from './services/auth';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// PrivateRoute component
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/" element={<Home />} />
              <Route path="/blogs" element={<PrivateRoute><Blogs /></PrivateRoute>} />
              <Route path="/songs" element={<PrivateRoute><Songs /></PrivateRoute>} />
              <Route path="/mvs" element={<PrivateRoute><MVs /></PrivateRoute>} />
              <Route path="/movies" element={<PrivateRoute><Movies /></PrivateRoute>} />
              <Route path="/recipes" element={<PrivateRoute><Recipes /></PrivateRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
