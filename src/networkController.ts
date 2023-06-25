import {DataSet} from "vis-data"
import {Network} from "vis-network/peer"
import * as descriptionsController from "./descriptionController"
import * as outputNetworkController from "./outputNetsController"
import "./styles/networkStyle"
import { CONSTANTS } from "./styles/networkStyle"

let deleteMode = false
let edgeMode = false
let edgeModeEdit = false
let isDirected = false
let isWeighted = false
let nodeIDs=1
const nodes = new DataSet([]);
const edges = new DataSet([]);
const container = document.querySelector("#network") as HTMLDivElement;
const sourceSelect = document.querySelector("#sourceNode") as HTMLSelectElement;
const destinationSelect = document.querySelector("#destinationNode") as HTMLSelectElement;
const deleteButton = document.querySelector("#delete") as HTMLButtonElement;
const edgeButton = document.querySelector("#addEdge")as HTMLButtonElement;
const editEdgeButton = document.querySelector("#editEdge")as HTMLButtonElement;
const edgeWeight = document.querySelector("#edgeWeight") as HTMLInputElement;
const dijkstra = document.querySelector("#dijkstra")! as HTMLButtonElement
const prim = document.querySelector("#prim")! as HTMLButtonElement
const kruskal = document.querySelector("#kruskal")! as HTMLButtonElement
function resetModes(){
  setDeleteMode(false)
  addEdgeMode(false)
  editEdgeMode(false)
}

export const MODES={
  delete:"delete",
  addEdge:"addE",
  editEdge:"editE"
}
export function setMode(value:String){
  switch(value){
    case MODES.delete:
      editEdgeMode(false)
      addEdgeMode(false)
      setDeleteMode(true)
      break
    case MODES.addEdge:
      editEdgeMode(false)
      setDeleteMode(false)
      addEdgeMode(true)
      break
    case MODES.editEdge:
      setDeleteMode(false)
      addEdgeMode(false)
      editEdgeMode(true)
      break
    default:
      resetModes()
  }
}
export function addVertex(){
    nodes.add({
      id:nodeIDs,
      label:"V"+nodeIDs++
    })
    let newOpt = document.createElement("option")
    let newOpt2 = document.createElement("option")
    newOpt.id="S"+(nodeIDs-1)
    newOpt.value="V"+(nodeIDs-1)
    newOpt.innerText="V"+(nodeIDs-1)
    newOpt2.id="D"+(nodeIDs-1)
    newOpt2.value="V"+(nodeIDs-1)
    newOpt2.innerText="V"+(nodeIDs-1)
    sourceSelect.appendChild(newOpt)
    destinationSelect.appendChild(newOpt2)
}
export function resetNetwork(){
    nodeIDs=1
    nodes.clear()
    edges.clear()
    network.redraw()
    let options:Node[] = []
    options[0] = sourceSelect.firstChild
    options[1] = destinationSelect.firstChild
    sourceSelect.replaceChildren(null)
    destinationSelect.replaceChildren(null)
    sourceSelect.appendChild(options[0])
    destinationSelect.appendChild(options[1])
}
function editEdgeMode(value:boolean){
  if(value && !edgeModeEdit){
    edgeModeEdit=true
    editEdgeButton.innerHTML="Annulla"
    descriptionsController.setDescription(descriptionsController.descriptions.EDIT_EDGE)
    network.editEdgeMode()
  }
  else{
    editEdgeButton.innerHTML="Modifica"
    edgeModeEdit=false
    network.disableEditMode()
    descriptionsController.setDescription("DEFAULT")
    editEdgeButton.style.display="none"
    network.unselectAll()
  }
}
function setDeleteMode(value:boolean){
  if(value && !deleteMode){
    deleteMode=true
    descriptionsController.setDescription(descriptionsController.descriptions.DELETE)
    deleteButton.innerHTML= "Annulla"
  }
  else{
    deleteMode=false
    descriptionsController.setDescription("DEFAULT")
    deleteButton.innerHTML= "Cancella"
  }
}
function addEdgeMode(value:boolean){
  if(value && !edgeMode){
    edgeMode=true
    descriptionsController.setDescription(descriptionsController.descriptions.ADD_EDGE)
    network.addEdgeMode()
    edgeButton.innerText = "Annulla"
  }
  else{
    edgeMode=false
    descriptionsController.setDescription(descriptionsController.descriptions.DEFAULT)
    network.disableEditMode()
    edgeButton.innerText = "Crea Arco"
  }
}
container.addEventListener("click",()=>{
    if(deleteMode){
        network.deleteSelected()
    }
})
const data = {
  nodes: nodes,
  edges: edges
};
const options = {
  interaction: { 
    hover: true,
    selectConnectedEdges:false
  },
  manipulation:{
    addEdge:function(edgeData,callback){
      let weight = edgeWeight.value
      try{
        edgeData.id = edgeData.from+""+edgeData.to
        edgeData.label = weight
        callback(edgeData)
      }catch(EdgeAlreadyExists){/* block the creation of a new edge */}
      descriptionsController.setDescription(descriptionsController.descriptions.DEFAULT)
      edgeButton.innerText="Crea Arco"
      addEdgeMode(false)
    },
    deleteNode:function(nodeData,callback){
      callback(nodeData)
      document.querySelector("#S"+nodeData.nodes[0]).remove()
      document.querySelector("#D"+nodeData.nodes[0]).remove()
      deleteButton.innerText="Cancella"
      setDeleteMode(false)
    },
    deleteEdge:function(edgeData,callback){
      callback(edgeData)
      deleteButton.innerText="Cancella"
      setDeleteMode(false)
    },
    editEdge:function(edgeData,callback){
      if(edgeData.from.length >=10 || edgeData.to.length>=10){
         alert("Non si possono creare cappi")
         callback()
      }else{
        let weight = edgeWeight.value
        edgeData.label = weight
        callback(edgeData)
      }
      editEdgeMode(false)
    }
  },
  edges:{
    "width":3,
    smooth:{
      "enabled":true,
      "type":"continuous",
      roundness:0.5
    },
    chosen:{
      edge:function(values, id, selected, hovering) {
        values.color=(hovering && deleteMode)?"red":CONSTANTS.secondaryColor
        if(selected && !deleteMode)
          editEdgeButton.style.display="inline"
      }
    },
    arrows:{
      "to":false
    },
    "hoverWidth": 0,
    font:{
      "align":"middle",
      "size":0,
      "strokeColor":CONSTANTS.edgeWeightColor,
       bold:{
         "size":20,
         "color":CONSTANTS.secondaryColor
       }
    }
  },
  nodes:{
    "shape":"circle",
    "borderWidth":3,
    widthConstraint:50,
    font:{
      "align":"center",
      "size":30,
      "color":CONSTANTS.primaryColor
    },
    color:{
      "background" :CONSTANTS.nodeColor, 
      "border": CONSTANTS.primaryColor,
    },
    chosen:{
      node:function(values, id, selected, hovering) {
        editEdgeButton.style.display="none"
        if(hovering && deleteMode){
          values.borderColor="red"
          values.fontColor="red"
        }
        else{
          values.borderColor=CONSTANTS.secondaryColor
          values.fontColor=CONSTANTS.secondaryColor
        }
      },
      label:function(values, id, selected, hovering) {
        if(hovering && deleteMode)
          values.color="red"
        else
          values.color=CONSTANTS.secondaryColor    
        values.mod = "bold"
      }
    }
  },
  physics:{
    barnesHut: {
      theta: 0.1,
      gravitationalConstant:-50,
      centralGravity: 0,
      springConstant: 0,
      avoidOverlap: 1
    },
    maxVelocity: 5,
    minVelocity: 1
  }
}as any;
var network = new Network(container, data, options);

