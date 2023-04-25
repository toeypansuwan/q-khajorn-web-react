import React, { useEffect } from 'react'
let longdo;
let map;

function LongdoMap(props) {
  const mapCallback = () => {
    longdo = window.longdo
    map = new window.longdo.Map({
      placeholder: document.getElementById('longdo-map'),
    });
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
      return () => {
        document.getElementById('longdoMapScript').remove();
      }
    }
  }, [])

  return (
    <div id={props.id} style={{ width: '100%', height: '100%' }}></div>
  )
}

export { LongdoMap, map, longdo }
