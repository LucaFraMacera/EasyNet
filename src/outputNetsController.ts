import{UndirectedWeightedGraph,DirectedWeightedGraph} from "./networks/WeightedGraphs"
import{UndirectedGraph,DirectedGraph} from "./networks/Graphs"
import{IGraph} from "./networks/IGraph"
import{IWeightedGraph} from "./networks/IWeightedGraph"
import {DataSet} from "vis-data"
import {Network} from "vis-network/peer"
import { HOVER_COLORS, MAIN_COLORS } from "./styles/networkStyle"
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
    width:2,
    smooth:{
      enabled:true,
      type:"continuous",
      roundness:0.5
    },
    chosen:{
      edge:function(values, id, selected, hovering) {
        values.color=(hovering || selected)?HOVER_COLORS.border:MAIN_COLORS.primaryColor
      }
    },
    arrows:{
      to:true
    },
    hoverWidth: 0,
    font:{
      align:"middle",
      size:20,
      strokeColor:MAIN_COLORS.edgeWeightStroke,
      strokeWidth:3,
      color:MAIN_COLORS.edgeWeightColor,
       bold:{
         size:20
       }
    }
  },
  nodes:{
    shape:"circle",
    borderWidth:3,
    widthConstraint:50,
    color:{
      background: MAIN_COLORS.nodeColor,
      border: MAIN_COLORS.primaryColor
    },
    font:{
      align:"center",
      size:30,
      strokeWidth:2,
      color:MAIN_COLORS.primaryColor,
      strokeColor:MAIN_COLORS.nodeColor
    },
    chosen:{
      node:function(values, id, selected, hovering) {
          values.borderColor=HOVER_COLORS.border
          values.fontColor=HOVER_COLORS.label
      },
      label:function(values, id, selected, hovering) {
        values.color=HOVER_COLORS.label   
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
export async function doFloydAndWharshall():Promise<boolean>{
  return new Promise(async (res,rej)=>{
    let netData = getNetworkData()
    let local = convertToLocalNet(netData.nodes,netData.edges,netData.options)
    if(local instanceof DirectedWeightedGraph || local instanceof UndirectedWeightedGraph){
      let result = local.floydWharshall()
      nodes.clear()
      edges.clear()
      console.log(result)
      result.forEach((elem,indx)=>{
        let nodeID = "V"+(indx+1)
        if(!nodes.get(nodeID)){
          nodes.add({
            id:nodeID,
            label:nodeID
          })
        }
        elem.forEach((elem,indx1)=>{
          let neighbourID = "V"+(indx1+1)
          if(!nodes.get(neighbourID)){
            nodes.add({
              id:neighbourID,
              label:neighbourID
            })
          }
          if(neighbourID !== nodeID && elem !== Infinity){
            edges.add({
              id:nodeID+neighbourID,
              from:nodeID,
              to:neighbourID,
              label:""+elem
            })
          }
        })
      })
      network.setOptions(options)
      network.setData(data)
      res(true)
    }
    rej(false)
  })
}
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
  console.log(local)
  if(local instanceof UndirectedWeightedGraph || local instanceof DirectedWeightedGraph){
      let result = local.dijkstra(from,to).toVisNetwork()
      if(result.nodes.getIds().length == 0)
        return false
      options.edges.arrows.to = true
      network.setOptions(options)
      network.setData(result)
      return true
  }   
  return false
}
export function convertToLocalNet(nodes:DataSet<any>,edges:DataSet<any>,options):IGraph<String>|IWeightedGraph<String>{
  if(nodes.length ===0)
    throw "Grafo Vuoto"
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
      result.addVertex(elem.id)
  for(const elem of edges.get())
      result.addEdge(elem.from,elem.to)
  return result
}
function toUndirected(nodes:DataSet<any>,edges:DataSet<any>):UndirectedGraph<String>{
  let result = new UndirectedGraph<String>()
  for(const elem of nodes.get())
      result.addVertex(elem.id)
  for(const elem of edges.get())
      result.addEdge(elem.from,elem.to)
  return result
}
function toDirectedWeighted(nodes:DataSet<any>,edges:DataSet<any>):DirectedWeightedGraph<String>{
  let result = new DirectedWeightedGraph<String>()
  for(const elem of nodes.get())
      result.addVertex(elem.id)
  for(const elem of edges.get())
      result.addEdge(elem.from,elem.to,Number.parseFloat(elem.label))
  return result
}
function toUndirectedWeighted(nodes:DataSet<any>,edges:DataSet<any>):UndirectedWeightedGraph<String>{
  let result = new UndirectedWeightedGraph<String>()
  for(const elem of nodes.get())
      result.addVertex(elem.id)
  for(const elem of edges.get())
      result.addEdge(elem.from,elem.to,Number.parseFloat(elem.label))
  return result
}