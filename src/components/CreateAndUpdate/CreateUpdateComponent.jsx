import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Container, Row, Col, Stack, Form, Button, ToggleButton, Card, ToggleButtonGroup } from 'react-bootstrap'
import { LongdoMap, longdo, map } from '../LongdoMap/LongdoMap';
import { Upload, Select, Tabs, Input, InputNumber, TimePicker, Modal, message } from 'antd';
import { uploadButton } from '../services/services';
import { Icon } from '@iconify/react';
import { BASE_URL_API, beforeUpload, days, fallbackImage } from '../../services/services';
import dayjs from 'dayjs';
import { token } from '../../services/AuthServices';
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

import FroalaEditor from 'froala-editor';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins/table.min.js';
import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/plugins/image.min.js';
import 'froala-editor/js/third_party/font_awesome.min.js';
import 'froala-editor/css/plugins/image.min.css'
import 'froala-editor/js/plugins/colors.min.js';
import 'froala-editor/js/plugins/emoticons.min.js';
import 'froala-editor/js/plugins/font_size.min.js';
import 'froala-editor/js/plugins/line_height.min.js';
import 'froala-editor/js/plugins/paragraph_style.min.js';
import 'froala-editor/js/plugins/word_paste.min.js';
import 'froala-editor/js/plugins/video.min.js';
import 'froala-editor/js/plugins/inline_class.min.js';
import 'froala-editor/js/plugins/paragraph_format.min.js';
import 'froala-editor/js/plugins/lists.min.js';

import axios from 'axios';
import AreaInformationCollector from '../AreaInformationCollector/AreaInformationCollector';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from "swiper";
import "swiper/css/pagination";
import "swiper/css";
import { stringify, v4 } from 'uuid';
import { config } from 'dotenv';

