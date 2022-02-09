
import { Button, Modal, makeStyles, Input, AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import React, { useRef, useState, useEffect, Component } from 'react'
import mapboxgl from 'mapbox-gl';
import logo from './logo.svg';
import 'mapbox-gl/dist/mapbox-gl.css';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import './App.css';
import { keys } from '@material-ui/core/styles/createBreakpoints';

const Base_URL = 'http://localhost:8001/'
const zoomThreshold = 4;


const colors = [
  '#FF5733',
  '#979190',
  '#13DE28',
  '#13B3DE',
  '#1F13DE',
  '#DB13DE',
  '#400511',
  '#C5BDBF',
  'f9d326',
  'ea0b7d',
  '40acb7',
];


const App = () => {

  mapboxgl.accessToken = 'pk.eyJ1IjoibWFuaXNoY2l0eW1hbGwiLCJhIjoiY2t3MXUwMG16YmprYjMxcXdvZ3U4ZDJpMCJ9.5ty4XjTQVSRB8EZcSmfnyA';

  const [newData, setnewdata] = useState([]);
  const [newtpId, setnewtpId] = useState('')
  const [flag, setFlag] = useState('')
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(77.2894773);
  const [lat, setLat] = useState(28.3956318);
  const [zoom, setZoom] = useState(5);
  const [showtpId, setshowtpId] = useState(false)
  const [aboutflag, setaboutflag] = useState(false)
  const [noofclusters, setnoofclusters] = useState(0)


  const resetMap = (e) => {
    e.preventDefault();
    window.location.reload();
  }

  const getData = (e) => {
    e.preventDefault();

    setshowtpId(true)
    fetch(Base_URL + newtpId)
      .then(response => {
        const json = response.json()
        console.log(json);
        if (response.ok) {
          return json
        }
        throw response
      })
      .then(data => {
        setnewdata(data)
        setFlag(newtpId)
      })
      .catch(error => {
        console.log(error);
        alert(error)
      })
  };

  useEffect (() => {
    if(newData.data!=undefined){
      setnoofclusters(newData.data.noofclusters);
    }
  })

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });
  });

  useEffect(() => {
    if (!map.current) return;
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  useEffect(() => {
    if (!map.current) return;
    if (newData.data != undefined) {
      let size = Number(Object.keys(newData.data.lat).length);
      for (let i = 0; i < size; i++) {
        const popup = new mapboxgl.Popup({ offset: 25 }).setText(
          'This is a delivery location for CL'
        );
        var marker1 = new mapboxgl.Marker({ "color": colors[1 + newData.data.labels[i]] })
          .setLngLat([newData.data.lng[i], newData.data.lat[i]])
          .setPopup(popup)
          .addTo(map.current)
      }
      console.log(200)
      size=Number(Object.keys(newData.spoke.lat).length)
      for (let i=0;i<size;i++){
        const popup = new mapboxgl.Popup({ offset: 25 }).setText(
          'This is a spoke Location'
        );
          
        new mapboxgl.Marker({"color":colors[noofclusters]})
        .setLngLat([newData.spoke.lng[i],newData.spoke.lat[i]])
        .setPopup(popup)
        .addTo(map.current)
      }

      const popup = new mapboxgl.Popup({ offset: 25 }).setText(
        'This is Home Address of CL'
      );

      var marker1 = new mapboxgl.Marker({"color":colors[noofclusters+1]})
        .setLngLat([newData.add_latlng.lng, newData.add_latlng.lat])
        .setPopup(popup)
        .addTo(map.current)

      if (!map.current) return;
      map.current.getCanvas().style.cursor = 'default';

      const layers = [];
      for (let i = 0; i < noofclusters; i++) {
        layers.push("Cluster " + (i + 1))
      }
      layers.push("Spoke Location")
      layers.push("Home Address of CL")

      console.log(layers)

      const legend = document.getElementById('legend');

      layers.forEach((layer, i) => {
        const color = colors[i];
        const item = document.createElement('div');
        const key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;

        const value = document.createElement('span');
        value.innerHTML = `${layer}`;
        item.appendChild(key);
        item.appendChild(value);
        legend.appendChild(item);
      });
    }
  }, [map.current, flag]);

  // useEffect(() => {
  //   if (!map.current) return;
  //   if (newData.add_latlng != null) {
  //     if (newData.add_latlng.lng != null && newData.add_latlng.lat != null) {
  //       const el = document.createElement('div');
  //       const width = 30
  //       const height = 30
  //       el.className = 'marker';
  //       el.style.backgroundImage = `url(https://thumbs.dreamstime.com/b/pin-location-house-home-icon-logo-design-element-can-be-used-as-as-complement-to-95678746.jpg/${width}/${height}/)`;
  //       el.style.width = `${width}px`;
  //       el.style.height = `${height}px`;
  //       el.style.backgroundSize = '100%';

  //       const popup = new mapboxgl.Popup({ offset: 25 }).setText(
  //         'This is Home Address of CL'
  //       );

  //       var marker1 = new mapboxgl.Marker(el)
  //         .setLngLat([newData.add_latlng.lng, newData.add_latlng.lat])
  //         .setPopup(popup)
  //         .addTo(map.current)
  //     }
  //   }
  // }, [map.current, flag]);

  const funsetaboutflag = () => {
    if (aboutflag)
      setaboutflag(false)
    else
      setaboutflag(true)
  }

  return (
    <div>
      <header>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className="cluster">
              Clustering
            </Typography>
            <Button
              style={{ padding: "20px" }}
              className='about'
              color="inherit"
              onClick={funsetaboutflag}
            >  About
            </Button>
          </Toolbar>
        </AppBar>
      </header>
      {
        aboutflag ? <div className='aboutdetails'> This app makes cluster of delivery locations of (CL)Team leaders orders</div> : null
      }
      <form className="tpid_commentbox">
        <input className="tpid_input"
          type="text"
          placeholder="Enter a tp_id"
          value={newtpId}
          onChange={(e) => setnewtpId(e.target.value)}
        />
        <button
          className="tpid_button"
          type="submit"
          disabled={!newtpId}
          onClick={getData}>
          Submit
        </button>
        <button
          className="reset_map"
          type="submit"
          onClick={resetMap}>
          Reset Map
        </button>
        {showtpId ? <div className='showtpid'>Tp Id of CL: {newtpId} </div> : null}
      </form>
      <div>
        <div className="sidebar">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
        <form>
          <div ref={mapContainer} className="map-container" />
          <div className="map-overlay" id="legend"></div>
        </form>
      </div>
      <AppBar position="static" elevation={0} component="footer" color="primary">
        <Toolbar style={{ justifyContent: "center" }}>
          <Typography variant="caption">©2022</Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default App;
