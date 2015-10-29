const React = require('react');
const ReactDOM = require('react/lib/ReactDOM');
const api = require('../src/lib/api');
const moment = require('moment');
const Autocomplete = require('react-autocomplete');

function matchStateToTerm (state, value) {
  return (
    state.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
    state.abbr.toLowerCase().indexOf(value.toLowerCase()) !== -1
  )
}

function sortStates (a, b, value) {
  return (
    a.name.toLowerCase().indexOf(value.toLowerCase()) >
    b.name.toLowerCase().indexOf(value.toLowerCase()) ? 1 : -1
  )
}

function getStates() {
  return [
    { abbr: "AL", name: "Alabama"},
    { abbr: "AK", name: "Alaska"},
    { abbr: "AZ", name: "Arizona"},
    { abbr: "AR", name: "Arkansas"},
    { abbr: "CA", name: "California"},
    { abbr: "CO", name: "Colorado"},
    { abbr: "CT", name: "Connecticut"},
    { abbr: "DE", name: "Delaware"},
    { abbr: "FL", name: "Florida"},
    { abbr: "GA", name: "Georgia"},
    { abbr: "HI", name: "Hawaii"},
    { abbr: "ID", name: "Idaho"},
    { abbr: "IL", name: "Illinois"},
    { abbr: "IN", name: "Indiana"},
    { abbr: "IA", name: "Iowa"},
    { abbr: "KS", name: "Kansas"},
    { abbr: "KY", name: "Kentucky"},
    { abbr: "LA", name: "Louisiana"},
    { abbr: "ME", name: "Maine"},
    { abbr: "MD", name: "Maryland"},
    { abbr: "MA", name: "Massachusetts"},
    { abbr: "MI", name: "Michigan"},
    { abbr: "MN", name: "Minnesota"},
    { abbr: "MS", name: "Mississippi"},
    { abbr: "MO", name: "Missouri"},
    { abbr: "MT", name: "Montana"},
    { abbr: "NE", name: "Nebraska"},
    { abbr: "NV", name: "Nevada"},
    { abbr: "NH", name: "New Hampshire"},
    { abbr: "NJ", name: "New Jersey"},
    { abbr: "NM", name: "New Mexico"},
    { abbr: "NY", name: "New York"},
    { abbr: "NC", name: "North Carolina"},
    { abbr: "ND", name: "North Dakota"},
    { abbr: "OH", name: "Ohio"},
    { abbr: "OK", name: "Oklahoma"},
    { abbr: "OR", name: "Oregon"},
    { abbr: "PA", name: "Pennsylvania"},
    { abbr: "RI", name: "Rhode Island"},
    { abbr: "SC", name: "South Carolina"},
    { abbr: "SD", name: "South Dakota"},
    { abbr: "TN", name: "Tennessee"},
    { abbr: "TX", name: "Texas"},
    { abbr: "UT", name: "Utah"},
    { abbr: "VT", name: "Vermont"},
    { abbr: "VA", name: "Virginia"},
    { abbr: "WA", name: "Washington"},
    { abbr: "WV", name: "West Virginia"},
    { abbr: "WI", name: "Wisconsin"},
    { abbr: "WY", name: "Wyoming"}
  ]
}

let styles = {
  item: {
    padding: '2px 6px',
    cursor: 'default',
    zIndex: 1000
  },

  highlightedItem: {
    color: 'white',
    background: 'hsl(200, 50%, 50%)',
    padding: '2px 6px',
    cursor: 'default'
  },

  menu: {
    border: 'solid 1px #ccc'
  }
}


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
].map(field => {
  if (!field.format) field.format = (row) => row[field.key];
  if (!field.raw) field.raw = (row) => row[field.key];
  return field;
});

function getFieldByKey(key) {
  let result;
  fields.forEach(function (field) {
    if (field.key === key) result = field;
  });
  return result;
}

