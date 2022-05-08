import { DotsItem, Point } from "@nivo/core";
import { CustomCanvasLayerProps } from "@nivo/line";
import { BasicTooltip, useTooltip } from "@nivo/tooltip";
import * as shape from 'd3-shape'
import React from "react";


export const RulerTool = (rulerPoints: Point[], {ctx, xScale, yScale, points, innerHeight, innerWidth}: CustomCanvasLayerProps) => {
    // const { showTooltipFromEvent, hideTooltip } = useTooltip()

    if(rulerPoints.length === 0) {
        return null;
    };

    for (let i = 0; i < rulerPoints.length; i++) {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = 'rgb(0, 0, 0, 1)';
        ctx.lineWidth = 1
        ctx.fillStyle = 'rgb(0, 0, 0, 1)';
        ctx.arc((rulerPoints[i].x), (rulerPoints[i].y), 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
        
    }
    

    if(rulerPoints.length == 2) {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = 'rgb(0, 0, 0, 1)';
        ctx.lineWidth = 1
        ctx.moveTo(rulerPoints[0].x, rulerPoints[0].y);
        ctx.lineTo(rulerPoints[1].x, rulerPoints[1].y);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = 'rgb(0, 0, 0, 1)';
        ctx.lineWidth = 1
        ctx.fillStyle = 'rgb(0, 0, 0, 0.5)';
        ctx.moveTo(rulerPoints[0].x, rulerPoints[0].y);
        ctx.lineTo(rulerPoints[1].x, rulerPoints[1].y);
        ctx.lineTo(rulerPoints[1].x, yScale(0));
        ctx.lineTo(rulerPoints[0].x, yScale(0));
        ctx.lineTo(rulerPoints[0].x, rulerPoints[0].y);
        ctx.fill();
        ctx.restore();
    };
    // return path;
}