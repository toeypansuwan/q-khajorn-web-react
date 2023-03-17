import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { hasValidCoordinatePairs } from '../../services/services'
import { Button, Collapse, Input, Radio, Select, InputNumber } from 'antd';
import { v4 as uuidv4 } from 'uuid'
import { Icon } from '@iconify/react';
import { Stack, Form } from 'react-bootstrap'

const AreaCreate = ({ areas, setArea, categories, type }) => {
    const convertStrToCoords = (id, e) => {
        const coords = e.target.value.split(',').map(str => parseInt(str.trim()));
        onUpdateArea(id, { target: { value: coords, name: e.target.name } });
    }
    const clearCoords = (id) => {
        onUpdateArea(id, { target: { value: [], name: 'coords' } });
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
        if (type !== "zone") {
            data.categories = []
            data.plan = {
                imagePlan: {},
                areaPlan: []
            }
        }
        if (type === "zone") {
            data.price = 0
            data.status = true
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
    const onChange = (value) => {
        console.log('changed', value);
    };
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
                            <Radio.Group name='shape' className='mb-2' value={area.shape} onChange={(e) => { clearCoords(area.id); onUpdateArea(area.id, e) }}>
                                <Radio.Button value="rect">rect</Radio.Button>
                                <Radio.Button value="poly">poly</Radio.Button>
                                <Radio.Button value="circle">circle</Radio.Button>
                            </Radio.Group>
                            <div className="mb-3">
                                {area.shape == 'rect' ? (<Input size="large" placeholder="x1,y1,x2,y2" name='coords' onChange={(e) => { convertStrToCoords(area.id, e) }} status={hasValidCoordinatePairs(area.shape, area.coords) ? '' : 'error'} prefix={<Icon icon='ci:square' />} />)
                                    : area.shape == 'poly' ? (<Stack direction='horizontal'><div className="p-2"><Icon icon='ci:triangle' className='fs-4' /></div><Input.TextArea size="large" name='coords' placeholder="x1,y1,x2,y2,x3,y3,..." autoSize onChange={(e) => { convertStrToCoords(area.id, e) }} status={hasValidCoordinatePairs(area.shape, area.coords) ? '' : 'error'} /></Stack>)
                                        : area.shape == 'circle' ? (<Input size="large" placeholder="x,y,radius" name='coords' onChange={(e) => { convertStrToCoords(area.id, e) }} status={hasValidCoordinatePairs(area.shape, area.coords) ? '' : 'error'} prefix={<Icon icon='ci:circle' />} />)
                                            : null}
                            </div>

                            {
                                categories?.length > 0 ?
                                    <>
                                        <h5>ประเภท</h5>
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
                                type === "zone" ?
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        defaultValue={area.price}
                                        min={0}
                                        formatter={(value) => `฿ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        // parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                        onChange={value => onUpdateArea(area.id, { target: { value, name: 'price' } })}
                                    /> : null
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