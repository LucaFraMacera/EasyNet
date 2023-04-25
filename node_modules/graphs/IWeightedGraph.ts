interface IWeightedGraph<Vertex>{
    addVertex(vertex: Vertex):void
    addVertexes(...vertexes: Vertex[]):void
    addEdge(from:Vertex,to:Vertex,weight:Number):void
    hasVertex(vertex:Vertex):boolean
    hasEdge(from:Vertex,to:Vertex):boolean
    getEdgeWeight(from:Vertex,to:Vertex):number
    removeVertex(vertex:Vertex):boolean
    removeEdge(from:Vertex,to:Vertex):boolean
}