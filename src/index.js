const React = require('react');
const ReactDOM = require('react/lib/ReactDOM');
const {Router, Route, IndexRoute} = require('react-router');

const App = React.createClass({
  getInitialState: function () {
    return {
      reportHistory: []
    };
  },
  childContextTypes: {
    addReportToHistory: React.PropTypes.func
  },
  getChildContext: function () {
    return {
      addReportToHistory: (report) => {
        const reportHistory = this.state.reportHistory.concat([report]);
        this.setState({reportHistory});
      }
    };
  },
  render: function () {
    return (<div className="outer-wrapper">
      <header>
        <button className="main-menu"><span/></button>
        <h1 className="pink">
          <span className="logo">SPLICE</span>
        </h1>
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
            {this.state.reportHistory.map(r => {
              return (<li><a>
                <span className="name">{r.campaign_id}</span>
                <span className="notes">{r.report_type}{r.start_date}{r.end_date}</span>
              </a></li>);
            })}
          </ul>
        </div>
        <div className="main">
          {this.props.children}
        </div>
      </main>
    </div>);
  }
});

const NotFound = React.createClass({
  render: function () {
    return <div>404</div>;
  }
});

ReactDOM.render((<Router>
  <Route path="/" component={App}>
    <Route path="campaign" component={require('./pages/Campaign/Campaign')}/>
    <Route path="*" component={NotFound}/>
    <IndexRoute component={require('./pages/NewReport/NewReport')} />
  </Route>
</Router>), document.getElementById('app'));
