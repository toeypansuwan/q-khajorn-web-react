import React from 'react'
import { ImageMap } from "@qiuz/react-image-map";
import { AreaType } from "./AreaType";

function ImageMap() {
    const onMapClick = (area, index) => {
        const tip = `click map${area.href || index + 1}`;
        console.log(tip);
        alert(tip);
    };
    const mapArea = [
        {
            left: "0%",
            top: "6%",
            height: "12%",
            width: "33%",
            style: { background: "rgba(255, 0, 0, 0.5)" },
            onMouseOver: () => console.log("map onMouseOver")
        },
        {
            width: "33%",
            height: "12%",
            left: "0%",
            top: "36.37931034482759%",
            style: { background: "rgba(255, 0, 0, 0.5)" },
            onMouseOver: () => console.log("map onMouseOver")
        }
    ];
    const img =
        "https://n.sinaimg.cn/sinacn20118/408/w690h518/20190701/a126-hzfeken6884504.jpg";

    const ImageMapComponent = React.useMemo(
        () => (
            <ImageMap
                className="usage-map"
                src={img}
                map={mapArea}
                onMapClick={onMapClick}
            />
        ),
        [img]
    );
    return (
        <div>{ImageMapComponent}</div>
    )
}

export default ImageMap