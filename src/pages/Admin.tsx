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
  const [loading, setLoading] = useState(true)

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
          setLoading(false)
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

export default Admin