const CreateAndUpdateComponent = ({ initialData, onSubmit }) => {
    const mapKey = import.meta.env.VITE_LONGDOMAP_API_KEY;
    const [marketName, setMarketName] = useState("");
    const [plan, setPlan] = useState({
        imagePlan: [],
        areaPlan: [],
    });
    const [imageProfile, setImageProfile] = useState([]);
    const [galleries, setGalleries] = useState([]);
    const [options, setOption] = useState([]);
    const [suggestLocation, setSuggestLocation] = useState([]);
    const [keywordLocation, setKeywordLocation] = useState([]);
    const [selectDays, setSelectDays] = useState([]);
    const [servicePrice, setServicePrice] = useState();
    const [location, setLocation] = useState({});
    const [fileListItem, setFileListItem] = useState([]);
    const [item, setItem] = useState({
        name: "",
        price: 0,
        file: [],
        imageUrl: "",
    });
    const [accessories, setAccessories] = useState([]);
    const [isModalEdit, setIsModalEdit] = useState(false);
    const [time, setTime] = useState({
        open: '',
        close: ''
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [content, setContent] = useState();
    const [key, setKey] = useState({ key: "", isKeyVerify: false });
    const [promptpay, setPromptpay] = useState({ number_phone: "", id_card_number: "" });


    const showModal = (event = null, accessory) => {
        if (event === 'edit') {
            setIsModalEdit(true);
            setItem(accessory)
            setFileListItem([accessory.file]);
        }
        setIsModalOpen(true);
    };

    const handleOk = () => {
        if (JSON.stringify(item.file) === '{}' || JSON.stringify(item) === '{}') {
            message.error('กรุณาใส่ภาพ')
            return;
        }
        const data = { id: v4(), ...item }
        setAccessories(prev => [...prev, data]);
        setFileListItem([]);
        setItem({});
        setIsModalOpen(false);
    };
    const handleEditOk = () => {
        if (JSON.stringify(item.file) === '{}' || JSON.stringify(item) === '{}') {
            message.error('กรุณาใส่ภาพ')
            return;
        }
        setAccessories(prevAccessories => prevAccessories.map(prevAccessory => {
            if (item.id === prevAccessory.id) {
                return item;
            }
            return prevAccessory;
        }));
        setFileListItem([]);
        setItem({});
        setIsModalEdit(false)
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setFileListItem([]);
        setIsModalEdit(false)
        setItem({});
    };

    const onChangeImageItems = async ({ file, fileList }) => {
        const index = fileList.findIndex((item) => item.uid === file.uid);
        if (file.status == 'uploading') {
            file.status = 'done';
            file.percent = 100;
            fileList[index].status = 'done'
            fileList[index].percent = 100
        }
        if (file.status === 'done') {
            setFileListItem(fileList)
            setItem(prev => ({ ...prev, file: fileList }));
        }
        if (file.status === 'removed') {
            // axios.delete(`${BASE_URL_API}upload/file/${file.response?.filename}`).then(
            //     message.success("ลบสำเร็จ")
            // ).catch((error) => {
            //     console.error(error)
            // })
            setFileListItem([])
            setItem(prev => ({ ...prev, file: [] }));
        }
    }

    const styles = {
        slideContainer: {
            weight: '100%', height: 200
        },
        imageSlid: {
            width: '100%', height: '100%', objectFit: 'cover'
        }
    }

    useEffect(() => {
        let editor = new FroalaEditor('textarea#editor', {
            events: {
                contentChanged: () => {
                    setContent(editor.html.get());
                }
            },
            placeholderText: "<div class='text-center'><h5>ออกแบบโปรไฟล์ตลาด</h5><br><p>คลิกที่นี่เพื่อแก้ไข...</p></div>",
            imageDefaultWidth: 0,
            imageResizeWithPercent: true,
            imageInsertButtons: ['imageBack', '|', 'imageByURL'],
            imageEditButtons: ['imageAlign', 'imageRemove', 'imageDisplay', 'imageStyle', 'imageAlt', 'imageSize'],
            imageMultipleStyles: false,
            imagePaste: false,
            imageRoundPercent: true,
            emoticonsButtons: ["emoticonsBack", "|"],
            emoticonsUseImage: true,
            videoInsertButtons: ['videoBack', '|', 'videoByURL'],
            colorsText: [
                "#000000",
                "#2C2E2F",
                "#6C7378",
                "#FFFFFF",
                "#009CDE",
                "#003087",
                "#FF9600",
                "#00CF92",
                "#DE0063",
                "#640487",
                "REMOVE"
            ],
            inlineClasses: {
                'text-primary': 'Primary',
                'text-secondary': 'Secondary'
            },
            toolbarButtons: {
                'moreParagraph': {
                    'buttons': ['paragraphFormat', 'alignLeft', 'alignCenter', 'alignRight', 'alignJustify', 'formatOLSimple', 'formatUL', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote'],
                    'buttonsVisible': 5
                },
                'moreText': {

                    'buttons': ['fontSize', 'bold', "|", 'backgroundColor', 'italic', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'textColor', 'inlineClass', 'inlineStyle', 'clearFormatting', 'underline'],
                    'buttonsVisible': 2
                },
                'moreRich': {
                    'buttons': ['insertLink', 'insertImage', 'insertVideo', 'emoticons', 'fontAwesome', 'insertTable', 'specialCharacters', 'embedly', 'insertFile', 'insertHR'],

                },

                'moreMisc': {
                    'buttons': ['undo', 'redo', 'fullscreen', 'print', 'getPDF', 'spellChecker', 'selectAll', 'html', 'help'],
                    'align': 'right',
                    'buttonsVisible': 2
                }
            },
            toolbarSticky: true,
            toolbarBottom: true,
            heightMin: 270,
            heightMax: 514,
            width: 390,
        });
        return () => {
            // editor = null;
        };
    }, []);

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
            children: <AreaInformationCollector planArea={zone.plan} setArea={handleSetAreaZone} setImagePlan={handleSetImageZone} type="section" />
        }
    })
    const onDestroyAccessory = (id) => {
        const newAccessories = accessories.filter(accessory => id !== accessory.id)
        setAccessories(newAccessories)
    }
    const verifyKey = (key) => {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        }
        axios.post(`${BASE_URL_API}market/verify-key`, { key }, config).then(res => {
            if (res.data.res_code == 200) {
                setKey(prev => ({ ...prev, isKeyVerify: true }))
                return;
            }
            setKey(prev => ({ ...prev, isKeyVerify: false }))
        }).catch(error => {
            console.error(error)
            message.error(error.response.data.message.message[0]);
            setKey(prev => ({ ...prev, isKeyVerify: false }))
        })
    }
    const formatPhoneNumber = (value) => {
        const maxLength = 10;
        const cleaned = value.replace(/\D/g, "").slice(0, maxLength);
        const formatted = cleaned.replace(/^(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3");
        return formatted;
    };
    const formatIdCardNumber = (value) => {
        const maxLength = 13;
        const cleaned = value.replace(/\D/g, "").slice(0, maxLength);
        const formatted = cleaned.replace(/^(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})$/, "$1-$2-$3-$4-$5");
        return formatted;
    };
    const convertToAxis = (arr) => {
        const newArr = arr.map((item, index) => {
            if (index % 2 === 0) {
                return { axis_x: item };
            } else {
                return { axis_y: item };
            }
        });
        const result = [];
        newArr.forEach((item, index) => {
            if (index % 2 === 0) {
                result.push(Object.assign({}, item, newArr[index + 1]));
            }
        });
        return result;
    }
    const sendForm = () => {
        const data = {
            key: key.key,
            name: marketName,
            image: imageProfile[0]?.response?.filename,
            time_open: time.open,
            time_close: time.close,
            lat: location.lat.toString(),
            lon: location.lon.toString(),
            detail: content,
            image_plan: plan.imagePlan[0]?.response?.filename,
            service_price: servicePrice,
            mobile_number: promptpay.number_phone,
            id_card_number: promptpay.id_card_number,
            daysname: selectDays,
            galleries: galleries.map(gallery => gallery.response?.filename),
            categories: options.map(option => ({
                id: option.id || "",
                name: option.value
            })),
            zones: plan.areaPlan.map(zone => {
                return {
                    name: zone.title,
                    color: zone.preFillColor,
                    image_plan: zone.plan.imagePlan[0]?.response?.filename,
                    shape: zone.shape,
                    categories: zone.categories.map(category => ({
                        id: category.id || "",
                        name: category.value
                    })),
                    points: convertToAxis(zone.coords),
                    sections_zone: zone.plan.areaPlan.map(section => {
                        return {
                            name: section.title,
                            price: section.price,
                            status: 1,
                            shape: section.shape,
                            image: section.file[0]?.response?.filename,
                            points: convertToAxis(section.coords)
                        }
                    })
                }
            }),
            accessories: accessories.map(accessory => (
                {
                    name: accessory.name,
                    price: parseFloat(accessory.price),
                    image: accessory.file[0]?.response?.filename,
                }
            ))
        }
        onSubmit(data);
    }
    return (
        <>
            <div className=" position-sticky top-0 bg-white" style={{ zIndex: 999 }}>
                <Container className='py-3 boder border-bottom'>
                    <Row className=' align-items-center'>
                        <Col xs='8'>
                            <h3 className='mb-0'>{initialData?.id ? 'แก้ไข' : 'เพิ่มตลาด'}</h3>
                        </Col>
                        <Col xs='4'>
                            <div className="">
                                <div className="text-end">
                                    <Button onClick={sendForm}>ยืนยันการสร้างตลาด</Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Container className='py-3'>
                <Row className='mt-4'>
                    <Col xs='8'>
                        <Stack direction='vertical' gap={4}>
                            <Row className='mb-3 align-items-center'>
                                <Col xs='auto'><h4>ระบุชื่อตลาด</h4></Col>
                                <Col><Form.Control onChange={(e) => setMarketName(e.target.value)} value={marketName} placeholder='ชื่อตลาด' /></Col>
                            </Row>
                            <div style={{ height: 300 }} className='mb-3 position-relative'>
                                <LongdoMap id="longdo-map" mapKey={mapKey} callback={initMap} />
                                <div className="position-absolute top-0 w-100 start-50 translate-middle-x p-4" style={{ zIndex: 10 }}>
                                    <ul className="list-group mt-2 list-style-none shadow-sm">
                                        <Input value={keywordLocation} onKeyUp={onPressEnter} onChange={onChangeSearch} size="large" className='list-group-item d-inline-flex' placeholder="สถานที่ใกล้เคียง หรือ จังหวัด หรือ อำเภอ" allowClear prefix={<Icon icon="akar-icons:location" className='text-secondary fs-3' />} />
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
                        <Card className='bg-light border-0'>
                            <Card.Body>
                                <Tabs defaultActiveKey="1" items={[
                                    {
                                        label: "ภาพตลาด",
                                        key: 1,
                                        children: <Upload beforeUpload={beforeUpload} fileList={imageProfile} action={`${BASE_URL_API}upload/file`} accept="image/*" onChange={async ({ file, fileList }) => {
                                            if (file.status === "uploading") {
                                                file.status = 'done'
                                                file.percent = 100
                                            }
                                            if (file.status === 'done') {
                                                setImageProfile(fileList)
                                            }
                                            if (file.status === "removed") {
                                                setImageProfile(prevImageProfile => prevImageProfile.filter(image => image.uid !== file.uid))
                                            }
                                        }} multiple={false} listType="picture-card">
                                            {imageProfile.length >= 1 ? null : uploadButton}
                                        </Upload>
                                    },
                                    {
                                        label: "อัลบั้ม",
                                        key: 2,
                                        children: <Upload beforeUpload={beforeUpload} fileList={galleries} action={`${BASE_URL_API}upload/file`} accept="image/*" onChange={async ({ file, fileList }) => {
                                            if (file.status === "uploading") {
                                                file.status = 'done'
                                                file.percent = 100
                                            }
                                            if (file.status === 'done') {
                                                setGalleries(fileList)
                                            }
                                            if (file.status === "removed") {
                                                setGalleries(prevGalleries => prevGalleries.filter(gallery => gallery.uid !== file.uid))
                                            }
                                        }} multiple={false} listType="picture-card">
                                            {galleries.length < 10 && uploadButton}
                                        </Upload>
                                    }
                                ]} />
                            </Card.Body>
                        </Card>
                        <Card className='bg-light border-0 mt-3'>
                            <Card.Body>
                                <h4>เวลา เปิด-ปิด</h4>
                                <TimePicker.RangePicker format={"HH:mm"} onChange={([start, end]) => setTime({ open: dayjs(start).format("HH:mm:ss"), close: dayjs(end).format("HH:mm:ss") })} />
                            </Card.Body>
                        </Card>
                        <Card className='bg-light border-0 mt-3'>
                            <Card.Body>
                                <h4>ค่าบริการไฟฟ้า</h4>
                                <Stack direction='horizontal'>
                                    <InputNumber onChange={(val) => { setServicePrice(val) }} className='w-100' placeholder='ราคาค่าไฟฟ้า' /><span className='px-3'>บาท</span>
                                </Stack>
                            </Card.Body>
                        </Card>
                        <Card className='bg-light border-0 mt-3'>
                            <Card.Body>
                                <h4>รหัสตลาด</h4>
                                <Stack direction='horizontal' gap={2}>
                                    <Input status={key.isKeyVerify ? null : 'error'} onChange={(e) => { setKey(prev => ({ isKeyVerify: false, key: e.target.value })) }} className='w-100' placeholder='กรอกรหัสที่มีความเฉพาะสำหรับตลาด' value={key.key} />
                                    <Button disabled={key.key === ''} style={{ flexShrink: 0 }} onClick={() => verifyKey(key.key)}>ตรวจสอบ</Button>
                                </Stack>
                            </Card.Body>
                        </Card>
                        <Card className='bg-light border-0 mt-3'>
                            <Card.Body>
                                <div className="mb-3">
                                    <h4>เบอร์ที่ผูกกับพร้อมเพย์</h4>
                                    <Stack direction='horizontal' gap={2}>
                                        <Input type='tel' onChange={(e) => setPromptpay(prev => ({ ...prev, number_phone: formatPhoneNumber(e.target.value) }))} className='w-100' placeholder='กรอกรหัสที่มีความเฉพาะสำหรับตลาด' value={promptpay.number_phone} />
                                    </Stack>
                                </div>
                                <>
                                    <h4>รหัสบัตรประชาชนที่ผูกกับพร้อมเพย์</h4>
                                    <Stack direction='horizontal' gap={2}>
                                        <Input type='tel' onChange={(e) => setPromptpay(prev => ({ ...prev, id_card_number: formatIdCardNumber(e.target.value) }))} className='w-100' placeholder='กรอกรหัสที่มีความเฉพาะสำหรับตลาด' value={promptpay.id_card_number} />
                                    </Stack>
                                </>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <hr className='mb-5' />
                <AreaInformationCollector planArea={plan} setArea={handleSetAreaPlan} setImagePlan={handleSetImagePlan} options={options} type="zone" />
                <Tabs defaultActiveKey="1" onChange={(key) => { zoneId.current = key }} items={tabsZoneItems} destroyInactiveTabPane />
                <Row>
                    <Col>
                        <Row className='gy-2 mb-3'>
                            <Col xs='12' md='6' style={{ height: 270 }}>
                                <Stack direction='vertical' className='justify-content-center h-100'>
                                    <Button className='mb-3' onClick={() => showModal()}>เพิ่มอุปกรณ์</Button>
                                    <p className='text-center text-custom-secondary'>เพิ่มอุปกรณ์เสริมที่ตลาดมีให้กับพ่อค้าแม่ค้า</p>
                                </Stack>
                                <Modal title={isModalEdit ? 'แก้ไขอุปกรณ์' : 'เพิ่มอุปกรณ์'} open={isModalOpen} onOk={isModalEdit ? handleEditOk : handleOk} onCancel={handleCancel}>

                                    <Row>
                                        <Col xs='auto'>
                                            <Upload action={`${BASE_URL_API}upload/file`} beforeUpload={beforeUpload} accept="image/*" fileList={item.file} onChange={onChangeImageItems} multiple={false} listType="picture-card">
                                                {item.file?.length > 0 ? null : uploadButton}
                                            </Upload>
                                        </Col>
                                        <Col>
                                            <Stack gap={2}>
                                                <Input placeholder='หลอดไฟ,โต๊ะ,...' onInput={(e) => setItem(prev => ({ ...prev, name: e.target.value }))} value={item.name} />
                                                <InputNumber
                                                    className='w-100'
                                                    placeholder="1.00"
                                                    prefix="฿"
                                                    onInput={val => setItem(prev => ({ ...prev, price: val }))}
                                                    value={item.price}
                                                />
                                            </Stack>
                                        </Col>
                                    </Row>
                                </Modal>
                            </Col>
                            {
                                accessories.length > 0 ? accessories.map(accessory => (
                                    <Col xs='12' md='6' key={accessory.id}>
                                        <Card >
                                            <div className='position-relative' style={{ height: 180 }}>
                                                <Card.Img variant="top" src={`${BASE_URL_API}upload/market/${accessory.file[0]?.response?.filename}`} style={styles.imageSlid} className='border border-primary' />
                                                <div className="position-absolute top-0 end-0 p-2">
                                                    <Button variant='danger' onClick={() => onDestroyAccessory(accessory.id)}><Icon icon='fluent:delete-24-regular' /></Button>
                                                </div>
                                            </div>
                                            <Card.Body>
                                                <Stack direction='horizontal' className='justify-content-between'>
                                                    <Card.Title>{accessory.name}</Card.Title>
                                                    <Button variant='' onClick={() => showModal('edit', accessory)}><Icon icon='akar-icons:edit' className='fs-4' /></Button>
                                                </Stack>
                                                <Card.Text>
                                                    ราคา {accessory.price} บาท
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                )) : null
                            }
                        </Row>
                    </Col>
                    <Col xs='auto'>
                        <h4>ออกแบบ Profile ตลาด</h4>
                        <div style={{ width: '100%', maxWidth: 390 }}>
                            <Swiper
                                className="mySwiper"
                                modules={[Pagination, Autoplay]}
                                pagination={{
                                    type: "fraction",
                                    horizontalClass: "text-end p-3 text-white fw-bold shadow"
                                }}
                                autoplay={{
                                    delay: 5000,
                                }}
                            >
                                <SwiperSlide style={styles.slideContainer}>
                                    {imageProfile.length > 0 ? <img style={styles.imageSlid} src={`${BASE_URL_API}upload/market/${imageProfile[0]?.response?.filename}`} alt="" /> : <img style={styles.imageSlid} src={fallbackImage} alt="" />}
                                </SwiperSlide>
                                {galleries?.length > 0 ?
                                    galleries?.map((gallery) => (
                                        <SwiperSlide style={styles.slideContainer} key={gallery.uid}>
                                            <img style={styles.imageSlid} src={`${BASE_URL_API}upload/market/${gallery?.response?.filename}`} alt="" />
                                        </SwiperSlide>
                                    ))
                                    : null}
                            </Swiper>
                        </div>
                        <textarea id='editor'></textarea>
                    </Col>
                </Row >
            </Container >
        </>
    )
}

CreateAndUpdateComponent.propTypes = {
}

export default CreateAndUpdateComponent