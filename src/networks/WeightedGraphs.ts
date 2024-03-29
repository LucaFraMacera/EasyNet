import { FibonacciHeap, INode } from "@tyriar/fibonacci-heap"
import {IWeightedGraph} from "./IWeightedGraph"
import {DataSet} from "vis-data"
export class DirectedWeightedGraph<Vertex> implements IWeightedGraph<Vertex>{
    protected adiacencyList :Map<Vertex,Map<Vertex,number>>
    constructor(){
        this.adiacencyList = new Map<Vertex,Map<Vertex,number>>()
    }
    addVertex(vertex:Vertex):void{
        this.adiacencyList.set(vertex,new Map<Vertex,number>())
    }
    addVertexes(...vertexes:Vertex[]):void{
        for(const node of vertexes)
            this.adiacencyList.set(node,new Map<Vertex,number>())
    }
    addEdge(from: Vertex, to:Vertex, weight: number):void{
        this.adiacencyList.get(from)?.set(to,weight)
    }
    removeVertex(node:Vertex):boolean{
        for(const key of this.adiacencyList.keys()){
            let neighbours = this.adiacencyList.get(key)
            if(neighbours)
                neighbours.delete(node)
        }
        return this.adiacencyList.delete(node)
    }
    hasVertex(vertex:Vertex):boolean{
        let v = this.adiacencyList.get(vertex)
        if(v)
            return true
        return false
    }
    getEdgeWeight(from:Vertex,to:Vertex):number{
        let weight = this.adiacencyList.get(from)!.get(to)!
        if(weight)
            return weight
        return Number.POSITIVE_INFINITY
    }
    hasEdge(from:Vertex,to:Vertex):boolean{
        if(this.getEdgeWeight(from,to) !== Number.POSITIVE_INFINITY)
            return true
        return false
    }
    removeEdge(from:Vertex, to:Vertex):boolean{
        let neighbours = this.adiacencyList.get(from)
        if(neighbours)
            return neighbours.delete(to)
        return false
    }
    size():number{
        return this.adiacencyList.size
    }
    bfs(startingNode: Vertex):Vertex[]{
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
    dfs(source:Vertex):Vertex[]{
        let result:Vertex[] = []
        const visited = new Map<Vertex,Boolean>()
        let queue:Vertex[]= []
        visited.set(source,true)
        queue.push(source)
        while(queue.length != 0){
            const node = queue.pop()!
            visited.set(node,true)
            const neighbours = this.adiacencyList.get(node)!
            for(const v of neighbours.keys()){
                if(!visited.get(v)){
                    visited.set(v,true)
                    queue.push(v)
                }else{
                    let removed = false
                    queue = queue.filter((value:Vertex)=>{
                        if(value!==v)
                            return value
                        removed = true
                        return
                    })!
                    if(removed)
                        queue.push(v)
                }
            }
            result.push(node)
        }
        return result
    }
    printGraph(){
        console.log(this.adiacencyList)
    }
    isConnected():boolean{
        for(const v of this.adiacencyList.keys()){
            let depthSearch = this.bfs(v).length
            if(depthSearch === this.adiacencyList.size)
                return true
        }
        return false
    }
   /*private hasNegativeEdges():boolean{
        for(const v of this.adiacencyList.keys()){
            for(const entries of this.adiacencyList.get(v)!.entries())
                if(entries[1]<0)
                    return true 
        }
        return false
    }*/
    /**So Stupid it doesen't even care about negative cycles or negative edges
     * @param from nodo di partenza 
     * @param to (Non richiesto) nodo di destinazione.
     * @returns Ritorna l'albero dei cammini minimi nel caso in cui il secondo parametro non sia specificato.
     *          Ritorna un cammino da 'from' verso 'to' nel caso contrario.
     */
    dijkstra(from:Vertex, to?:Vertex):DirectedWeightedGraph<Vertex>{
        let isVisited = new Map<Vertex,boolean>
        let path = new Map<Vertex,number>
        let minimunPath = new DirectedWeightedGraph<Vertex>()  
        let queue = new FibonacciHeap<Vertex,number>((elem1:INode<Vertex,number>,elem2:INode<Vertex,number>)=>{
            return elem1.value! -elem2.value!
        })
        for(const v of this.adiacencyList.keys()){
            isVisited.set(v,false)
            path.set(v,Number.POSITIVE_INFINITY)
        }
        path.set(from,0)
        queue.insert(from,0)
        minimunPath.addVertex(from)
        while(!queue.isEmpty()){
            let element = queue.extractMinimum()!
            isVisited.set(element.key,true)
            if(element.key === to){
                break
            }
            for(const entry of this.adiacencyList.get(element.key)!.entries()){
                if(path.get(entry[0])===Number.POSITIVE_INFINITY){
                    isVisited.set(entry[0],false)
                    queue.insert(entry[0],element.value! + entry[1])
                    path.set(entry[0],element.value! + entry[1])
                    minimunPath.addVertex(entry[0])
                    minimunPath.addEdge(element.key,entry[0],entry[1])
                }
                else{
                    if((path.get(entry[0])! > (element.value! + entry[1])) && !isVisited.get(entry[0])){
                        queue.insert(entry[0],element.value! + entry[1])
                        path.set(entry[0],element.value! + entry[1])
                        minimunPath.removeVertex(entry[0])
                        minimunPath.addVertex(entry[0])
                        minimunPath.addEdge(element.key,entry[0],entry[1])
                    }
                }
            }
        }
        if(to){
            while(!minimunPath.isPath(to)){
                let reducePath = new Set<Vertex>(minimunPath.adiacencyList.keys())
                for(const v of reducePath){
                    let neighbours = minimunPath.adiacencyList.get(v)
                    if(v != to && neighbours.size == 0)
                        minimunPath.removeVertex(v)
                }
            }
        }
        return minimunPath
    }
    floydWharshall():number[][]{
        let matrix = this.getAdiacencyMatrix()
        for(let i = 0 ; i<matrix.length;i++){
            matrix[i][i] = 0
        }
        for(let k =0; k< matrix.length;k++){
            for(let i =0; i< matrix.length;i++){
                for(let j =0; j< matrix.length;j++){
                    matrix[i][j] = Math.min(matrix[i][j],(matrix[i][k]+matrix[k][j]))
                }
            }
        }
        for(let i = 0 ; i<matrix.length;i++){
            if(matrix[i][i]<0)
                throw new Error("Il Grafo ha cicli negativi")
        }
        return matrix
    }
    public isBipartite(getAssignedColors:boolean):boolean|Map<Vertex,string>{
        let indirectedVersion = new UndirectedWeightedGraph<Vertex>()
        for(const node of this.adiacencyList.keys())
            indirectedVersion.addVertex(node)
        for(const node of this.adiacencyList.keys())
            for(const entries of this.adiacencyList.get(node).entries())
                indirectedVersion.addEdge(node,entries[0],entries[1])
        return indirectedVersion.isBipartite(getAssignedColors)
    }
    private getAdiacencyMatrix():number[][]{
        var matrix = Array.from(Array(this.adiacencyList.size), ()=>Array(this.adiacencyList.size).fill(0));
        let i =0
        for(const v of this.adiacencyList.keys()){
            let j = 0
            for(const v1 of this.adiacencyList.keys()){
                matrix[i][j] = this.getEdgeWeight(v,v1)
                j++
            }
            i++
        }
        return matrix;
    }
    //Metodo che dice se il grafo è un cammino verso un certo Vertex. Se non lo è allora ritorna il primo nodo che 
    private isPath(to:Vertex):boolean{
        for(const v of this.adiacencyList.keys())
            if(v!=to && this.adiacencyList.get(v).size == 0)
                return false
        return true
    }
    public toVisNetwork():{nodes:DataSet<any>,edges:DataSet<any>}{
        let visNodes = new DataSet([])
        let visEdges = new DataSet([])
        let networkData = {
            nodes:visNodes,
            edges:visEdges
        }
        for(const node of this.adiacencyList.keys()){
            visNodes.add({
                id:node,
                label:node
            })
        }
        for(const node of this.adiacencyList.keys()){
            let neighbours = this.adiacencyList.get(node)
            for(const v of neighbours.entries()){
                visEdges.add({
                    from:node,
                    to:v[0],
                    id:node+""+v[0],
                    label:""+v[1]
                })
            }
        }
        return networkData
    }
}

export class UndirectedWeightedGraph<Vertex> extends DirectedWeightedGraph<Vertex>{
    addEdge(from: Vertex, to:Vertex, weight: number):void{
        this.adiacencyList.get(from)?.set(to,weight)
        this.adiacencyList.get(to)?.set(from,weight)
    }
    isConnected():boolean{
        for(const v of this.adiacencyList.keys()){
            if(this.adiacencyList.get(v)!.size === 0)
                return false
        }
        return true
    }
    private getAllEdges():FibonacciHeap<number,{from:Vertex,to:Vertex}>{
        type Edge={
            from:Vertex,
            to:Vertex
        }
        let mappedEdges = new Map<Vertex,Set<Vertex>>
        let queue = new FibonacciHeap<number,Edge>((a,b)=>{return a.key-b.key})
        for(const v of this.adiacencyList.keys())
            mappedEdges.set(v,new Set<Vertex>())
        for(const v of this.adiacencyList.keys()){
            for(const entries of this.adiacencyList.get(v)!.entries()){
                if(!mappedEdges.get(v).has(entries[0])){
                    mappedEdges.get(v).add(entries[0])
                    mappedEdges.get(entries[0]).add(v)
                    let edgeInfo = {
                        from: v,
                        to:entries[0]
                    }
                    queue.insert(entries[1],edgeInfo)
                }      
            }
        }
        return queue
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
    
    /**
     * 
     * @param source Nodo sorgente da cui far partire l'albero ricoprente.
     * @returns Minimo albero ricoprente del grafo corrente.
     */
    prim(source:Vertex):UndirectedWeightedGraph<Vertex>{
        type Edge= {
            from:Vertex,
            to:Vertex
        }
        let result = new UndirectedWeightedGraph<Vertex>
        if(!this.isConnected())
            return result
        let queue = new FibonacciHeap<number,Edge>((a,b)=>{
            return a.key-b.key
        })
        result.addVertex(source)
        let neighbours = this.adiacencyList.get(source)!
        for(const entry of neighbours.entries()){
            let neighbourEdge = {
                from:source,
                to:entry[0]
            }
            queue.insert(entry[1],neighbourEdge)
        }
        while(result.adiacencyList.size < this.adiacencyList.size){
            let element = queue.extractMinimum()!
            let from = element.value!.from
            let to = element.value!.to
            let weight = element.key
            if(!result.adiacencyList.get(to)){
                result.addVertex(to)
                result.addEdge(from,to,weight)
                for(const entry of this.adiacencyList.get(to)!.entries()){
                    if(!result.adiacencyList.has(entry[0])){
                        let newQueueElement:Edge={
                            from:to,
                            to:entry[0]
                        }
                        queue.insert(entry[1],newQueueElement)
                    }
                }
            }
        }
        return result
    }
    kruskal():UndirectedWeightedGraph<Vertex>{
        let result = new UndirectedWeightedGraph<Vertex>()
        let unionFind = new Map<Vertex,Vertex[]>
        let edges = this.getAllEdges()
        let numberOfEdges = 0
        if(!this.isConnected())
            return result
        for(const v of this.adiacencyList.keys()){
            result.addVertex(v)
            unionFind.set(v,[v])
        }
        while(numberOfEdges != this.adiacencyList.size-1){
            let edgeInfo = edges.extractMinimum()
            let from = edgeInfo!.value!.from
            let to = edgeInfo!.value!.to
            let group1 = unionFind.get(from)
            let group2 = unionFind.get(to)
            if(group1[0]==group2[0]){
                continue // The edge creates a cycle
            }
            result.addEdge(from,to,edgeInfo!.key)
            numberOfEdges++
            if(group1.length > group2.length){
                group1 = group1.concat(group2)
                for(const v of group1)
                    unionFind.set(v,group1)
            }
            else{
                group2 = group2.concat(group1)
                for(const v of group2)
                    unionFind.set(v,group2)
            }
        } 
        return result
    }
    public toVisNetwork():{nodes:DataSet<any>,edges:DataSet<any>}{
        let visNodes = new DataSet([])
        let visEdges = new DataSet([])
        let networkData = {
            nodes:visNodes,
            edges:visEdges
        }
        for(const node of this.adiacencyList.keys()){
            visNodes.add({
                id:node,
                label:node
            })
        }
        for(const node of this.adiacencyList.keys()){
            let neighbours = this.adiacencyList.get(node)
            for(const v of neighbours.entries()){
                if(!visEdges.get(v[0]+""+node)){
                    visEdges.add({
                        from:node,
                        to:v[0],
                        id:node+""+v[0],
                        label:""+v[1]
                    })
                }
            }
        }
        return networkData
    }
}

