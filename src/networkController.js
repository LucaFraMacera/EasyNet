import {DataSet} from "vis-data"
import {Network} from "vis-network/peer"
import * as descriptionsController from "./descriptionController"
const CONSTANTS={
    nodeColor:"rgb(10,10,10)",
    primaryColor:"springgreen",
    secondaryColor:"rgb(7, 163, 140)",
    edgeWeightColor:"rgb(0,200,50)"
}
let deleteMode = false
let edgeMode = false
let edgeModeEdit = false
let nodeIDs=1
const nodes = new DataSet([]);
const edges = new DataSet([]);
const container = document.querySelector("#network");
const deleteButton = document.querySelector("#delete");
const edgeButton = document.querySelector("#addEdge");
const editEdgeButton = document.querySelector("#editEdge");
const edgeWeight = document.querySelector("#edgeWeight");
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
export function setMode(value){
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
}
export function resetNetwork(){
    nodeIDs=1
    nodes.clear()
    edges.clear()
    network.redraw()
}
function editEdgeMode(value){
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
function setDeleteMode(value){
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
function addEdgeMode(value){
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
var options = {
  interaction: { 
    hover: true,
    selectConnectedEdges:false
  },
  manipulation:{
    addEdge:function(edgeData,callback){
      let weight = edgeWeight.value
      edgeData.label = weight
      callback(edgeData)
      descriptionsController.setDescription(descriptionsController.descriptions.DEFAULT)
      edgeButton.innerText="Crea Arco"
      addEdgeMode(false)
    },
    deleteNode:function(nodeData,callback){
      callback(nodeData)
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
         edgeData.from = edgeData.to = (edgeData.from.length >= edgeData.to.length) ? edgeData.from : edgeData.to
        callback(edgeData)
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
      roundness:0.2
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
    enabled:false
  }
};
var network = new Network(container, data, options);
export function setNetworkDirection(value){
  options.edges.arrows.to=value
  network.setOptions(options)
}
export function setWeighted(value){
  if(value){
    options.edges.font.size=20
  }else{
    options.edges.font.size=0
  }
  network.setOptions(options)
}