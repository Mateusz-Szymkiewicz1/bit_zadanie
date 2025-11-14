import { useEffect, useState } from "react"
import { useDecision } from "../components/useDecision"

function Admin(props: any) {

  const [user, setUser] = useState()
  const [spots, setSpots] = useState<Spot[]>([])
  const [reservations, setReservations] = useState<Rezerwacja[]>([])
  const [refresh, setRefresh] = useState(false)

  const [editId, setEditId] = useState(0)
  const [editDostepne, setEditDostepne] = useState<string>("")
  const [editUwagi, setEditUwagi] = useState<string>("")

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
        fetch("http://localhost:3000/reservations", {
          credentials: 'include',
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          }
        }).then(res => res.json()).then(res => {
          setReservations(res)
        })
      }else{
        window.location.href = '/'
      }
    })
  }, [refresh])

  const closeEdit = () => {
    document.querySelector('.edit')!.classList.add("hidden")
  }
  
  const showEdit = (e: any) => {
    document.querySelector('.edit')!.classList.remove("hidden")
    const el = spots.find(x => x['id'] == e.currentTarget.dataset.id)
    setEditId(el!['id'])
    setEditDostepne(el!['dostepne']+"")
    setEditUwagi(el!['uwagi'])
  }

  const submitEdit = async () => {
    if (document.querySelector(".decision")) document.querySelector('.decision')!.remove()
    const response = await useDecision().then(function () {
      document.querySelector(".decision")!.remove()
      return
    }, function () {
      document.querySelector(".decision")!.remove()
      return "stop"
    });
    if(response) return
    fetch("http://localhost:3000/edit_spot", {
      credentials: 'include',
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: editId,
        dostepne: editDostepne,
        uwagi: editUwagi
      }),
    }).then(() => {
      setRefresh(prev => !prev)
      closeEdit()
    })
  }

  const deleteSpot = async (e: any) => {
    const id = e.currentTarget.dataset.id
    if (document.querySelector(".decision")) document.querySelector('.decision')!.remove()
    const response = await useDecision().then(function () {
      document.querySelector(".decision")!.remove()
      return
    }, function () {
      document.querySelector(".decision")!.remove()
      return "stop"
    });
    if(response) return
    fetch("http://localhost:3000/delete_spot", {
      credentials: 'include',
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id
      }),
    }).then(() => {
      props.setToast({type: "msg", text: "Usunięto!"})
      setRefresh(prev => !prev)
    })
  }

  const deleteReservation = async (e: any) => {
    const id = e.currentTarget.dataset.id
    if (document.querySelector(".decision")) document.querySelector('.decision')!.remove()
    const response = await useDecision().then(function () {
      document.querySelector(".decision")!.remove()
      return
    }, function () {
      document.querySelector(".decision")!.remove()
      return "stop"
    });
    if(response) return
    fetch("http://localhost:3000/delete_reservation", {
      credentials: 'include',
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id
      }),
    }).then(() => {
      props.setToast({type: "msg", text: "Usunięto!"})
      setRefresh(prev => !prev)
    })
  }

  return (
    <>
      {user && user['admin'] == 1 &&
        <div className="px-5 sm:px-10">
          <h1 className="text-shadow-lg text-red-600 font-semibold text-3xl sm:text-4xl text-center mt-24"><i className="fa fa-user-tie mr-2"></i>Panel administratora</h1>
          <h2 className="text-red-600 text-2xl sm:text-3xl mt-16"><i className="fa fa-parking mr-1"></i>Miejsca ({spots.length})</h2>
          <div className="flex items-center my-2 mt-8">
            <input checked={tylkoDostepne} onChange={(e) => setTylkoDostepne(e.target.checked)} type="checkbox" className="cursor-pointer w-4 h-4 text-red-600 bg-gray-600 border-gray-700 rounded-sm"></input>
            <label className="ms-2 text-sm font-medium">Pokaż tylko dostępne</label>
          </div>
          <table className="w-full text-md bg-neutral-600 shadow-xl rounded mb-4">
            <tbody>
                <tr className="border-b text-left">
                    <th className="p-3 px-5">Miejsce</th>
                    <th className="p-3 px-5">Dostępne</th>
                    <th className="p-3 px-5">Uwagi</th>
                    <th className="p-3 px-5">Zajęte (dziś)</th>
                </tr>
                {spots.map(el => {
                if(tylkoDostepne && el['dostepne'] == 0) return
                return(
                  <tr key={el['id']} className="border-b hover:bg-neutral-600 bg-neutral-700">
                    <td className="p-3 px-5">{el['id']}</td>
                    <td className="p-3 px-5">{el['dostepne'] ? "Tak" : "Nie"}</td>
                    <td className="p-3 px-5">{el['uwagi']}</td>
                    <td className="p-3 px-5">{el['rezerwacja'] ? "Tak" : "Nie"}</td>
                    <td className="p-3 px-5 flex justify-end"><button data-id={el['id']} onClick={showEdit} type="button" className="mr-3 text-sm bg-orange-500 hover:bg-orange-400 py-1 px-2 rounded focus:outline-none"><i className="fa fa-pencil mr-1"></i>Edytuj</button><button data-id={el['id']} onClick={deleteSpot} type="button" className="mr-3 text-sm bg-red-500 hover:bg-red-600 py-1 px-2 rounded focus:outline-none"><i className="fa fa-trash mr-1"></i>Usuń</button></td>
                </tr>
                )
              })}          
            </tbody>
        </table>
          <h2 className="text-red-600 text-2xl sm:text-3xl mt-16"><i className="fa fa-parking mr-1"></i>Wszystkie rezerwacje ({reservations.length})</h2>
          <table className="w-full text-md bg-neutral-600 shadow-xl rounded my-4">
            <tbody>
                <tr className="border-b text-left">
                    <th className="p-3 px-5">Miejsce</th>
                    <th className="p-3 px-5">Pracownik</th>
                    <th className="p-3 px-5">Dzień</th>
                </tr>
                {reservations.map(el => {
                return(
                  <tr key={el['id']} className="border-b hover:bg-neutral-600 bg-neutral-700">
                    <td className="p-3 px-5">{el['miejsce']}</td>
                    <td className="p-3 px-5">{el['login']}</td>
                    <td className="p-3 px-5">{el['dzien'].split('T')[0]}</td>
                    <td className="p-3 px-5 flex justify-end"><button data-id={el['id']} onClick={deleteReservation} type="button" className="mr-3 text-sm bg-red-500 hover:bg-red-600 py-1 px-2 rounded focus:outline-none focus:shadow-outline"><i className="fa fa-trash mr-1"></i>Usuń</button></td>
                </tr>
                )
              })}          
            </tbody>
        </table>
          <div className="edit z-50 fixed hidden top-0 bottom-0 right-0 left-0 bg-neutral-800 flex justify-center items-center" style={{background: "rgba(50,50,50,0.9)"}}>
            <div className="bg-neutral-700 p-5 pb-8 text-white">
              <div className="flex justify-between">
                <h1 className="text-xl font-semibold">Edytuj miejsce</h1>
                <i className="fa fa-close mr-1 text-xl cursor-pointer" onClick={closeEdit}></i>
              </div>
              <div className="mt-5">
              <label className="text-lg">Dostępne: </label>
              <select value={editDostepne} onChange={(e) => setEditDostepne(e.target.value)} className="bg-neutral-500 outline-none ml-2 p-2">
                <option value="1">TAK</option>
                <option value="0">NIE</option>
              </select>
            </div>
            <input type="text" value={editUwagi} onChange={(e) => setEditUwagi(e.target.value)} placeholder="Uwagi..." className="w-72 outline-none h-11 mt-3 bg-neutral-500 px-3" />
            <button onClick={submitEdit} className="block bg-orange-500 p-3 py-2 mt-3 hover:bg-orange-400"><i className="fa fa-pencil mr-1"></i>Edytuj</button>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default Admin
