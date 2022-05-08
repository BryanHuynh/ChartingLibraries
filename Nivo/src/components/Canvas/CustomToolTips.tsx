import { Point } from "@nivo/line";
import { BasicTooltip } from "@nivo/tooltip"

export const rulerToolTooltip = ({rulerPoints}) => {
    if(rulerPoints.length < 2) {
        return null;
    }

    const horizontalLength = Math.abs(rulerPoints[1].x - rulerPoints[0].x);
    const verticalLength = Math.abs(rulerPoints[1].y - rulerPoints[0].y);
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

export const HoleBaseToolTip = ({holeBase}) => {
    if(holeBase === null) {
        return null;
    }

    return (
        <>
            <BasicTooltip id={'Hole Base'} value = {holeBase} enableChip />
        </>
    )
}