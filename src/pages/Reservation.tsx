import { useState, useEffect } from "react"
import { useDecision } from "../components/useDecision"

function Reservation(props: any) {
  
  const [user, setUser] = useState()
  const [spots, setSpots] = useState<Spot[]>([])
  const [miejsce, setMiejsce] = useState<string>(location.search.split('=')[1] ?? "1")
  const [dzien, setDzien] = useState<string>("")
  const [loading, setLoading] = useState(true)

  interface Spot {
    id: number
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
        fetch("http://localhost:3000/parking", {
          credentials: 'include',
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          }
        }).then(res => res.json()).then(res => {
          setSpots(res)
          setLoading(false)
        })
      }else{
        window.location.href = '/'
      }
    })
  }, [])

  const submit = async (e: any) => {
    e.preventDefault()
    if(dzien.length < 1){
      props.setToast({type: "error", text: "Wypełnij pola!"})
      return
    }
    const dzisiaj = new Date()
    const data_dzien = new Date(dzien)
    if(dzisiaj > data_dzien){
      props.setToast({type: "error", text: "Trochę już za późno..."})
      return
    }
    if (document.querySelector(".decision")) document.querySelector('.decision')!.remove()
        const response = await useDecision().then(function () {
          document.querySelector(".decision")!.remove()
          return
        }, function () {
          document.querySelector(".decision")!.remove()
          return "stop"
        });
        if(response) return
        fetch("http://localhost:3000/reserve", {
          credentials: 'include',
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            miejsce: miejsce,
            dzien: dzien
          }),
        }).then(res => res.json()).then(res => {
          if(res == "done"){
            window.location.href = '/'
          }else{
            props.setToast({type: "error", text: res.text})
          }
        })
  }

  return (
    <>
      {user &&
        <>
          <h1 className="text-shadow-lg text-red-600 font-semibold text-3xl sm:text-4xl text-center mt-24"><i className="fa fa-lock mr-2"></i>Dodaj rezerwację</h1>
          <form className="flex shadow-xl flex-col gap-3 bg-neutral-600 mx-auto w-fit p-5 mt-10">
            <div>
              <label className="text-lg">Wybierz nr. miejsca: </label>
              <select value={miejsce} onChange={(e) => setMiejsce(e.target.value)} className="bg-neutral-500 outline-none ml-2 p-2">
                {spots.map(el => <option key={el.id}>{el.id}</option>)}
              </select>
            </div>
            <div>
              <label className="text-lg">Data rezerwacji: </label>
              <input onChange={(e) => setDzien(e.target.value)} className="text-white bg-neutral-500! outline-none ml-2 p-2" type="date"></input>
            </div>
            <button onClick={submit} className="bg-red-700 w-full p-4 hover:bg-red-800"><i className="fa fa-plus mr-1"></i>Dodaj rezerwację</button>
          </form>
        </>
      }
      {loading &&
        <div role="status" className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-neutral-800 z-50">
        <svg aria-hidden="true" className="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-red-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        </div>
      }
    </>
  )
}

export default Reservation
