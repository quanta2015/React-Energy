export const UNIT = {
  day: '日',
  week: '周',
  month: '月',
  year: '年'
};
export const POW = {
  sys1: { tl: '所属系统', data: ['生产', '间接生产', '辅助'] },
  sys2: {
    tl: '所属中心',
    data: ['电子中心', '机电中心', '管理平台', '生产公用']
  },
  sys3: { tl: '楼栋', data: ['2号楼', '3号楼', '3号楼辅房', '10号楼'] }
};

export const ViewHeight = () => {
  var viewportHeight = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0
  );
  return (viewportHeight - 95) / 4;
};

export const ViewWidth = () => {
  var viewportWidth = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );
  // console.log(viewportWidth)
  return viewportWidth * 0.235;
};

export const genPowData = (d, POW) => {
  let data = [];
  for (let i = 0; i < d.length; i++) {
    let value = d[i];
    if (value !== null) {
      let dataName = POW.data[i];
      let title = POW.tl;
      data.push([dataName, title, value]);
    }
  }
  return data;
};

export const opt = (cate, seri, type) => {
  return {
    chart: {
      type,
      backgroundColor: 'transparent',
      height: ViewHeight() - 40
    },
    title: {
      text: null,
      style: { color: '#FFFFFF' }
    },
    yAxis: {
      gridLineWidth: 0,
      title: {
        text: null,
        style: { color: '#FFFFFF' }
      },
      labels: { style: { color: '#FFFFFF', fontSize: 13 } }
    },
    xAxis: {
      categories: cate,
      gridLineWidth: 0,
      title: {
        text: null,
        style: { color: '#FFFFFF' }
      },
      labels: { style: { color: '#FFFFFF', fontSize: 13 } }
    },
    tooltip: {
      style: {
        fontSize: 15
      }
    },
    legend: {
      enabled: true,
      floating: true,
      layout: 'horizontal',
      align: 'right',
      verticalAlign: 'top',
      y: -10,
      itemStyle: {
        color: '#FFFFFF',
        fontSize: 15
      }
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: false
        },
        marker: {
          enabled: true,
          symbol: 'circle',
          radius: 3
        }
      },
      column: {
        borderWidth: 0
      }
    },
    series: seri,
    colors: ['#2caffe', '#9b20d9', '#4c46db', '#ff6600', '#00f194']
  };
};

export const optPow = data => {
  return {
    chart: {
      width: ViewWidth(),
      height: ViewHeight() - 40,
      margin: [10, 10, 10, 10],
      backgroundColor: null,
      spacingTop: 0,
      spacingBottom: 0
    },
    title: {
      text: ''
    },
    tooltip: {
      formatter: function () {
        if (this.point?.from) {
          return `${this.point.from} → ${this.point.to}: ${this.point.weight}`;
        } else {
          return false;
        }
      },
      style: { color: '#333', fontSize: '15px' }
    },
    dataLabels: {
      style: {
        fontSize: '18px'
      }
    },
    series: [
      {
        keys: ['from', 'to', 'weight'],
        dataLabels: { style: { fontSize: '15px' } },
        nodes: [
          { id: '所属系统', color: '#dd0000' },
          { id: '生产', color: '#b7552e' },
          { id: '间接生产', color: '#e64e04' },
          { id: '辅助', color: '#fd1e48' },

          { id: '所属中心', color: '#0B3D0B' },
          { id: '电子中心', color: '#1F6B1F' },
          { id: '机电中心', color: '#339933' },
          { id: '管理平台', color: '#4CC74C' },
          { id: '生产公用', color: '#65D965' },

          { id: '楼栋', color: '#003366' },
          { id: '2号楼', color: '#004c99' },
          { id: '3号楼', color: '#0066cc' },
          { id: '3号楼辅房', color: '#3385ff' },
          { id: '10号楼', color: '#66a3ff' }
        ],
        data,
        type: 'sankey'
      }
    ]
  };
};

