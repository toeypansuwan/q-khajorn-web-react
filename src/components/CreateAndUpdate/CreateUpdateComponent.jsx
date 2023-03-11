import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Container, Row, Col, Stack, Form, Button, ToggleButton, Card } from 'react-bootstrap'
import { LongdoMap, longdo, map } from '../LongdoMap/LongdoMap';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { message, Upload, Button as ButtonAntd, Select, Tabs } from 'antd';
import { v4 as uuidv4 } from 'uuid'
import { uploadButton } from '../services/services';
import ImageMapSection from '../ImageMapSection/ImageMapSection';
const { Dragger } = Upload;
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
    // map.Search.language('th');
    // map.Event.bind('drag', dragMap);
    // map.Event.bind('drop', dropMap);
    // map.Event.bind('click', clickMap);
    // map.zoom(zoomMap)
    // map.location(longdo.LocationMode.Geolocation)
}
const CreateAndUpdateComponent = ({ initialData, onCreate, onUpdate }) => {
    const mapKey = import.meta.env.VITE_LONGDOMAP_API_KEY;
    const [imagePlan, setImagePlan] = useState({});
    const [imageProfile, setImageProfile] = useState({});
    const [galleries, setGalleries] = useState([]);
    const [options, setOption] = useState([]);
    const [mapAreaPlan, setMapAreaPlan] = useState([]);
    const [mapAreaZone, setMapAreaZone] = useState([]);

    const uploadImage = async ({ onSuccess }) => {
        onSuccess("ok")
    };
    const convertImageUrl = async (file, setState, fileList = []) => {
        if (file instanceof FileList) {
            // handle multiple files
            const filesArray = Array.from(file);
            const results = await Promise.all(
                filesArray.map(async (file) => {
                    const reader = new FileReader();
                    return new Promise((resolve, reject) => {
                        reader.onerror = () => {
                            reader.abort();
                            reject(new DOMException("Problem parsing input file."));
                        };

                        reader.onload = (event) => {
                            const dataURL = event.target.result;
                            resolve({ file: file.originFileObj, imageUrl: dataURL, fileList });
                        };

                        reader.readAsDataURL(file.originFileObj);
                    });
                })
            );
            setState(results);
        } else {
            // handle single file
            const reader = new FileReader();
            reader.onerror = () => {
                console.error(new Error("Problem parsing input file."));
            };
            reader.onload = (event) => {
                const dataURL = event.target.result;
                setState({ file: file.originFileObj, imageUrl: dataURL, fileList });
            };
            reader.readAsDataURL(file.originFileObj);
        }
    }
    return (
        <Container className='py-3'>
            <Row className='mt-5'>
                <Col xs='8'>
                    <Stack direction='vertical' gap={3}>
                        <Row className='mb-3 align-items-center'>
                            <Col xs='auto'><h4>{initialData?.id ? 'แก้ไข' : 'เพิ่มตลาด'}</h4></Col>
                            <Col><Form.Control placeholder='ชื่อตลาด' /></Col>
                        </Row>
                        <div style={{ height: 300 }} className='mb-3'>
                            <LongdoMap id="longdo-map" mapKey={mapKey} callback={initMap} />
                        </div>
                        <div>
                            <h4>วันเปิดตลาด</h4>
                            <p>เลือกได้มากกว่า 1 วัน</p>
                            <Row className='mb-3'>
                                <Col xs='auto'>
                                    <ToggleButton
                                        id="toggle-check"
                                        type="checkbox"
                                        variant="outline-secondary"
                                        value="Sunday"
                                    >
                                        อาทิตย์
                                    </ToggleButton>
                                </Col>
                                <Col xs='auto'>
                                    <ToggleButton
                                        id="toggle-check"
                                        type="checkbox"
                                        variant="outline-secondary"
                                        value="Monday"
                                    >
                                        จันทร์
                                    </ToggleButton>
                                </Col>
                                <Col xs='auto'>
                                    <ToggleButton
                                        id="toggle-check"
                                        type="checkbox"
                                        variant="outline-secondary"
                                        value="Tuesday"
                                    >
                                        อังคาร
                                    </ToggleButton>
                                </Col>
                                <Col xs='auto'>
                                    <ToggleButton
                                        id="toggle-check"
                                        type="checkbox"
                                        variant="outline-secondary"
                                        value="Wednesday"
                                    >
                                        พุธ
                                    </ToggleButton>
                                </Col>
                                <Col xs='auto'>
                                    <ToggleButton
                                        id="toggle-check"
                                        type="checkbox"
                                        variant="outline-secondary"
                                        value="Thursday"
                                    >
                                        พฤหัสบดี
                                    </ToggleButton>
                                </Col>
                                <Col xs='auto'>
                                    <ToggleButton
                                        id="toggle-check"
                                        type="checkbox"
                                        variant="outline-secondary"
                                        value="Friday"
                                    >
                                        ศุกร์
                                    </ToggleButton>
                                </Col>
                                <Col xs='auto'>
                                    <ToggleButton
                                        id="toggle-check"
                                        type="checkbox"
                                        variant="outline-secondary"
                                        value="Saturday"
                                    >
                                        เสาร์
                                    </ToggleButton>
                                </Col>
                            </Row>
                        </div>

                    </Stack>
                    <h4>เพิ่มประเภทสินค้า</h4>
                    <Stack direction='horizontal' gap={3} className='mb-3'>
                        <Select
                            mode="tags"
                            style={{
                                width: '100%',
                            }}
                            onChange={(value) => { setOption(value.map((i) => ({ id: uuidv4(), label: i, value: i }))) }}
                            tokenSeparators={[',']}
                            options={options}
                        />
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
            <Row>
                <Col xs='8'>
                    <hr className='mb-5' />
                    <h4>ผังตลาด</h4>
                    <div>
                        {imagePlan.imageUrl ? (
                            <>
                                <div className="mb-3">
                                    <ImageMapSection type="section" plan={imagePlan.imageUrl} className="h-70" />
                                </div>
                                <Upload accept="image/*" onChange={async ({ file }) => {
                                    convertImageUrl(file, setImagePlan)
                                }} showUploadList={false} customRequest={uploadImage} multiple={false}>
                                    <ButtonAntd icon={<UploadOutlined />}>อัพโหลดใหม่</ButtonAntd>
                                </Upload>
                            </>
                        ) : <Dragger accept="image/*" showUploadList={false} onChange={async ({ file }) => {
                            convertImageUrl(file, setImagePlan)
                        }} customRequest={uploadImage} multiple={false} >
                            <>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                <p className="ant-upload-hint">
                                    Support for a single upload. Strictly prohibit from uploading company data or other
                                    band files
                                </p>
                            </>
                        </Dragger>}
                    </div>
                </Col>
                <Col xs='4'>

                </Col>
            </Row>
        </Container>
    )
}

CreateAndUpdateComponent.propTypes = {
}

export default CreateAndUpdateComponent