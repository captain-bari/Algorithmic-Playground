import React, { Component } from 'react';
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Navbar from 'react-bootstrap/Navbar'

function Node(value) {
  this.value = value;
  this.left = null;
  this.right = null;
}


class nav extends Component {
  

  constructor(props) {
    super(props);
    this.state = {nodeX : [] , nodeY :[] , wallX : [] , wallY :[] , speed : 1000 }
  }
  
  RotationDirection(p1x, p1y, p2x, p2y, p3x, p3y) {
    if (((p3y - p1y) * (p2x - p1x)) > ((p2y - p1y) * (p3x - p1x)))
      return 1;
    else if (((p3y - p1y) * (p2x - p1x)) == ((p2y - p1y) * (p3x - p1x)))
      return 0;
    
    return -1;
  }
  
  containsSegment(x1, y1, x2, y2, sx, sy) {
    if (x1 < x2 && x1 < sx && sx < x2) return true;
    else if (x2 < x1 && x2 < sx && sx < x1) return true;
    else if (y1 < y2 && y1 < sy && sy < y2) return true;
    else if (y2 < y1 && y2 < sy && sy < y1) return true;
    else if (x1 == sx && y1 == sy || x2 == sx && y2 == sy) return true;
    return false;
  }
  
  collision(x1, y1, x2, y2, x3, y3, x4, y4) {
    var f1 = this.RotationDirection(x1, y1, x2, y2, x4, y4);
    var f2 = this.RotationDirection(x1, y1, x2, y2, x3, y3);
    var f3 = this.RotationDirection(x1, y1, x3, y3, x4, y4);
    var f4 = this.RotationDirection(x2, y2, x3, y3, x4, y4);
    
    // If the faces rotate opposite directions, they intersect.
    var intersect = f1 != f2 && f3 != f4;
    
    // If the segments are on the same line, we have to check for overlap.
    if (f1 == 0 && f2 == 0 && f3 == 0 && f4 == 0) {
      intersect = this.containsSegment(x1, y1, x2, y2, x3, y3) || this.containsSegment(x1, y1, x2, y2, x4, y4) ||
      this.containsSegment(x3, y3, x4, y4, x1, y1) || this.containsSegment(x3, y3, x4, y4, x2, y2);
    }
    
    return intersect;
  }


  clickNodes = () => {
    this.props.cref.current.addEventListener('click', this.createNodes )
    this.props.cref.current.removeEventListener('click',this.createWalls)
    document.getElementById("Nodes").style.color= `#00ff11`;
    document.getElementById("Walls").style.color= `#c7c7c7`;
    

    
}
  clickewalls = () => {
    this.props.cref.current.addEventListener('click', this.createWalls )
    this.props.cref.current.removeEventListener('click',this.createNodes)
    document.getElementById("Nodes").style.color= `#c7c7c7`;
    document.getElementById("Walls").style.color= `#00ff11`;

  }
    createNodes = () => {
        const canvas = this.props.cref.current;
        this.setState({nodeX : this.state.nodeX.concat(this.props.cordX),
                        nodeY : this.state.nodeY.concat(this.props.cordY)});
        var draw = canvas.getContext("2d");
        draw.fillStyle = `#eae7dc`;
        draw.beginPath();
        draw.arc(this.props.cordX ,this.props.cordY,5 ,0 ,Math.PI*2, true )
        draw.fill();
        
        
        //console.log(`nodes ${this.props.cordX} ${this.props.cordY} ${this.state.nodeX} ${this.state.nodeY}`);
    
    }
    createWalls = () => {
        const canvas = this.props.cref.current;
        this.setState({wallX : this.state.wallX.concat(this.props.cordX),
          wallY : this.state.wallY.concat(this.props.cordY)});

          var draw = canvas.getContext("2d");
          draw.fillStyle = `#a30e0e`;
          draw.beginPath();
          draw.arc(this.props.cordX ,this.props.cordY,5 ,0 ,Math.PI*2, true )
          draw.fill();

          if(this.state.wallX.length%2 == 0){
            for (var i = 0; i < this.state.wallX.length-1; i=i+2) {
              var draw = canvas.getContext("2d");
              draw.fillStyle = `#a30e0e`;
              draw.beginPath();
              draw.moveTo(this.state.wallX[i], this.state.wallY[i]);
              draw.lineTo(this.state.wallX[i+1], this.state.wallY[i+1]);
              draw.stroke();
            }
          }
        
        
       // console.log(`walls ${this.props.cordX} ${this.props.cordY} ${this.state.wallX} ${this.state.wallY} ${this.state.wallY.length}`);
    
    }
    resetcanvas = () => {
      const canvas = this.props.cref.current;
      var draw = canvas.getContext("2d");
      draw.clearRect(0, 0, canvas.width, canvas.height);
      this.state.wallX.length=0
      this.state.wallY.length=0
      this.state.nodeX.length=0
      this.state.nodeY.length=0

    }



    


