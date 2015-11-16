const React = require('react');
const ReactDOM = require('react/lib/ReactDOM');
const api = require('../../lib/api');
const moment = require('moment');
const faker = require('faker');

const {Link} = require('react-router');

const {Modal, ModalSubmit} = require('../../components/modal/modal');
const {Table} = require('../../components/table/table');
const Select = require('../../components/select/select');
const {CAMPAIGNS} = require('../../lib/fake');

function campaignById(id) {
  let result;
  CAMPAIGNS.forEach(c => {
    if (c.id === +id) result = c;
  });
  return result;
}

function currency(n) {
  const nString = n * 100 + '';
  return `$${nString.slice(0, -1)}.${nString.slice(-2)}`;
}

function numberWithCommas(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const LEAD_FIELDS = {
  date: {
    label: 'Date',
    key: 'date',
    raw: function (row) {
      return moment(row.date, 'YYYY-MM-DD');
    },
    format: function (row) {
      return row.date_string;
    }
  },
  category: {
    label: 'Category',
    key: 'category'
  },
  locale: {
    label: 'Locale',
    key: 'locale'
  },
  country: {
    label: 'Country',
    key: 'country'
  }
};

const BASE_FIELDS = [
  {
    label: 'Impressions',
    key: 'impressions',
    format: function (row) {
      return numberWithCommas(row.impressions);
    }
  },
  {
    label: 'Clicks',
    key: 'clicks',
    format: function (row) {
      return numberWithCommas(row.clicks);
    }
  },
  {
    label: 'CTR',
    key: 'ctr',
    raw: function (row) {
      return row.clicks / row.impressions;
    },
    format: function (row) {
      const ctr = row.clicks / row.impressions;
      const formatted = `${Math.round(ctr * 10000000) / 100000}%`;
      const percentage = (ctr * 1000 - 2)/2;
      let level = 2;
      if (percentage < 0.25) level = 1;
      if (percentage > 0.75) level = 3;
      return <span className={'ctr ctr-' + level} >{formatted}</span>;
    }
  },
  {
    label: 'Pinned',
    key: 'pinned',
    format: function (row) {
      return numberWithCommas(row.pinned);
    }
  },
  {
    label: 'Blocked',
    key: 'blocked',
    format: function (row) {
      return numberWithCommas(row.blocked);
    }
  }
];

const Chart = require('rc-chartjs');
const {Bar, Line} = Chart;

module.exports = React.createClass({
  displayName: 'CampaignPage',
  getInitialState: function () {
    const query = this.props.location.query;
    return {
      campaign: api.getRows({
        name: campaignById(query.campaign_id).name,
        startDate: query.start_date,
        endDate: query.end_date,
        groupBy: query.report_type,
        period: query.period
      })
    };
  },
  generateNewRows: function (data, cb) {
    setTimeout(() => {
      cb();
    }, 1000);
  },
  render: function () {
    const query = this.props.location.query;

    let fields = [];
    fields.push(LEAD_FIELDS[query.report_type]);
    fields = fields.concat(BASE_FIELDS);

    const chartData = {
      labels: this.state.campaign.rows.map(row => moment(row[query.report_type], 'YYYY-MM-DD').format('MM/DD')),
      datasets: [{
        fillColor: "rgba(107, 142, 191, 0.2)",
        // strokeColor: "rgba(220,220,220,1)",
        // pointColor: "rgba(220,220,220,1)",
        // pointStrokeColor: "#fff",
        // pointHighlightFill: "#fff",
        // pointHighlightStroke: "rgba(220,220,220,1)",
        data: this.state.campaign.rows.map(row => Math.round((row.clicks / row.impressions) * 10000000) / 100000)
      }]
    };

    const chartOptions = {
      responsive: true
    };

    // const chartOptions = {};

    return (<div className="right-wrapper-wide">
      <div className="summary">
        <div className="main-summary">
          <h2>Daily report for {this.state.campaign.name}, {moment(this.state.campaign.startDate, 'YYYY-MM-DD').format('MMM DD')} – {moment(this.state.campaign.endDate, 'YYYY-MM-DD').format('MMM DD')}</h2>
          <p>
            <strong>All</strong> countries, <strong>all</strong> locales, <strong>all</strong> categories.
          </p>
          <p><button onClick={() => this.refs.reportSettingsModal.setVisibility(true)} className="btn action">
            <span className="ion-android-settings" /> Edit report settings
          </button> <button className="btn normal">
            <span className="ion-document" /> Download as .xls
          </button></p>
        </div>
      </div>
      <Line data={chartData} width="1200" height="400" options={chartOptions}/>
      <Table fields={fields} data={this.state.campaign.rows} />

      <Modal ref="reportSettingsModal" onClick={this.generateNewRows}>
        <div className="modal-body">
          <h1>Edit report</h1>
          <div className="report-settings">
            <div className="section">
              <div className="form-group"><label>Campaign</label>The Scene</div>
            </div>
            <div className="section row">
              <div className="form-group half">
                <label>Start Date</label>
                <input type="date" className="input" value="2015-10-01" />
              </div>
              <div className="form-group half">
              <label>Period</label><Select options={[
                {label: 'Daily', value: 'daily'},
                {label: 'Weekly', value: 'weekly'}
              ]} initial="daily" /></div>
            </div>
            <div className="section">
              <div className="row">
                <div className="form-group half"><label>Locale</label><Select options={[
                  {label: 'All', value: 'all'},
                  {label: 'en-US', value: 'en-US'}
                ]} initial="all" /></div>
                <div className="form-group half"><label>Country</label><Select options={[
                  {label: 'All', value: 'all'},
                  {label: 'United States', value: 'US'},
                  {label: 'Canada', value: 'CA'}
                ]} initial="all" /></div>
              </div>
              <div className="row">
                <div className="form-group half"><label>Channel</label><Select options={[
                  {label: 'Desktop', value: 'all'},
                  {label: 'United States', value: 'US'},
                  {label: 'Canada', value: 'CA'}
                ]} initial="all" /></div>
                <div className="form-group half"><label>Type</label><Select options={[
                  {label: 'Suggested', value: 'all'},
                  {label: 'United States', value: 'US'},
                  {label: 'Canada', value: 'CA'}
                ]} initial="all" /></div>
              </div>
            </div>
            <div className="form-group">
              <label>Categories</label>
              <Select options={[
                {label: 'All', value: 'all'},
                {label: 'Fashion', value: '1'},
                {label: 'Design', value: '2'},
                {label: 'Auto', value: '3'}
              ]} initial="all" />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <ModalSubmit label="Generate new Report" />
        </div>
      </Modal>
    </div>);
  }
});
