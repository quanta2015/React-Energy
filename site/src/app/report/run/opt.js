export const OptLineInit = (categories, series, title, unit) => {
  return {
    chart: {
      type: 'line',
      backgroundColor: 'transparent',
      style: {
        color: '#FFFFFF'
      }
    },
    title: {
      text: title,
      align: 'right',
      margin: 10,
      verticalAlign: 'top',
      style: {
        color: '#fff',
        fontSize: '12px'
      }
    },
    yAxis: {
      title: {
        text: null,
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
      // max: maxValue + 2,
      // min: minValue,
    },
    xAxis: {
      categories,
      labels: {
        enabled: false,
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
      enabled: false,
      floating: true,
      align: 'right',
      verticalAlign: 'top',
      x: 0,
      y: -10,
      layout: 'horizontal',
      itemStyle: {
        color: '#FFFFFF',
        fontSize: '10px'
      }
    },
    tooltip: {
      style: {
        fontSize: '13px'
      },
      formatter: function () {
        return `<b>${this.series.name}</b> ${this.y} ${unit}`;
      }
    },
    plotOptions: {
      line: {
        marker: {
          // enabled: true,
          // radius: 3,
          fillColor: '#FFFFFF',
          lineWidth: 2,
          lineColor: null,
          symbol: 'circle'
        },
        events: {
          // 动态调整 Y 轴最大值
          legendItemClick: function () {
            const chart = this.chart;
            // 获取当前可见的系列
            const visibleSeries = chart.series.filter(s => s.visible);
            // 重新计算可见系列的最大值
            const visibleDataPoints = visibleSeries.flatMap(s =>
              s.data.map(point => point.y)
            );
            const newMaxValue = Math.max(...visibleDataPoints);
            // 更新 Y 轴的最大值
            chart.yAxis[0].update({
              max: newMaxValue + 2 // 增加一些缓冲空间
            });
            return true; // 允许默认的图例点击行为
          }
        }
      }
    },
    exporting: {
      enabled: false // 直接关闭导出功能（按钮和菜单均隐藏）
    },
    series
  };
};
