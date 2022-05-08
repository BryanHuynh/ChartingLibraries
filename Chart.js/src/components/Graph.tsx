import { Line } from "react-chartjs-2";

const generateData = (count: number) => {
    const labels = Array.from(Array(count), (_, i) => i);
    let data = [];
    for (let i = 0; i < count; i++) {
        data.push(Math.sin(i / 4) * i);
    }
    return {
        labels,
        data
    };
}

interface GraphProps {
    onClickCallback: (e: any) => void;
}

const generateImage = () => {
    const myImage= new Image(50,1000);
    myImage.src = "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png";
    return myImage;


}

export const Graph = ({onClickCallback}: GraphProps) => {
    const {labels, data}  = generateData(100);
    return(
        <Line 
            options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
            }}
            data=
            {{
                labels,
                datasets: [
                    {
                        label: "Line graph",
                        data,
                        fill: false,
                        borderColor: '#4bc0c0',
                        type: 'line'
                        
                    },
                    {
                        label: "Scatter graph",
                        data: [
                            {
                                x: 34,
                                y: 20,
                            }
                        ],
                        fill: false,
                        borderColor: '#4bc0c0',
                        type: 'scatter',
                        pointStyle: (e: any) => {
                            console.log(e)
                            const image = generateImage()
                            console.log(image);
                            return image;
                        },
                    }
                ]
            }}
        />
    );
}