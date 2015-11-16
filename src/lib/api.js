const faker = require('faker');
const moment = require('moment');
const {CAMPAIGNS, LOCALES, COUNTRY_CODES, OS, VERSIONS, CATEGORIES} = require('./fake');

function generateBasicStats() {
  const impressions = faker.random.number({min: 700000, max: 2000000});
  return {
    impressions,
    clicks: faker.random.number({min: Math.floor(impressions * 0.002), max: Math.floor(impressions * 0.004)}),
    pinned: faker.random.number({min: 2, max: 350}),
    blocked: faker.random.number({min: 2000, max: 90000}),
  };
}

function getDateRange(startDate, endDate, period) {
  const VALID_PERIODS = ['day', 'week', 'month'];
  const MAX_ROWS = 30;
  if (VALID_PERIODS.indexOf(period) === -1) {
    throw new Error(`${period} is not a valid period. Must be one of: ${VALID_PERIODS.join(', ')}`);
  }
  startDate = moment(startDate, 'YYYY-MM-DD');
  endDate = moment(endDate, 'YYYY-MM-DD');
  const result = []
  let count = 1;
  while (startDate <= endDate && result.length <= MAX_ROWS) {
    const obj = {
      date: startDate.format('YYY-MM-DD')
    };
    if (period === 'day') {
      obj.date_string = startDate.format('MMM DD');
    } else if (period === 'week') {
      obj.date_string = 'Week ' + count;
    } else {
      obj.date_string = startDate.format('MMMM');
    }
    result.push(obj);
    count++;
    startDate.add(1, period);
  }
  return result;
}

function getBaseArray(options) {
  const {field, period, startDate, endDate} = options;
  let rows;
  switch (field) {
    case 'date':
      rows = getDateRange(startDate, endDate, period);
      break;
    case 'locale':
      rows = LOCALES;
      break;
    case 'category':
      rows = CATEGORIES;
      break;
    case 'country':
      rows = COUNTRY_CODES;
      break;
    default:
      throw new Error('Sorry, you cannot group by ' + field);
  }
  if (typeof rows[0] === 'object') return rows;
  return rows.map(value => {
    let row = {};
    row[field] = value;
    return row;
  });
}

module.exports.campaigns = function () {
  return CAMPAIGNS;
};

module.exports.campaign = function (id) {
  let result;
  CAMPAIGNS.forEach(c => {
    if (c.id === +id) {
      result = c;
    }
  });
  return result;
};

module.exports.getRows = function getRows(options) {
  const {name, groupBy, compareBy, period, startDate, endDate, filters} = options;
  let rows;
  if (compareBy) {
    rows = getBaseArray({field: compareBy, period, startDate, endDate}).map(row => {
      return Object.assign(row, {
        rows: getBaseArray({field: groupBy, period, startDate, endDate}).map(r => {
          return Object.assign(r, generateBasicStats());
        })
      });
    });
  } else {
    rows = getBaseArray({field: groupBy, period, startDate, endDate}).map(row => {
      return Object.assign(row, generateBasicStats());
    });
  }
  return Object.assign({
    name,
    startDate,
    endDate,
    period,
    rows
  });
};
