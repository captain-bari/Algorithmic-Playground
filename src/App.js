import React , {components, useEffect,useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Nav from './comp/nav'



function App() {

  const canvasRef = React.useRef(null)
  const conextRef = React.useRef(null)
  
  const [cordX , setX] = useState(0)
  const [cordY , setY] = useState(0)


  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 1000;
    canvas.height = 500;

    //canvas.style.width = `${window.innerWidth}px`;
    //canvas.style.height = `${window.innerHeight}px`;
    canvas.style.width = `1000px`;
    canvas.style.height = `500px`;

    canvas.style.backgroundColor = `#ff9595`;

    const context = canvas.getContext("2d");
    conextRef.current = context;

  }, [])

  const clickfun = (e) => {
    const {offsetX , offsetY} = e.nativeEvent;
    setX(offsetX);
    setY(offsetY);
  
    //console.log(`${offsetX} ${cordX} ${cordX} `);
           /* const canvas = canvasRef.current;
            let rect = canvas.getBoundingClientRect(); 
            let x = e.clientX - rect.left; 
            let y = e.clientY - rect.top;
            setX(x);
            setY(y); */
  }

 
  

  
  return (
    <div className="App">
      <Nav cref= {canvasRef} cordX={cordX} cordY={cordY}/>
   <br></br>
   <canvas ref={canvasRef} onMouseDown={clickfun} id="canvas"/>


        
    </div>
  );
}

export default App;
