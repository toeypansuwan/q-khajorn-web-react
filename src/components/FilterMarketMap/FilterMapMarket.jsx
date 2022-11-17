import React, { useState } from 'react';
import { Radio, Slider, InputNumber } from 'antd';
import { Row, Col } from 'react-bootstrap';

function FilterMapMarket() {

    const [inputMinValue, setInputMinValue] = useState(1);
    const [inputMaxValue, setInputMaxValue] = useState(20);
    const [inputKgValue, setInputKgValue] = useState(1);

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
        console.log(`radio checked:${select}`);
    };
    const onChangeKg = (kg) => {
        setInputKgValue(kg);
    };

    return (
        <div>
            <div className="mb-3">
                <h6>สถานะ</h6>
                <Radio.Group onChange={onChangeRadio} defaultValue="a">
                    <Radio.Button value="a">ทั้งหมด</Radio.Button>
                    <Radio.Button value="b">มีที่ว่าง</Radio.Button>
                    <Radio.Button value="c">ไม่มีที่ว่าง</Radio.Button>
                </Radio.Group>
            </div>
            <div className="mb-3">
                <h6>สถานะ</h6>
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
                <h6>สถานะ</h6>
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

        </div>
    )
}

export default FilterMapMarket