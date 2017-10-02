import PropTypes from 'prop-types';
import React     from 'react';

export default class Outlet extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    this.handleUpdate = this.handleUpdate.bind(this);

    this.state = {
      content: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.name !== this.props.name) {
      this.unsubscribe(this.props);
      this.subscribe(nextProps);
    }
  }

  componentWillMount() {
    this.props.name && this.subscribe(this.props);
  }

  componentWillUnmount() {
    this.unsubscribe(this.props);
  }

  subscribe(props) {
    const nextContent = this.context.pipe.subscribe(props.name, this.handleUpdate);

    this.setState(() => ({ content: nextContent }));
  }

  unsubscribe(props) {
    this.context.pipe.unsubscribe(props.name, this.handleUpdate);
  }

  handleUpdate(nextContent) {
    this.setState(() => ({ content: nextContent }));
  }

  render() {
    const { name, ...otherProps } = this.props;

    return (
      <div { ...otherProps }>
        { this.state.content || this.props.children }
      </div>
    );
  }
}

Outlet.contextTypes = {
  pipe: PropTypes.shape({
    subscribe  : PropTypes.func,
    unsubscribe: PropTypes.func
  })
};

Outlet.propTypes = {
  name: PropTypes.string
};
