import React from 'react';
import { CustomLayer, CustomLayerProps, Point} from "@nivo/line";
import { HoleBaseToolTip } from './CustomToolTips.tsx';
import { BasicTooltip, useTooltip } from "@nivo/tooltip";
import { IHoleBaseData } from "./IHoleBaseData";
import * as shape from 'd3-shape'


export const HoleBase = (holebaseData: IHoleBaseData[], {xScale, yScale, points}: CustomLayerProps) => {
    const { showTooltipFromEvent, hideTooltip } = useTooltip()

    const findElevation = (find: number, points: Point[]): number => {
        for(let i = 0; i < points.length; i++) {
            if(points[i].data.x >= find) {
                return Number(points[i].data.y);
            }
        }
        return -1;
    }

    // find all the points that have serieId === 'elevation'   
    let paths = [];
    for (let i = 0; i < holebaseData.length; i++) {
        const pointsToDraw = points.filter(point => point.serieId === holebaseData[i].serieId)
        const start =  holebaseData[i].start;
        const end = holebaseData[i].end;
        const startElevation = findElevation(start, pointsToDraw);
        const endElevation = findElevation(end, pointsToDraw);
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
            const _path = shape.line()
            .x(d => d.x)
            .y(d => d.y)
            .context(null)([
                { x: x1, y: y1 },
                { x: x2, y: y2 },
                { x: x2, y: y3 },
                { x: x1, y: y3 },
                { x: x1, y: y1 }
            ])
            let path = (<path 
                key={holebaseData[i].id + holebaseData[i].layers[k].name}
                d={_path}
                fill={holebaseData[i].layers[k].color}
                stroke="black"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="0"
                className='hole-base'
                onMouseMove={ (event) => {
                    console.log('mouse entered ', holebaseData[i].name, holebaseData[i].layers[k].color)
                    showTooltipFromEvent(
                        React.createElement(HoleBaseToolTip, {
                            holebase: holebaseData[i],
                            layer: holebaseData[i].layers[k],
                            elevation: startElevation,
                        }),
                        event
                    )
                }}
                onMouseLeave={() => {
                    hideTooltip()
                }}
                id={`{holebaseData[i].id + holebaseData[i].layers[k].name}`}
            />)
            paths.push(path)

        }
    };
    return paths;
}    