import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import AddQuestion from "./pages/AddQuestion.jsx";
import Questions from "./pages/Questions.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ padding: 24 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/questions/new" element={<AddQuestion />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
