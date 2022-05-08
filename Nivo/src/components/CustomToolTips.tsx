import { Point } from "@nivo/line";
import { BasicTooltip } from "@nivo/tooltip"
import { IHoleBaseData, ILayer } from "./IHoleBaseData"


export const rulerToolTooltip = ({rulerPoints}: {rulerPoints: Point[]}) => {
    if(rulerPoints.length < 2) {
        return null;
    }
    const {x, y} = rulerPoints[0].data
    const {x: x2, y: y2} = rulerPoints[1].data
    

    const horizontalLength = Math.abs(Number(x) - Number(x2));
    const verticalLength = Math.abs(Number(y) - Number(y2));
    const length = Math.sqrt(horizontalLength * horizontalLength + verticalLength * verticalLength);
    const slopeAngle = Math.atan2(verticalLength, horizontalLength) * 180 / Math.PI;

    return (
    <>
        <BasicTooltip id={'Horizontal Distance'} value = {horizontalLength} enableChip />
        <BasicTooltip id={'Vertical Distance'} value = {verticalLength} enableChip />
        <BasicTooltip id={'Length'} value = {length} enableChip />
        <BasicTooltip id={'slope angle'} value = {slopeAngle} enableChip />
    </>

    )
}

interface IHoleBaseToolTipProps { 
    holebase: IHoleBaseData;
    layer: ILayer;
    elevation: number;
}

export const HoleBaseToolTip = ({holebase, layer, elevation}: IHoleBaseToolTipProps) => {
    return (
        <>
            <BasicTooltip id={'Instrument Name'} value = {layer.name} enableChip/>
            <BasicTooltip id={'Elevation'} value = {Math.round(elevation)} enableChip/>
        </>   
    )
};

export const BasicPointToolTip = ({point}: {point: Point}) => {
    return (
        <>
            <BasicTooltip id={point.data.x + ' m along profile'} enableChip/>
            <BasicTooltip id={point.serieId} value={129.2 + 'm'} enableChip/>

        </>   
    )
};