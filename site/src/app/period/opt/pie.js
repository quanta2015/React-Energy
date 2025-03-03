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
    y: 20,
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
      fontSize: '12px'
    },
    pointFormat: '<b style="color:#666;">{point.percentage:.1f}%</b>'
  },
  plotOptions: {
    pie: {
      borderWidth: 0,
      dataLabels: {
        enabled: true,
        distance: -15,
        allowOverlap: true, // 允许标签重叠
        style: {
          fontWeight: 'bold',
          color: 'white',
          fontSize: '10px'
        }
      },
      startAngle: 0,
      endAngle: 360,
      center: ['50%', '60%'],
      size: '90%'
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
