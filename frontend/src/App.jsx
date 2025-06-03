import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
// import Login from "./pages/Login";
// import Articles from "./pages/Articles";
// import ArticleDetail from "./pages/ArticleDetail";
// import NewArticle from "./pages/NewArticle";
// import EditArticle from "./pages/EditArticle";
import Navbar from "./pages/Navbar";
import { getToken } from "./common/helper";
import Login from "./pages/Login";
import Home from "./pages/Home";
import "./App.css";
import ViewEditHistory from "./pages/viewEditHistory";
function ProtectedRoute({ children }) {
  return getToken() ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/viewedithistory/:id" element={<ViewEditHistory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