const Campaign = React.createClass({
  getInitialState: function () {
    return Object.assign({}, api.campaign(), {
      sortBy: 'date',
      sortOrder: 1
    });
  },
  sort: function (rows, sortBy, sortOrder) {
    rows = rows.slice();
    sortBy = sortBy || 'date';
    sortOrder = sortOrder || 1;

    const getValue = getFieldByKey(sortBy).raw;
    return rows.sort(function (x, y) {
      return (getValue(x) - getValue(y)) * sortOrder;
    });
  },
  onFieldHeaderClick: function (field) {
    if (this.state.sortBy === field.key) {
      this.setState({sortOrder: -this.state.sortOrder});
    } else {
      this.setState({sortBy: field.key, sortOrder: 1});
    }
  },
  getCarrot: function (field) {
    const selected = this.state.sortBy === field.key;
    const icon = (selected && this.state.sortOrder === -1) ? 'ion-android-arrow-dropup' : 'ion-android-arrow-dropdown';

    return (<button className={'carrot' + (selected ? ' selected' : '')}>
      <span className={icon} />
    </button>);
  },
  render: function () {

    const rows = this.sort(this.state.rows, this.state.sortBy, this.state.sortOrder);

    return (<div>
      <header>
        <h1><Link className="breadcrumbs" to="/">Campaigns</Link> {this.state.title}</h1>
      </header>
      <main>
        <div className="filters">
          <div className="button-group">
            <button className="chooser">Date: <span className="content">{moment(this.state.startDate, 'YYYY-MM-DD').format('MMM D')}</span> to <span className="content">{moment(this.state.startDate, 'YYYY-MM-DD').add(30, 'days').format('MMM D')}</span></button>
            <button className="chooser"><span className="content">Daily</span></button>
          </div>
          <div className="button-group">
            <button className="chooser">Locale: <span className="content">All</span></button>
            <button className="chooser">Country: <span className="content">All</span></button>
            <button className="chooser">Categories: <span className="content">All</span></button>
            <button className="chooser">Segments: <span className="content">Desktop</span></button>
            <button className="chooser icon"><span className="ion-android-more-horizontal" /></button>
          </div>
          <div className="button-group" style={{float: 'right', marginRight: 0}}>
            <button className="chooser pink"><span className="ion-android-arrow-down" /> Download report</button>
          </div>
          <div className="filter-input">
            <Autocomplete
              initialValue="Alabama"
              items={getStates()}
              getItemValue={(item) => item.name}
              shouldItemRender={matchStateToTerm}
              sortItems={sortStates}
              renderItem={(item, isHighlighted) => (
               <div
                 style={isHighlighted ? styles.highlightedItem : styles.item}
                 key={item.abbr}
               >{item.name}</div>
              )}
            />
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th className="settings">
                <button  onClick={() => this.setState({showMenu: !this.state.showMenu})}><span className="ion-android-settings" /></button>
                <ul className="menu" hidden={!this.state.showMenu}>
                  <li><input type="checkbox" checked /> Date</li>
                  <li><input type="checkbox" checked /> Impressions</li>
                  <li><input type="checkbox" checked /> Clicks</li>
                  <li><input type="checkbox" checked /> CTR</li>
                  <li><input type="checkbox" checked /> Pinned</li>
                  <li><input type="checkbox" checked /> Blocked</li>
                  <li><input type="checkbox" /> Engagement</li>
                </ul>
              </th>
              {fields.map(field => <th onClick={() => this.onFieldHeaderClick(field)}>{field.label} {this.getCarrot(field)}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => {
              return (<tr>
                <td />
                {fields.map(field => <td>{field.format(row)}</td>)}
              </tr>);
            })}
          </tbody>
        </table>
      </main>
  </div>);
  }
});

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

const Router = require('react-router').Router;
const Route = require('react-router').Route;
const IndexRoute = require('react-router').IndexRoute;
const Link = require('react-router').Link;

const faker = require('faker');

const Home = React.createClass({
  render: function () {
    const campaigns = [];
    for (let i = 0; i < 10; i++) {
      campaigns.push(faker.commerce.productName());
    }
    return (<div>
      <header>
        <h1>Campaigns</h1>
      </header>
      <main>
        <ul className="campaign-list">
          {campaigns.map(c => <li><Link to="campaigns">{c}</Link></li>)}
        </ul>
      </main>
    </div>);
  }
});


ReactDOM.render((<Router>
  <Route path="/" component={App}>
    <Route path="campaigns" component={Campaign}/>
    <Route path="*" component={NotFound}/>
    <IndexRoute component={Home} />
  </Route>
</Router>), document.getElementById('app'));
