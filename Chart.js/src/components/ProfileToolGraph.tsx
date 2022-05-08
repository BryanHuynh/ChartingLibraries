import { Graph } from './Graph';
import { Rulertool } from './Rulertool';
import { useState } from 'react';

export const ProfileToolGraph = () => {
    const [rulerPoints, setRulerPoints] = useState([0,0]);


    const onClickCallback=(e: any)=>{
        console.log('ProfileTool', e);
        setRulerPoints([e.clientX, e.clientY]);
    }

    return(
        <>
            <Graph onClickCallback={onClickCallback}/>
            {
                Rulertool(rulerPoints[0],rulerPoints[1])
            }
        </>

    )
}