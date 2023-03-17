import React from 'react'
import PropTypes from 'prop-types'
import { Upload, Button as ButtonAntd } from 'antd'
import ImageMapSection from '../ImageMapSection/ImageMapSection'
import { Col, Row } from 'react-bootstrap'
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import AreaCreate from '../AreaCreate/AreaCreate'
import { convertImageUrl, uploadImage } from '../../services/services'
const { Dragger } = Upload;

const AreaInformationCollector = ({ planArea, setArea, options, setImagePlan, type }) => {
    return (
        <>
            <Row className='my-3'>
                <Col xs='8'>
                    <h4>{type === "zone" ? "แผง" : "โซน"}</h4>
                </Col>
                <Col xs='4'>
                    <h4>{type === "zone" ? "เลือกพื้นที่ แผง" : "เลือกพื้นที่ โซน"}</h4>
                </Col>
            </Row >
            <Row>
                <Col xs='8'>
                    <div>
                        {planArea?.imagePlan.imageUrl ? (
                            <>
                                <div className="mb-3 border">
                                    <ImageMapSection type="section" plan={planArea?.imagePlan.imageUrl} mapArea={planArea.areaPlan} className="h-70" />
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
                    <div style={{ maxHeight: 800 }} className="overflow-scroll">
                        <AreaCreate areas={planArea?.areaPlan} setArea={setArea} categories={options} type={type} />
                    </div>
                </Col>
            </Row >
        </>
    )
}

AreaInformationCollector.propTypes = {}

export default AreaInformationCollector