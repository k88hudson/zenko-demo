const faker = require('faker');
const moment = require('moment');

const LOCALES = ['en-US', 'en-GB', 'fr-FR', 'fr-CA', 'de-GR'];
const COUNTRY_CODES = ['US', 'CA', 'IT', 'GR'];
const OS = ['Windows', 'Windows 7', 'Windows 8', 'Linux', 'Mac OS X'];
const VERSIONS = ['35.0', '34.0', '33.0', '25.0'];

function generateDailyRow(date, options) {
  options = options || {};
  date = date || faker.date.past();

  const impressions = faker.random.number({min: 700000, max: 2000000});

  return {
    date: date.format('YYYY-MM-DD'),
    impressions,
    clicks: faker.random.number({min: Math.floor(impressions * 0.002), max: Math.floor(impressions * 0.004)}),
    pinned: faker.random.number({min: 2, max: 350}),
    blocked: faker.random.number({min: 2000, max: 90000}),
    locale: options.locale || faker.random.arrayElement(LOCALES),
    country_code: options.country_code || faker.random.arrayElement(COUNTRY_CODES),
    os: faker.random.arrayElement(OS),
    browser: 'Firefox',
    version: faker.random.arrayElement(VERSIONS),
    month: date.month(),
    week: date.week(),
    year: date.year(),
    blacklisted: false
  };
}

module.exports.campaign = function generateCampaign(title, date) {
  title = title || faker.commerce.productName();
  const rows = [];

  const startDate = moment(date || faker.date.past());
  for (let i = 0; i < 30; i++) {
    rows.push(generateDailyRow(startDate));
    startDate.add(1, 'days');
  }

  return {
    title,
    rows,
    startDate: startDate.format('YYYY-MM-DD')
  }
}


