import { Routes, Route, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './pages/Home';
import NoMatch from './pages/NoMatch';
import { useState, useEffect } from 'react';
import Toast from './components/Toast';
import Reservation from './pages/Reservation';
import Admin from './pages/Admin';

function App() {

  const [msg,setMsg] = useState()
  const location = useLocation();
  const closeToast = () => {
    setMsg(undefined)
  }
  const setToast = (msg: any) => {
    setMsg(msg)
  }

  useEffect(() => {
      window.scrollTo(0,0)
      if(msg && !msg['stay']){
        setMsg(undefined)
      }
    }, [location])

  return (
    <>
      <div>
        <Header key={location.pathname} ></Header>
        <Routes>
          <Route path="/" element={<Home setToast={setToast} />} />
          <Route path="/admin" element={<Admin setToast={setToast} />} />
          <Route path="/reservation" element={<Reservation setToast={setToast} />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
        {msg &&
          <Toast msg={msg} closeToast={closeToast}></Toast>
        }
        <Footer></Footer>
      </div>
    </>
  )
}

export default App
