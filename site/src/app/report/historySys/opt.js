import { caluColor, lang, exporting } from '@/util/highcharts';

export const opt = (cate, seri) => ({
  chart: {
    type: 'line',
    zoomType: 'x',
    backgroundColor: 'transparent',
    style: {
      color: '#FFFFFF'
    }
  },
  title: { text: null },
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
    }
  },
  xAxis: {
    categories: cate,
    title: { text: ` 日期` },
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
  tooltip: {
    shared: true,
    split: false,
    enabled: true,
    style: {
      fontSize: '12px'
    }
  },
  legend: {
    enabled: true,
    itemStyle: {
      color: '#FFFFFF',
      fontSize: '10px'
    }
  },
  series: seri,
  lang: lang,
  exporting: exporting
});
