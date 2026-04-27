import {BrowserRouter, Routes, Route } from 'react-router-dom';
import SplashPage from '../src/pages/SplashPage';

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={SplashPage} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
