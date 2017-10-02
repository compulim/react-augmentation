import PropTypes from 'prop-types';
import React     from 'react';

export default class Freeze extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      children: props.frozen && props.children
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.frozen !== this.props.frozen) {
      this.setState(() => ({
        children: nextProps.frozen && nextProps.children
      }));
    }
  }

  render() {
    const { frozen, ...otherProps } = this.props;

    return (
      <div { ...otherProps }>
        {
          this.props.frozen ?
            this.state.children
          :
            this.props.children
        }
      </div>
    );
  }
}

Freeze.propTypes = {
  frozen: PropTypes.bool
};
