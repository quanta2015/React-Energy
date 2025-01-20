export const OptGauge =(val, title)=>({
    chart: {
        type: 'solidgauge',
        backgroundColor: 'transparent',
    },
    title: null,
    pane: {
        center: ['50%', '75%'],
        size: '100%',
        startAngle: -90,
        endAngle: 90,
        background: {
            backgroundColor: 'transparent',
            borderRadius: 5,
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc'
        }
    },
    exporting: { enabled: false },
    tooltip: { enabled: false },
    yAxis: {
        min: 0,
        max: 10,
        title: {
            text: title, 
            y: -60, 
            style: {
                color: '#FFFFFF', 
                fontSize: '14px', 
                fontWeight: 'bold'
            }
        },
        stops: [
            [0.1, '#55BF3B'],
            [0.5, '#DDDF0D'], 
            [0.9, '#DF5353'] 
        ],
        lineWidth: 0,
        tickWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        labels: {
            y: 16,
            x: 0,
            distance: -14,
            style: {
                color: '#FFFFFF' // 设置刻度标签文字颜色为白色
            }
        }
    },
    series: [{
        name: 'Speed',
        data: [val],
        dataLabels: {
            format:
            '<div style="text-align:center">' +
            '<span style="font-size:25px;color:#FFFFFF">{y}</span><br/>' +
            '</div>'
        },
        tooltip: {
            valueSuffix: ' km/h'
        }
    }],

    plotOptions: {
        solidgauge: {
            borderRadius: 3,
            dataLabels: {
                y: 5,
                borderWidth: 0,
                useHTML: true
            }
        }
    }
}) 