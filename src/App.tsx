import { Routes, Route, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './pages/Home';
import NoMatch from './pages/NoMatch';
import { useState, useEffect } from 'react';
import Toast from './components/Toast';
import Reservation from './pages/Reservation';
import Admin from './pages/Admin';
import NoConnection from './pages/NoConnection';

function App() {

  const [msg,setMsg] = useState()
  const location = useLocation();
  const [connection, setConnection] = useState(true)

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
    fetch("http://localhost:3000/connection").catch(err => {
      setConnection(false)
    })
  }, [location])

  return (
      <div>
        <Header key={location.pathname} ></Header>
        <Routes>
          {connection && 
            <>
            <Route path="/" element={<Home setToast={setToast} />} />
            <Route path="/admin" element={<Admin setToast={setToast} />} />
            <Route path="/reservation" element={<Reservation setToast={setToast} />} />
            <Route path="*" element={<NoMatch />} />
            </>
          }
          {!connection &&
            <Route path="*" element={<NoConnection />} />
          }
        </Routes>
        {msg &&
          <Toast msg={msg} closeToast={closeToast}></Toast>
        }
        <Footer></Footer>
      </div>
  )
}

export default App
