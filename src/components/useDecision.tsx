export function useDecision() {
  return new Promise<void>(function (resolve, reject) {
    let decision = document.createElement("div");
    decision.className = "decision shadow-xl bg-neutral-800 text-slate-200 border-red-500";
    decision.innerHTML = `<span>Na pewno?</span><br /><button id="button_tak">Tak</button><button id="button_nie">Nie</button>`;
    document.querySelector('body')!.appendChild(decision);
    decision.style.animation = "slideInDown 0.5s ease";
    document.querySelector("#button_tak")!.addEventListener("click", function () {
        resolve();
    })
    document.querySelector("#button_nie")!.addEventListener("click", function () {
        reject();
    })
  })
}
