import { DotsItem, Point } from "@nivo/core";
import { CustomLayerProps } from "@nivo/line";
import { BasicTooltip, useTooltip } from "@nivo/tooltip";
import * as shape from 'd3-shape'
import React from "react";
import { rulerToolTooltip } from "./CustomToolTips.tsx";
import { Mesh } from "@nivo/voronoi";


export const RulerTool = (rulerPoints: Point[], {xScale, yScale, points, innerHeight, innerWidth}: CustomLayerProps) => {
    const { showTooltipFromEvent, hideTooltip } = useTooltip()

    if(rulerPoints.length === 0) {
        return null;
    };
    let path = [];
    for(let i = 0; i < rulerPoints.length; i++) {
        const point = rulerPoints[i];
        let dot = (
            <DotsItem
                key={point.x + '-' + point.y}
                datum={point}
                x={(point.x)}
                y={(point.y)}
                size={5}
                color="black"
                labelYOffset={0}
                borderColor="black"
                borderWidth={1}
            />
        )
        path.push(dot);
    }

    if(rulerPoints.length == 2) {
        const ruler = shape.line()
            .x(d => d.x)
            .y(d => d.y)
            .context(null)([
                {x: rulerPoints[0].x, y: rulerPoints[0].y},
                {x: rulerPoints[1].x, y: rulerPoints[1].y}
            ])
        let line = (<path 
            key={'ruler'}
            d={ruler} 
            fill={'green'}
            stroke="black"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="0"
        />)
        path.push(line);
        let text = (
            <text
                key={'ruler-text'}
                x={(rulerPoints[0].x + rulerPoints[1].x) / 2}
                y={(rulerPoints[0].y + rulerPoints[1].y) / 2 - 5}
                textAnchor="middle"
                fontSize="10"
                fill="black"
            >
                {Math.abs(Math.round(rulerPoints[1].x - rulerPoints[0].x))}m
            </text>
        )
        path.push(text);
        // fill the area under the line
        const area = shape.line()
            .x(d => d.x)
            .y(d => d.y)
            .context(null)([
                {x: rulerPoints[0].x, y: rulerPoints[0].y},
                {x: rulerPoints[1].x, y: rulerPoints[1].y},
                {x: rulerPoints[1].x, y: yScale(0)},
                {x: rulerPoints[0].x, y: yScale(0)},
                {x: rulerPoints[0].x, y: rulerPoints[0].y}
            ])
        
        let areaPath = (<path
            key={'ruler-area'}
            d={area}
            fill="green"
            stroke="black"
            opacity="0.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="0"
            id={'ruler-area'}
            onMouseMove={(event) => {
                showTooltipFromEvent(
                    React.createElement(rulerToolTooltip, {
                        rulerPoints,
                    }),
                    event,
                    'right',
                )
            }}
            onMouseLeave={() => {
                hideTooltip()
            }}
        />)         
        path.push(areaPath);
    };
    return path;
}