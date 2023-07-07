import {DataSet} from "vis-data"
import {Network} from "vis-network/peer"
import * as descriptionsController from "./descriptionController"
import * as outputNetworkController from "./outputNetsController"
import "./styles/networkStyle"
import { MAIN_COLORS,BIPARTITION_COLORS, HOVER_COLORS} from "./styles/networkStyle"
const performanceLVLs ={
  max: 3,
  medium:1,
  normal:0
}
let performance = performanceLVLs.normal
const nodeGroups={
  standard : "standardNode",
  stable1: "stableGroup1",
  stable2: "stableGroup2",
  neutral: "neutralNode"
}
const modes = {
  deleteMode: false,
  edgeModeAdd : false,
  edgeModeEdit : false,
}
const networkInformations = {
  isDirected : false,
  isWeighted : false,
  isBipartite : false
}
let nodeIDs=1
let selectedEdge = null
const nodes = new DataSet([]);
const edges = new DataSet([]);
const container = document.querySelector("#network") as HTMLDivElement;
const sourceSelect = document.querySelector("#sourceNode") as HTMLSelectElement;
const destinationSelect = document.querySelector("#destinationNode") as HTMLSelectElement;
const deleteButton = document.querySelector("#delete") as HTMLButtonElement;
const edgeButton = document.querySelector("#addEdge")as HTMLButtonElement;
const editEdgeButton = document.querySelector("#editEdge")as HTMLButtonElement;
const swapEdgeButton = document.querySelector("#swapEdge")as HTMLButtonElement;
const commitEdgeEdit = document.querySelector("#commitEdgeEdit") as HTMLButtonElement;
const edgeWeight = document.querySelector("#edgeWeight") as HTMLInputElement;
const dijkstra = document.querySelector("#dijkstra")! as HTMLButtonElement
const prim = document.querySelector("#prim")! as HTMLButtonElement;
const kruskal = document.querySelector("#kruskal")! as HTMLButtonElement;
const floydWharshall = document.querySelector("#flwr")! as HTMLButtonElement;
const excecuteAlg = document.querySelector("#excecuteAlg")! as HTMLButtonElement;

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
export async function addVertex(){
  let newID = "V"+nodeIDs
  nodes.add({
    id:newID,
    label:"V"+nodeIDs++,
    group: networkInformations.isBipartite? nodeGroups.neutral:nodeGroups.standard
  })
  let newOpt = document.createElement("option")
  let newOpt2 = document.createElement("option")
  newOpt.id="S"+newID
  newOpt.value=newID
  newOpt.innerText=newID
  newOpt2.id="D"+newID
  newOpt2.value=newID
  newOpt2.innerText=newID
  sourceSelect.appendChild(newOpt)
  destinationSelect.appendChild(newOpt2)
}
export function resetNetwork(){
    nodeIDs=1
    nodes.clear()
    edges.clear()
    network.redraw()
    let selectOptions:Node[] = []
    selectOptions[0] = sourceSelect.firstChild
    selectOptions[1] = destinationSelect.firstChild
    sourceSelect.replaceChildren()
    destinationSelect.replaceChildren()
    sourceSelect.appendChild(selectOptions[0])
    destinationSelect.appendChild(selectOptions[1])
    setMode(null)
    checkPerformance()
}
function editEdgeMode(value:boolean){
  if(value && !modes.edgeModeEdit){
    modes.edgeModeEdit=true
    editEdgeButton.innerHTML="Annulla"
    commitEdgeEdit.style.display = "inline"
    if(networkInformations.isDirected)
      swapEdgeButton.style.display = "inline"
    descriptionsController.setDescription(descriptionsController.descriptions.EDIT_EDGE)
    selectedEdge=edges.get(network.getSelectedEdges()[0])
    network.editEdgeMode()
  }
  else{
    modes.edgeModeEdit=false
    network.disableEditMode()
    descriptionsController.setDescription("DEFAULT")
    editEdgeButton.innerHTML="Modifica"
    commitEdgeEdit.style.display = "none"
    editEdgeButton.style.display="none"
    swapEdgeButton.style.display = "none"
    network.unselectAll()
    if(selectedEdge){
      edges.updateOnly(selectedEdge)
    }
    selectedEdge = null
  }
}
function setDeleteMode(value:boolean){
  if(value && !modes.deleteMode){
    modes.deleteMode=true
    descriptionsController.setDescription(descriptionsController.descriptions.DELETE)
    deleteButton.innerHTML= "Annulla"
    options.interaction.selectConnectedEdges = true
    network.setOptions(options)
  }
  else{
    modes.deleteMode=false
    descriptionsController.setDescription("DEFAULT")
    deleteButton.innerHTML= "Cancella"
    options.interaction.selectConnectedEdges = false
    network.setOptions(options)
  }
}
function addEdgeMode(value:boolean){
  if(value && !modes.edgeModeAdd){
    modes.edgeModeAdd=true
    descriptionsController.setDescription(descriptionsController.descriptions.ADD_EDGE)
    network.addEdgeMode()
    edgeButton.innerText = "Annulla"
  }
  else{
    modes.edgeModeAdd=false
    descriptionsController.setDescription(descriptionsController.descriptions.DEFAULT)
    network.disableEditMode()
    edgeButton.innerText = "Crea Arco"
  }
}
container.addEventListener("click",()=>{
    if(modes.deleteMode){
        network.deleteSelected()
    }
})
container.addEventListener("dblclick",async ()=>{
  let selections = network.getSelectedEdges()
  if(selections.length !==1 )
    return
  setMode(MODES.editEdge)
})
const data = {
  nodes: nodes,
  edges: edges
};
const options = {
  interaction: { 
    hover: true,
    selectConnectedEdges:false,
    hideEdgesOnDrag: false,
    hideEdgesOnZoom: false,
  },
  manipulation:{
    addEdge:function(edgeData:any,callback:any){
      let weight = networkInformations.isWeighted? edgeWeight.value : "1"
      try{
        edgeData.id = edgeData.from+""+edgeData.to
        edgeData.label = weight
        if(networkInformations.isBipartite){
          let from = nodes.get(edgeData.from) as any
          let to = nodes.get(edgeData.to) as any
          if(from.group === to.group){
            if(from.group !== nodeGroups.neutral){
              alert("Non si puo aggiungere un arco tra due nodi dello stesso insieme stabile")
              throw "Same Stable Set"
            }
          }
          if(from.group === nodeGroups.neutral && to.group === nodeGroups.neutral){
            nodes.updateOnly({id:from.id,group:nodeGroups.stable1})
            nodes.updateOnly({id:to.id,group:nodeGroups.stable2})
          }
          else if(from.group === nodeGroups.neutral && to.group !== nodeGroups.neutral){
            nodes.updateOnly(
              {
                id:from.id,
                group: to.group === nodeGroups.stable1? nodeGroups.stable2:nodeGroups.stable1
              })
          }
          else if(from.group !== nodeGroups.neutral && to.group === nodeGroups.neutral){
            nodes.updateOnly(
              {
                id:to.id,
                group: from.group===nodeGroups.stable1? nodeGroups.stable2:nodeGroups.stable1
              })
          }
        }
        callback(edgeData)
      }catch(EdgeAlreadyExists){console.error(EdgeAlreadyExists)/* block the creation of a new edge */}
      descriptionsController.setDescription(descriptionsController.descriptions.DEFAULT)
      edgeButton.innerText="Crea Arco"
      addEdgeMode(false)
      checkPerformance()
    },
    deleteNode:function(nodeData:any,callback:any){
      callback(nodeData)
      document.querySelector("#S"+nodeData.nodes[0]).remove()
      document.querySelector("#D"+nodeData.nodes[0]).remove()
      deleteButton.innerText="Cancella"
      setDeleteMode(false)
      checkPerformance()
    },
    deleteEdge:function(edgeData:any,callback:any){
      callback(edgeData)
      deleteButton.innerText="Cancella"
      setDeleteMode(false)
      checkPerformance()
    },
    editEdge:function(edgeData:any,callback:any){
      if(edgeData.from.length >=10 || edgeData.to.length>=10){
         alert("Non si possono creare cappi")
         callback()
      }else{
        let weight = networkInformations.isWeighted? edgeWeight.value: "1"
        edgeData.label = weight
        try{
          if(networkInformations.isBipartite){
            let from = nodes.get(edgeData.from) as any
            let to = nodes.get(edgeData.to) as any
            if(from.group === to.group){
              if(from.group !== nodeGroups.neutral){
                alert("Non si puo aggiungere un arco tra due nodi dello stesso insieme stabile")
                throw "Same Stable Set"
              }
            }
            else if(from.group === nodeGroups.neutral && to.group !== nodeGroups.neutral){
              nodes.updateOnly(
                {
                  id:from.id,
                  group:to.group===nodeGroups.stable1? nodeGroups.stable2: nodeGroups.stable1
                })
            }
            else if(from.group !== nodeGroups.neutral && to.group === nodeGroups.neutral){
              nodes.updateOnly(
                {
                  id:to.id,
                  group:from.group===nodeGroups.stable1? nodeGroups.stable2: nodeGroups.stable1
                })
            }
          }
          let oldID = edgeData.id
          if(edgeData.from+""+edgeData.to !== edgeData.id){
            edgeData.id=edgeData.from+""+edgeData.to
          }
          selectedEdge = null
          callback(edgeData)
          if(oldID !== edgeData.id)
            edges.remove(oldID)
        }catch(EdgeCannotBeEdited){console.error(EdgeCannotBeEdited)/**Don't do anything */}
      }
      editEdgeMode(false)
    }
  },
  edges:{
    width:2,
    smooth:{
      enabled:true,
      type:"continuous",
      roundness:0.3
    },
    chosen:{
      edge:function(values, id, selected, hovering) {
        values.color=(hovering && modes.deleteMode)?MAIN_COLORS.deleteColor:HOVER_COLORS.border
        if(selected && !modes.deleteMode)
          editEdgeButton.style.display="inline"
      }
    },
    arrows:{
      to:false
    },
    hoverWidth: 0,
    font:{
      align:"middle",
      size:0,
      strokeColor:MAIN_COLORS.edgeWeightStroke,
      strokeWidth:3,
      color:MAIN_COLORS.edgeWeightColor,
       bold:{
         size:20
       }
    },
    color: MAIN_COLORS.primaryColor
  },
  nodes:{
    shape:"circle",
    borderWidth:5,
    widthConstraint:50,
    chosen:{
      node:function(values, id, selected, hovering) {
        editEdgeButton.style.display="none"
        if(hovering && modes.deleteMode){
          values.borderColor=MAIN_COLORS.deleteColor
          values.fontColor=MAIN_COLORS.deleteColor
        }
        else{
          values.borderColor=HOVER_COLORS.label
          values.fontColor=HOVER_COLORS.label
        }
      },
      label:function(values, id, selected, hovering) {
        if(hovering && modes.deleteMode)
          values.color=MAIN_COLORS.deleteColor
        else
          values.color=HOVER_COLORS.label   
        values.mod = "bold"
      }
    },
    font:{
      align:"center",
      size:30,
      strokeWidth:2
    }
  },
  groups:{
    standardNode:{
      color:{
        background: MAIN_COLORS.nodeColor,
        border: MAIN_COLORS.primaryColor
      },
      font:{
        color:MAIN_COLORS.primaryColor,
        strokeColor:MAIN_COLORS.nodeColor
      }
    },
    stableGroup1:{
      color:BIPARTITION_COLORS.stableColor1,
      font:{
        color:BIPARTITION_COLORS.nodeLabel,
        strokeColor:BIPARTITION_COLORS.nodeLabel
      }
    },
    stableGroup2:{
      color:BIPARTITION_COLORS.stableColor2,
      font:{
        color:BIPARTITION_COLORS.nodeLabel,
        strokeColor:BIPARTITION_COLORS.nodeLabel
      }
    },
    neutralNode:{
      color:{
        background: BIPARTITION_COLORS.neutralColor,
        border: BIPARTITION_COLORS.neutralColor
      },
      font:{
        color:BIPARTITION_COLORS.nodeLabel,
        strokeColor:BIPARTITION_COLORS.nodeLabel
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

export function switchNetworkDirection(){
  networkInformations.isDirected = !networkInformations.isDirected
  options.edges.arrows.to = networkInformations.isDirected
  network.setOptions(options)
}
export function switchWeighted(){
  networkInformations.isWeighted= !networkInformations.isWeighted
  if(networkInformations.isWeighted){
    edgeWeight.parentElement.style.display="inline"
    options.edges.font.size=20
  }else{
    edgeWeight.parentElement.style.display="none"
    options.edges.font.size=0
    let copyEdges = edges.get()
    copyEdges.forEach(async (edge)=>{
      try{
        edges.updateOnly({id:edge.id,label:"1"})
      }catch(Errore){console.error("bruh")}
    })
  }
  network.setOptions(options)
}
export function switchBipartition(){
  networkInformations.isBipartite= !networkInformations.isBipartite
  if(networkInformations.isBipartite){
    if(nodes.length===0)
      return
    try{
      let network = outputNetworkController.convertToLocalNet(nodes,edges,options)
      let coloration = network.isBipartite(true)
      if(!coloration){
        networkInformations.isBipartite = false
        throw "Grafo non è bipartito, non puo essere bipartito"
      }
      if(coloration instanceof Map)
        setBipatition(coloration)
    }catch(GraphNotFound){
      networkInformations.isBipartite = false
      throw GraphNotFound
    }
  }
  else{
    let netNodes = nodes.get()
    for(const node of netNodes){
      nodes.updateOnly(
        {
          id:node.id, 
          group:nodeGroups.standard
        })
    }
    options.edges.color=MAIN_COLORS.primaryColor
    network.setOptions(options)
  }
}
edgeWeight.addEventListener("change",async()=>{
  if(!modes.edgeModeEdit)
    return
  let weight = edgeWeight.value
  edges.updateOnly({id:selectedEdge.id,label:weight})
})
commitEdgeEdit.addEventListener("click", async()=>{
  if(!modes.edgeModeEdit)
    return
  let weight = edgeWeight.value
  edges.updateOnly({id:selectedEdge.id,label:weight})
  selectedEdge=null
  editEdgeMode(false)
})
swapEdgeButton.addEventListener("click",async()=>{
  let selection = edges.get(network.getSelectedEdges()[0])
  let selected = null
  let edgeID = null
  if(selection instanceof Array){
    edgeID = selectedEdge.id
    selected = edges.get(selectedEdge.id)
  }else{
    edgeID = selection.id
    selected = selection
  }
  edges.updateOnly({id:edgeID,from:selected.to,to:selected.from})
  network.setSelection({edges:[edgeID]})
  network.editEdgeMode()
})
dijkstra.addEventListener("click",async ()=>{
  prim.className = "tabNotSelected"
  dijkstra.className="tabSelected"
  sourceSelect.parentElement.style.display="flex"
  destinationSelect.parentElement.style.display="flex"
  excecuteAlg.style.display="inline"
})
prim.addEventListener("click", async()=>{
  dijkstra.className = "tabNotSelected"
  prim.className="tabSelected"
  sourceSelect.parentElement.style.display="flex"
  destinationSelect.parentElement.style.display="none"
  excecuteAlg.style.display="inline"
})
kruskal.addEventListener("click",async()=>{
  let showOutNetButton = document.querySelector("#showOutNet") as HTMLButtonElement;
  let outputNet= document.querySelector("#outputNetwork") as HTMLDivElement;
  let notVisible =  outputNet.style.display == "none"
  prim.className = "tabNotSelected"
  dijkstra.className = "tabNotSelected"
  sourceSelect.parentElement.style.display="none"
  destinationSelect.parentElement.style.display="none"
  excecuteAlg.style.display="none"
  let result = outputNetworkController.doKruskal()
  if(notVisible && result){
    if(showOutNetButton.className != "tabNotSelectedGlow")
      showOutNetButton.className = "tabNotSelectedGlow"
  }
  descriptionsController.setOutputDescription(descriptionsController.algorithms.KRUSKAL)
})
floydWharshall.addEventListener("click", async()=>{
  let showOutNetButton = document.querySelector("#showOutNet") as HTMLButtonElement;
  let outputNet= document.querySelector("#outputNetwork") as HTMLDivElement;
  let notVisible =  outputNet.style.display == "none"
  prim.className = "tabNotSelected"
  dijkstra.className = "tabNotSelected"
  sourceSelect.parentElement.style.display="none"
  destinationSelect.parentElement.style.display="none"
  excecuteAlg.style.display="none"
  let result = await outputNetworkController.doFloydAndWharshall()
  if(notVisible && result){
    if(showOutNetButton.className != "tabNotSelectedGlow")
      showOutNetButton.className = "tabNotSelectedGlow"
  }
  descriptionsController.setOutputDescription(descriptionsController.algorithms.KRUSKAL)
})
excecuteAlg.addEventListener("click", async()=>{
  if(dijkstra.className == "tabSelected")
    return await runDijkstra()
  if(prim.className == "tabSelected")
    return await runPrim()
})
export function getNetworkData():{nodes:DataSet<any>,edges:DataSet<any>,options:any}{
  return {nodes,edges,options}
}
export async function completeNetwork(){
  edges.clear()
  if(networkInformations.isBipartite){
    createCompleteBipartite()
  }else{
    createQlique()
  }
  checkPerformance()
  network.setData(data)   
}
async function runDijkstra(){
  let showOutNetButton = document.querySelector("#showOutNet") as HTMLButtonElement;
  let algButtonDiv = document.querySelector("#algButtons") as HTMLDivElement;
  let outputNet= document.querySelector("#outputNetwork") as HTMLDivElement;
  let sourceDiv = document.querySelector("#sourceDiv") as HTMLDivElement;
  let errorLabel = document.querySelector("#errorLabel") as HTMLLabelElement;
  let errorLabel1 = document.querySelector("#errorLabel1") as HTMLLabelElement;
  let notVisible =  outputNet.style.display == "none"
  let source = sourceSelect.options[sourceSelect.selectedIndex]
  let destination = destinationSelect.options[destinationSelect.selectedIndex]
  if(!networkInformations.isWeighted){
    algButtonDiv.className = "glitchError"
    errorLabel1.className = "showError1"
    setTimeout(()=>{
      algButtonDiv.className=null
    },250)
    setTimeout(()=>{
      errorLabel1.className="errorLabel"
    },1000)
    return
  }
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
  descriptionsController.setOutputDescription(descriptionsController.algorithms.DIJKSTRA)
}

async function runPrim(){
  let showOutNetButton = document.querySelector("#showOutNet") as HTMLButtonElement;
  let algButtonDiv = document.querySelector("#algButtons") as HTMLDivElement;
  let outputNet= document.querySelector("#outputNetwork") as HTMLDivElement;
  let sourceDiv = document.querySelector("#sourceDiv") as HTMLDivElement;
  let errorLabel = document.querySelector("#errorLabel") as HTMLLabelElement;
  let errorLabel1 = document.querySelector("#errorLabel1") as HTMLLabelElement;
  let notVisible =  outputNet.style.display == "none"
  let source = sourceSelect.options[sourceSelect.selectedIndex]
  if(!networkInformations.isWeighted){
    algButtonDiv.className = "glitchError"
    errorLabel1.className = "showError1"
    setTimeout(()=>{
      algButtonDiv.className=null
    },250)
    setTimeout(()=>{
      errorLabel1.className="errorLabel"
    },1000)
    return
  }
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
  let result = outputNetworkController.doPrim(source.value)
  if(notVisible && result){
    if(showOutNetButton.className != "tabNotSelectedGlow")
      showOutNetButton.className = "tabNotSelectedGlow"
  }
  descriptionsController.setOutputDescription(descriptionsController.algorithms.PRIM)
}
async function setBipatition(coloration:Map<String,string>):Promise<void>{
  let color = null
  for(const entries of coloration.entries()){
    let groupToAssign = nodeGroups.stable1
    if(!color)
      color = entries[1]
    if(entries[1] === color)
      groupToAssign = nodeGroups.stable1
    else
      groupToAssign = nodeGroups.stable2
    nodes.updateOnly(
      {
        id:entries[0],
        group:groupToAssign
      })
  }
  options.edges.color=BIPARTITION_COLORS.edges
  network.setOptions(options)
}
async function createQlique(){
  for(const node of nodes.get()){
    for(const node1 of nodes.get()){
      if(!(node.id === node1.id)){
        let weight= networkInformations.isWeighted? edgeWeight.value : "1"
        let newEdge = {
          id: node.id+""+node1.id,
          from :node.id,
          to: node1.id,
          label : weight
        }
        try{
          if(networkInformations.isDirected || !(edges.get(node1.id+""+node.id)))
            edges.add(newEdge)
        }catch(EdgeAlreadyExists){/*Do nothing */}
      }
    }
  }
}
async function createCompleteBipartite(){
  if(nodes.length===0)
    return
  let newGroup = nodeGroups.stable1
  let netNodes = nodes.get()
  for(const node of netNodes)
    if(node.group===nodeGroups.neutral){
      nodes.updateOnly({id:node.id,group:newGroup})
      newGroup= newGroup===nodeGroups.stable1?nodeGroups.stable2 :nodeGroups.stable1
    }
  let outer = nodes.get()
  for(const node of outer){
    let inner = nodes.get()
    for(const node1 of inner){
      if(!(node.id === node1.id)){
        let weight= networkInformations.isWeighted? edgeWeight.value : "1"
        let newEdge = {
          id: node.id+""+node1.id,
          from :node.id,
          to: node1.id,
          label : weight
        }
        try{
          if(networkInformations.isDirected || !(edges.get(node1.id+""+node.id))){
            if(node.group === node1.group)
              continue
            edges.add(newEdge)
          }  
        }catch(EdgeAlreadyExists){/*Do nothing */}
      }
    }
  }
}
function checkPerformance():void{
  let newPerformanceLVL = performance
  if(edges.length>=350){
    options.edges.smooth.enabled = false
    options.interaction.hideEdgesOnDrag= true
    options.interaction.hideEdgesOnZoom= true
    newPerformanceLVL = performanceLVLs.max
  }
  else if(edges.length>=250){
    options.edges.smooth.enabled = false
    options.interaction.hideEdgesOnDrag= false
    options.interaction.hideEdgesOnZoom= true
    newPerformanceLVL = performanceLVLs.medium
  }
  else{
    options.edges.smooth.enabled = true
    options.interaction.hideEdgesOnDrag= false
    options.interaction.hideEdgesOnZoom= false
    newPerformanceLVL = performanceLVLs.normal
  }
  if(newPerformanceLVL != performance){
    performance = newPerformanceLVL
    network.setOptions(options)
    network.redraw()
  }
}
async function changeNetworkCursor(cursor:string):Promise<void>{
  container.style.cursor = cursor
}
export async function saveNetwork(){
  return {info:networkInformations,data:{nodes:nodes.get(),edges:edges.get()}}
}
export async function loadNetwork(netInfo:{info:{isBipartite:boolean,isWeighted:boolean,isDirected:boolean},data:{nodes:any,edges:any}}) {
  resetNetwork()
  setMode(null)
  netInfo.data.nodes.forEach(element => {
    nodes.add({
      id:element.id,
      label:element.label,
      group: element.group
    })
    let newOpt = document.createElement("option")
    let newOpt2 = document.createElement("option")
    newOpt.id="S"+element.id
    newOpt.value=element.id
    newOpt.innerText=element.id
    newOpt2.id="D"+element.id
    newOpt2.value=element.id
    newOpt2.innerText=element.id
    sourceSelect.appendChild(newOpt)
    destinationSelect.appendChild(newOpt2)
    let numId = element.id.match(/([0-9]+)/gm)
    if(nodeIDs < Number.parseInt(numId))
      nodeIDs = numId
  });
  edges.add(netInfo.data.edges)
  checkPerformance()
  nodeIDs++
}
network.on("hoverNode",async ()=>{
  if(modes.deleteMode)
    changeNetworkCursor("crosshair")
  else if(modes.edgeModeAdd)
    changeNetworkCursor("cell")
  else
    changeNetworkCursor("grab")
})
network.on("dragging",async ()=>changeNetworkCursor("grabbing"))
network.on("dragEnd",async ()=>changeNetworkCursor("auto"))
network.on("blurNode",async ()=>changeNetworkCursor("auto"))
