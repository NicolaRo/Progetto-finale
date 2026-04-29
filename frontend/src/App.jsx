import {BrowserRouter, Routes, Route } from 'react-router-dom';
import SplashPage from './pages/SplashPage';
import LoginPage from './pages/LoginPage';

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        {/* the splashpage will navigate to the components and here represent the entry point of the App */}
        <Route path="/" element={<SplashPage/>}/>
        <Route path="/Login" element={<LoginPage/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
