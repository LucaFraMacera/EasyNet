import { FibonacciHeap, INode } from "@tyriar/fibonacci-heap"
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
    dijkstra(from:Vertex, to:Vertex):Map<Vertex,Vertex>{
        let isVisited = new Map<Vertex,boolean>
        let path = new Map<Vertex,number>
        let minimunPath = new Map<Vertex,Vertex>   
        let queue = new FibonacciHeap<Vertex,number>((elem1:INode<Vertex,number>,elem2:INode<Vertex,number>)=>{
            return elem1.value! -elem2.value!
        })
        for(const v of this.adiacencyList.keys()){
            isVisited.set(v,false)
            path.set(v,Number.POSITIVE_INFINITY)
        }
        path.set(from,0)
        queue.insert(from,0)
        while(!queue.isEmpty()){
            let element = queue.extractMinimum()!
            isVisited.set(element.key,true)
            console.log(element.key)
            if(element.key === to){
                break
            }
            for(const entry of this.adiacencyList.get(element.key)!.entries()){
                if(path.get(entry[0])===Number.POSITIVE_INFINITY){
                    isVisited.set(entry[0],false)
                    queue.insert(entry[0],element.value! + entry[1])
                    path.set(entry[0],element.value! + entry[1])
                    minimunPath.set(entry[0],element.key)
                }
                else{
                    if((path.get(entry[0])! > (element.value! + entry[1])) && !isVisited.get(entry[0])){
                        queue.insert(entry[0],element.value! + entry[1])
                        path.set(entry[0],element.value! + entry[1])
                        minimunPath.set(entry[0],element.key)
                    }
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
        let queue = new FibonacciHeap<number,Edge>((a,b)=>{return a.key-b.key})
        for(const v of this.adiacencyList.keys()){
            for(const entries of this.adiacencyList.get(v)!.entries()){
                let edgeInfo = {
                    from: v,
                    to:entries[0]
                }
                queue.insert(entries[1],edgeInfo)
            }
        }
        return queue
    }
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
        let edges = this.getAllEdges()
        while(this.adiacencyList.size-edges.size() !== 1){
            let edgeInfo = edges.extractMinimum()
            let from = edgeInfo!.value!.from
            let to = edgeInfo!.value!.to
            if(!result.hasVertex(from))
                result.addVertex(from)
            if(!result.hasVertex(to))
                result.addVertex(to)
            result.addEdge(from,to,edgeInfo!.key)
        }
        return result
    }
    
}

