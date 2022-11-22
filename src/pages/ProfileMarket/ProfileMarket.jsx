import React from 'react'
import data from '../../DataMockup/Data'
import { useParams } from 'react-router-dom'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
function ProfileMarket() {
    const { id } = useParams();
    const navigate = useNavigate();
    const handleBack = () => {
        navigate(-1);
    }
    return (
        <div>
            {id}
            <div className="grid grid-cols-2 gap-3 p-3">
                <Button block className='span' onClick={handleBack}>ย้อนกลับ</Button>
                <Button type="primary" danger>
                    ดูผังตลาด
                </Button>
            </div>
        </div>
        // <div className='h-screen flex-col flex justify-between'>
        //     <div className="">
        //         <img className='h-52 w-full object-cover' src={`../`} alt="" />
        //         <div className="p-3">
        //             <h1 className='mb-3 text-2xl'>{data[id-1].name}</h1>
        //             <div className="flex mb-4">
        //                 <div className="flex-auto">
        //                     <p>passsadas</p>
        //                     <p>asas</p>
        //                 </div>
        //                 <div className="flex-none">
        //                     <p></p>
        //                     <p className=' font-bold'>saaas</p>
        //                 </div>
        //             </div>
        //             <div className="content">
        //                 <h1 className='mb-3 text-xl'>{data[id-1].name}</h1>
        //                 <p>detail</p>
        //             </div>

        //         </div>

        //     </div>
        //     <div className="grid grid-cols-2 gap-3 p-3">
        //             <Button block className='span' onClick={handleBack}>ย้อนกลับ</Button>
        //             <Button type="primary" danger>
        //                 ดูผังตลาด
        //             </Button>
        //     </div>

        // </div>
    )
}

export default ProfileMarket