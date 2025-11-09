import { useState, useEffect } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useDecision } from "../components/useDecision"

function Home(props: any) {
  
  const navigator = useNavigate()
  const [user, setUser] = useState()
  const [userReservations, setUserReservations] = useState<Rezerwacja[]>([])
  const [spots, setSpots] = useState<Spot[]>([])
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tylkoDostepne, setTylkoDostepne] = useState(false)

  interface Rezerwacja {
    id: number,
    miejsce: number,
    dzien: string,
    login: string,
    uwagi: string
  }

  interface Spot {
    id: number,
    rezerwacja: number,
    dostepne: number,
    uwagi: string,
  }


  useEffect(() => {
    fetch("http://localhost:3000/login", {
      credentials: 'include',
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    }).then(res => res.json()).then(res => {
      if(!res.text){
        setUser(res[0])
        fetch("http://localhost:3000/user_reservations", {
          credentials: 'include',
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          }
        }).then(res => res.json()).then(res => {
          setLoading(false)
          setUserReservations(res)
        })
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
        setLoading(false)
      }
    })
  }, [refresh])

  const togglePassword = () => {
    setShowPass(!showPass)
  }

  const submit = (e: any) => {
    e.preventDefault();
    if(!login || !password){
      props.setToast({type:"error", text:"Wypełnij formularz!"})
      return
    }
    if(!/^[A-Za-z0-9]+([A-Za-z0-9]*|[]?[A-Za-z0-9]+)*$/.test(login)){
      props.setToast({type:"error", text:"Nieprawidłowy login!"})
      return
    } 
    fetch("http://localhost:3000/login", {
      credentials: 'include',
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: login,
        pass: password,
      }),
    }).then(res => res.json()).then(res => {
      if(res.status == 0){
        props.setToast({type:"error", text: res.text})
      }else{
        navigator(0)
      }
    })
  }

  const cancel = async (e: any) => {
    if (document.querySelector(".decision")) document.querySelector('.decision')!.remove()
    const response = await useDecision().then(function () {
      document.querySelector(".decision")!.remove()
      return
    }, function () {
      document.querySelector(".decision")!.remove()
      return "stop"
    });
    if(response) return
    fetch("http://localhost:3000/cancel", {
      credentials: 'include',
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: e.target.dataset.id
      }),
    }).then(() => setRefresh(prev => !prev))
  }

  return (
    <div className="sm:px-10 px-5">
      <h1 className="text-red-600 font-semibold text-3xl sm:text-4xl text-center mt-24"><i className="fa fa-car mr-2"></i>Firmowy system parkingowy</h1>
      {!user &&
        <>
          <h2 className="mt-4 text-center font-xl"><span className="text-red-500">Zaloguj się</span> aby uzyskać dostęp do rezerwacji</h2>
          <form className="space-y-4 bg-neutral-700 p-5 sm:w-[50%] mx-auto mt-10 w-full">
            <div>
              <label className="block text-sm font-medium text-slate-200"><i className="fa fa-user mr-1"></i>Użytkownik</label>
              <input type="text" maxLength={50} onChange={(e) => setLogin(e.target.value)} id="username" name="username" className="mt-1 p-2 w-full bg-neutral-600 rounded-md focus:outline-none"></input>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200"><i className="fa fa-key mr-1"></i>Hasło</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} onChange={(e) => setPassword(e.target.value)} maxLength={100} className="mt-1 p-2 pr-10 w-full bg-neutral-600 rounded-md focus:outline-none"></input>
                <button onClick={togglePassword} type="button" className="absolute inset-y-6 end-0 flex items-center z-20 px-3 cursor-pointer rounded-e-md focus:outline-none focus:text-red-500 text-neutral-400">
                  <svg className="shrink-0 size-3.5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {!showPass && 
                      <>
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                      <line x1="2" x2="22" y1="2" y2="22"></line>    
                      </> 
                    }
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
          </div>
        <div>
          <button onClick={submit} className="shadow w-full bg-red-700 text-white p-2 rounded-md hover:bg-red-800 focus:outline-none transition">Zaloguj</button>
        </div>
      </form>
        </>
      }
      {user &&
        <>
          <h2 className="text-red-600 text-2xl sm:text-3xl mt-16"><i className="fa fa-lock mr-1"></i>Twoje rezerwacje ({userReservations.length})</h2>
          <NavLink to={"/reservation"}><button className="bg-red-700 p-4 my-3 hover:bg-red-800"><i className="fa fa-plus mr-1"></i>Dodaj rezerwację</button></NavLink>
          {userReservations.length > 0 &&
            <table className="my-5 shadow-lg text-lg sm:text-xl">
              <thead>
                <tr><th>Miejsce</th><th>Dzień</th><th>Uwagi</th></tr>
              </thead>
              <tbody>
              {userReservations.map((el,i) => {
                return(
                  <tr key={i}><td>{el['miejsce']}</td><td>{el['dzien'].split('T')[0]}</td><td>{el['uwagi']}</td><td onClick={cancel} data-id={el['id']} className="cursor-pointer"><i className="fa fa-cancel mr-1"></i>Anuluj</td></tr>
                )
              })}
              </tbody>
            </table>
          }
          {userReservations.length == 0 &&
            <p className="text-lg mt-3">Brak rezerwacji...</p>
          }
          <h2 className="text-red-600 text-2xl sm:text-3xl mt-16"><i className="fa fa-parking mr-1"></i>Miejsca ({spots.length})</h2>
          <div className="flex items-center my-2 mt-8">
            <input checked={tylkoDostepne} onChange={(e) => setTylkoDostepne(e.target.checked)} type="checkbox" className="cursor-pointer w-4 h-4 text-red-600 bg-gray-600 border-gray-700 rounded-sm"></input>
            <label className="ms-2 text-sm font-medium">Pokaż tylko dostępne</label>
        </div>
          <table className="shadow-lg text-lg sm:text-xl">
            <thead>
              <tr><th>Miejsce</th><th>Dostępne</th><th>Uwagi</th><th>Zajęte (Dziś)</th></tr>
            </thead>
            <tbody>
              {spots.map(el => {
                if(tylkoDostepne && el['dostepne'] == 0) return
                return(
                  <tr key={el['id']}><td>{el['id']}</td><td>{el['dostepne'] ? "Tak" : "Nie"}</td><td>{el['uwagi']}</td><td>{el['rezerwacja'] ? "Tak" : "Nie"}</td>{el['dostepne'] == 1 &&
                    <td className="p-0!"><NavLink className="block p-3" to={'/reservation?m='+el['id']}><i className="fa fa-anchor-lock mr-1"></i>Rezerwuj</NavLink></td>
                  }
                  {el['dostepne'] != 1 &&
                    <td></td>
                  }
                  </tr>
                )
              })}
            </tbody>
          </table>
        </>
      }
      {!user && loading &&
        <div role="status" className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-neutral-800 z-50">
        <svg aria-hidden="true" className="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-red-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        </div>
      }
    </div>
  )
}

export default Home
