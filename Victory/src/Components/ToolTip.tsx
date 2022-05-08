
import React, {useState,useRef} from 'react';

interface Props {
  type: string
  data: any
}

export const ToolTip = (props: Props) => {
  if (props.type == 'line') {
    return (
      <div>
        <p>{Math.round(props.data.y)}m along profile</p>
        <p>y: {Math.round(props.data.y)}</p>
      </div>
    );
  }
  if (props.type == 'ruler') {
    const horizontalDistance = props.data[0].x - props.data[1].x;
    const verticalDistance = props.data[0].y - props.data[1].y;
    const distance = Math.sqrt(horizontalDistance * horizontalDistance + verticalDistance * verticalDistance);
    return (
      <div>
        <p>Distance: {Math.round(distance)}</p>
        <p>horizontalDistance: {Math.round(horizontalDistance)}</p>
        <p>verticalDistance: {Math.round(verticalDistance)}</p>
      </div>
    );
  }
  if (props.type == 'borehole') {
    return (
      <div>
        <p>Borehole</p>
      </div>
    )
  }
  return (<></>)

}