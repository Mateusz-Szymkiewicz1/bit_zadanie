import { useEffect, useState } from "react"

function Admin(props: any) {

  const [user, setUser] = useState()
  const [spots, setSpots] = useState([])

  useEffect(() => {
    fetch("http://localhost:3000/login", {
      credentials: 'include',
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    }).then(res => res.json()).then(res => {
      if(!res.text && res[0].admin == "1"){
        setUser(res[0])
        fetch("http://localhost:3000/parking", {
          credentials: 'include',
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          }
        }).then(res => res.json()).then(res => {
          setSpots(res)
        })
      }else{
        window.location.href = '/'
      }
    })
  }, [])

  return (
    <>
      {user && user['admin'] == 1 &&
        <>
          <h1 className="text-red-600 font-semibold text-3xl sm:text-4xl text-center mt-24"><i className="fa fa-user-tie mr-2"></i>Panel administratora</h1>
        </>
      }
    </>
  )
}

export default Admin
