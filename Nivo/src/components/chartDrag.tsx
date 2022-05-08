import { Point, ResponsiveLine } from '@nivo/line'
import { DotsItem } from '@nivo/core'
import React, { useState } from 'react';
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
    const [lineData, setLineData] = useState(generateData());
    //const [currentPoint, setCurrentPoint] = useState(null);
    const maxPoints = 2000;
    
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

    const filterData = (originalData, domain) => {
        console.log('domain:', domain)
        let filteredData = JSON.parse(JSON.stringify(originalData))
        filteredData.forEach(d => {
            d.data = d.data.filter(d => d.x >= domain.x[0] && d.x <= domain.x[1] + 1)
            if (d.data.length > maxPoints ) {
                const k = Math.ceil(d.data.length / maxPoints);
                d.data = d.data.filter((d, i) => ((i % k) === 0));
              }
        })
        return filteredData
    }
    const [filteredData, setFilteredData] = useState(filterData(lineData, domain));
  



    const commonProperties = {
        margin: { top: 20, right: 20, bottom: 60, left: 80 },
        enableSlices: false,
        yScale: {
            type: 'linear',
            
        },
    }
    
    return ( 
        <div style={{ height: 350 }}>
        <ResponsiveLine
            {...commonProperties}
            xScale= {{
                type: 'linear',
                min: domain.x[0],
            }}
            data={filterData(lineData, domain)}
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
        </div>
    );


}
