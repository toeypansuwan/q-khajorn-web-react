import React from 'react';
import './SiteFixBottom.css';
import 'antd/dist/antd.css';
import { Input } from 'antd';
import { Link } from 'react-router-dom';
const { Search } = Input;
function SiteFixBottom(props) {
    const onSearch = () => {

    }
    return (
        <div className='site__bg'>
            <Search placeholder="input search text" onSearch={onSearch} enterButton className='mb-3' />
            <div className="list flex flex-col gap-y-4 h-full overflow-scroll">
                {props.markets.map(market => {
                    return (
                        <Link to={`/profile-market/${market.id}`} key={market.name} className="rounded-lg flex border border-l-neutral-400 h-20 cursor-pointer">
                            <img className='flex-1 w-40 object-cover' src={`./${market.image}`} alt="" />
                            <div className="flex-1 w-60 p-3">
                                <p>{market.open}</p>
                                <p>{market.openCloseTime}</p>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default SiteFixBottom