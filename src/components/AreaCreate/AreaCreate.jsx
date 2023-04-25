import React from 'react'
import { BASE_URL_API, beforeUpload, hasValidCoordinatePairs } from '../../services/services'
import { Button, Collapse, Input, Radio, Select, InputNumber, Upload } from 'antd';
import { v4 as uuidv4 } from 'uuid'
import { Icon } from '@iconify/react';
import { Stack, Form } from 'react-bootstrap'
import { uploadButton } from '../services/services';

const AreaCreate = ({ areas, setArea, categories, type }) => {
    const convertStrToCoords = (id, e) => {
        const coords = e.target.value.split(',').map(str => parseInt(str.trim()));
        if (!coords.some(i => isNaN(i))) {
            onUpdateArea(id, { target: { value: coords, name: e.target.name } });
        } else {
            onUpdateArea(id, { target: { value: [], name: e.target.name } });
        }
    }
    const handleChangeShape = (id, e) => {
        const newAreas = areas.map((area) => {
            if (area.id === id) {
                return { ...area, coords: [], [e.target.name]: e.target.value }
            }
            return area;
        })
        setArea(newAreas);
    }
    const insertArea = () => {
        const data = {
            id: uuidv4(),
            title: null,
            shape: "rect",
            preFillColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            strokeColor: "black",
            coords: [],
        }
        if (type === "zone") {
            data.categories = []
            data.plan = {
                imagePlan: {},
                areaPlan: []
            }
        }
        if (type === "section") {
            data.price = 0
            data.status = true
            data.file = []
        }
        const newArea = [
            ...areas,
            data
        ]
        setArea(newArea);
    }
    const onUpdateArea = (id, e) => {
        const newArea = areas.map(area => {
            if (area.id === id) {
                return { ...area, [e.target.name]: e.target.value }
            }
            return area
        })
        setArea(newArea);
    }
    const onDeleteArea = (id) => {
        const newArea = areas.filter((area) => area.id !== id)
        setArea(newArea);
    }

    return (
        <>
            <Collapse defaultActiveKey={['1']} className='mb-3' accordion>
                {areas?.map((area) => {
                    return (
                        <Collapse.Panel className={`align-content-center ${hasValidCoordinatePairs(area.shape, area.coords) ? '' : 'border-danger border border-1'}`} collapsible='header' key={area.id}
                            extra={
                                <Stack direction='horizontal' gap={3} >
                                    <Form.Control name='preFillColor' onChange={(e) => (onUpdateArea(area.id, e))} type='color' value={area.preFillColor} />
                                    <Button variant='' onClick={() => { onDeleteArea(area.id) }}><Icon icon='fluent:delete-24-regular' /></Button>
                                </Stack>
                            }
                            header={<Input name='title' onChange={(e) => (onUpdateArea(area.id, e))} placeholder="ชื่อโซน.." bordered={false} value={area.title} />}
                        >
                            <Radio.Group name='shape' className='mb-2' value={area.shape} onChange={(e) => { handleChangeShape(area.id, e) }}>
                                <Radio.Button value="rect">rect</Radio.Button>
                                <Radio.Button value="poly">poly</Radio.Button>
                                <Radio.Button value="circle">circle</Radio.Button>
                            </Radio.Group>
                            <div className="mb-3">
                                <label htmlFor={`${area.shape}-${area.id}`}>ตำแหน่ง</label>
                                {area.shape == 'rect' ? (<Input id={`rect-${area.id}`} size="large" placeholder="x1,y1,x2,y2" name='coords' onChange={(e) => { convertStrToCoords(area.id, e) }} status={hasValidCoordinatePairs(area.shape, area.coords) ? '' : 'error'} prefix={<Icon icon='ci:square' />} />)
                                    : area.shape == 'poly' ? (<Stack direction='horizontal'><div className="p-2"><Icon icon='ci:triangle' className='fs-4' /></div><Input.TextArea id={`poly-${area.id}`} size="large" name='coords' placeholder="x1,y1,x2,y2,x3,y3,..." autoSize onChange={(e) => { convertStrToCoords(area.id, e) }} status={hasValidCoordinatePairs(area.shape, area.coords) ? '' : 'error'} /></Stack>)
                                        : area.shape == 'circle' ? (<Input id={`circle-${area.id}`} size="large" placeholder="x,y,radius" name='coords' onChange={(e) => { convertStrToCoords(area.id, e) }} status={hasValidCoordinatePairs(area.shape, area.coords) ? '' : 'error'} prefix={<Icon icon='ci:circle' />} />)
                                            : null}
                            </div>

                            {
                                categories?.length > 0 ?
                                    <>
                                        <label htmlFor={`category${area.id}`}>ประเภท</label>
                                        <Select
                                            mode="multiple"
                                            allowClear
                                            style={{ width: '100%' }}
                                            value={area.categories}
                                            placeholder="Please select"
                                            onChange={(value, option) => onUpdateArea(area.id, { target: { value: option, name: 'categories' } })}
                                            options={categories}
                                        />
                                    </>
                                    : null
                            }
                            {
                                type === "section" ?
                                    <>
                                        <div className="mb-3">
                                            <label htmlFor={`price${area.id}`}>ราคา</label>
                                            <InputNumber
                                                id={`price${area.id}`}
                                                style={{ width: '100%' }}
                                                defaultValue={area.price}
                                                min={0}
                                                formatter={(value) => `฿ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                onChange={value => onUpdateArea(area.id, { target: { value, name: 'price' } })}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor={`${area.id}-upload`}>รูปแผง</label>
                                            <Upload
                                                id={`${area.id}-upload`}
                                                listType="picture-card"
                                                action={`${BASE_URL_API}upload/file`}
                                                accept="image/*"
                                                beforeUpload={beforeUpload}
                                                fileList={area.file}
                                                onChange={({ fileList, file }) => {
                                                    if (file.status === 'uploading') {
                                                        file.status = 'done'
                                                        file.percent = 100
                                                    }
                                                    if (file.status === 'done') {
                                                        onUpdateArea(area.id, { target: { value: fileList, name: 'file' } })
                                                    }
                                                    if (file.status === 'removed') {
                                                        onUpdateArea(area.id, { target: { value: [], name: 'file' } })
                                                    }
                                                }}
                                            >
                                                {area.file?.length < 1 && uploadButton}
                                            </Upload>
                                        </div>
                                    </> : null
                            }

                        </Collapse.Panel>)
                })}
            </Collapse>
            <Button variant='outline-secondary' onClick={insertArea}>{type === 'zone' ? "เพิ่มแผง" : "เพิ่มโซน"}</Button>
        </>
    )
}

AreaCreate.propTypes = {}

export default AreaCreate