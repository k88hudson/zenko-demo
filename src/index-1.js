const React = require('react');
const ReactDOM = require('react/lib/ReactDOM');
const api = require('../src/lib/api');

console.log(api.campaign());

function currency(n) {
  const nString = n * 100 + '';
  return `$${nString.slice(0, -1)}.${nString.slice(-2)}`;
}

const App = React.createClass({
  getInitialState: function () {
    return {
      activeSection: 1,
      showMenu: false
    };
  },
  setSection: function (id) {
    this.setState({activeSection: id});
  },
  render: function () {
    var campaignData = [
      {
        name: 'Cheese and bread',
        category: 'Food',
        delivery: 'RUNNING',
        results: 789,
        reach: 1039,
        frequency: 10.5,
        cost: 10.32,
        amountSpent: 502.10,
        startDate: '10/10/2015'
      },
      {
        name: 'Wine time',
        category: 'Media',
        delivery: 'RUNNING',
        results: 321,
        reach: 439,
        frequency: 5,
        cost: 8.00,
        amountSpent: 32.10,
        startDate: '10/15/2015'
      }
    ];
    return (<div>
      <header>
        <h1>Splice</h1>
        <nav>
          <ul>
            <li><a onClick={() => this.setSection(0)} className={this.state.activeSection === 0 ? 'active' : ''}>Accounts</a></li>
            <li><a onClick={() => this.setSection(1)} className={this.state.activeSection === 1 ? 'active' : ''}>Campaigns</a></li>
            <li><a onClick={() => this.setSection(2)} className={this.state.activeSection === 2 ? 'active' : ''}>Add Groups</a></li>
            <li><a onClick={() => this.setSection(3)} className={this.state.activeSection === 3 ? 'active' : ''}>Tiles</a></li>
          </ul>
        </nav>
      </header>
      <main>
        <table>
          <thead>
            <tr>
              <th className="settings">
                <span onClick={() => this.setState({showMenu: !this.state.showMenu})} className="ion-android-settings" />
                <ul className="menu" hidden={!this.state.showMenu}>
                  <li>Option</li>
                </ul>
              </th>
              <th>Campaign Name</th>
              <th>Delivery</th>
              <th>Results</th>
              <th>Reach</th>
              <th>Frequency</th>
              <th>Cost</th>
              <th>Start Date</th>
            </tr>
          </thead>
          <tbody>
            {campaignData.map(campaign => {
              return (<tr>
                <td />
                <td><span className="category">{campaign.category}</span>{campaign.name}</td>
                <td className="delivery">{campaign.delivery}</td>
                <td>{campaign.results}</td>
                <td>{campaign.reach}</td>
                <td>{campaign.frequency}</td>
                <td>{currency(campaign.cost)}</td>
                <td>{campaign.startDate}</td>
              </tr>);
            })}
          </tbody>
        </table>
      </main>
  </div>);
  }
});

ReactDOM.render(<App />, document.getElementById('app'));
