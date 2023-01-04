import { Icon } from '@iconify/react';
import React, { useState, useRef, useEffect } from 'react'
// import { ImageMap } from "@qiuz/react-image-map";
import ImageMapper from 'react-img-mapper';
import { v4 } from 'uuid';
import './ImageMapSection.css'
import moment from 'moment/moment';
import { useSelector } from 'react-redux';
const getCenterPoint = (shape, coords) => {
    if (shape === 'circle') {
        const [x, y, r] = coords;
        return { x, y };
    }
    if (shape === 'rect') {
        const [x1, y1, x2, y2] = coords;
        const x = (x1 + x2) / 2;
        const y = (y1 + y2) / 2;
        return { x, y };
    }
    if (shape === 'poly') {
        let x = 0;
        let y = 0;
        for (let i = 0; i < coords.length; i += 2) {
            x += coords[i];
            y += coords[i + 1];
        }
        x /= coords.length / 2;
        y /= coords.length / 2;
        return { x, y };
    }
};
function ImageMapSection(props) {
    const { reserveStore } = useSelector(state => ({ ...state }))
    const [zoom, setZoom] = useState(1);
    const [areasMap, setAreasMap] = useState([]);
    const componentRef = useRef();
    const [parent, setParent] = useState({});
    const [imgSize, setImgSize] = useState({ width: 1, height: 1 });
    const getParentCenter = (x, y) => {
        const px = (x / imgSize.width) * zoom || 0
        const py = (y / imgSize.height) * (imgSize.height / imgSize.width * zoom) || 0
        return { x: px, y: py }
    }
    const handleWheel2 = (event, parent) => {
        if (event.deltaY > 0) {
            // Zoom out
            setZoom(prev => { if (prev <= parent.width) return parent.width; else return prev - 10 });
        } else {
            // Zoom in
            setZoom(prev => { if (prev >= parent.width * 2) return parent.width * 2; else return prev + 10 });
        }

    };
    useEffect(() => {
        setAreasMap(props.mapArea);
    }, [props.mapArea])
    useEffect(() => {
        setWidthImage();
    }, [props.plan])
    useEffect(() => {
        const handleWheel = (event) => {
            handleWheel2(event, parent)
        };
        if (componentRef.current) {
            componentRef.current.addEventListener('wheel', handleWheel, parent);
        }
        return () => {

            if (componentRef.current) {
                componentRef.current.removeEventListener('wheel', handleWheel);
            }
        };
    }, [zoom]);

    const setWidthImage = () => {
        const img = new Image();
        img.src = props.plan;
        img.onload = (e) => {
            const aspectRatio = e.target.height / e.target.width;
            const w = componentRef.current.offsetHeight / aspectRatio;
            const h = aspectRatio * w;
            setZoom(w);
            setParent({ width: w, height: h })
            setImgSize({ width: e.target.width, height: e.target.height })
        }
    }
    return (
        <div ref={componentRef} className={`w-100 overflow-scroll position-relative ${props.className}`} >
            <ImageMapper
                src={
                    props.plan
                }
                map={
                    {
                        name: 'my-map',
                        areas: areasMap
                    }
                }
                responsive={true}
                zoom={true}
                parentWidth={zoom}
                onClick={props.onClick}
                onLoad={props.onLoad}
            />
            {areasMap.map(area => {
                const center = getCenterPoint(area.shape, area.coords);
                const centerParent = getParentCenter(center.x, center.y);
                return (
                    <span
                        className='badge text-bg-light'
                        key={v4()}
                        style={{
                            position: 'absolute',
                            left: centerParent.x,
                            top: centerParent.y,
                            transform: 'translate(-50%, -50%)',
                            zIndex: 999,
                            pointerEvents: 'none'
                        }}
                    >
                        {reserveStore.data.some(i =>
                            i.id === area.id && i.days.some(d => d === moment(area.day).format("YYYY-MM-DD"))
                        ) ? (<Icon icon='akar-icons:circle-check' className='fs-5 text-success' />) : area.title}
                    </span>
                );
            })}
        </div>
    )
}

export default ImageMapSection