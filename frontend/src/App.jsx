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
        {/* <Route path="/" element={<Navigate to="/articles" />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/articles"
          element={
            <ProtectedRoute>
              <Articles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/articles/new"
          element={
            <ProtectedRoute>
              <NewArticle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/articles/:id"
          element={
            <ProtectedRoute>
              <ArticleDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/articles/:id/edit"
          element={
            <ProtectedRoute>
              <EditArticle />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
