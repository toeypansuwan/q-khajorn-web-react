import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Upload, Button as ButtonAntd, message } from 'antd'
import ImageMapSection from '../ImageMapSection/ImageMapSection'
import { Col, Row } from 'react-bootstrap'
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import AreaCreate from '../AreaCreate/AreaCreate'
import { BASE_URL_API, beforeUpload } from '../../services/services'
import axios from 'axios'
const { Dragger } = Upload;

const AreaInformationCollector = ({ planArea, setArea, options, setImagePlan, type }) => {
    const image = useMemo(() => {
        return `${BASE_URL_API}upload/market/${planArea?.imagePlan[0]?.response?.filename}`
    }, [planArea?.imagePlan[0]?.response?.filename])
    return (
        <>
            <Row className='my-3'>
                <Col xs='8'>
                    <h4>{type === "section" ? "แผง" : "โซน"}</h4>
                </Col>
                <Col xs='4'>
                    <h4>{type === "section" ? "เลือกพื้นที่ แผง" : "เลือกพื้นที่ โซน"}</h4>
                </Col>
            </Row >
            <Row>
                <Col xs='8'>
                    <div>
                        {planArea?.imagePlan[0]?.response?.filename ? (
                            <>
                                <div className="mb-3 border">
                                    <ImageMapSection type={type} plan={image} mapArea={planArea.areaPlan} className="h-70" />
                                </div>
                                <Upload action={`${BASE_URL_API}upload/file`} beforeUpload={beforeUpload} showUploadList={false} onChange={async ({ file }) => {
                                    if (file.status === 'done') {
                                        setImagePlan([file])
                                    }
                                    if (file.status === 'removed') {
                                        // axios.delete(`${BASE_URL_API}upload/file/${file.response?.filename}`).then(
                                        //     message.success("ลบสำเร็จ")
                                        // ).catch((error) => {
                                        //     console.error(error)
                                        // })
                                    }
                                }} multiple={false} >
                                    <ButtonAntd icon={<UploadOutlined />}>อัพโหลดใหม่</ButtonAntd>
                                </Upload>
                            </>
                        ) : <Dragger accept="image/*" action={`${BASE_URL_API}upload/file`} showUploadList={false} onChange={async ({ file }) => {
                            if (file.status === 'done') {
                                setImagePlan([file])
                            }
                            if (file.status === 'removed') {
                                // axios.delete(`${BASE_URL_API}upload/file/${file.response?.filename}`).then(
                                //     message.success("ลบสำเร็จ")
                                // ).catch((error) => {
                                //     console.error(error)
                                // })
                            }
                        }} multiple={false} >
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
                    <div style={{ maxHeight: 800 }} className="overflow-scroll">
                        <AreaCreate areas={planArea?.areaPlan} setArea={setArea} categories={options} type={type} />
                    </div>
                </Col>
            </Row >
            <hr className='mb-5' />
        </>
    )
}

AreaInformationCollector.propTypes = {}

export default AreaInformationCollector