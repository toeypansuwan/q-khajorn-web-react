import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Container, Row, Col, Stack, Form, Button, ToggleButton, Card, ButtonGroup, ToggleButtonGroup } from 'react-bootstrap'
import { LongdoMap, longdo, map } from '../LongdoMap/LongdoMap';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { message, Upload, Button as ButtonAntd, Select, Tabs, Collapse, Input, Radio } from 'antd';
import { v4 as uuidv4 } from 'uuid'
import { uploadButton } from '../services/services';
import ImageMapSection from '../ImageMapSection/ImageMapSection';
import { Icon } from '@iconify/react';
import { convertImageUrl, days, hasValidCoordinatePairs, uploadImage } from '../../services/services';
import AreaCreate from '../AreaCreate/AreaCreate';
import axios from 'axios';
import AreaInformationCollector from '../AreaInformationCollector/AreaInformationCollector';

const CreateAndUpdateComponent = ({ initialData, onCreate, onUpdate }) => {
    const mapKey = import.meta.env.VITE_LONGDOMAP_API_KEY;
    const [marketName, setMarketName] = useState();
    const [imagePlan, setImagePlan] = useState({});
    const [plan, setPlan] = useState({
        imagePlan: {},
        areaPlan: [],
    });
    const [imageProfile, setImageProfile] = useState({});
    const [galleries, setGalleries] = useState([]);
    const [options, setOption] = useState([]);
    const [mapAreaPlan, setMapAreaPlan] = useState([]);
    const [mapAreaZone, setMapAreaZone] = useState([]);
    const [selectDays, setSelectDays] = useState([]);
    const [suggestLocation, setSuggestLocation] = useState([]);
    const [keywordLocation, setKeywordLocation] = useState([]);
    const [location, setLocation] = useState([]);

    const handleChangeDays = (val) => {
        setSelectDays(val);
    };

    const handleTagDeselect = (value) => {
        setPlan((prevPlan) => {
            return {
                ...prevPlan, areaPlan: prevPlan.areaPlan.map(area => {
                    const updatedCategories = area.categories.filter(
                        (category) => category.label !== value
                    );
                    return { ...area, categories: updatedCategories };
                })
            }
        });
    };

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
        addMarker();
        map.Event.bind('overlayMove', function (overlay) {
            setLocation(overlay.location())
        });

        // map.Search.language('th');
        // map.Event.bind('drag', dragMap);
        // map.Event.bind('drop', dropMap);
        // map.Event.bind('click', clickMap);
        // map.zoom(zoomMap)
        // map.location(longdo.LocationMode.Geolocation)
    }
    const addMarker = (location = {}) => {
        const newLocation = location?.lat && location?.lon ? { lat: location.lat, lon: location.lon } : map.location();
        const marker = new longdo.Marker(newLocation, {
            icon: {
                url: 'https://map.longdo.com/mmmap/images/pin_mark.png',
                offset: { x: 12, y: 45 }
            },
            draggable: true,
            weight: longdo.OverlayWeight.Top,
        });
        map.Overlays.add(marker);
        setLocation(newLocation)
    }
    const doSearch = () => {
        axios(`https://search.longdo.com/mapsearch/json/search?keyword=${keywordLocation}&limit=1&key=${mapKey}`).then((res) => {
            const { lat, lon } = res.data.data[0];
            map.location({ lon, lat });
            map.zoom(12);
            map.Overlays.clear();
            addMarker({ lat, lon });

        }).catch(err => {
            console.error(err);
        })
        setSuggestLocation([]);
    }
    const onPressEnter = (e) => {
        if ((e || window.event).keyCode != 13)
            return;
        doSearch();
    }
    const onChangeSearch = (e) => {
        setKeywordLocation(e.target.value);
        if (keywordLocation != "") {
            axios.get(`https://search.longdo.com/mapsearch/json/suggest?keyword=${keywordLocation}&limit=8&key=${mapKey}`).then((res) => {
                setSuggestLocation(res.data.data);
            }).catch(err => {
                console.log(err);
            })
        } else {
            setSuggestLocation([]);
        }
    }
    const onClickListKeyword = (item) => {
        setKeywordLocation(item);
        doSearch();
    }
    const handleSetImagePlan = (result) => setPlan(prevPlan => ({ ...prevPlan, imagePlan: result }));
    const handleSetAreaPlan = (updatedArea) => {
        setPlan(prevPlan => ({
            ...prevPlan,
            areaPlan: updatedArea
        }));
    }
    const zoneId = useRef(null);
    const handleSetAreaZone = (updatedArea) => {
        setPlan(prevPlan => {
            const newPlan = {
                ...prevPlan,
                areaPlan: prevPlan.areaPlan.map(zone => {
                    if (zone.id === zoneId.current) {
                        return {
                            ...zone,
                            plan: {
                                ...zone.plan,
                                areaPlan: updatedArea.map((area, i) => ({
                                    ...area,
                                    title: area.title !== null ? area.title : zone.title + (i + 1)
                                }))
                            }
                        }
                    }
                    return zone
                })
            }
            return newPlan
        });
    }
    useEffect(() => {
        zoneId.current = plan.areaPlan[0]?.id;
    }, [plan.areaPlan[0]])
    const handleSetImageZone = (result) => setPlan(prevPlan => ({
        ...prevPlan, areaPlan: prevPlan.areaPlan.map(zone => {
            if (zone.id === zoneId.current) {
                return {
                    ...zone,
                    plan: {
                        ...zone.plan,
                        imagePlan: result
                    }
                }
            }
            return zone
        })
    }));
    const tabsZoneItems = plan.areaPlan.map((zone, i) => {
        return {
            key: zone.id,
            label: zone.title ? `โซน ${zone.title}` : `โซน ${i + 1}`,
            children: <AreaInformationCollector planArea={zone.plan} setArea={handleSetAreaZone} setImagePlan={handleSetImageZone} type="zone" />
        }
    })
    return (
        <Container className='py-3'>
            <Row className='mt-5'>
                <Col xs='8'>
                    <Stack direction='vertical' gap={4}>
                        <Row className='mb-3 align-items-center'>
                            <Col xs='auto'><h4>{initialData?.id ? 'แก้ไข' : 'เพิ่มตลาด'}</h4></Col>
                            <Col><Form.Control onChange={(e) => setMarketName(e.target.value)} value={marketName} placeholder='ชื่อตลาด' /></Col>
                        </Row>
                        <div style={{ height: 300 }} className='mb-3 position-relative'>
                            <LongdoMap id="longdo-map" mapKey={mapKey} callback={initMap} />
                            <div className="position-absolute top-0 w-100 start-50 translate-middle-x p-4" style={{ zIndex: 10 }}>
                                <ul className="list-group mt-2 list-style-none shadow-sm">
                                    <Input value={keywordLocation} onKeyUp={onPressEnter} onChange={onChangeSearch} size="large" className='list-group-item d-inline-flex' placeholder="สถานที่ใกล้เคียง หรือ ที่คุณต้องการ" allowClear prefix={<Icon icon="akar-icons:location" className='text-secondary fs-3' />} />
                                    {
                                        suggestLocation.map((prevLocatin, i) => (
                                            <li key={i} onClick={() => { onClickListKeyword(prevLocatin.w) }} className="list-group-item list-group-item-action" aria-current="true">{prevLocatin.w}</li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                        <div>
                            <h4>วันเปิดตลาด</h4>
                            <p>เลือกได้มากกว่า 1 วัน</p>
                            <ToggleButtonGroup bsPrefix='d-flex gap-3 flex-wrap' type="checkbox" onChange={handleChangeDays}>
                                {
                                    days.map((day, i) => (
                                        <ToggleButton variant='outline-secondary' key={i} id={day.value} value={day.value}>{day.label}</ToggleButton>
                                    ))
                                }
                            </ToggleButtonGroup>
                        </div>

                        <Stack direction='vertical' gap={3} className='mb-3'>
                            <h4>เพิ่มประเภทสินค้า</h4>
                            <Select
                                mode="tags"
                                style={{
                                    width: '100%',
                                }}
                                onChange={(value) => { setOption(value.map((i) => ({ label: i, value: i }))) }}
                                onDeselect={handleTagDeselect}
                                tokenSeparators={[',']}
                                options={options}
                            />
                        </Stack>

                    </Stack>

                </Col>
                <Col xs='4'>
                    <div className="text-end mb-3">
                        <Button>ยืนยันการสร้างตลาด</Button>
                    </div>
                    <Card className='bg-light border-0'>
                        <Card.Body>
                            <Tabs defaultActiveKey="1" items={[
                                {
                                    label: "ภาพตลาด",
                                    key: 1,
                                    children: <Upload accept="image/*" onChange={({ file, fileList }) => {
                                        console.log(event)
                                        convertImageUrl(file, setImageProfile, fileList);
                                    }} customRequest={uploadImage} multiple={false} listType="picture-card">
                                        {imageProfile.fileList?.length >= 1 ? null : uploadButton}
                                    </Upload>
                                },
                                {
                                    label: "อัลบั้ม",
                                    key: 2,
                                    children: <Upload accept="image/*" onChange={({ file, fileList }) => {
                                        convertImageUrl(file, setGalleries, fileList);
                                    }} customRequest={uploadImage} multiple={true} listType="picture-card">
                                        {uploadButton}
                                    </Upload>
                                }
                            ]} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <hr className='mb-5' />
            {/* <Row>
                <Col xs='8'>
                    <h4>ผังตลาด</h4>
                </Col>
                <Col xs='4'>
                    <h4>เลือกพื้นที่ โซน</h4>
                </Col>
            </Row> */}
            <AreaInformationCollector planArea={plan} setArea={handleSetAreaPlan} setImagePlan={handleSetImagePlan} options={options} />
            <hr className='mb-5' />
            <Tabs defaultActiveKey="1" onChange={(key) => { zoneId.current = key }} items={tabsZoneItems} destroyInactiveTabPane />
        </Container >
    )
}

CreateAndUpdateComponent.propTypes = {
}

export default CreateAndUpdateComponent