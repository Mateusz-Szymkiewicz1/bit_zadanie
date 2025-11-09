import { useState, useEffect } from "react"
import { useDecision } from "../components/useDecision"

function Reservation(props: any) {
  
  const [user, setUser] = useState()
  const [spots, setSpots] = useState<Spot[]>([])
  const [miejsce, setMiejsce] = useState<string>(location.search.split('=')[1] ?? "1")
  const [dzien, setDzien] = useState<string>("")

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
          <h1 className="text-red-600 font-semibold text-3xl sm:text-4xl text-center mt-24"><i className="fa fa-lock mr-2"></i>Dodaj rezerwację</h1>
          <form className="flex flex-col gap-3 bg-neutral-600 mx-auto w-fit p-5 mt-10">
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
    </>
  )
}

export default Reservation
