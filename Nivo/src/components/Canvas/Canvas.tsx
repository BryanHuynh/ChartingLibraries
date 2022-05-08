import { ResponsiveLineCanvas } from '@nivo/line'
import { DotsItem } from '@nivo/core'
import { generateData, holebaseData } from '../generateData'
import  * as shape from 'd3-shape'
import React, {useState, useEffect} from 'react'
import { RulerTool } from './RulerTool.tsx'
import { rulerToolTooltip, HoleBaseToolTip } from './CustomToolTips.tsx'
import { Mesh } from '@nivo/voronoi'
import Circle from 'd3-shape/src/symbol/circle'

export const Canvas = () => {
    const [rulerPoints, setRulerPoints] = useState([]);
    let currentPoint = null;
    const data = generateData()
    const [Graphics, setGraphics] = useState(null);

    // useEffect(() => {
    //     if(Graphics) {
    //         console.log('Graphics', Graphics)
    //     }
    // }, [Graphics])
    

    const commonProperties = {
            margin: { top: 20, right: 20, bottom: 60, left: 80 },
            data: data,
            pointSize: 8,
            pointColor: { theme: 'background' },
            pointBorderWidth: 2,
            pointBorderColor: { theme: 'background' },
    }

    const holeBase = ({points, xScale, yScale, ctx, innerWidth}) => {
        // find all the points that have serieId === 'elevation'   
        for (let i = 0; i < holebaseData.length; i++) {
            const pointsToDraw = points.filter(point => point.serieId === holebaseData[i].serieId)
            const start =  holebaseData[i].start;
            const end = holebaseData[i].end;
            // get the starting elevation
            const startElevation = pointsToDraw.find(point => parseFloat(point.data.x) === start).data.y
            // get the ending elevation
            const endElevation = pointsToDraw.find(point => parseFloat(point.data.x) === end).data.y
        
            let currentDepth = 0;
            for(let k = 0; k < holebaseData[i].layers.length; k++) {
                let x1 = xScale(start);
                let x2 = xScale(end);
                let y1 = yScale(startElevation - currentDepth);
                let y2 = yScale(endElevation - currentDepth);
                if(k > 0) {
                    y2 = yScale(startElevation - currentDepth);
                }
                let y3 = yScale(startElevation - currentDepth - holebaseData[i].layers[k].depth);
                currentDepth += holebaseData[i].layers[k].depth;
                ctx.fillStyle = holebaseData[i].layers[k].color;

                const layer = new Path2D();     // need this to seperate the layers
                ctx.save();
                layer.rect(x1, y1, x2 - x1, y3 - y1);
                ctx.fill(layer);
                ctx.restore();
            }
            ctx.save()
            ctx.setLineDash([5, 3]);
            ctx.strokeStyle = 'rgb(0, 0, 0, 1)';
            ctx.beginPath();
            ctx.lineWidth = 0.7
            ctx.moveTo((xScale(start) + xScale(end)) / 2, (yScale(startElevation) + yScale(endElevation)) / 2);
            ctx.lineTo((xScale(start) + xScale(end)) / 2, yScale(200));
            ctx.stroke();
            ctx.restore();
        };
        const svg = (
            <svg height="10" width="10" style={{
                position: 'absolute',
                zIndex: 1,
                left: xScale(0),
                top: yScale(10),
            }}>
                <circle cx="5" cy="5" r="5" fill="red" />
            </svg>
        )
        if(Graphics === null) {
            setGraphics(svg)
        }

    }

    const customToolTip = ({point}) => {
        currentPoint = point;
        if(rulerPoints.length === 2) {
            if(point.x > rulerPoints[0].x && point.x < rulerPoints[1].x && point.y >= Math.min(rulerPoints[0].y, rulerPoints[1].y)) {
                return (
                    rulerToolTooltip({rulerPoints})
                )
            }
        }

        const x = parseInt(point.data.x);
        const y = Math.ceil(point.data.y);
        for(let i = 0 ; i < holebaseData.length; i++) {
            if(x >= holebaseData[i].start && x <= holebaseData[i].end) {
                // console.log(x, y , holebaseData[i])
                return (
                    <h1>hole</h1>
                )
            }
        }

        return (
            <h1>point</h1>
        )

        
    }

    const drawCurrentPoint = ({ctx, xScale, yScale}) => {
        ctx.save();
        ctx.fillStyle = 'rgb(0, 0, 0, 1)';
        ctx.beginPath();
        ctx.arc(currentPoint.x, currentPoint.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();


    }



    return(
        <div style={{ width: "100%", height: "90%", position: "relative"}}>
        <ResponsiveLineCanvas
            {...commonProperties}
            enableArea={true}
            tooltip={ customToolTip }
            
            layers = {[
                //'grid',
                'markers',
                'axes',
                'areas',
                'crosshair',
                'lines',
                'slices',
                'points',
                //'mesh',
                'legends',
                holeBase,
                (props) => {
                    if(currentPoint) {
                        drawCurrentPoint(props);
                    }
                },
                (props) => {
                    return (
                        RulerTool(rulerPoints, props)
                    )
                },
                (layerData) => {
                    return (
                        <Mesh
                            nodes={layerData.points}
                            width={layerData.innerWidth}
                            height={layerData.innerHeight}
                            onClick={(e) => {
                                console.log(e)
                            }}
                        />
                    )
                }
                
            ]}
            // onClick={(point, event) => {
            //     if(rulerPoints.length < 2){
            //         setRulerPoints([...rulerPoints, point])
            //     } else {
            //         setRulerPoints([point])
            //     }
            // }}
        />
        {Graphics}
        </div>

    )
}