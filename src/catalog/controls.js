export const defaultControls = [
  { field: 'count', label: '粒子数', type: 'range', min: 0, max: 180, step: 10 },
  { field: 'speed', label: '速度', type: 'range', min: 0.5, max: 8, step: 0.5 },
  { field: 'size', label: 'サイズ', type: 'range', min: 1, max: 12, step: 0.5 },
  {
    field: 'linkDistance',
    label: '接続距離',
    type: 'range',
    min: 0,
    max: 240,
    step: 10,
  },
  {
    field: 'repulseDistance',
    label: 'ホバー強度',
    type: 'range',
    min: 40,
    max: 240,
    step: 10,
  },
  { field: 'linksEnabled', label: '線', type: 'checkbox' },
  { field: 'hoverEnabled', label: 'Hover', type: 'checkbox' },
  { field: 'clickEnabled', label: 'Click', type: 'checkbox' },
]

export const bundleControls = [
  { field: 'count', label: '量', type: 'range', min: 10, max: 180, step: 10 },
  { field: 'speed', label: '速度', type: 'range', min: 0.5, max: 8, step: 0.5 },
  { field: 'size', label: 'サイズ', type: 'range', min: 1, max: 12, step: 0.5 },
]
