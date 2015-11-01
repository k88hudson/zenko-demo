const React = require('react');
const faker = require('faker');
const {Link} = require('react-router');
const {Table} = require('../components/table/table');
const moment = require('moment');
const campaigns = require('../lib/fake').CAMPAIGNS;
const fields = [
  {
    key: 'name',
    label: 'Campaign',
    format: function (row) {
      return <Link to="campaign">{row.name}</Link>;
    }
  },
  {
    key: 'status',
    label: 'Status',
    raw: function (row) {
      const isPaused = row.paused;
      const isPast = moment(row.end_date, 'YYYY-M-D').isBefore(new Date());
      if (isPaused) return 'paused';
      else if (isPast) return 'complete';
      else return 'active';
    },
    format: function (row, value) {
      return (<span className={'status status-' + value}>
        {value}</span>);
    }
  },
  {
    key: 'start_date',
    label: 'Start date',
    format: function (row) {
      return moment(row.start_date, 'YYYY-M-D').format('MMM DD, YYYY');
    }
  },
  {
    key: 'end_date',
    label: 'End date',
    format: function (row) {
      return moment(row.end_date, 'YYYY-M-D').format('MMM DD, YYYY');
    }
  }
];

module.exports = React.createClass({
  render: function () {
    return (<div>
      <header>
        <h1><div className="wrapper">Campaigns</div></h1>
      </header>
      <main className="wrapper" style={{paddingTop: 30}}>
        <Table fields={fields} data={campaigns} sortBy="end_date" />
      </main>
    </div>);
  }
});
