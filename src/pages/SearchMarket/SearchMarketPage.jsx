import React, { useState, useEffect, useRef } from 'react'
import { LongdoMap, longdo, map } from '../../components/LongdoMap/LongdoMap';
import data from '../../DataMockup/Data';
import { Drawer, Space, Input } from 'antd';
import './SearchMarket.css';
import { InputGroup, Form, Button, Container, Row, Col, Card } from 'react-bootstrap'
import { Icon } from '@iconify/react';
import FilterMarketMap from '../../components/FilterMarketMap/FilterMapMarket';
import axios from 'axios';
import liff from '@line/liff';
import { v4 as uuidv4 } from 'uuid';



function SearchMarketPage() {
  const mapKey = import.meta.env.VITE_LONGDOMAP_API_KEY;

  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(500);
  const [childrenDrawer, setChildrenDrawer] = useState(false);

  const [suggestLocation, setSuggestLocation] = useState([]);
  const [keywordSearch, setKeywordSearch] = useState('');
  const [currentLocation, setCurrentLocation] = useState(false);
  const [zoomMap, setZoomMap] = useState(15);
  const [profile, setProfile] = useState({});
  const [location, setLocation] = useState({});

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
    map.Event.bind('location', locationUpdate);
    map.Event.bind('click', clickMap);
    map.zoom(zoomMap)
    for (const marker of data) {
      map.Overlays.add(new longdo.Marker(marker.location, {
        // title: marker.name,
        icon: {
          url: 'https://map.longdo.com/mmmap/images/pin_mark.png',
          offset: { x: 12, y: 45 }
        },
        // detail: marker.openCloseTime,
        visibleRange: { min: 10, max: 20 },
      }));

      // map.Overlays.add(new longdo.Popup(marker.location,
      //   {
      //     html: `<div style="background: #fff;padding:5px 10px;border-radius:20px;width:max-content">${marker.name}</div>`,
      //   }
      // ))
    }
  }
  const style = {
    topBorderSiteMenu: {
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      overflow: 'hidden'
    }
  }
  const liffFetch = async () => {
    await liff.ready;
    const profile = await liff.getProfile();
    setProfile(profile)
  }
  useEffect(() => {
    liffFetch();
    const getMap = async () => {
      try {
        const { map } = (await import('../../components/LongdoMap/LongdoMap'));
        await map.location(longdo.LocationMode.Geolocation)
        setCurrentLocation(true);
        setOpen(true);
      } catch (err) {
        console.error(err.message);
      }
    }
    getMap();
  }, [profile.userId])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLocation(() => {
        return { lat: position.coords.latitude, lon: position.coords.longitude }
      })
    });
  }, [])

  const showDrawer = () => {
    console.log(profile)
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const showChildrenDrawer = () => {
    setChildrenDrawer(true);
  };

  const onChildrenDrawerClose = () => {
    setChildrenDrawer(false);
  };
  const confirmFilter = () => {
    //filter

    //filter end
    setChildrenDrawer(false);
  }
  const listMarket = () => {
    const lists = data.map((item) => {
      return (
        <div key={uuidv4()}>
          <Card className='flex-row text-start disable'>
            <div className="box-image">
              <Card.Img variant="start" src={`../../../public/${item.image}`} className='image-fit' />
            </div>
            <Card.Body>
              <Card.Title className='h6'>{item.name}</Card.Title>
              <Card.Text className='fs-6'>
                {item.openCloseTime}<br />
                {item.open}
              </Card.Text>
              <Card.Text className='fs-6'>{profile.displayName}</Card.Text>
              <Button variant='outline-secondary' onClick={() => { liff.logout(); window.location.reload() }}>log</Button>
            </Card.Body>
          </Card>
        </div>
      )
    })
    return lists;
  }
  const doSearch = () => {
    axios(`https://search.longdo.com/mapsearch/json/search?keyword=${keywordSearch}&limit=1&key=${mapKey}`).then((res) => {
      const { lat, lon } = res.data.data[0];
      setZoomMap(12);
      map.location({ lon, lat });
      map.zoom(zoomMap)
    }).catch(err => {
      console.log(err);
    })
    setSuggestLocation([]);
  }
  const onPressEnter = (e) => {
    if ((e || window.event).keyCode != 13)
      return;
    doSearch();
  }
  const onChangeSearch = (e) => {
    setKeywordSearch(e.target.value);
    axios.get(`https://search.longdo.com/mapsearch/json/suggest?keyword=${keywordSearch}&limit=8&key=${mapKey}`).then((res) => {
      setSuggestLocation(res.data.data);
    }).catch(err => {
      console.log(err);
    })
  }
  const onClickListKeyword = (item) => {
    setKeywordSearch(item);
    doSearch();
  }
  const listSuggestElem = suggestLocation.map((prevLocatin, i) => {
    return (
      <li key={i} className="list-group-item list-group-item-action" onClick={() => onClickListKeyword(prevLocatin.w)} aria-current="true">{prevLocatin.w}</li>
    )
  });
  const dragMap = () => {
    setCurrentLocation(false);
    setSuggestLocation([]);
  }
  const dropMap = () => {
    setLocation(map.location())
  }
  const locationUpdate = () => {
  }
  const clickMap = () => {
    setSuggestLocation([]);
  }
  const getLocation = async (e) => {
    const x = await map.location(longdo.LocationMode.Geolocation);
    await console.log(map.location(longdo.LocationMode.Geolocation));
    setCurrentLocation(true);
  }
  const zoomInMap = () => {
    if (zoomMap < 20) setZoomMap(zoomMap + 1);
    map.zoom(zoomMap)
  }
  const zoomOutMap = () => {
    if (zoomMap > 1) setZoomMap(zoomMap - 1);
    map.zoom(zoomMap)
  }

  return (
    <div className='h-screen'>
      <div className="position-fixed top-0 w-100 start-50 translate-middle-x p-4" style={{ zIndex: 10 }}>
        <ul className="list-group mt-2 list-style-none shadow-sm">
          <Input value={keywordSearch} size="large" onKeyUp={onPressEnter} onChange={onChangeSearch} className='list-group-item d-inline-flex' placeholder="สถานที่" allowClear prefix={<Icon icon="akar-icons:location" className='text-secondary fs-3' />} />
          {listSuggestElem}
        </ul>
      </div>
      <div className="d-grid position-fixed top-50 end-0 translate-middle-y me-3 gap-3 " style={{ zIndex: 10 }}>
        <div className={`map__btn ${currentLocation ? 'active' : ''}`}><Icon icon="bx:current-location" className='fs-4' onClick={getLocation} /></div>
        <div className="map__btn" onClick={zoomInMap}><Icon icon="akar-icons:plus" className='fs-4' /></div>
        <div className="map__btn" onClick={zoomOutMap}><Icon icon="akar-icons:minus" className='fs-4' /></div>
      </div>
      <LongdoMap id="longdo-map" mapKey={mapKey} callback={initMap} markets={data} />
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
          <Form.Control placeholder='ชื่อตลาด...' />
          <Button variant="outline-secondary" className='p-1' onClick={showChildrenDrawer}>
            <Icon icon="clarity:filter-grid-line" className='fs-2' />
          </Button>
          <Button variant="primary" >
            <Icon icon="akar-icons:search" />
          </Button>
        </InputGroup>
        <div className="position-absolute bottom-0 start-0 overflow-scroll w-100 text-center" style={{ height: 390 }}>
          <Container>
            <div className="d-grid gap-3">
              {listMarket()}
            </div>
          </Container>
        </div>
        <Drawer
          title="คัดกรองตลาด"
          placement="bottom"
          contentWrapperStyle={{ ...style.topBorderSiteMenu }}
          onClose={onChildrenDrawerClose}
          bodyStyle={{ paddingTop: 8 }}
          open={childrenDrawer}
          closable={false}
          extra={
            <Space>
              <Button variant='outline-secondary' onClick={onChildrenDrawerClose}>ยกเลิก</Button>
              <Button type="primary" onClick={confirmFilter}>
                แก้ไข
              </Button>
            </Space>
          }
        >
          <FilterMarketMap />
        </Drawer>
      </Drawer>

      <div className='bottom___bar' onClick={showDrawer}>
        <div className=' text-center'>
          <div className='line__bar'></div>
        </div>
      </div>
    </div>
  )
}

export default SearchMarketPage