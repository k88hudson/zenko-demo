const React = require('react');

function generateClass(displayName, classNameBase) {
  return  React.createClass({
    displayName,
    render: function () {
      let className = classNameBase;
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
module.exports.Section = generateClass('Section', 'section');
