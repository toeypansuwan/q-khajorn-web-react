import { ConfigProvider } from 'antd';

const CustomConfigProvider = ({ children, customConfig }) => {
    <ConfigProvider {...customConfig}>
        {children}
    </ConfigProvider>
}

const primary = {
    theme: {
        primaryColor: '#23235D',
    },
}
const secondary = {
    theme: {
        primaryColor: '#E17D7D',
    },
}

export {
    CustomConfigProvider,
    primary,
    secondary
}