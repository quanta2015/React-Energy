export const OptBar = (categories,series,title,unit) => ({
    chart: {
      type: 'bar',
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
        align: 'high', 
        style: {
          color: '#FFFFFF',
        }
      },
      labels: {
        style: {
          color: '#FFFFFF',
          fontSize: '10px'
        }
      },
      gridLineWidth: 1,
      gridLineColor: 'rgba(255,255,255,.2)'
    },
    xAxis: {
      categories,
      labels: {
        style: {
          color: '#FFFFFF',
          fontSize: '10px'
        }
      },
      lineColor: '#FFFFFF',
      tickColor: '#FFFFFF',
      gridLineWidth: 1,
      gridLineColor: 'rgba(255,255,255,.2)',
      gridLineDashStyle: 'Dash'
    },
    plotOptions: {
      bar: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          style: {
            color: '#FFFFFF',
            fontSize: '11px'
          },
          formatter: function () {
            return this.y.toFixed(2);
          },
        },
        groupPadding: 0.1
      }
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
    credits: {
      enabled: false
    },
    series
  });