export const optPie = data => {
  return {
    chart: {
      margin: [0, 0, 0, 0],
      height: ViewHeight() - 40,
      //  plotBackgroundColor: null,
      // plotBorderWidth: 0,
      // plotShadow: false
      spacingTop: 0,
      spacingBottom: 0,
      backgroundColor: 'transparent'
    },
    title: {
      text: null,
      align: 'center',
      verticalAlign: 'middle',
      y: 60
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
      style: { color: '#333', fontSize: 15 }
    },
    accessibility: {
      point: { valueSuffix: '%' }
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true,
          distance: 10,
          format: '<b>{point.name}</b><br>{point.percentage:.1f}%',
          style: {
            fontSize: 11,
            fontWeight: 'bold',
            color: 'white'
          }
        },
        borderWidth: 0,
        startAngle: -90,
        endAngle: 90,
        center: ['50%', '100%'],
        size: '160%'
      }
    },
    series: [
      {
        type: 'pie',
        name: 'Browser share',
        innerSize: '50%',
        data
      }
    ]
  };
};

export const optBar = data => {
  const CATS = [
    '所属系统 - 生产',
    '所属系统 - 间接生产',
    '所属系统 - 辅助',
    '所属中心 - 电子中心',
    '所属中心 - 机电中心',
    '所属中心 - 管理平台',
    '所属中心 - 生产公用',
    '楼栋 - 2号楼',
    '楼栋 - 3号楼',
    '楼栋 - 3号楼辅房',
    '楼栋 - 10号楼'
  ];

  const mapData = d => [
    d.sys1[0],
    d.sys1[1],
    d.sys1[2],
    d.sys2[0],
    d.sys2[1],
    d.sys2[2],
    d.sys2[3],
    d.sys3[0],
    d.sys3[1],
    d.sys3[2],
    d.sys3[3]
  ];

  return {
    chart: {
      type: 'bar',
      backgroundColor: null,
      style: {
        color: '#FFFFFF'
      }
    },
    title: {
      text: '',
      style: {
        color: '#FFFFFF',
        fontSize: '16px'
      }
    },
    xAxis: {
      categories: CATS,
      crosshair: true,
      gridLineWidth: 0,
      labels: {
        style: {
          color: '#FFFFFF'
        }
      }
    },
    yAxis: {
      min: 0,
      gridLineWidth: 0,
      title: {
        text: '',
        style: {
          color: '#FFFFFF'
        }
      },
      labels: {
        enabled: false,
        style: {
          color: '#FFFFFF'
        }
      }
    },
    legend: {
      enabled: false
    },
    tooltip: {
      style: {
        color: '#333'
      }
    },
    plotOptions: {
      bar: {
        borderWidth: 0, // 去掉边框
        dataLabels: {
          enabled: true,
          style: {
            color: '#FFFFFF' // 数据标签颜色
          }
        }
      }
    },
    series: [
      {
        name: '能流',
        data: mapData(data).map((value, index) => {
          const colors = [
            '#FF0000',
            '#FF3333',
            '#FF6666', // 红色系
            '#00FF00',
            '#33FF33',
            '#66FF66',
            '#99FF99', // 绿色系
            '#0000FF',
            '#3333FF',
            '#6666FF',
            '#9999FF' // 蓝色系
          ];
          return {
            y: value,
            color: colors[index % colors.length] // 根据索引循环取颜色
          };
        })
      }
    ]
  };
};

export const optSys = data => {
  const CATS = ['耗电', '压缩空气', '氮气', '光伏发电'];
  // console.log(data)

  return {
    chart: {
      type: 'column',
      backgroundColor: null,
      style: {
        color: '#FFFFFF'
      }
    },
    title: {
      text: '',
      style: {
        color: '#FFFFFF',
        fontSize: '16px'
      }
    },
    xAxis: {
      categories: CATS,
      crosshair: true,
      labels: {
        style: {
          color: '#FFFFFF'
        }
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: '',
        style: {
          color: '#FFFFFF'
        }
      },
      labels: {
        enabled: false,
        style: {
          color: '#FFFFFF'
        }
      },
      gridLineWidth: 0
    },
    legend: {
      enabled: false
    },
    tooltip: {
      style: {
        color: '#333'
      }
    },
    plotOptions: {
      column: {
        borderWidth: 0, // 去掉边框
        dataLabels: {
          enabled: true,
          style: {
            color: '#FFFFFF' // 数据标签颜色
          }
        }
      }
    },
    series: data
  };
};
