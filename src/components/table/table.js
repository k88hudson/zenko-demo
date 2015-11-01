const React = require('react');

const Table = React.createClass({
  getDefaultProps: function () {
    fieldsEditable: false
  },
  getInitialState: function () {
    return {
      sortBy: this.props.sortBy || this.fields()[0].key || '',
      sortOrder: 1
    };
  },
  fields: function () {
    return this.props.fields.map(field => {
      if (!field.format) field.format = (row) => row[field.key];
      if (!field.raw) field.raw = (row) => row[field.key];
      return field;
    });
  },
  getFieldByKey: function (key) {
    let result;
    this.fields().forEach(function (field) {
      if (field.key === key) result = field;
    });
    return result;
  },
  sort: function (rows, sortBy, sortOrder) {
    rows = rows.slice();

    const field = this.getFieldByKey(sortBy);
    const sort = field.sort || function (x, y) {
      if (typeof x === 'number' && typeof y === 'number') {
        return (x - y) * sortOrder;
      } else {
        return (x > y ? 1 : -1) * sortOrder;
      }
      
    };
    return rows.sort((x, y) => sort(field.raw(x), field.raw(y)));
  },
  setSort: function (field) {
    if (this.state.sortBy === field.key) {
      this.setState({sortOrder: -this.state.sortOrder});
    } else {
      this.setState({sortBy: field.key, sortOrder: 1});
    }
  },
  getCarrot: function (field) {
    const selected = this.state.sortBy === field.key;
    const icon = (selected && this.state.sortOrder === -1) ? 'ion-android-arrow-dropup' : 'ion-android-arrow-dropdown';
    return <span className={'carrot ' + icon} />;
  },
  render: function () {

    const rows = this.sort(this.props.data, this.state.sortBy, this.state.sortOrder);
    const fields = this.fields();

    return (<div className="table">
      <table>
        <thead>
          <tr>
            {fields.map(field => <th key={field.key} className={this.state.sortBy === field.key && 'selected'} onClick={() => this.setSort(field)}>{field.label} {this.getCarrot(field)}</th>)}
            <th className="settings" hidden={!this.fieldsEditable}>
              <button onClick={() => this.setState({showMenu: !this.state.showMenu})}>
                <span className="ion-android-more-horizontal" />
              </button>
              <ul className="menu" hidden={!this.state.showMenu}>
                {fields.map(field => <li key={field.key}><input type="checkbox" checked /> {field.label}</li>)}
              </ul>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            return (<tr key={i}>
              {fields.map(field => <td key={field.key}>{field.format(row, field.raw(row))}</td>)}
              <td hidden={!this.state.fieldsEditable} />
            </tr>);
          })}
        </tbody>
      </table>
    </div>);
  }
});

module.exports = {
  Table
};
