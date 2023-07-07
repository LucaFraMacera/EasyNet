import * as networkController from "./networkController";
import * as storageController from "./storageController"
import "./styles/animations.css"
import "./styles/buttonStyles.css"
import "./styles/fieldsStyle.css"
import "./styles/generalStyle.css"
import "./styles/media.css"
const addButton = document.querySelector("#addNode")as HTMLButtonElement;
const edgeButton = document.querySelector("#addEdge")as HTMLButtonElement;
const deleteButton = document.querySelector("#delete")as HTMLButtonElement;
const resetButton = document.querySelector("#reset")as HTMLButtonElement;
const editEdgeButton = document.querySelector("#editEdge")as HTMLButtonElement;
const enableDirectionButton = document.querySelector("#netType") as HTMLButtonElement;
const enableWeightButton = document.querySelector("#isWeighted")as HTMLButtonElement;
const enableBipartitionButton = document.querySelector("#isBipartite")as HTMLButtonElement;
const optDivButton = document.querySelector("#optDivButton") as HTMLButtonElement;
const algDivButton = document.querySelector("#algDivButton") as HTMLButtonElement;
const showMainNetButton = document.querySelector("#showMainNet") as HTMLButtonElement;
const showOutNetButton = document.querySelector("#showOutNet") as HTMLButtonElement;
const completeNetButton = document.querySelector("#complete") as HTMLButtonElement;
const r1 = document.querySelector("#r1") as HTMLButtonElement;
const s1 = document.querySelector("#s1") as HTMLButtonElement;
const loadNet = document.querySelector("#loadNet") as HTMLButtonElement;
const saveNet = document.querySelector("#saveNet") as HTMLButtonElement;
enableDirectionButton.addEventListener("click", ()=>{
  networkController.setMode(null)
  switchStyleChange(enableDirectionButton)
  networkController.switchNetworkDirection()
})
enableWeightButton.addEventListener("click",()=>{
  networkController.setMode(null)
  switchStyleChange(enableWeightButton)
  networkController.switchWeighted()
})
enableBipartitionButton.addEventListener("click",()=>{
  networkController.setMode(null)
  try{
    networkController.switchBipartition()
    switchStyleChange(enableBipartitionButton)
  }catch(GraphIsNotBipartite){
    alert(GraphIsNotBipartite)
  }
})
addButton.addEventListener("click",()=>{
  networkController.setMode("none")
  networkController.addVertex()
})
edgeButton.addEventListener("click",()=>{
  networkController.setMode(networkController.MODES.addEdge)
})
resetButton.addEventListener("click",()=>{
  networkController.setMode("none")
  networkController.resetNetwork()
})
deleteButton.addEventListener("click",()=>{
  networkController.setMode(networkController.MODES.delete)
})
editEdgeButton.addEventListener("click",()=>{
  networkController.setMode(networkController.MODES.editEdge)
})

optDivButton.addEventListener("click",()=>{
  let optDiv = document.querySelector("#optDiv") as HTMLDivElement;
  let algDiv = document.querySelector("#algDiv") as HTMLDivElement;
  if(optDiv.style.display == "none"){
    let styleSwap = optDivButton.className 
    optDiv.style.display = "flex"
    optDivButton.className = algDivButton.className
    algDiv.style.display = "none"
    algDivButton.className = styleSwap
  }
})
algDivButton.addEventListener("click",()=>{
  let optDiv = document.querySelector("#optDiv") as HTMLDivElement;
  let algDiv = document.querySelector("#algDiv") as HTMLDivElement;
  if(algDiv.style.display == "none"){
    let styleSwap = algDivButton.className 
    algDiv.style.display = "flex"
    algDivButton.className = optDivButton.className
    optDiv.style.display = "none"
    optDivButton.className = styleSwap
  }
})
showMainNetButton.addEventListener("click",()=>{
  let netArea = document.querySelector("#network") as HTMLDivElement;
  if(netArea.style.display == "none"){
    netArea.style.display = "inline"
    showMainNetButton.className = "tabSelected"
    showMainNetButton.textContent = "Nascondi Network"
  }
  else{
    netArea.style.display = "none"
    showMainNetButton.className = "tabNotSelected"
    showMainNetButton.textContent = "Mostra Network"
  }
})
showOutNetButton.addEventListener("click",()=>{
  let netArea = document.querySelector("#outputNetwork") as HTMLDivElement;
  if(netArea.style.display == "none"){
    netArea.style.display = "inline"
    showOutNetButton.className = "tabSelected"
    showOutNetButton.textContent = "Nascondi Output"
    let ouputDescription = document.querySelector("#outDescription") as HTMLLabelElement;
    ouputDescription.style.display="inline"
  }
  else{
    netArea.style.display = "none"
    showOutNetButton.className = "tabNotSelected"
    showOutNetButton.textContent = "Mostra Output"
    let ouputDescription = document.querySelector("#outDescription") as HTMLLabelElement;
    ouputDescription.style.display="none"
  }
})
completeNetButton.addEventListener("click",async()=>{
  networkController.completeNetwork()
})

