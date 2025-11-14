import { NavLink } from "react-router-dom"
import { useState, useEffect } from "react"

function Header() {

  const [user, setUser] = useState()

  useEffect(() => {
    fetch("http://localhost:3000/login", {
      credentials: 'include',
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    }).then(res => res.json()).then(res => {
      if(res.text) return
      setUser(res[0])
    })
  }, [])

  const signout = () => {
    fetch("http://localhost:3000/signout", {
      credentials: 'include',
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    }).then(() => window.location.href = '/')
  }
  
  return (
    <div className="text-white w-full bg-neutral-900 shadow-lg flex flex-row justify-between items-center p-4 sticky top-0 z-50 px-5 sm:px-10">
      <NavLink to={'/'}><span className="text-2xl"><i className="fa fa-tree mr-1 text-red-800"></i><span className="sm:inline-block hidden">Drzewo Czerwono-Czarne</span></span></NavLink>
      <div className="flex gap-5">
        {user && user['admin'] == 1 &&
          <NavLink to={"/admin"}><h2 className="text-red-700 text-lg"><i className="fa fa-user-tie mr-1"></i>Panel admina</h2></NavLink>
        }
        {user &&
          <button onClick={signout} className="text-red-700 text-lg"><i className="fa fa-sign-out mr-1"></i>Wyloguj</button>
        }
      </div>
    </div>
  )
}

export default Header
