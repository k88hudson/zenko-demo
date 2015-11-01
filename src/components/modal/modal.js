const React = require('react');

const contextTypes = {
  submit: React.PropTypes.func,
  cancel: React.PropTypes.func,
  modalState: React.PropTypes.func
};

const ModalMixin = {
  contextTypes,
  submit: function () { return this.context.submit.apply(null, arguments) },
  cancel: function () { return this.context.cancel.apply(null, arguments) },
  modalState: function () { return this.context.modalState.apply(null, arguments) }
};

const ModalSubmit = React.createClass({
  mixins: [ModalMixin],
  render: function () {
     return (<button onClick={this.submit} className="btn action">
      <span hidden={!this.modalState().loading} className="ion-ios-loop-strong spin" />
      <span hidden={this.modalState().loading}>{this.props.label}</span>
    </button> );
  }
});

const Modal = React.createClass({
  getInitialState: function () {
    return {
      visible: false,
      loading: false
    };
  },
  childContextTypes: contextTypes,
  getChildContext: function () {
    return {
      submit: this.submit,
      cancel: this.cancel,
      modalState: () => this.state
    };
  },
  setVisibility: function (isVisible) {
    this.setState({visible: isVisible});
  },
  submit: function () {
    const handler = this.props.onSubmit || () => {};
    this.setState({loading: true});
    handler(null, () => {
      this.setState({
        visible: false
      });
      // wait for fade to be done
      setTimeout(() => {
        this.setState({loading: false});
      }, 200);
    });
  },
  cancel: function () {
    this.setState({
      visible: false,
      loading: false
    });
  },
  render: function () {
    return (<div className={'modal-container' + (this.state.visible ? '' : ' hidden')}>
      <div className="modal-overlay" onClick={this.cancel} />
      <div className="modal">
        {this.props.children}
      </div>
    </div>);
  }
});

module.exports = {
  ModalMixin,
  ModalSubmit,
  Modal
};
