import React,{useEffect} from 'react'
import data from '../../DataMockup/Data';
let longdo;
let map;

function LongdoMap(props) {
  const mapCallback = ()=> {
    longdo = window.longdo
    map = new window.longdo.Map({
      placeholder: document.getElementById('longdo-map'),
    });
    // marker = new longdo.Marker({ lon: 99.827787, lat: 13.274825 });
    // if(props.markets){
    //    props.markets
    //     marker = new longdo.Marker({ lon: 100.56, lat: 13.74 });
    // }
  }

  useEffect(() => {
    
    const existingScript = document.getElementById('longdoMapScript');
    const callback = props.callback;
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `https://api.longdo.com/map/?key=${props.mapKey}`;
      script.id = 'longdoMapScript';
      document.body.appendChild(script);
      script.onload = () => {
        mapCallback();
        if (callback) callback();
      };
      return()=>{
        document.getElementById('longdoMapScript').remove();
      }
    }
  }, [])

  return (
    <div id={props.id} style={{width:'100%',height:'100%'}}></div>
  )
}

export {LongdoMap,map,longdo}

// import React, { Component } from 'react';

// export let longdo;
// export let map;

// export class LongdoMap extends Component {

//   constructor(props) {
//     super(props);
//     this.mapCallback = this.mapCallback.bind(this);
//   }

//   mapCallback() {
//     longdo = window.longdo
//     map = new window.longdo.Map({
//       placeholder: document.getElementById(this.props.id),
//       language: 'en'
//     });
//   }

//   componentDidMount() {
//     const existingScript = document.getElementById('longdoMapScript');
//     const callback = this.props.callback

//     if (!existingScript) {
//       const script = document.createElement('script');
//       script.src = `https://api.longdo.com/map/?key=${this.props.mapKey}`;
//       script.id = 'longdoMapScript';
//       document.body.appendChild(script);

//       script.onload = () => {
//         this.mapCallback();
//         if (callback) callback();
//       };
//     }

//     if (existingScript) this.mapCallback();
//     if (existingScript && callback) callback();
//   }

//   render() {
//     return (
//         <div id={this.props.id} style={{width:'100%',height:'100%'}}>
        
//         </div>
//     );
//   }

// }