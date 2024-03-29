import React, { useState, useEffect, useRef } from 'react'
import { LongdoMap, longdo, map } from '../LongdoMap/LongdoMap';
// import data from '../../DataMockup/data';
import { Drawer, Input } from 'antd';
import { Link } from 'react-router-dom'
import './SearchMarket.css';
import { InputGroup, Form, Button, Container, Card } from 'react-bootstrap'
import { Icon } from '@iconify/react';
import FilterMarketMap from '../FilterMarketMap/FilterMapMarket';
import axios from 'axios';
import liff from '@line/liff';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';
import moment from 'moment';
import th from 'moment/dist/locale/th';
import { useDispatch } from 'react-redux';
import { addFilter } from '../../reducers/filterMarketSlice';
moment.locale('th', th);

function SearchMarket(props) {
  const store = useSelector((state) => ({ ...state }))
  const dispatch = useDispatch();
  const mapKey = import.meta.env.VITE_LONGDOMAP_API_KEY;
  const baseUrl = import.meta.env.VITE_BASE_URL_API;

  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(500);

  const [childrenDrawer, setChildrenDrawer] = useState(false);
  const move = useRef("");
  const [suggestLocation, setSuggestLocation] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(false);
  const [zoomMap, setZoomMap] = useState(15);
  const [location, setLocation] = useState({});
  const searchMarket = useRef(null);
  const [listData, setListData] = useState({ data: [], load: false });

  const style = {
    topBorderSiteMenu: {
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      overflow: 'hidden'
    }
  }

  const initMap = async () => {
    map.Layers.setBase(longdo.Layers.NORMAL);
    map.Ui.Zoombar.visible(false);
    map.Ui.LayerSelector.visible(false);
    map.Ui.Fullscreen.visible(false);
    map.Ui.Crosshair.visible(false);
    map.Ui.Scale.visible(false);
    map.Ui.DPad.visible(false);
    map.Ui.Zoombar.visible(false);
    map.Ui.Toolbar.visible(false);
    map.Search.language('th');
    map.Event.bind('drag', dragMap);
    map.Event.bind('drop', dropMap);
    map.Event.bind('click', clickMap);
    map.zoom(zoomMap)
    map.location(longdo.LocationMode.Geolocation)
    setCurrentLocation(true);
    setOpen(true);
  }
  const dragMap = () => {
    map?.Overlays.clear()
    setCurrentLocation(false);
    setSuggestLocation([]);
    move.current = "drag"
  }
  const dropMap = () => {
    setLocation(map.location())
    dispatch(addFilter(map.location()))
    move.current = "drop"
  }
  useEffect(() => {
    if (move.current === "drop") {
      searchListMarket()
    }
  }, [move.current])
  useEffect(() => {
    searchListMarket();
  }, [location])
  useEffect(() => {

    listData.data.forEach((marker) => {
      map?.Overlays.add(new longdo.Marker({ lat: marker.lat, lon: marker.lon }, {
        title: marker.name,
        icon: {
          url: 'https://map.longdo.com/mmmap/images/pin_mark.png',
          offset: { x: 12, y: 45 }
        },
        detail: marker.openCloseTime,
        visibleRange: { min: 10, max: 20 },
      }));
    })
  }, [listData.data])
  const onChildrenDrawerClose = () => {
    setChildrenDrawer(false);
  };
  const showChildrenDrawer = () => {
    setChildrenDrawer(true);
  }

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const clickMap = () => {
    setSuggestLocation([]);
  }
  const getLocation = async (e) => {
    map.location(longdo.LocationMode.Geolocation)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const location = { lat: position.coords.latitude, lon: position.coords.longitude }
        dispatch(addFilter(location))
        setCurrentLocation(true);
        searchListMarket();
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }
  const zoomInMap = () => {
    if (zoomMap < 20) setZoomMap(zoomMap + 1);
    map.zoom(zoomMap)
  }
  const zoomOutMap = () => {
    if (zoomMap > 1) setZoomMap(zoomMap - 1);
    map.zoom(zoomMap)
  }
  const searchListMarket = () => {
    const data = { ...store.filterMarketStore.data, search: searchMarket.current?.value }
    axios.post(`${baseUrl}market/list-filter`, data).then(res => {
      setListData({ data: res.data, load: true });
    }).catch(err => console.error(err.response.data.message.message))
  }

  return (
    <div className='h-screen'>
      <div className="position-fixed top-0 w-100 start-50 translate-middle-x p-4" style={{ zIndex: 10 }}>
      </div>
      <div className="d-grid position-fixed top-50 end-0 translate-middle-y me-3 gap-3 " style={{ zIndex: 10 }}>
        <div className={`map__btn ${currentLocation ? 'active' : ''}`}><Icon icon="bx:current-location" className='fs-4' onClick={getLocation} /></div>
        <div className="map__btn" onClick={zoomInMap}><Icon icon="akar-icons:plus" className='fs-4' /></div>
        <div className="map__btn" onClick={zoomOutMap}><Icon icon="akar-icons:minus" className='fs-4' /></div>
      </div>
      <LongdoMap id="longdo-map" mapKey={mapKey} callback={initMap} />
      <Drawer
        placement="bottom"
        height={height}
        maskStyle={{ background: 'transparent' }}
        contentWrapperStyle={{ ...style.topBorderSiteMenu }}
        bodyStyle={{ paddingTop: 0 }}
        closable={false}
        onClose={onClose}
        open={open}
      >
        <div className="mb-4">
          <div className=' text-center'>
            <div className='line__bar'></div>
          </div>
        </div>
        <InputGroup className="mb-3">
          <Form.Control placeholder='ค้นชื่อตลาด...' ref={searchMarket} />
          <Button variant="outline-secondary" className='p-1' onClick={showChildrenDrawer}>
            <Icon icon="clarity:filter-grid-line" className='fs-2' />
          </Button>
          <Button variant="secondary" onClick={searchListMarket} >
            <Icon icon="akar-icons:search" color='white' />
          </Button>
        </InputGroup>
        <div className="position-absolute bottom-0 start-0 overflow-scroll w-100 text-center" style={{ height: 390 }}>
          <Container>
            <div className="d-grid gap-3">
              {listData.load ?
                listData.data.map((item) => {
                  return (
                    <div key={uuidv4()}>
                      <Link to={`/profile-market/${item.id}`} className=" text-decoration-none">
                        <Card className='flex-row text-start disable '>
                          <div className="box-image">
                            <Card.Img variant="start" src={`${baseUrl}upload/market/${item.image}`} className='image-fit' />
                          </div>
                          <Card.Body>
                            <Card.Title className='h6'>{item.name}</Card.Title>
                            <Card.Text className='fs-6'>
                              {moment(item.time_open, 'th').format('LT')} - {moment(item.time_close, 'th').format('LT')} น.
                            </Card.Text>
                            {/* <Card.Text className='fs-6'>{profile.displayName}</Card.Text> */}
                            {/* <Button variant='outline-secondary' onClick={() => { liff.logout(); window.location.reload() }}>log</Button> */}
                          </Card.Body>
                        </Card>
                      </Link>
                    </div>
                  )
                }) : null}
            </div>
          </Container>
        </div>
        {childrenDrawer ? <FilterMarketMap onChildrenDrawerClose={onChildrenDrawerClose} childrenDrawer={childrenDrawer} /> : <div></div>}
      </Drawer>

      <div className='bottom___bar' onClick={showDrawer}>
        <div className=' text-center'>
          <div className='line__bar'></div>
        </div>
      </div>
    </div>
  )
}

export default SearchMarket