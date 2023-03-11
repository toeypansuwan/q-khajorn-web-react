import { Icon } from '@iconify/react';
import React, { useState, useRef, useEffect, useMemo } from 'react'
// import { ImageMap } from "@qiuz/react-image-map";
import ImageMapper from 'react-img-mapper';
import { v4 } from 'uuid';
import './ImageMapSection.css'
import moment from 'moment/moment';
import { useSelector } from 'react-redux';
import { useGesture } from 'react-use-gesture';
import { Badge } from 'react-bootstrap';

const getCenterPointAndSize = (shape, coords) => {
    if (shape === 'circle') {
        const [x, y, r] = coords;
        const diameter = r * 2;
        return { center: { x, y }, width: diameter, height: diameter };
    }
    if (shape === 'rect') {
        const [x1, y1, x2, y2] = coords;
        let width = x2 - x1;
        let height = y2 - y1;
        const x = (x1 + x2) / 2;
        const y = (y1 + y2) / 2;
        if (width < 0 && height < 0) {
            return { center: { x, y }, width: width * -1, height: height * -1 };
        }
        return { center: { x, y }, width, height };
    }
    if (shape === 'poly') {
        let x = 0;
        let y = 0;
        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;
        for (let i = 0; i < coords.length; i += 2) {
            const pointX = coords[i];
            const pointY = coords[i + 1];
            x += pointX;
            y += pointY;
            minX = Math.min(minX, pointX);
            maxX = Math.max(maxX, pointX);
            minY = Math.min(minY, pointY);
            maxY = Math.max(maxY, pointY);
        }
        const width = maxX - minX;
        const height = maxY - minY;
        x /= coords.length / 2;
        y /= coords.length / 2;
        return { center: { x, y }, width, height };
    }
};

function ImageMapSection(props) {
    const { reserveStore } = useSelector(state => ({ ...state }))
    const [zoom, setZoom] = useState(1);
    const [crop, setCrop] = useState({ x: 0, y: 0, scale: 1, });
    const [areasMap, setAreasMap] = useState([]);
    const componentRef = useRef();
    const [parent, setParent] = useState({});
    const [imgSize, setImgSize] = useState({ width: 1, height: 1 });
    const SCALE_FACTOR = 0.02;
    const URL = useMemo(() => {
        return props.plan
    }, [props.plan])
    const getParentCenter = (x, y) => {
        const px = (x / imgSize.width) * zoom || 0
        const py = (y / imgSize.height) * (imgSize.height / imgSize.width * zoom) || 0
        return { x: px, y: py }
    }
    useEffect(() => {
        setAreasMap(props.mapArea);
    }, [props.mapArea])
    useEffect(() => {
        setWidthImage();
    }, [props.plan])
    const ref = useRef(null)
    const setWidthImage = () => {
        console.log(ref)
        const img = new Image();
        img.src = props.plan;
        img.onload = (e) => {
            let aspectRatio, w, h;
            if (e.target.width > e.target.height || e.target.width == e.target.height) {
                aspectRatio = e.target.height / e.target.width;
                w = ref.current.offsetHeight / aspectRatio;
                h = aspectRatio * w;
            } else {
                aspectRatio = e.target.height / e.target.width;
                h = ref.current.offsetWidth * aspectRatio;
                w = h / aspectRatio;
            }
            setZoom(w);
            setParent({ width: w, height: h })
            setImgSize({ width: e.target.width, height: e.target.height })
        }
    }
    useGesture({
        onDrag: ({ offset: [dx, dy], distance, previous }) => {
            setCrop(crop => ({ ...crop, x: dx, y: dy }))
        },
        onPinch: ({ offset: [d], previous }) => {
            const scaleDelta = d / 100 * SCALE_FACTOR;
            const newScale = crop.scale + scaleDelta;
            if (newScale > 0.5 && newScale < 3) {
                setCrop(crop => ({ ...crop, scale: newScale }))
            }

        },
    }, {
        domTarget: componentRef,
        eventOptions: { passive: false },
        drag: {
            bounds: {
                left: -parent.width * crop.scale + 100,
                right: ref.current?.offsetWidth - 100,
                top: -parent.height * crop.scale + 100,
                bottom: ref.current?.offsetHeight - 100,
            },
            rubberband: true
        },
    })
    return (
        <div className={`overflow-hidden w-100 position-relative ${props.className}`} ref={ref}>
            <div
                ref={componentRef}
                style={{
                    left: crop.x,
                    top: crop.y,
                    height: parent.height,
                    width: parent.width,
                    touchAction: 'none',
                    transform: `scale(${crop.scale})`
                }}
                className={`position-relative`} >
                <ImageMapper
                    src={
                        URL
                        // `https://raw.githubusercontent.com/img-mapper/react-docs/master/src/assets/example.jpg`
                    }
                    map={
                        {
                            name: 'my-map',
                            areas: areasMap ? areasMap : []
                        }
                    }
                    // width={parent.width}
                    // height={parent.height}
                    responsive={true}
                    zoom={true}
                    parentWidth={zoom}
                    onClick={props.onClick}
                    onLoad={props.onLoad}
                />
                {areasMap?.map(area => {
                    const shapeDetail = getCenterPointAndSize(area.shape, area.coords);
                    const centerParent = getParentCenter(shapeDetail.center.x, shapeDetail.center.y);
                    const isRotate = shapeDetail.height - shapeDetail.height * 20 / 100 > shapeDetail.width;
                    return (
                        <span
                            className='d-inline-block fw-bolder h5'
                            key={v4()}
                            style={{
                                position: 'absolute',
                                left: centerParent.x,
                                top: centerParent.y,
                                transform: `translate(-50%, -50%) scale(${1 / crop.scale}) ${isRotate ? `rotate(90deg)` : ''}`,
                                zIndex: 999,
                                pointerEvents: 'none',
                            }}
                        >
                            {reserveStore.data.some(i =>
                                i.id === area.id && i.days.some(d => d === moment(area.day).format("YYYY-MM-DD"))
                            ) && props.type === 'section' ? (<Icon icon='material-symbols:check-circle' className='text-success fs-1' />) : <Badge bg='light' text='dark'>{(props.type == "zone" ? `โซน ${area.title}` : area.title)}</Badge>}
                        </span>
                    );
                })}
            </div>
        </div>
    )
}

export default ImageMapSection;