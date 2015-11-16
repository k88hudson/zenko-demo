const React = require('react');
const Select = require('react-select');
const {clone} = require('lodash');

const {CATEGORIES, CAMPAIGNS, LOCALES} = require('../../lib/fake');
const {Row, Third, Half, Quarter, Section} = require('../../components/grid/grid');
const moment = require('moment');

const campaignsById = {};
CAMPAIGNS.forEach(c => campaignsById[c.id] = c);

const CHANNELS = [
  {label: 'Desktop', value: 'desktop'},
  {label: 'Android', value: 'android'},
  {label: 'Desktop Pre-release', value: 'desktop-prerelease'}
];

const TYPES = [
  {label: 'Suggested', value: 'suggested'},
  {label: 'Directory', value: 'directory'},
  {label: 'All', value: 'all'}
];

const DEFAULT_FORM_DATA = {
  campaign_id: null,
  report_type: 'date',
  categories: CATEGORIES.map(c => { return {value: c, checked: true}; }),
  period: 'day',
  start_date: '',
  end_date: '',
  type_filter: 'suggested',
  channel_filter: 'desktop',
  locale_filter: 'All',
  country_filter: 'All'
};

module.exports = React.createClass({
  contextTypes: {
    addReportToHistory: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      campaign_id: null,
      report_type: 'date',
      categories: CATEGORIES.map(c => { return {value: c, checked: true}; }),
      period: 'day',
      type_filter: 'suggested',
      channel_filter: 'desktop',
      locale_filter: 'All',
      country_filter: 'All',
      start_date: '',
      end_date: '',
      showFilters: false
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
  resetFilters: function () {
    this.setState({
      showFilters: false,
      type_filter: 'suggested',
      channel_filter: 'desktop',
      locale_filter: 'All',
      country_filter: 'All',
    });
    this.setAllCategories(true);
  },
  setCampaign: function (campaignId) {
    if (!campaignId) {
      return this.setState({
        campaign_id: '',
        start_date: '',
        end_date: ''
      });
    }
    const campaign = campaignsById[campaignId]; 
    this.setState({
      campaign_id: campaignId,
      start_date: moment(campaign.start_date, 'YYYY-MM-D').format('YYYY-MM-DD'),
      end_date: moment(campaign.end_date, 'YYYY-MM-D').format('YYYY-MM-DD')
    });
  },
  submit: function () {
    const query = clone(this.state);
    delete query.showFilters;
    delete query.categories;

    this.context.addReportToHistory(query);
    this.props.history.pushState(null, '/campaign', query);
  },
  render: function () {
    const reportTypes = [
      {label: 'Date', value: 'date', icon: 'ion-calendar'},
      {label: 'Category', value: 'category', icon: 'ion-android-list'},
      {label: 'Country', value: 'country', icon: 'ion-android-globe'},
      {label: 'Locale', value: 'locale', icon: 'ion-android-textsms'}
    ];
    return (<div className="right-wrapper">
      <h2>Create a report</h2>
      <Section>
        <Row className="form-group">
          <Half>
            <label>Account</label>
            <Select 
              value={1}
              options={[{value: 1, label: 'Vegetable Coop'}]} />
          </Half>
        </Row>
        <Row>
          <Half>
            <label>Campaign</label>
            <Select 
              value={this.state.campaign_id}
              onChange={(v) => this.setCampaign(v)}
              options={CAMPAIGNS.map(c => {return {value: c.id, label: c.name}})} />
          </Half>
          <Quarter hidden={!this.state.campaign_id}>
            <label>Starting</label>
            <input value={this.state.start_date} className="input" />
          </Quarter>
          <Quarter hidden={!this.state.campaign_id}>
            <label>Ending</label>
            <input value={this.state.end_date} className="input" />
          </Quarter>
        </Row>
      </Section>

      <div hidden={!this.state.campaign_id}>
        <Section>
          <h3>Compare by...</h3>
          <Row className="report-types">
            {reportTypes.map(type => {
              return (<Quarter key={type.value} className={'type' + (this.state.report_type === type.value ? ' selected' : '')}>
                <label>
                  <input
                    checked={this.state.report_type === type.value}
                    onChange={() => this.setState({report_type: type.value})}
                    type="radio"
                    name="report_type"
                    value={type.value} />
                  <span className={'icon ' + type.icon} /> {type.label}
                </label>
              </Quarter>);
            })}
          </Row>
          <Row>
            <Quarter hidden={this.state.report_type !== 'date'}>
              <Select value={this.state.period}
                onChange={(v) => this.setState({period: v})}
                options={[
                  {value: 'day', label: 'Daily'},
                  {value: 'week', label: 'Weekly'},
                  {value: 'month', label: 'Monthly'}
                ]} />
            </Quarter>
          </Row>
        </Section>

        <Section hidden={this.state.showFilters}>
          <button className="btn" onClick={() => this.setState({showFilters: true})}>
            <span className="ion-ios-settings-strong" /> Add custom filters</button>
        </Section>

        <Section hidden={!this.state.showFilters}>
          <h3>Filters <button onClick={this.resetFilters} className="btn btn-small">Reset</button></h3>
          <div className="filters-container">
            <Row>
              <Half className="form-group">
                <label>Locale</label>
                <Select value={this.state.locale_filter}
                  options={LOCALES.map(l => {return {label: l, value: l}})}
                  onChange={(v) => this.setState({locale_filter: v})} />
              </Half>
              <Half className="form-group half">
                <label>Country</label>
                <Select options={[
                  {label: 'All', value: 'All'},
                  {label: 'United States', value: 'US'},
                  {label: 'Canada', value: 'CA'},
                  {label: 'France', value: 'FR'}
                ]} value={this.state.country_filter} onChange={(v) => this.setState({country_filter: v})} />
              </Half>
            </Row>
            <Row className="form-group">
              <Half>
                <label>Channel</label>
                <Select options={CHANNELS} value={this.state.channel_filter} onChange={(v) => this.setState({channel_filter: v})}  />
              </Half>
              <Half>
                <label>Type</label>
                <Select options={TYPES} initial="suggested" value={this.state.type_filter} onChange={(v) => this.setState({type_filter: v})} />
              </Half>
            </Row>
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
          </div>
        </Section>
        <Section>
          <button onClick={this.submit} className="btn action">
            <span className="ion-stats-bars"></span> Generate Report
          </button>
        </Section>
      </div>
    </div>);
  }
})
