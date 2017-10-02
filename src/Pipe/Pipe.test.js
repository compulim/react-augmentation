import React    from 'react';
import renderer from 'react-test-renderer';

import Inlet    from './Inlet';
import Outlet   from './Outlet';
import Provider from './Provider';

it('pipes correctly', () => {
  const tree = renderer.create(
    <Provider>
      <div className="inlet">
        <Inlet name="aloha" className="not-passed">
          <p>How are you?</p>
          <p>I am fine.</p>
        </Inlet>
      </div>
      <div className="outlet">
        <Outlet name="aloha" className="passed" />
      </div>
    </Provider>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('switch pipe correctly', () => {
  class TestHost extends React.Component {
    render() {
      return (
        <Provider>
          <h1>{ this.props.pipeName }</h1>
          <div className="inlet">
            <Inlet name={ this.props.pipeName }>
              <p>How are you?</p>
              <p>I am fine.</p>
            </Inlet>
          </div>
          <div className="first-outlet">
            <Outlet name="first" />
          </div>
          <div className="second-outlet">
            <Outlet name="second" />
          </div>
        </Provider>
      );
    }
  }

  const component = renderer.create(
    <TestHost pipeName="first" />
  );

  expect(component.toJSON()).toMatchSnapshot();

  component.update(
    <TestHost pipeName="second" />
  );

  expect(component.toJSON()).toMatchSnapshot();
});

it('cross switch pipe correctly', () => {
  class TestHost extends React.Component {
    render() {
      return (
        <Provider>
          <h1>{ this.props.firstPipeName } x { this.props.secondPipeName }</h1>
          <div className="first-inlet">
            <Inlet name={ this.props.firstPipeName }>
              <p>How are you?</p>
            </Inlet>
          </div>
          <div className="second-inlet">
            <Inlet name={ this.props.secondPipeName }>
              <p>I am fine.</p>
            </Inlet>
          </div>
          <div className="first-outlet">
            <Outlet name="first" />
          </div>
          <div className="second-outlet">
            <Outlet name="second" />
          </div>
        </Provider>
      );
    }
  }

  const component = renderer.create(
    <TestHost firstPipeName="first" secondPipeName="second" />
  );

  expect(component.toJSON()).toMatchSnapshot();

  component.update(
    <TestHost firstPipeName="second" secondPipeName="first" />
  );

  expect(component.toJSON()).toMatchSnapshot();
});

it('multiplex correctly', () => {
  const tree = renderer.create(
    <Provider>
      <div className="inlet">
        <Inlet name="aloha">
          <p>How are you?</p>
          <p>I am fine.</p>
        </Inlet>
      </div>
      <div className="first-outlet">
        <Outlet name="aloha" />
      </div>
      <div className="second-outlet">
        <Outlet name="aloha" />
      </div>
    </Provider>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('propagate content change correctly', () => {
  const component = renderer.create(
    <Provider>
      <div className="inlet">
        <Inlet name="greeting">
          <p>Hello, World!</p>
        </Inlet>
      </div>
      <div className="outlet">
        <Outlet name="greeting" />
      </div>
    </Provider>
  );

  expect(component.toJSON()).toMatchSnapshot();

  component.update(
    <Provider>
      <div className="inlet">
        <Inlet name="greeting">
          <p>Aloha!</p>
        </Inlet>
      </div>
      <div className="outlet">
        <Outlet name="greeting" />
      </div>
    </Provider>
  );

  expect(component.toJSON()).toMatchSnapshot();
});

it('inlet join and leave pipe correctly', () => {
  const component = renderer.create(
    <Provider>
      <div className="inlet">
        <Inlet>
          <p>Hello, World!</p>
        </Inlet>
      </div>
      <div className="outlet">
        <Outlet name="greeting" />
      </div>
    </Provider>
  );

  expect(component.toJSON()).toMatchSnapshot();

  component.update(
    <Provider>
      <div className="inlet">
        <Inlet name="greeting">
          <p>Hello, World!</p>
        </Inlet>
      </div>
      <div className="outlet">
        <Outlet name="greeting" />
      </div>
    </Provider>
  );

  expect(component.toJSON()).toMatchSnapshot();

  component.update(
    <Provider>
      <div className="inlet">
        <Inlet>
          <p>Hello, World!</p>
        </Inlet>
      </div>
      <div className="outlet">
        <Outlet name="greeting" />
      </div>
    </Provider>
  );

  expect(component.toJSON()).toMatchSnapshot();
});

it('outlet join and leave pipe correctly', () => {
  const component = renderer.create(
    <Provider>
      <div className="inlet">
        <Inlet name="greeting">
          <p>Hello, World!</p>
        </Inlet>
      </div>
      <div className="outlet">
        <Outlet />
      </div>
    </Provider>
  );

  expect(component.toJSON()).toMatchSnapshot();

  component.update(
    <Provider>
      <div className="inlet">
        <Inlet name="greeting">
          <p>Hello, World!</p>
        </Inlet>
      </div>
      <div className="outlet">
        <Outlet name="greeting" />
      </div>
    </Provider>
  );

  expect(component.toJSON()).toMatchSnapshot();

  component.update(
    <Provider>
      <div className="inlet">
        <Inlet name="greeting">
          <p>Hello, World!</p>
        </Inlet>
      </div>
      <div className="outlet">
        <Outlet />
      </div>
    </Provider>
  );

  expect(component.toJSON()).toMatchSnapshot();
});

it('should unmount pipe correctly', () => {
  const component = renderer.create(
    <Provider>
      <div className="inlet">
        <Inlet name="greeting">
          <p>Hello, World!</p>
        </Inlet>
      </div>
      <div className="outlet">
        <Outlet name="greeting" />
      </div>
    </Provider>
  );

  expect(component.toJSON()).toMatchSnapshot();

  component.update(
    <Provider>
      <div className="inlet">
      </div>
      <div className="outlet">
        <Outlet name="greeting" />
      </div>
    </Provider>
  );

  expect(component.toJSON()).toMatchSnapshot();

  component.update(
    <Provider>
      <div className="inlet">
      </div>
      <div className="outlet">
      </div>
    </Provider>
  );

  expect(component.toJSON()).toMatchSnapshot();
});

it('shows outlet children if nothing from inlet', () => {
  const component = renderer.create(
    <Provider>
      <div className="inlet">
        <Inlet name="aloha" />
      </div>
      <div className="outlet">
        <Outlet name="aloha">
          <p>Default content</p>
        </Outlet>
      </div>
    </Provider>
  );

  expect(component.toJSON()).toMatchSnapshot();

  component.update(
    <Provider>
      <div className="inlet">
        <Inlet name="aloha">
          <p>Overriden content</p>
        </Inlet>
      </div>
      <div className="outlet">
        <Outlet name="aloha">
          <p>Default content</p>
        </Outlet>
      </div>
    </Provider>
  );

  expect(component.toJSON()).toMatchSnapshot();
});
