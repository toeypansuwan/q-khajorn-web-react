import { ConfigProvider } from 'antd';
import React from 'react'

const CustomConfigProvider = ({ children, type }) => {
    ConfigProvider.config({
        theme: {
            primaryColor: type == 'secondary' ? '#E17D7D' : '#23235D',
        },
    })
    return (
        <ConfigProvider>{children}</ConfigProvider>
    )
}

export default CustomConfigProvider