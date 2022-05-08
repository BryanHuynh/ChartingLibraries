

export const Rulertool = (x:number, y:number) => {
    return(
        <svg style={{position: 'absolute', zIndex: 1, width: '50px', height: '50px', left: x, top: y}}>
            <circle cx={5} cy={5} r="5" fill="red"
                onMouseOver={(e:any)=>{
                    console.log(e.clientX, e.clientY);
                }}
            />
        </svg>
    )
}
