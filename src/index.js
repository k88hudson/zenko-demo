const React = require('react');
const ReactDOM = require('react/lib/ReactDOM');
const api = require('../src/lib/api');
const moment = require('moment');
const faker = require('faker');

const Router = require('react-router').Router;
const Route = require('react-router').Route;
const IndexRoute = require('react-router').IndexRoute;
const Link = require('react-router').Link;

const {Modal, ModalSubmit} = require('./components/modal/modal');
const {Table} = require('./components/table/table');

function currency(n) {
  const nString = n * 100 + '';
  return `$${nString.slice(0, -1)}.${nString.slice(-2)}`;
}

function numberWithCommas(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const fields = [
  {
    label: 'Date',
    key: 'date',
    raw: function (row) {
      return moment(row.date, 'YYYY-MM-DD');
    },
    format: function (row) {
      return moment(row.date, 'YYYY-MM-DD').format('MMM D');
    }
  },
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


const App = React.createClass({
  render: function () {
    return this.props.children;
  }
});

const NotFound = React.createClass({
  render: function () {
    return <div>404</div>;
  }
});

const Select = require('./components/select/select');


const Campaign = React.createClass({
  getInitialState: function () {
    return {
      campaign: api.getRows({
        name: faker.commerce.productName(),
        startDate: '2015-10-01',
        endDate: '2015-10-31',
        groupBy: 'date',
        period: 'day'
      })
    };
  },
  generateNewRows: function (data, cb) {
    setTimeout(() => {
      cb();
    }, 1000);
  },
  render: function () {
    return (<div>
      <header>
        <h1>
          <div className="wrapper">
            <Link className="breadcrumbs" to="/">Campaigns</Link>
            {this.state.campaign.name}
          </div>
        </h1>
      </header>
      <main className="wrapper" style={{paddingTop: 30}}>
        <div className="summary">
          <div className="main-summary">
            <h2>Daily report for {moment(this.state.campaign.startDate, 'YYYY-MM-DD').format('MMM DD')} – {moment(this.state.campaign.endDate, 'YYYY-MM-DD').format('MMM DD')}</h2>
            <p>
              <strong>All</strong> countries, <strong>all</strong> locales, <strong>all</strong> categories.
            </p>
            <p><button onClick={() => this.refs.reportSettingsModal.setVisibility(true)} className="btn action">
              <span className="ion-android-settings" /> Customize view
            </button> <button className="btn normal">
              <span className="ion-android-arrow-down" /> Download for excel
            </button></p>
          </div>
        </div>
        <Table fields={fields} data={this.state.campaign.rows} />
      </main>
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

ReactDOM.render((<Router>
  <Route path="/" component={App}>
    <Route path="campaign" component={Campaign}/>
    <Route path="new" component={require('./pages/NewReport/NewReport')} />
    <Route path="*" component={NotFound}/>
    <IndexRoute component={require('./pages/home')} />
  </Route>
</Router>), document.getElementById('app'));
