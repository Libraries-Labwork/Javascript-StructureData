function Edge(src, dest) {
  this.src = src
  this.dest = dest
}

function Graph(arrEdge) {
  this.adj = []
  
  for (i = 0; i < arrEdge.length; i++)
    this.adj.push([])
    
  arrEdge.forEach(function(item) {
    this.adj[item.src].push(item.dest)
  })
  
  this.traverse = (params) => {
    src = 0
    n = params.adj.length
    
    while (src < n) {
      params.adj[src].forEach(function(item) {
        console.log("("+ src +" -> "+ item +")\t")
      })
      src++
    }
  }
}

arrEdge = [
  new Edge(0, 1),
  new Edge(1, 2),
  new Edge(2, 0),
  new Edge(2, 1),
  new Edge(3, 2),
  new Edge(4, 5),
  new Edge(5, 4)
]

grp = new Graph(arrEdge)

grp.traverse(grp)