loadNet.addEventListener("click",async () => {
  let overlay = document.querySelector("#overlay") as HTMLDivElement;
  let saveOver = document.querySelector("#saveOverlay") as HTMLFieldSetElement; 
  let loadOver = document.querySelector("#loadOverlay") as HTMLFieldSetElement; 
  let storedNet = document.querySelector("#storedNets") as HTMLTableElement;
  let tableBody = storedNet.querySelector("tbody") as HTMLTableSectionElement
  let tableHeader = tableBody.firstElementChild
  tableBody.replaceChildren()
  tableBody.appendChild(tableHeader)
  let storedNetworks = await storageController.getAllNetworks()
  for(const network of storedNetworks){
    let row = document.createElement("tr")
    let netName = document.createElement("td")
    let data1 = document.createElement("td")
    let data2 = document.createElement("td")
    let selectButton = document.createElement("button")
    let deleteButton = document.createElement("button")
    netName.innerText = network.nome
    selectButton.innerText="Apri"
    selectButton.className="functional"
    selectButton.addEventListener("click",()=>{
      loadNetwork(network)
    })
    deleteButton.innerText="Elimina"
    deleteButton.className="functional"
    deleteButton.addEventListener("click",()=>{
      let result = confirm("Sicuro di eliminare [ "+network.nome+" ] ? L'eliminazione porterà la perdità permanente dei dati")
      if(result)
        deleteNetwork(network.nome)
    })
    data1.appendChild(selectButton)
    data2.appendChild(deleteButton)
    row.appendChild(netName)
    row.appendChild(data1)
    row.appendChild(data2)
    tableBody.appendChild(row)
  }
  overlay.style.display = "inline"
  saveOver.style.display = "none"
  loadOver.style.display = "flex"
  s1.innerText="Carica"
  s1.removeEventListener("click",saveNetwork)
  s1.addEventListener("click",loadNetwork)
})
saveNet.addEventListener("click",async () => {
  let overlay = document.querySelector("#overlay") as HTMLDivElement;
  let saveOver = document.querySelector("#saveOverlay") as HTMLFieldSetElement; 
  let loadOver = document.querySelector("#loadOverlay") as HTMLFieldSetElement; 
  overlay.style.display = "inline"
  saveOver.style.display = "flex"
  loadOver.style.display = "none"
  s1.innerText="Salva"
  s1.removeEventListener("click",loadNetwork)
  s1.addEventListener("click",saveNetwork)
})
r1.addEventListener("click",removeOverlay)

async function switchStyleChange(node:HTMLElement){
  let bgColor = node.style.getPropertyValue("--bgColor");
  let fontColor = node.style.getPropertyValue("--fontColor");
  if(node.innerText === "NO"){
    node.innerText="SI"
    bgColor="springgreen"
    fontColor="black"
  }else{
    node.innerText="NO"
    bgColor="black"
    fontColor="springgreen"
  }
  node.style.setProperty("--bgColor",bgColor)
  node.style.setProperty("--fontColor",fontColor)
}

async function removeOverlay(){
  let overlay = document.querySelector("#overlay") as HTMLDivElement;
  overlay.style.display = "none"
}
async function loadNetwork(networkData){
  networkController.loadNetwork({info:networkData.info,data:networkData.data})
  if(networkData.info.isWeighted){
    if(enableWeightButton.innerText == "NO"){
      enableWeightButton.click()
    }
  }
  else{
    if(enableWeightButton.innerText == "SI"){
      enableWeightButton.click()
    }
  }
  if(networkData.info.isDirected){
    if(enableDirectionButton.innerText == "NO"){
      enableDirectionButton.click()
    }
  }
  else{
    if(enableDirectionButton.innerText == "SI"){
      enableDirectionButton.click()
    }
  }
  if(networkData.info.isBipartite){
    if(enableBipartitionButton.innerText == "NO"){
      enableBipartitionButton.click()
    }
  }
  else{
    if(enableBipartitionButton.innerText == "SI"){
      enableBipartitionButton.click()
    }
  }
  let text = document.querySelector("#nomeGrafo") as HTMLInputElement;
  text.value = networkData.nome
  removeOverlay()
}
async function saveNetwork(){
  let text = document.querySelector("#nomeGrafo") as HTMLInputElement;
  let networkInformations = await networkController.saveNetwork()
  try{
    await storageController.addNetwork({nome:text.value,info:networkInformations.info,data:networkInformations.data})
  }catch(KeyAlreadyExists){
    let result = confirm("Esiste già un elemento con questo nome, sovrascrivere l'elemento?")
    if(result)
      await storageController.updateNetwork({nome:text.value,info:networkInformations.info,data:networkInformations.data})
    else
      return
  }
  removeOverlay()
}
async function deleteNetwork(networkName:string):Promise<boolean>{
  removeOverlay()
  return await storageController.remove(networkName)
}
