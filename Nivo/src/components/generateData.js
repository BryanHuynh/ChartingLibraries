
export const generateData = () => {
    const generateYAxis = (max, min, size) => {
        let yAxis = []
        for (let i = 0; i < size; i++) {
            yAxis.push({
                x: i.toString(),
                y: (Math.sin(i / 40) * (max - min) + min)
            })
        }
        return yAxis
    }

    const size = 100
    const data = 
    [
        {
            id: 'elevation',
            // generate 20 x, y pairs with random values for y ranging from 15-20
            data: [
                ...generateYAxis(100, 95, size),
            ],

        },
        {
            id: 'elevation 2',
            // generate 20 x, y pairs with random values for y ranging from 15-20
            data: [
                ...generateYAxis(50, 60, size),
            ],

        },
        {
            id: 'elevation 3',
            // generate 20 x, y pairs with random values for y ranging from 15-20
            data: [
                ...generateYAxis(20, 30, size),
            ],

        },
    ]
    return data;
}

export const holebaseData = [
    {
      id: 1,
      serieId: 'elevation',
      name: 'borehole 1',
      layers: [
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
        },
      ],
      start: 50,
      end: 51,
    },
    {
      id: 2,
      serieId: 'elevation',
      name: 'borehole 2',
      layers: [
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
        },
      ],
      start: 20,
      end: 21,
    },
  ];
  