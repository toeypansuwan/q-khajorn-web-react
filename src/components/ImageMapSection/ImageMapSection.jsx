import axios from 'axios';
import React, { useState } from 'react'
import { useRef } from 'react';
import { useEffect } from 'react';
// import { ImageMap } from "@qiuz/react-image-map";
import ImageMapper from 'react-img-mapper';
import './ImageMapSection.css'

function ImageMapSection(props) {
    const [zoom, setZoom] = useState(640);
    const [areasMap, setAreasMap] = useState([]);
    const boxImage = useRef();
    const [parentWidth, setParentWidth] = useState(0);
    useEffect(() => {
        setAreasMap(props.mapArea);
    }, [props.mapArea])
    useEffect(() => {
        setWidthImage();
    }, [props.plan])
    const setWidthImage = () => {
        const img = new Image();
        img.src = props.plan;
        img.onload = (e) => {
            const aspectRatio = e.target.height / e.target.width;
            const x = boxImage.current.offsetHeight / aspectRatio;
            setParentWidth(x)
        }
    }
    return (
        <div ref={boxImage} className='w-100 h-85vh overflow-scroll'>
            <ImageMapper
                src={
                    props.plan
                }
                map={
                    {
                        name: 'my-map',
                        // GET JSON FROM BELOW URL AS AN EXAMPLE
                        areas: areasMap
                    }
                } responsive={true}
                parentWidth={parentWidth}
                onClick={props.onClick}
            />
        </div>
    )
}

export default ImageMapSection