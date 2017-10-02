import PropTypes from 'prop-types';
import React     from 'react';

export default class PersistenceOfVision extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      children: props.children
    };
  }

  componentWillReceiveProps(nextProps) {
    if (React.Children.count(nextProps.children)) {
      this.setState(() => ({
        children: nextProps.children
      }));
    } else if (nextProps.children !== this.props.children) {
      this.props.onPersist();
    }
  }

  render() {
    const { onPersist, ...otherProps } = this.props;

    return (
      <div { ...otherProps }>
        { this.state.children }
      </div>
    );
  }
}

PersistenceOfVision.defaultProps = {
  onPersist: () => 0
};

PersistenceOfVision.propTypes = {
  onPersist: PropTypes.func
};
