const React = require('react');

module.exports = React.createClass({
  displayName: 'Select',
  render: function () {
    let options = this.props.options.slice();

    if (typeof this.props.options[0] !== 'object') {
      options = options.map(o => { return {value: o, label: o} });
    }

    return (<span className="select">
      <select value={this.props.value} onChange={this.props.onChange}>
        <option value="" disabled>{this.props.placeholder}</option>
        {options.map(option => {
          return <option key={option.value} value={option.value}>{option.label}</option>
        })}
      </select>
      <span className="select-arrow">
        <span className="ion-android-arrow-dropdown" />
      </span>
    </span>);
  }
});
