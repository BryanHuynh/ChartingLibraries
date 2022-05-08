import { Point, ResponsiveLine } from '@nivo/line'
import { DotsItem } from '@nivo/core'
import React, { useState, useEffect } from 'react';
import * as shape from 'd3-shape'
import { HoleBase } from './HoleBase.tsx';
import { RulerTool } from './RulerTool.tsx';
import { BasicPointToolTip } from './CustomToolTips.tsx';
import { generateData } from './generateData';


const holebaseData = [
    {
        id: 1,
        serieId: 'elevation',
        name: 'borehole 1',
        layers : [
            {
                name: 'layer 1',
                color: 'green',
                depth: 10,
            },
            {
                name: 'layer 2',
                color: 'brown',
                depth: 20,
            },
            {
                name: 'layer 3',
                color: 'red',
                depth: 20,
            }
        ],
        start: 50,
        end: 52,
        total_depth: 75,
    },
    {
        id: 2,
        serieId: 'elevation',
        name: 'borehole 2',
        layers : [
            {
                name: 'layer 1',
                color: 'green',
                depth: 10,
            },
            {
                name: 'layer 2',
                color: 'brown',
                depth: 40,
            },
            {
                name: 'layer 3',
                color: 'red',
                depth: 20,
            }
        ],
        start: 20,
        end: 22,
        total_depth: 75,
    }
]