    testrun = () => {
      let node = new Node(10);
      var stack = [];
      stack.push(node);
      console.log(stack);
      let nodeX = [...this.state.nodeX]
      let nodeY = [...this.state.nodeY]
      let wallX = [...this.state.wallX]
      let wallY = [...this.state.wallY]
      console.log(this.collision(nodeX[1] , nodeY[1] , nodeX[0], nodeX[0] ,wallX[0] , wallY[0],wallX[1] , wallY[1]));
    }
/*                                           -----Algorithms start-----                                          */



createart = async() => {

  const delay = ms => new Promise(res => setTimeout(res, ms));

  const canvas = this.props.cref.current;
  var draw = canvas.getContext("2d");

  let nodeX = [...this.state.nodeX]
  let nodeY = [...this.state.nodeY]
  let wallX = [...this.state.wallX]
  let wallY = [...this.state.wallY]
  let oldnodeX = [...this.state.nodeX]
  let oldnodeY = [...this.state.nodeY]
  var shortest = 1000000;
  var shortestindex = 0;

  while(nodeY.length != 1) {
  for (var i = 1; i < nodeX.length; i=i+1) {

   if(this.collision(nodeX[i] , nodeY[i] , nodeX[0], nodeX[0] ,wallX[0] , wallY[0],wallX[1] , wallY[1]))
        continue;
   
    draw.strokeStyle = `#df6748`;
              draw.beginPath();
              draw.moveTo(nodeX[0],nodeY[0]);
              draw.lineTo(nodeX[i],nodeY[i]);
              draw.stroke();
              
    
    var distance = Math.hypot(nodeX[i]-nodeX[0], nodeY[i]-nodeY[0]);
    

    if(distance<shortest)
    {
        shortest=distance
        shortestindex=i;
    }
              
  await delay(this.state.speed);

          
  }
  if(this.collision(oldnodeX[0],oldnodeY[0] , oldnodeX[shortestindex],oldnodeY[shortestindex] ,wallX[0] , wallY[0],wallX[1] , wallY[1]))
  continue;

              draw.strokeStyle = `#000000`;
              draw.beginPath();
              draw.moveTo(oldnodeX[0],oldnodeY[0]);
              draw.lineTo(oldnodeX[shortestindex],oldnodeY[shortestindex]);
              draw.stroke();
      //console.log(shortestindex);
      
      nodeX[0]=oldnodeX[shortestindex]; nodeY[0] = oldnodeY[shortestindex];
      
      var ind = 1;
      for (var i = 1; i < nodeX.length; i=i+1) {
        if(i == shortestindex)
              continue;
        if(this.collision(oldnodeX[0],oldnodeY[0] , oldnodeX[i],oldnodeY[i] ,wallX[0] , wallY[0],wallX[1] , wallY[1]))
              continue;
              draw.strokeStyle = `#ff9595`;
              draw.beginPath();
              draw.moveTo(oldnodeX[0],oldnodeY[0]);
              draw.lineTo(oldnodeX[i],oldnodeY[i]);
              draw.stroke();
      nodeX[ind]=oldnodeX[i]
      nodeY[ind]=oldnodeY[i]
      ind++;
      
      }
      
      nodeX.length=nodeX.length-1; nodeY.length=nodeY.length-1;
      oldnodeX = [...nodeX]
      oldnodeY = [...nodeY]
      shortest = 1000000;
  }
      
}





/*                                           -----Algorithms end-----                                           */
    render() {
        return (
        <div>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
  <Navbar.Brand >Welcome to Algorithm Playground</Navbar.Brand>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
    <Nav className="mr-auto">
      <Nav.Link onClick={this.clickNodes}><span id="Nodes">Create Nodes</span></Nav.Link>
      <Nav.Link onClick={this.clickewalls}><span id="Walls">Create Walls</span></Nav.Link>
      
      <NavDropdown title="Speed" id="collasible-nav-dropdown">
      <NavDropdown.Item onClick={() => this.setState({speed : 10}) }>0.01 Second</NavDropdown.Item>
      <NavDropdown.Item onClick={() => this.setState({speed : 50}) }>0.05 Second</NavDropdown.Item>
      <NavDropdown.Item onClick={() => this.setState({speed : 100}) }>0.1 Second</NavDropdown.Item>
        <NavDropdown.Item onClick={() => this.setState({speed : 200}) }>0.2 Second</NavDropdown.Item>
        <NavDropdown.Item onClick={() =>  this.setState({speed : 500})}>0.5 Second</NavDropdown.Item>
        <NavDropdown.Item onClick={() =>  this.setState({speed : 1000})}>1 Second</NavDropdown.Item>
        
        <NavDropdown.Item onClick={() =>  this.setState({speed : 2000})}>2 Second</NavDropdown.Item>
      </NavDropdown>

      <NavDropdown title="Select Algorithm" id="collasible-nav-dropdown">
        <NavDropdown.Item onClick={this.createart}>Create Art</NavDropdown.Item>
        <NavDropdown.Item >A Star Algo</NavDropdown.Item>
        <NavDropdown.Item >Depth First Algo</NavDropdown.Item>
        <NavDropdown.Item >Dijkstra Algo</NavDropdown.Item>
        <NavDropdown.Item onClick = {this.testrun}>Debugging</NavDropdown.Item>
      </NavDropdown>
      

      <Nav.Link onClick={this.resetcanvas}>Reset</Nav.Link>
    </Nav>
    
  </Navbar.Collapse>
</Navbar>
            </div>
        );
    }
}

export default nav;