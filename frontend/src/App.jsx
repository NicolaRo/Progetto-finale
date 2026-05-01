import {BrowserRouter, Routes, Route } from 'react-router-dom';
import SplashPage from './pages/SplashPage';
import LoginPage from './pages/LoginPage';
import UserHome from './pages/user/UserHome';
import ProducerHome from './pages/producer/ProducerHome';

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        {/* the splashpage will navigate to the components and here represent the entry point of the App */}
        <Route path="/" element={<SplashPage/>}/>
        <Route path="/Login" element={<LoginPage/>}/>
        <Route path="/UserHome" element={<UserHome/>}/>
        <Route path="/ProducerHome" element={<ProducerHome/>}/> 
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
