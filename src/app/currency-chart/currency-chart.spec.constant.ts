export const HISTORICAL_RATE = {
  AUD_GBP: {
    '2020-08-18': 0.547494,
    '2020-08-19': 0.548124
  }
};

export const EXPECTED_XAXIS = {
  title: {
    text: ''
  },
  categories: ['18 Aug', '19 Aug']
};

export const EXPECTED_SERIES = [{
  type: 'line',
  name: 'AUD -> GBP',
  data: [0.547494, 0.548124]
}];
