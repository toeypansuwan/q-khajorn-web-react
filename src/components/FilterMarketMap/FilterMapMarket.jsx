import React, { useState } from 'react';
import { Radio, Slider, InputNumber, Drawer, Space, Button } from 'antd';
import { Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addFilter } from '../../reducers/filterMarketSlice';
import axios from 'axios';
import { useEffect } from 'react';
import CustomConfigProvider from '../../Config/CustomConfigProvider';

function FilterMapMarket(props) {
    const { filterMarketStore } = useSelector((state) => ({ ...state }));
    const [defaultPrice, setDefaultPrice] = useState({});
    const [inputMinValue, setInputMinValue] = useState(0);
    const [inputMaxValue, setInputMaxValue] = useState(0);
    const [inputKgValue, setInputKgValue] = useState(30);
    const [load, setLoad] = useState(false);
    const [selectValue, setSelectValue] = useState("");
    const dispatch = useDispatch();

    const BASE_URL_API = import.meta.env.VITE_BASE_URL_API;

    const style = {
        topBorderSiteMenu: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            overflow: 'hidden'
        }
    }

    useEffect(() => {
        getMinMax();
        setInputKgValue(filterMarketStore.data.distance || 30);
        setSelectValue(filterMarketStore.data.state || "");
    }, []);

    const getMinMax = () => {
        axios.get(`${BASE_URL_API}market/min-max/price?lat=${filterMarketStore.data.lat}&lon=${filterMarketStore.data.lon}`).then(res => {
            setDefaultPrice(res.data);
            dispatch(addFilter({ max_price: res.data.max, min_price: res.data.min }))
            setInputMinValue(filterMarketStore.data.min_price || res.data.min);
            setInputMaxValue(filterMarketStore.data.max_price || res.data.max);
            setLoad(true);
        }).catch(console.error)
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
        <CustomConfigProvider type='secondary'>
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

                {!load ? <div></div> : (
                    <div className="">
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
                            <Slider onChange={onChangeLength} range defaultValue={[inputMinValue, inputMaxValue]} min={defaultPrice.min} max={defaultPrice.max} />
                            <Row className="justify-content-between">
                                <Col xs={'auto'} md={3}>
                                    <InputNumber
                                        min={defaultPrice.min}
                                        max={defaultPrice.max}
                                        value={inputMinValue}
                                        onChange={onChangeMin}
                                    />
                                </Col>
                                <Col xs={'auto'} md={3}>
                                    <InputNumber
                                        min={defaultPrice.min}
                                        max={defaultPrice.max}
                                        value={inputMaxValue}
                                        onChange={onChangeMax}
                                    />
                                </Col>
                            </Row>
                        </div>
                        <div className="mb-3">
                            <h6>ระยะทาง</h6>
                            <p className='text-muted'>ระยะทางสูงสุด 100 กิโลเมตร</p>
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
                    </div>
                )}
            </Drawer>
        </CustomConfigProvider>
    )
}

export default FilterMapMarket;