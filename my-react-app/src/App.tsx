import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import SkiingGame from './SkiingGame';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game" element={<SkiingGame />} />
    </Routes>
  );
}

export default App;
