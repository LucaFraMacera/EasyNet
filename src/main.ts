import * as networkController from "./networkController";
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
const weightSection = document.querySelector("#weight")as HTMLLabelElement

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
