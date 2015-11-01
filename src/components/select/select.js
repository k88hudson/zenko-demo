const React = require('react');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      value: this.props.initial || this.props.options[0].value
    };
  },
  onChange: function (e) {
    this.setState({value: e.target.value});
  },
  render: function () {
    return (<span className="select">
      <select value={this.state.value} onChange={this.onChange}>
        {this.props.options.map(option => {
          return <option key={option.value} value={option.value}>{option.label}</option>
        })}
      </select>
      <span className="select-arrow">
        <span className="ion-android-arrow-dropdown" />
      </span>
    </span>);
  }
});
