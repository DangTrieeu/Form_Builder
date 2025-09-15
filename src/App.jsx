import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import EditorPage from './pages/EditorPage.jsx';
import PreviewPage from './pages/PreviewPage.jsx';
import './styles/App.css';
import ListForm from "@/components/form-render/ListForm.jsx";
import RenderForm from "@/components/form-render/RenderForm.jsx";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/forms" element={<ListForm/>}/>
          <Route path="/forms/:id" element={<RenderForm/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
