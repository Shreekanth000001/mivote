import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from './components/home'
import Login from "./components/login";
import Signup from "./components/signup";

function App() {
  return (
    <Router basename="/">
      <MainLayout />
    </Router>

  );
}
function MainLayout() {

  const location = useLocation();
  const isAuthloc = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="App font-aileron md:bg-[#F6F7F9] tracking-wide">
      {!isAuthloc && <Home />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App