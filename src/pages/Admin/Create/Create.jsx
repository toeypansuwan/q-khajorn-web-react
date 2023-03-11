import React from 'react'
import CreateUpdateComponent from '../../../components/CreateAndUpdate/CreateUpdateComponent'
import AdminLayout from '../../../Layouts/AdminLayout'

const Create = () => {
    return (
        <AdminLayout isAdmin>
            <CreateUpdateComponent />
        </AdminLayout>
    )
}


export default Create