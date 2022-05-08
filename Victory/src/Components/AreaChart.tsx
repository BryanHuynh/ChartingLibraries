import { size } from "lodash";
import React from "react";
import { render } from "react-dom";
import {
  VictoryAxis,
  VictoryVoronoiContainer,
  VictoryZoomContainer,
  VictoryScatter,
  VictoryPie,
  VictoryTooltip,
  VictoryChart,
  VictoryGroup,
  VictoryArea,
  VictoryBar,
  VictoryLine,
  VictoryBrushContainer,
  createContainer,
  VictoryPortal, 
  Selection,
  Point,
  Background,
} from "victory";
import { DomainTuple } from 'victory-core';
import { BasicTooltip, useTooltip } from "@nivo/tooltip";
import { ToolTip } from "./ToolTip";

const allData = (ratio: number, height: number, color: string): IData[] => {
  let data = [];
  for(let i = 0; i < 100; i+=0.001){
      data.push(
          {
              x: i,
              y: Math.sin(Math.PI*i/ratio) * i + height,
              y0: -100,
              color: color
          }
      )
  }
  return data;
}



interface IData {
  x: number;
  y: number;
  y0: number;
  color: string;
}

interface IDomain {
  x: DomainTuple;
  y: DomainTuple;
}



export const AreaChart = () => {

  const maxPoints = 200;
  const [lineData, setLineData] = React.useState([allData(40, 0, 'red'), allData(30,10, 'blue'), allData(50,20, 'green')]);

  const getEntireDomain = (): IDomain => {

      // const xMax = lineData.reduce((acc, d) => { return d.x > acc ? d.x : acc }, 0);
      // const xMin = lineData.reduce((acc, d) => { return d.x < acc ? d.x : acc }, Infinity);
      // const yMax = lineData.reduce((acc, d) => { return d.y > acc ? d.y : acc }, 0);
      // const yMin = lineData.reduce((acc, d) => { return d.y < acc ? d.y : acc }, Infinity);
    // loop through all line data and get the max and min
    const xMax = lineData.reduce((acc, d) => {
      return d.reduce((acc2, d2) => {
        return d2.x > acc2 ? d2.x : acc2;
      }, acc);
    }, 0);

    const xMin = lineData.reduce((acc, d) => {
      return d.reduce((acc2, d2) => {
        return d2.x < acc2 ? d2.x : acc2;
      }, acc);
    }, Infinity);

    const yMax = lineData.reduce((acc, d) => {
      return d.reduce((acc2, d2) => {
        return d2.y > acc2 ? d2.y : acc2;
      }, acc);
    }, 0);

    const yMin = lineData.reduce((acc, d) => {
      return d.reduce((acc2, d2) => {
        return d2.y < acc2 ? d2.y : acc2;
      }, acc);
    }, Infinity);

    return {
        x: [xMin, xMax],
        y: [yMin, yMax]
    }
  }
  const [entireDomain, setEntireDomain] = React.useState(getEntireDomain());
  const [zoomDomain, setZoomDomain] = React.useState<IDomain>(entireDomain);


  const filterData = (data: IData[], domain: IDomain) => {
    const filtered = data.filter(d => d.x > domain.x[0] && d.x < domain.x[1]);
    if(filtered.length > maxPoints){
        const k = Math.ceil(filtered.length / maxPoints);
        return filtered.filter((d, i) => i % k === 0);
    }
    return filtered;
  }

  const filterDataFull = (data: IData[]) => {
    if(data.length > maxPoints){
      const k = Math.ceil(data.length / maxPoints);
      return data.filter((d, i) => i % k === 0);
    }
    return data;
  }
  //const [filteredData, setFilteredData] = React.useState(filterData(lineData, zoomDomain));
  const [filteredData, setFilteredData] = React.useState(lineData.map(d => filterDataFull(d)));
  
  const [rulerPoints, setRulerPoints] = React.useState<{x: number, y:number, y0: number}[] | []>([]);

  const handleZoom = (domain: IDomain) => {
    setZoomDomain(domain);
    setFilteredData(lineData.map(d => filterData(d, domain)));
  };

  const VictoryZoomVoronoiContainer = createContainer("zoom", "voronoi");

  const [tooltipActive, setToolTipActive] = React.useState(false);
  const [tooltipData, setToolTipData] = React.useState<any | null>(null);
  const [tooltipLocation, setToolTipLocation] = React.useState<{x: number, y: number} | null >(null);
  const [toolTipType, setToolTipType] = React.useState<string>("");

  const handleToolTipEnter = (data: any, type: string , event: any) => {
    setToolTipData(data);
    setToolTipType(type);
    setToolTipLocation({x: event.clientX, y: event.clientY});
    setToolTipActive(true);
  }

  const handleToolTipExit = () => {
    setToolTipActive(false);
    setToolTipData(null);
    setToolTipLocation(null);
    setToolTipType("");
  }

  // const getBoreHoleElevation = (start: number) => {
  //   const data = lineData.filter(d => Math.round(d.x) == start);
  //   const max = data.reduce((acc, d) => { return d.y > acc ? d.y : acc }, 0);
  //   return max;
  // }



  return (
    <React.Fragment>
      <VictoryChart
        containerComponent={
          <VictoryZoomContainer
            zoomDimension="x"
            zoomDomain={zoomDomain}
            onZoomDomainChange={handleZoom}
          />
        }
        minDomain={{y: Number(entireDomain.y[0]) }}
      >

        {
          lineData.map((d, i) => {
            return (
              <VictoryArea
                key={i}
                name={`line${i}`}
                style={{
                  data: {
                    fill: d[0].color,
                    stroke: d[0].color,
                    strokeWidth: 3,
                    fillOpacity: 0.7
                  }
                }}
                data={filterDataFull(d)}
                interpolation="natural"
              />
            )
          })
        }
        {lineData.map((d, i) => {
          return (
            <VictoryScatter
              key={i}
              name={`lineScatter${i}`}
              data={filteredData[i]}
              size={3}
              style={{ 
                data: { fill: "red", opacity: 0.0} 
              }}
              labels={(d: any) => d.y}
              labelComponent={
                <VictoryTooltip
                  />
              }
              events={[
                {
                  target: "data",
                  eventHandlers: {
                    onMouseEnter(event: any, point) {
                      //handleToolTipEnter(point.datum, "line", event);
                      return [{
                        target: "data",
                        mutation: () => {
                          return {
                            style: {
                              fill: "red",
                              opacity: 0.9,
                            }
                          }
                        }
                      }]
                    },
                    onMouseLeave() {
                      //handleToolTipExit();
                      return [{
                        target: "data",
                        mutation: () => {
                          return {
                            style: {
                              fill: "red",
                              opacity: 0
                            }
                          }
                        }
                      }]
                    },
                    onClick(event, props: any) {
                      if(rulerPoints.length < 2){
                        setRulerPoints([...rulerPoints, {x: props.datum.x, y: props.datum.y, y0: Number(entireDomain.y[0])}]);
                      }else{
                        setRulerPoints([{x: props.datum.x, y: props.datum.y, y0: Number(entireDomain.y[0])}]);
                      }
                    }
                  }
                }
              ]}
            />
          )
        })}

        <VictoryGroup>
            <VictoryScatter
              data={rulerPoints}
              size={3}
              style={{
                data: { fill: "red", opacity: 1}
              }}
            />
        {rulerPoints.length === 2 ? (
            <VictoryArea
            style={{
              data: {
                fill: "green",
                fillOpacity: 0.4,
              }
            }}
            data={rulerPoints}
            events = {[{
              target: "data",
              eventHandlers: {
                onMouseMove: (event: any) => {
                  handleToolTipEnter(rulerPoints, "ruler", event);
              },
                onMouseOut: () => {
                  handleToolTipExit();
                }
              }
            }]}
          />
        ) : null}
        </VictoryGroup> 


        <VictoryBar
            name = "bar"
            data={[
                { x: 12, y: (12) , y0: -50, end: 13, fill:"blue" },
            ]}
            barWidth={(props: any) => {
                const { datum, x, scale } = props;
                const newWidth = scale.x(datum.end) - x;
                return newWidth
            }}
            alignment="start"
            style={{
                data: {
                    fill: ({datum}: any) => datum.fill
                },
                labels: { fontSize: 12 },
            }}
            labels = {({ datum }: any) => 'borehole'}
            labelComponent={<VictoryTooltip pointerLength={0} />}
            events = {[{
                target: "data",
                eventHandlers: {
                    onMouseOver: (event: any, point) => {
                      handleToolTipEnter(point.datum, "borehole", event);
                    },
                    onMouseMove: (event: any, point) => {
                      handleToolTipEnter(point.datum, "borehole", event);
                    },
                    onMouseOut: (event: any) => { 
                      handleToolTipExit();
                    }

                }
            }]}
        />


      </VictoryChart>

      {tooltipActive && tooltipLocation? (
          <div 
            style={{ 
              position: "absolute", 
              top: tooltipLocation.y - 50, 
              left: tooltipLocation.x + 50,
              backgroundColor: "white",
              border: "1px solid black",
              paddingLeft: "10px",
              paddingRight: "10px",
              paddingTop: "0px",
              paddingBottom: "0px",
              textAlign: "left",
              margin: "0px",
            }}
          
          >
            <ToolTip type={toolTipType} data={tooltipData} />
          </div>
      ) : null}



    </React.Fragment>


  );
};
