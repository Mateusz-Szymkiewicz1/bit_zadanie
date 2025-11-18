function NoConnection() {

  return (
    <div className="min-h-screen px-5 flex flex-col items-center justify-center">
      <p className="text-8xl text-red-600 text-bold text-center">Error</p>
      <h1 className="text-red-600 font-semibold text-3xl text-center mt-2">Nie udało się połączyć z serwerem :(</h1>
    </div>
  )
}

export default NoConnection
