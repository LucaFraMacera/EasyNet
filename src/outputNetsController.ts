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
var options = {
    interaction: { 
      hover: true,
      selectConnectedEdges:false
    },
    manipulation:{
      enabled:false
    },
    edges:{
      "width":3,
      smooth:{
        "enabled":true,
        "type":"continuous",
        roundness:0.2
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
      enabled:false
    }
  }as any; 
const data = {
    nodes:nodes,
    edges:edges
}
const network = new Network(outputNetwork,data,options)
export function doDijkstra(from:String,to:String):void{
    let data = getNetworkData()
    let network = convertToLocalNet(data.nodes,data.edges,data.options)
    console.log(network)
    if(network instanceof UndirectedWeightedGraph || network instanceof DirectedWeightedGraph){
        let result = network.dijkstra(from,to)
        console.log(result)
    }
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