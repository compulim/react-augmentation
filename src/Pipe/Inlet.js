import PropTypes from 'prop-types';
import React     from 'react';

export default class Inlet extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      name: props.name
    };
  }

  componentDidMount() {
    this.context.pipe.update(this.props.name, this.props.children);
  }

  componentWillReceiveProps(nextProps) {
    const { name: nextName } = nextProps;

    if (nextName !== this.state.name) {
      this.context.pipe.update(this.state.name, null);

      this.setState(() => ({ name: nextName }), () => {
        this.context.pipe.update(nextName, nextProps.children);
      });
    } else if (nextProps.children !== this.props.children) {
      this.context.pipe.update(nextName, nextProps.children);
    }
  }

  componentWillUnmount() {
    this.context.pipe.update(this.state.name, null);
  }

  render() {
    return false;
  }
}

Inlet.contextTypes = {
  pipe: PropTypes.shape({
    update: PropTypes.func
  })
};

Inlet.propTypes = {
  name: PropTypes.string
};
