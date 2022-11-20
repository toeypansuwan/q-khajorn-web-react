import React, { useState } from 'react';
import { Radio, Slider, InputNumber, Drawer, Space, Button } from 'antd';
import { Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addFilter } from '../../reducers/filterMarketSlice';

function FilterMapMarket(props) {
    const { filerMarketStore } = useSelector((state) => ({ ...state }));
    const [inputMinValue, setInputMinValue] = useState(filerMarketStore.data.min_price || 1);
    const [inputMaxValue, setInputMaxValue] = useState(filerMarketStore.data.max_price || 20);
    const [inputKgValue, setInputKgValue] = useState(filerMarketStore.data.distance || 30);
    const [selectValue, setSelectValue] = useState(filerMarketStore.data.status || "");
    const dispatch = useDispatch();

    const [height, setHeight] = useState(500);

    const style = {
        topBorderSiteMenu: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            overflow: 'hidden'
        }
    }
    const onChildrenDrawerClose = () => {
        props.onChildrenDrawerClose();
    };
    const confirmFilter = () => {
        //filter
        dispatch(addFilter({
            status: selectValue,
            distance: inputKgValue,
            min_price: inputMinValue,
            max_price: inputMaxValue,
        }))
        //filter end
        props.onChildrenDrawerClose();
    }

    const onChangeLength = (value) => {
        const min = value[0];
        const max = value[1];
        setInputMinValue(min);
        setInputMaxValue(max);
    };
    const onChangeMin = (min) => {
        setInputMinValue(min);
    };
    const onChangeMax = (max) => {
        setInputMaxValue(max);
    };
    const onChangeRadio = (select) => {
        setSelectValue(select.target.value);
    };
    const onChangeKg = (kg) => {
        setInputKgValue(kg);
    };

    return (
        <Drawer
            title="คัดกรองตลาด"
            placement="bottom"
            contentWrapperStyle={{ ...style.topBorderSiteMenu }}
            onClose={onChildrenDrawerClose}
            bodyStyle={{ paddingTop: 8 }}
            open={props.childrenDrawer}
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
            <div className="mb-3">
                <h6>สถานะ</h6>
                <Radio.Group onChange={onChangeRadio} defaultValue={selectValue}>
                    <Radio.Button value="">ทั้งหมด</Radio.Button>
                    <Radio.Button value="free">มีที่ว่าง</Radio.Button>
                    <Radio.Button value="full">ไม่มีที่ว่าง</Radio.Button>
                </Radio.Group>
            </div>
            <div className="mb-3">
                <h6>ค่าเช่าตลาด</h6>
                <Slider onChange={onChangeLength} range defaultValue={[inputMinValue, inputMaxValue]} min={1} max={200} />
                <Row className="justify-content-between">
                    <Col xs={'auto'} md={3}>
                        <InputNumber
                            min={1}
                            max={200}
                            value={inputMinValue}
                            onChange={onChangeMin}
                        />
                    </Col>
                    <Col xs={'auto'} md={3}>
                        <InputNumber
                            min={1}
                            max={200}
                            value={inputMaxValue}
                            onChange={onChangeMax}
                        />
                    </Col>
                </Row>
            </div>
            <div className="mb-3">
                <h6>ระยะทาง</h6>
                <p className='text-secondary'>ระยะทางสูงสุด 100 กิโลเมตร</p>
                <Row>
                    <Col>
                        <Slider
                            min={1}
                            max={100}
                            onChange={onChangeKg}
                            value={typeof inputKgValue === 'number' ? inputKgValue : 0}
                        />
                    </Col>
                    <Col xs={'auto'}>
                        <InputNumber
                            min={1}
                            max={100}
                            value={inputKgValue}
                            onChange={onChangeKg}
                        />
                    </Col>
                </Row>
            </div>
        </Drawer>
    )
}

export default FilterMapMarket;