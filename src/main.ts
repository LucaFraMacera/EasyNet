import * as networkController from "./networkController";
import "./styles/animations.css"
import "./styles/buttonStyles.css"
import "./styles/fieldsStyle.css"
import "./styles/generalStyle.css"
const addButton = document.querySelector("#addNode")as HTMLButtonElement;
const edgeButton = document.querySelector("#addEdge")as HTMLButtonElement;
const deleteButton = document.querySelector("#delete")as HTMLButtonElement;
const resetButton = document.querySelector("#reset")as HTMLButtonElement;
const editEdgeButton = document.querySelector("#editEdge")as HTMLButtonElement;
const enableDirectionButton = document.querySelector("#netType") as HTMLButtonElement;
const enableWeightButton = document.querySelector("#isWeighted")as HTMLButtonElement;
const weightSection = document.querySelector("#weight")as HTMLLabelElement;
const optDivButton = document.querySelector("#optDivButton") as HTMLButtonElement;
const algDivButton = document.querySelector("#algDivButton") as HTMLButtonElement;
const showMainNetButton = document.querySelector("#showMainNet") as HTMLButtonElement;
const showOutNetButton = document.querySelector("#showOutNet") as HTMLButtonElement;
enableDirectionButton.addEventListener("click", ()=>{
  let bgColor = enableDirectionButton.style.getPropertyValue("--bgColor");
  let fontColor = enableDirectionButton.style.getPropertyValue("--fontColor");
  if(!bgColor || bgColor === "black"){
    enableDirectionButton.innerText="SI"
    bgColor="springgreen"
    fontColor="black"
    networkController.setNetworkDirection(true)
  }else{
    enableDirectionButton.innerText="NO"
    bgColor="black"
    fontColor="springgreen"
    networkController.setNetworkDirection(false)
  }
  enableDirectionButton.style.setProperty("--bgColor",bgColor)
  enableDirectionButton.style.setProperty("--fontColor",fontColor)
})

enableWeightButton.addEventListener("click",()=>{
  let bgColor = enableWeightButton.style.getPropertyValue("--bgColor");
  let fontColor = enableWeightButton.style.getPropertyValue("--fontColor");
  if(enableWeightButton.innerHTML === "NO"){
    enableWeightButton.innerText="SI"
    bgColor="springgreen"
    fontColor="black"
    weightSection.style.display="inline"
    networkController.setWeighted(true)
  }else{
    weightSection.style.display="none"
    enableWeightButton.innerText="NO"
    bgColor="black"
    fontColor="springgreen"
    networkController.setWeighted(false)
  }
  enableWeightButton.style.setProperty("--bgColor",bgColor)
  enableWeightButton.style.setProperty("--fontColor",fontColor)
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
