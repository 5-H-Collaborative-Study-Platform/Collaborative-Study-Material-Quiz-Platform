import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import AddQuestion from "./pages/AddQuestion.jsx";
import Questions from "./pages/Questions.jsx";
import Materials from "./pages/Materials.jsx";
import UploadMaterial from "./pages/UploadMaterial.jsx";
import AttemptQuiz from "./pages/AttemptQuiz.jsx";
import Performance from "./pages/Performance.jsx";

function QuizRoute() {
  const { quizId } = useParams();
  return <AttemptQuiz quizId={quizId} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/questions/new" element={<AddQuestion />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/materials/upload" element={<UploadMaterial />} />
          <Route path="/quiz/:quizId" element={<QuizRoute />} />
          <Route path="/performance" element={<Performance />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
