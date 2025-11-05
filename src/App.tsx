import { Routes, Route} from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './pages/Home';
import NoMatch from './pages/NoMatch';

function App() {

  return (
    <>
      <div>
        <Header key={location.pathname} ></Header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
        <Footer></Footer>
      </div>
    </>
  )
}

export default App
