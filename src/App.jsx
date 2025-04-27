import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Calendar from './components/Calendar';
import Navbar from './components/Navbar';
import Events from './components/Events';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
        <Navbar />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Calendar />} />
            <Route path="/programs" element={<div className="p-8">Programs Page</div>} />
            <Route path="/events" element={<Events />} />
            <Route path="/memberships" element={<div className="p-8">Memberships Page</div>} />
            <Route path="/documents" element={<div className="p-8">Documents Page</div>} />
            <Route path="/people" element={<div className="p-8">People Page</div>} />
          </Routes>
        </div>
      </div>
    </Router>
)}

export default App;
