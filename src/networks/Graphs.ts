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
    public bfs(startingNode: Vertex):Vertex[]{
        let result:Vertex[] = []
        const visited = new Map<Vertex,Boolean>()
        const queue:Vertex[]= []
        visited.set(startingNode,true)
        queue.push(startingNode)
        while(queue.length != 0){
            const node = queue.shift()
            if(!node)
                continue
            visited.set(node,true)
            const neighbours = this.adiacencyList.get(node)
            if(!neighbours)
                continue
            for(const v of neighbours.keys()){
                if(!visited.get(v)){
                    queue.push(v)
                    visited.set(v,true)
                }
            }
            result.push(node)
        }
        return result
    }
    public isBipartite(getAssignedColors:boolean):boolean| Map<Vertex,string>{
        let indirectedVersion = new UndirectedGraph<Vertex>()
        for(const node of this.adiacencyList.keys())
            indirectedVersion.addVertex(node)
        for(const node of this.adiacencyList.keys())
            for(const node1 of this.adiacencyList.get(node))
                indirectedVersion.addEdge(node,node1)
        console.log(indirectedVersion)
        return indirectedVersion.isBipartite(getAssignedColors)
    }
    isConnected():boolean{
        for(const v of this.adiacencyList.keys()){
            let depthSearch = this.bfs(v).length
            if(depthSearch === this.adiacencyList.size)
                return true
        }
        return false
    }
}
export class UndirectedGraph<Vertex> extends DirectedGraph<Vertex>{
    addEdge(from:Vertex,to:Vertex):void{
        this.adiacencyList.get(from)?.add(to)
        this.adiacencyList.get(to)?.add(from)
    }

    /**
     * 
     * @param getAssignedColors If set, the method returns the coloration of the nodes
     * @returns Checks if the current network can be 2-colored. If it is, then the network is bipartite
     */
     public isBipartite(getAssignedColors?:boolean):boolean|Map<Vertex,string>{
        if(!this.isConnected())
            return false
        let colors = ["BIANCO","NERO"]
        let assignedColors = new Map<Vertex,string>()
        let queue:Vertex[] = []
        let startingNode = null
        for(const node of this.adiacencyList.keys()){
            if(!startingNode){
                assignedColors.set(node,colors[0])
                startingNode = node
            }else{
                assignedColors.set(node,null)
            }
        }
        queue.push(startingNode)
        while(queue.length != 0){
            let node = queue.shift()!
            let assignedColor = assignedColors.get(node)
            for(const neighbour of this.adiacencyList.get(node).keys()){
                let neighbourColor = assignedColors.get(neighbour)
                if(!neighbourColor){
                    let colorToAssign = assignedColor===colors[0] ? colors[1] : colors[0]
                    assignedColors.set(neighbour,colorToAssign)
                    queue.push(neighbour)
                }
                else if(neighbourColor === assignedColor){
                    return false
                }
            }
        }
        if(getAssignedColors)
            return assignedColors
        return true
    }
}