export function setNetworkDirection(value:boolean){
  isDirected=value
  options.edges.arrows.to=value
  network.setOptions(options)
}
export function setWeighted(value:boolean){
  isWeighted=value
  if(value){
    options.edges.font.size=20
  }else{
    options.edges.font.size=0
  }
  network.setOptions(options)
}

dijkstra.addEventListener("click",async ()=>{
  let showOutNetButton = document.querySelector("#showOutNet") as HTMLButtonElement;
  let outputNet= document.querySelector("#outputNetwork") as HTMLDivElement;
  let sourceDiv = document.querySelector("#sourceDiv") as HTMLDivElement;
  let errorLabel = document.querySelector("#errorLabel") as HTMLLabelElement;
  let notVisible =  outputNet.style.display == "none"
  let source = sourceSelect.options[sourceSelect.selectedIndex]
  let destination = destinationSelect.options[destinationSelect.selectedIndex]
  if(!source.id){
    sourceDiv.className = "glitchError"
    errorLabel.className = "showError"
    setTimeout(()=>{
      sourceDiv.className=null
    },250)
    setTimeout(()=>{
      errorLabel.className="errorLabel"
    },1000)
    return
  }
  let result = outputNetworkController.doDijkstra(source.value,destination.value)
  if(notVisible && result){
    if(showOutNetButton.className != "tabNotSelectedGlow")
      showOutNetButton.className = "tabNotSelectedGlow"
  }
})
export function getNetworkData():{nodes:DataSet<any>,edges:DataSet<any>,options:any}{
  return {nodes,edges,options}
}