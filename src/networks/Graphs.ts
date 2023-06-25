import {IGraph} from "./IGraph"
export class DirectedGraph<Vertex> implements IGraph<Vertex>{
    protected adiacencyList : Map<Vertex,Set<Vertex>>
    constructor(){
        this.adiacencyList = new Map<Vertex, Set<Vertex>>
    }
    addVertex(vertex: Vertex):void{
        this.adiacencyList.set(vertex, new Set<Vertex>())
    }
    addVertexes(...vertexes: Vertex[]):void{
        for(const node of vertexes)
            this.adiacencyList.set(node, new Set<Vertex>())
    }
    addEdge(from:Vertex,to:Vertex):void{
        this.adiacencyList.get(from)?.add(to)
    }
    removeVertex(vertex:Vertex):boolean{
        for(const key of this.adiacencyList.keys())
            this.adiacencyList.get(key)?.delete(vertex)
        return this.adiacencyList.delete(vertex)
    }
    removeEdge(from:Vertex,to:Vertex):boolean{
        const neighbours = this.adiacencyList.get(from)
        if(neighbours)
            return neighbours.delete(to)
        return false
    }
    printGraph(){
        console.log(this.adiacencyList)
    }
}
export class UndirectedGraph<Vertex> extends DirectedGraph<Vertex>{
    addEdge(from:Vertex,to:Vertex):void{
        this.adiacencyList.get(from)?.add(to)
        this.adiacencyList.get(to)?.add(from)
    }
}