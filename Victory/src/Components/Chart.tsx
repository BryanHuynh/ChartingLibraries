import * as V from 'victory';
import * as VC from 'victory-canvas'
import { useState, useEffect } from 'react';
import { DomainTuple } from 'victory-core';
import React from 'react';
import { ContainerType, createContainer } from 'victory-create-container'




const allData = () => {
    let data = [];
    for(let i = 0; i < 10; i+=0.1){
        data.push(
            {
                x: i,
                y: Math.sin(Math.PI*i/40) * i 
            }
        )
    }
    console.log(data.length)
    return data;
}



export const Chart = () => {
    const [lineData, setLineData] = useState(allData());
    
    const maxPoints = 1000;

    
    const getEntireDomain = (): {x: DomainTuple, y:DomainTuple}=> {
        const xMax = lineData.reduce((acc, d) => { return d.x > acc ? d.x : acc }, 0);
        const xMin = lineData.reduce((acc, d) => { return d.x < acc ? d.x : acc }, Infinity);
        const yMax = lineData.reduce((acc, d) => { return d.y > acc ? d.y : acc }, 0);
        const yMin = lineData.reduce((acc, d) => { return d.y < acc ? d.y : acc }, Infinity);
        return {
            x: [xMin, xMax],
            y: [yMin, yMax]
        }
    }

    const filterData = () => {
        const filtered = lineData.filter(d => d.x > zoomedXDomain[0] && d.x < zoomedXDomain[1]);
        if(filtered.length > maxPoints){
            const k = Math.ceil(filtered.length / maxPoints);
            console.log('only showing ' + filtered.length + ' points')
            return filtered.filter((d, i) => i % k === 0);
        }
        console.log('only showing ' + filtered.length + ' points')
        return filtered;

    }
    
    let zoomedXDomain = getEntireDomain().x;

    const onDomainChange = (domain : {x: DomainTuple, y: DomainTuple}) => {
        zoomedXDomain =(domain.x);
    }

    const getBoreHoleElevation = (start: number) => {
        const data = lineData.filter(d => Math.round(d.x) == start);
        const max = data.reduce((acc, d) => { return d.y > acc ? d.y : acc }, 0);
        return max;
    }



    let currentPosition = {x:0, y:0} as any;
    // const [currentPosition, setCurrentPosition] = useState({x:0, y:0} as any);
    const Cursor = React.memo(function Cursor(props:any){
        const {scale} = props;
        return (
            <svg>
                <circle cx = {scale.x(currentPosition.x)} cy = {scale.y(currentPosition.y)} r={2}/>
            </svg>

        )
    })

    const [rulerPoints, setRulerPoints] = useState<{x: number, y: number}[]>([] as {x: number, y: number}[]);
    const [activatedPoints, setActivatedPoints] = useState<{x:number, y:number}[]>([]);
    // let activatedPoints:[] = [];

    // const CursorPoint = React.memo(function CursorPoint(props:any) : JSX.Element{
    //     console.log('cursorPoint: ', props);
    //     return (
    //         <V.VictoryScatter
    //             data={[{x: 50, y: 20}]}
            
    //         />
    //     )
    // })

    const onActivated = (point: any, props: any) => {
        console.log(point, props);
        setActivatedPoints(point);
        // activatedPoints = (point);
    }

    const VictoryZoomVoronoiContainer = V.createContainer('voronoi', 'zoom');
    return (
        <V.VictoryChart
            containerComponent={
                <VictoryZoomVoronoiContainer
                    // @ts-ignore
                    labels={({ datum }: any) => `${datum.x}, ${datum.y}`}
                    // labels = {({ datum }: any) => {
                    //     // if(datum.childName === "line"){
                    //     //     console.log('line')
                    //     // }
                    //     if(boreholeHovered){
                    //         return
                    //     }
                    //     return `${Math.floor(datum.x)}, ${Math.floor(datum.y)}`;
                    // }}
                    // @ts-ignore
                    onActivated = {onActivated}
                    // onZoomDomainChange={onDomainChange}
                    voronoiBlacklist={["cursor"]}
                />
            }

        >
        {/* <Cursor /> */}
        <V.VictoryLine
            name = "line"
            data={filterData()}
            interpolation="basis"
        />

         <V.VictoryBar
            name = "bar"
            data={[
                { x: 12, y: getBoreHoleElevation(12) , y0: -50, end: 13, fill:"blue" },
            ]}
            barWidth={(props: any) => {
                const { datum, x, scale } = props;
                const newWidth = scale.x(datum.end) - x;
                return newWidth
            }}
            alignment="start"
            style={{
                data: {
                    fill: ({datum}) => datum.fill
                },
                labels: { fontSize: 12 },
            }}
            labels = {({ datum }: any) => 'borehole'}
            labelComponent={<V.VictoryTooltip pointerLength={0} />}
            events = {[{
                target: "data",
                eventHandlers: {
                    onMouseOver: (event: any) => {
                        const {x, y} = V.Selection.getSVGEventCoordinates(event);
                        return {
                            target: 'labels',
                            mutation: () => ({
                                y,
                                x, 
                                active: true
                            })
                        }
                    },
                    onMouseMove: (event: any) => {
                        const {x, y} = V.Selection.getSVGEventCoordinates(event);
                        return {
                            target: 'labels',
                            mutation: () => ({
                                y, 
                                x,
                                active: true
                            })
                        }
                    },
                    onMouseOut: (event: any) => {
                        return {
                            target: 'labels',
                            mutation: () => ({
                                active: false
                            })
                        }
                    }

                }
            }]}
        />
         
        {activatedPoints.length ? (
            <V.VictoryScatter
                name = 'cursor'
                data= {activatedPoints}
                x = "x"
                y = "y"
            />
        ) : null}

        <V.VictoryAxis dependentAxis/>
        <V.VictoryAxis 
            offsetY={50}
        />
        </V.VictoryChart>

    )
}