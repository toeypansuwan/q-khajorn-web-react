import React from 'react'
import { Spin, Alert } from "antd";

function Loading() {
    const style = {
        screen_full: {
            width: '100vw',
            height: '100vh',
        }
    }
    return (
        <div style={style.screen_full} className="d-flex align-items-center justify-content-center flex-column">
            <Spin size="large" tip="Loading..." />

        </div>
    )
}

export default Loading