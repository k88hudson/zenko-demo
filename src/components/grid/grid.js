const React = require('react');

function generateClass(displayName, className) {
  return  React.createClass({
    displayName,
    render: function () {
      if (this.props.className) className += ' ' + this.props.className;
      const props = Object.assign({}, this.props, {className});
      return (<div {...props}>
        {this.props.children}
      </div>);
    }
  });
}

module.exports.Row = generateClass('Row', 'row');
module.exports.Half = generateClass('Half', 'half');
module.exports.Third = generateClass('Third', 'third');
module.exports.Quarter = generateClass('Quarter', 'quarter');
