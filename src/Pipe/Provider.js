import PropTypes from 'prop-types';
import React     from 'react';

export default class PipeProvider extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    this.contents = {};
    this.outlets = {};
  }

  getChildContext() {
    return {
      pipe: {
        subscribe: (name, observer) => {
          (this.outlets[name] || (this.outlets[name] = [])).push(observer);

          return this.contents[name];
        },
        unsubscribe: (name, observer) => {
          const targetOutlets = this.outlets[name];

          if (targetOutlets) {
            this.outlets[name] = targetOutlets.filter(o => o !== observer);

            if (!this.outlets[name].length) {
              delete this.outlets[name];
            }
          }
        },
        update: (name, children) => {
          if (children) {
            this.contents[name] = children;
          } else {
            delete this.contents[name];
          }

          if (this.outlets[name]) {
            this.outlets[name].forEach(observer => observer(children));
          }
        }
      }
    };
  }

  render() {
    return (
      <div { ...this.props }>
        { this.props.children }
      </div>
    );
  }
};

PipeProvider.childContextTypes = {
  pipe: PropTypes.shape({
    subscribe  : PropTypes.func,
    unsubscribe: PropTypes.func,
    update     : PropTypes.func
  })
};
