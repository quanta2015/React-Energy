export const OptColumn = (categories,series,title, unit) => ({
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      style: {
        color: '#FFFFFF'
      }
    },
    title: {
      text: title,
      align: 'left',
      style: {
        color: '#9ca3d8',
        fontSize: '15px'
      }
    },
    yAxis: {
      title: {
        text: unit,
        style: {
          color: '#FFFFFF',
          fontSize: '12px'
        }
      },
      labels: {
        style: {
          color: '#FFFFFF'
        }
      },
      gridLineWidth: 1,
      gridLineColor: 'rgba(255,255,255,.2)'
    },
    xAxis: {
      categories,
      labels: {
        style: {
          color: '#FFFFFF'
        }
      },
      lineColor: '#FFFFFF',
      tickColor: '#FFFFFF',
      gridLineWidth: 1,
      gridLineColor: 'rgba(255,255,255,.2)',
      gridLineDashStyle: 'Dash'
    },
    legend: {
      layout: 'horizontal',
      align: 'right',
      verticalAlign: 'top',
      x: 0,
      y: 0,
      floating: true,
      borderWidth: 0,
      backgroundColor: 'transparent', // 设置背景为透明
      shadow: true,
      itemStyle: {
        color: '#FFFFFF'
      }
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    series
  });