export const Graph = () => {
    const [rulerPoints, setRulerPoints] = useState<Point[]>([]);
    const [rulerToolTip, setRulerToolTip] = useState(false)
    const [lineData, setLineData] = useState(generateData());
    //const [currentPoint, setCurrentPoint] = useState(null);
    const [selectionPoint, setSelectionPoint] = useState<Point[]>([]);
    const maxPoints = 2000;
    let currentPoint = null;


    const getRange = (data) => {
        let maxX = 0;
        let minX = 0;
        let maxY = 0;
        let minY = 0;
        data.forEach(serie => {
            serie.data.forEach(point => {
                if (point.x > maxX) {
                    maxX = point.x;
                }
                if (point.x < minX) {
                    minX = point.x;
                }
                if (point.y > maxY) {
                    maxY = point.y;
                }
                if (point.y < minY) {
                    minY = point.y;
                }
            })
        })
        return {x: [minX, maxX], y: [minY, maxY]};
    }
    const [domain, setDomain] = useState(getRange(lineData));
    const [entireDomain, setEntireDomain] = useState(getRange(lineData));

    const filterData = (data, domain) => {
        let filteredData = [];
        for (let i = 0; i < data.length; i++) {
            let filteredLayer = data[i].data.filter(d => d.x >= domain.x[0] && d.x <= domain.x[1] + 1);
            if (filteredLayer.length > maxPoints ) {
                const k = Math.ceil(filteredLayer.length / maxPoints);
                filteredLayer = filteredLayer.filter((d, i) => ((i % k) === 0));
            }
            filteredData.push({...data[i], data: filteredLayer}); 
        }
        setFilteredData(filteredData);
        // return filteredData
    }

    
    const filterDataFull = (data) => {
        let filteredData = [];
        for (let i = 0; i < data.length; i++) {
            let filteredLayer = data[i].data.filter(d => d.x >= entireDomain.x[0] && d.x <= entireDomain.x[1] + 1);
            if (filteredLayer.length > maxPoints ) {
                const k = Math.ceil(filteredLayer.length / maxPoints);
                filteredLayer = filteredLayer.filter((d, i) => ((i % k) === 0));
            }
            filteredData.push({...data[i], data: filteredLayer}); 
        }
        return filteredData
    }
    const [filteredData, setFilteredData] = useState<any>();

    useEffect(() => {
        filterData(lineData, domain);
    }, [domain]);
    const [descaledData, setDescaledData] = useState<any>();
  
 
    // const cursorPoint = ({xScale, yScale}) => {
    //     if(currentPoint !== null) {
    //         let dot = (
    //             <DotsItem
    //                 datum={currentPoint}
    //                 key={'cursor-point'}
    //                 x={(currentPoint.x)}
    //                 y={(currentPoint.y)}
    //                 size={5}
    //                 color="black"
    //                 borderColor='red'
    //                 labelYOffset={0}
    //                 borderWidth={1}
    //             />
    //         )
    //         return dot;
    //     }
    //     return null;
    // }


    const commonProperties = {
        margin: { top: 20, right: 20, bottom: 60, left: 80 },
        enableSlices: false,
        yScale: {
            type: 'linear',
            
        },
    }

    const areaSelection = (points, props) => {
        const { xScale, yScale } = props;
        const area = shape.line()
            .x(d => d.x)
            .y(d => d.y)
            .context(null)([
                {x: xScale(points[0].data.x), y: yScale(domain.y[1])},
                {x: xScale(points[1].data.x), y: yScale(domain.y[1])},
                {x: xScale(points[1].data.x), y: yScale(domain.y[0])},
                {x: xScale(points[0].data.x), y: yScale(domain.y[0])},
                {x: xScale(points[0].data.x), y: yScale(domain.y[1])},
            ])

            let areaPath = (<path
                key={'selection-area'}
                d={area}
                fill="green"
                stroke="black"
                opacity="0.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="0"
                id={'selection-area'}
            />)     
            return areaPath;
    }

    const handleSelection = (point) => {
        setDomain( (prev) => ({...prev, x: [selectionPoint[0].data.x, point.data.x]}))
        filterData(lineData, {x: [selectionPoint[0].data.x, point.data.x]});
    }

    return ( 
        <div style={{ height: 350 }}>
        <ResponsiveLine
            {...commonProperties}
            xScale= {{
                type: 'linear',
                min: domain.x[0],
            }}
            data={filteredData}
            enableArea={true}
            enablePoints = {false}
            animate={false}
            isInteractive={true}
            useMesh={true}
            axisBottom={{
                legend: 'Distance along Profile (m)',
                legendPosition: 'middle',
                legendOffset: 50,
            }}
            axisLeft={{
                legend: 'Elevation (m)',
                legendPosition: 'middle',
                legendOffset: -50,
            }}
            tooltip={({ point }) => {
                return (
                    <BasicPointToolTip point={point}/>
                )
            }}
            layers={[
                'grid',
                'markers',
                'axes',
                'areas',
                'lines',
                'points', 
                'slices',
                'legends',
                'mesh',
                (props) => {
                    return (
                        HoleBase(holebaseData, props)
                    )
                },
                (props) => {
                    return (
                        RulerTool(rulerPoints, props)
                    )
                },

            ]}
            onClick={(point, event) => {
                if(rulerPoints.length < 2){
                    setRulerPoints([...rulerPoints, point])
                } else {
                    setRulerPoints([point])
                }
            }}
            onMouseMove={(point, event) => {
                currentPoint = point
            }}
            lineWidth={0.5}
            enableGridX={false}
            enableGridY={false}
            curve={'basis'}
            fill={[{ match: '*', id: 'gradientA' }]}
        />

        <ResponsiveLine
            {...commonProperties}
            xScale= {{
                type: 'linear',
            }}
            height={200}
            layers={[
                'grid',
                'areas',
                (props) => {
                    if(selectionPoint.length === 2) {
                        return (
                            areaSelection(selectionPoint, props)
                        )
                    }
                },
                (props) => {
                    return (
                        HoleBase(holebaseData, props)
                    )
                },
                'lines',
                'axes',
                'legends',
                'mesh',
            ]}
            data={filterDataFull(lineData)}
            enableArea={true}
            //enablePoints = {false}
            animate={false}
            isInteractive={true}
            useMesh={true}
            onClick={(point, event) => {
                if(selectionPoint.length === 0){
                    setSelectionPoint([point])
                    setDomain(entireDomain)
                } else if ( selectionPoint.length === 2) {
                    setSelectionPoint([])
                    setDomain(entireDomain)
                }else {
                    setSelectionPoint([...selectionPoint, point])
                    handleSelection(point)
                }
            }}
        />
        </div>
    );


}
