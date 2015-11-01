const React = require('react');
const Select = require('../../components/select/select');
const {CATEGORIES, CAMPAIGNS, LOCALES} = require('../../lib/fake');
const {Row, Third, Half, Quarter} = require('../../components/grid/grid');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      report_type: 'date',
      categories: CATEGORIES.map(c => { return {value: c, checked: true}; })
    };
  },
  setCategory: function (category, checked) {
    const categories = this.state.categories.slice();
    categories.forEach(c => {
      if (c.value === category) c.checked = checked;
    });
    this.setState({categories});
  },
  setAllCategories: function (checked) {
    const categories = this.state.categories.map(c => Object.assign(c, {checked}));
    this.setState({categories});
  },
  render: function () {
    const history = [
      {
        last_updated: 'today',
        campaign: 'Kale',
        notes: '[10.1-10.30/date/daily]'
      },
      {
        last_updated: 'yesterday',
        campaign: 'Broccoli',
        notes: '[10.1-10.30/date/daily]'
      },
      {
        last_updated: 'yesterday',
        campaign: 'Zucchini',
        notes: '[10.1-10.30/date/daily]'
      }
    ];
    const reportTypes = [
      {label: 'Date', value: 'date', icon: 'ion-calendar'},
      {label: 'Category', value: 'category', icon: 'ion-android-list'},
      {label: 'Country', value: 'country', icon: 'ion-android-globe'},
      {label: 'Locale', value: 'locale', icon: 'ion-android-textsms'}
    ];
    return (<div>
      <header>
        <h1>Splice</h1>
      </header>
      <main className="flex-wrapper home">
          <div className="sidebar">
            <nav className="tabs">
              <ul>
                <li><a className="active">History</a></li>
                <li><a>Favourites</a></li>
              </ul>
            </nav>
            <ul className="sidebar-list">
              {history.map(r => {
                return (<li><a>
                  <span className="name">{r.campaign}</span>
                  <span className="notes">{r.notes}</span>
                </a></li>);
              })}
            </ul>
          </div>
          <div>
            <div className="right-wrapper">
              <h2>Create a report</h2>

              <h3>Campaign</h3>
              <Row>
                <Half>
                  <label>Name</label>
                  <Select options={CAMPAIGNS.map(c => {return {value: c.id, label: c.name}})} />
                </Half>
              </Row>

              <h3>Compare by...</h3>
              <ul className="report-types">
                {reportTypes.map(type => {
                  return (<li key={type.value} className={this.state.report_type === type.value ? 'selected' : ''}>
                    <label>
                      <input
                        checked={this.state.report_type === type.value}
                        onChange={() => this.setState({report_type: type.value})}
                        type="radio"
                        name="report_type"
                        value={type.value} />
                      <span className={'icon ' + type.icon} /> {type.label}
                    </label>
                  </li>);
                })}
              </ul>

              <h3>Date</h3>
             
              <Row>
                <Third hidden={this.state.report_type !== 'date'}>
                  <label>Period</label>
                  <Select options={[
                    {value: 'daily', label: 'Daily'},
                    {valie: 'weekly', label: 'Weekly'}
                  ]} initial="daily" />
                </Third>
                <Third>
                  <label>Start Date</label>
                  <input className="input" />
                </Third>
                <Third>
                  <label>End Date</label>
                  <input className="input" />
                </Third>
              </Row>

              <h3>Filters</h3>
              <div className="section">
                <Row>
                  <Half className="form-group">
                    <label>Locale</label>
                    <Select options={LOCALES} initial="all" />
                  </Half>
                  <Half className="form-group half">
                    <label>Country</label>
                    <Select options={[
                      {label: 'All', value: 'all'},
                      {label: 'United States', value: 'US'},
                      {label: 'Canada', value: 'CA'}
                    ]} initial="all" />
                  </Half>
                </Row>
                <Row>
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
                </Row>
              </div>
              <Row>
                <div className="form-group">
                  <label>Categories <button onClick={() => this.setAllCategories(true)} className="btn btn-small">All</button> <button onClick={() => this.setAllCategories(false)} className="btn btn-small">Clear</button></label>
                  <ul className="checkbox-list">
                    {this.state.categories.map(c => {
                      return (<li key={c.value}>
                        <input type="checkbox" checked={c.checked} onChange={(e) => this.setCategory(c.value, e.target.checked)} />
                        {c.value}
                      </li>);
                    })}
                  </ul>
                </div>
              </Row>
            </div>
          </div>
      </main>
    </div>);
  }
})
