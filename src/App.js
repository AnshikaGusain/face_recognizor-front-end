import React,{Component} from "react";
import './App.css';
import Clarifai from "clarifai";
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import Particles from "react-tsparticles";


const app = new Clarifai.App({
  apiKey: '6e93463d0101470584f9d7a5b13effaa'
 });

const initialState={
  input:"",
  ImageUrl:"",
  box:{},
  route:"Signin",
  user:{
    id:'',
    name:"",
    email:"",
    entries:0,
    joined: ""
  }
}

class App extends Component {
  constructor(){
    super();
    this.state=initialState
  }
  // componentDidMount(){
  //   fetch("http://localhost:3000/")
  //   .then(res=>res.json())
  //   .then(console.log)
  // }

  onRouteChange=(route)=>{
    if(route==="Signout"){
      this.setState(initialState)
    }
    this.setState({route:route});
  }

  loadUser=(data)=>{
    this.setState({user: {
      id: data.id,
      name:data.name,
      email:data.email,
      entries:data.entries,
      joined:data.joined
    }});
  }
  
  calculateBoundingBox=(data)=>{
    const image=document.getElementById("inputimage");
    const width=Number(image.width);
    const height=Number(image.height);
    return {
      top: data.top_row * height,
      bottom: height-(data.bottom_row*height),
      left: data.left_col *width,
      right: width - (data.right_col * width)
    }
  }

  displayBox=(box)=>{
    // console.log(box);
    this.setState({box:box});
  }

  onInputChange=(event)=>{
    this.setState({input: event.target.value});
  }

  onButtonSubmit=()=>{
    this.setState({ImageUrl: this.state.input});
    const raw = JSON.stringify({
      "user_app_id": {
        "user_id": "anshikagusain13_7448",
        "app_id": "a156366dc46c4e40b4e86861d855a057"
      },
      "inputs": [
        {
          "data": {
            "image": {
              "url": this.state.input
            }
          }
        }
      ]
    });
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Key e5d0996a8030467ba6edba8bc2f43306'
      },
      body: raw
    };
    
    // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
    // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
    // this will default to the latest version_id
    
    fetch("https://api.clarifai.com/v2/models/face-detection/outputs", requestOptions)
      .then(response => response.text())
      .then(result =>{
        if(result){
          fetch("https://damp-taiga-90498.herokuapp.com/image",{
            method:"put",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({
              id:this.state.user.id
            })
          }).then(res=>res.json())
          .then(count=>{
            this.setState(Object.assign(this.state.user,{entries:count}))
          })
          .catch(console.log)
        }
        this.displayBox(this.calculateBoundingBox(JSON.parse(result, null, 2).outputs[0].data.regions[0].region_info.bounding_box))
      })
      
      .catch(error => console.log('error', error));
  }

  render(){
    return (
      <div className="App">
        <Particles className="particles"/>    
        <Navigation onRouteChange={this.onRouteChange} route={this.state.route}/>
        {this.state.route==="home" ? 
          <div>
            <Logo/> 
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition ImageUrl={this.state.ImageUrl} box={this.state.box}/>
          </div>
        :
        (this.state.route==="Register" ?
        
        <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        :
        <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        )
        }
        
      </div>
    );
  }
}

export default App;
