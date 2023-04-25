import React from 'react'
import CreateUpdateComponent from '../../../components/CreateAndUpdate/CreateUpdateComponent'
import AdminLayout from '../../../Layouts/AdminLayout'
// import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { token } from '../../../services/AuthServices'
import { message } from 'antd'
import { BASE_URL_API } from '../../../services/services'

const Create = () => {
    const onCreate = (data) => {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        }
        console.log(data);
        axios.post(`${BASE_URL_API}market/create`, data, config).then(res => {
            if (res.data.res_code == 200) {
                message.success("บันทึกสำเร็จ")
                setInterval(() => {
                    navigate('/system/')
                }, 1500)
            }
        }).catch(error => {
            message.error(error.response.data.message?.message[0] || "เกิดปัญหา")
            console.error(error.response.data.message);
        })
    }
    return (
        <AdminLayout isAdmin>
            <CreateUpdateComponent onSubmit={onCreate} />
        </AdminLayout>
    )
}


export default Create