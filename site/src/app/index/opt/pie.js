export const OptPie = (data, title) => ({
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: 0,
    plotShadow: false,
    backgroundColor: 'transparent'
  },
  title: {
    text: title,
    align: 'center',
    verticalAlign: 'middle',
    y: 80,
    style: {
      fontSize: '14px',
      color: 'white'
    }
  },
  accessibility: {
    point: {
      valueSuffix: '%'
    }
  },
  tooltip: {
    style: {
      fontSize: '14px'
    },
    pointFormat: '<b style="color:#ff6600;">{point.percentage:.1f}%</b>'
  },
  plotOptions: {
    pie: {
      borderWidth: 0,
      dataLabels: {
        enabled: true,
        distance: 10,
        style: {
          fontWeight: 'bold',
          color: 'white',
          fontSize: '10px'
        }
      },
      startAngle: -90,
      endAngle: 90,
      center: ['50%', '85%'],
      size: '130%'
    }
  },
  xAxis: {
    labels: {
      style: {
        color: 'white'
      }
    }
  },
  yAxis: {
    labels: {
      style: {
        color: 'white'
      }
    },
    title: {
      style: {
        color: 'white'
      }
    }
  },
  series: [
    {
      type: 'pie',
      innerSize: '70%',
      data
    }
  ],
  exporting: {
    enabled: false // 直接关闭导出功能（按钮和菜单均隐藏）
  }
});
