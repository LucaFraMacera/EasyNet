interface IGraph<Vertex>{
    addVertex(vertex: Vertex):void
    addVertexes(...vertexes: Vertex[]):void
    addEdge(from:Vertex,to:Vertex):void
    removeVertex(vertex:Vertex):boolean
    removeEdge(from:Vertex,to:Vertex):boolean
}