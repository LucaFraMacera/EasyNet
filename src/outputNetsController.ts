import{UndirectedWeightedGraph,DirectedWeightedGraph} from "./networks/WeightedGraphs"
import{UndirectedGraph,DirectedGraph} from "./networks/Graphs"
import{IGraph} from "./networks/IGraph"
import{IWeightedGraph} from "./networks/IWeightedGraph"
import {DataSet} from "vis-data"
import {Network} from "vis-network/peer"
import { CONSTANTS } from "./styles/networkStyle"
import {getNetworkData} from "./networkController"
const outputNetwork = document.querySelector("#outputNetwork")! as HTMLDivElement
const nodes = new DataSet([])
const edges = new DataSet([])
const options = {
  interaction: { 
    hover: true,
    selectConnectedEdges:false
  },
  manipulation:false,
  edges:{
    "width":3,
    smooth:{
      "enabled":true,
      "type":"continuous",
      roundness:0.5
    },
    arrows:{
      "to":true
    },
    "hoverWidth": 0,
    font:{
      "align":"middle",
      "size":20,
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
          values.borderColor=CONSTANTS.secondaryColor
          values.fontColor=CONSTANTS.secondaryColor
      },
      label:function(values, id, selected, hovering) {
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
const data = {
    nodes:nodes,
    edges:edges
}
const network = new Network(outputNetwork,data,options)
export function doKruskal():boolean{
  let data = getNetworkData()
  let local = convertToLocalNet(data.nodes,data.edges,data.options)
  if(local instanceof UndirectedWeightedGraph){
    let result = local.kruskal().toVisNetwork()
    if(result.nodes.getIds().length == 0)
          return false
    options.edges.arrows.to = false
    network.setOptions(options)
    network.setData(result)
    return true
  }
  return false
}
export function doPrim(from:string):boolean{
  let data = getNetworkData()
  let local = convertToLocalNet(data.nodes,data.edges,data.options)
  if(local instanceof UndirectedWeightedGraph){
    let result = local.prim(from).toVisNetwork()
    if(result.nodes.getIds().length == 0)
          return false
    options.edges.arrows.to = false
    network.setOptions(options)
    network.setData(result)
    return true
  }
  return false
}
export function doDijkstra(from:string,to:string):boolean{
  let data = getNetworkData()
  let local = convertToLocalNet(data.nodes,data.edges,data.options)
  if(local instanceof UndirectedWeightedGraph || local instanceof DirectedWeightedGraph){
      let result1 = local.dijkstra(from,to)
      let result = result1.toVisNetwork()
      if(result.nodes.getIds().length == 0)
        return false
      options.edges.arrows.to = true
      network.setOptions(options)
      network.setData(result)
      return true
  }   
  return false
}
function convertToLocalNet(nodes:DataSet<any>,edges:DataSet<any>,options):IGraph<String>|IWeightedGraph<String>{
  //Node ID are all V+(auto_increment number)
  if(options.edges.arrows.to === true){
      if(options.edges.font.size === 0)
          return toDirected(nodes,edges)
      else
          return toDirectedWeighted(nodes,edges)
  }
  else{
      if(options.edges.font.size === 0)
          return toUndirected(nodes,edges)
      else
          return toUndirectedWeighted(nodes,edges)
  }
}
function toDirected(nodes:DataSet<any>,edges:DataSet<any>):DirectedGraph<String>{
  let result = new DirectedGraph<String>()
  for(const elem of nodes.get())
      result.addVertex(elem.label)
  for(const elem of edges.get())
      result.addEdge("V"+elem.from,"V"+elem.to)
  return result
}
function toUndirected(nodes:DataSet<any>,edges:DataSet<any>):UndirectedGraph<String>{
  let result = new UndirectedGraph<String>()
  for(const elem of nodes.get())
      result.addVertex(elem.label)
  for(const elem of edges.get())
      result.addEdge("V"+elem.from,"V"+elem.to)
  return result
}
function toDirectedWeighted(nodes:DataSet<any>,edges:DataSet<any>):DirectedWeightedGraph<String>{
  let result = new DirectedWeightedGraph<String>()
  for(const elem of nodes.get())
      result.addVertex(elem.label)
  for(const elem of edges.get())
      result.addEdge("V"+elem.from,"V"+elem.to,Number.parseFloat(elem.label))
  return result
}
function toUndirectedWeighted(nodes:DataSet<any>,edges:DataSet<any>):UndirectedWeightedGraph<String>{
  let result = new UndirectedWeightedGraph<String>()
  for(const elem of nodes.get())
      result.addVertex(elem.label)
  for(const elem of edges.get())
      result.addEdge("V"+elem.from,"V"+elem.to,Number.parseFloat(elem.label))
  return result
}