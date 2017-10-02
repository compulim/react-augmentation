import React    from 'react';
import renderer from 'react-test-renderer';

import Freeze from './Freeze';

it('passthru when not frozen', () => {
  const component = renderer.create(
    <Freeze>
      <p>Hello, World!</p>
    </Freeze>
  );

  expect(component.toJSON()).toMatchSnapshot();

  component.update(
    <Freeze className="passed">
      <p>Aloha!</p>
    </Freeze>
  );

  expect(component.toJSON()).toMatchSnapshot();
});

it('frozen and thaw correctly', () => {
  const component = renderer.create(
    <Freeze>
      <p>Hello, World!</p>
    </Freeze>
  );

  expect(component.toJSON()).toMatchSnapshot();

  component.update(
    <Freeze frozen={ true }>
      <p>Hello, World!</p>
    </Freeze>
  );

  expect(component.toJSON()).toMatchSnapshot();

  component.update(
    <Freeze frozen={ true }>
      <p>Aloha!</p>
    </Freeze>
  );

  expect(component.toJSON()).toMatchSnapshot();

  component.update(
    <Freeze frozen={ false }>
      <p>Aloha!</p>
    </Freeze>
  );

  expect(component.toJSON()).toMatchSnapshot();
});

it('initial freeze correctly', () => {
  const component = renderer.create(
    <Freeze frozen={ true }>
      <p>Hello, World!</p>
    </Freeze>
  );

  expect(component.toJSON()).toMatchSnapshot();

  component.update(
    <Freeze frozen={ true }>
      <p>Aloha!</p>
    </Freeze>
  );

  expect(component.toJSON()).toMatchSnapshot();
});

it('freeze multiple children correctly', () => {
  const component = renderer.create(
    <Freeze frozen={ true }>
      <p>How are you?</p>
      <p>I am fine.</p>
    </Freeze>
  );

  expect(component.toJSON()).toMatchSnapshot();

  component.update(
    <Freeze frozen={ true }>
      <p>Hello, World!</p>
      <p>Aloha!</p>
    </Freeze>
  );

  expect(component.toJSON()).toMatchSnapshot();

  component.update(
    <Freeze frozen={ false }>
      <p>Hello, World!</p>
      <p>Aloha!</p>
    </Freeze>
  );

  expect(component.toJSON()).toMatchSnapshot();
});

it('should freeze with reordered key correctly', () => {
  const component = renderer.create(
    <div>
      <Freeze key={ 0 } frozen={ true }>
        <p>How are you?</p>
      </Freeze>
      <Freeze key={ 1 } frozen={ true }>
        <p>I am fine</p>
      </Freeze>
    </div>
  );

  expect(component.toJSON()).toMatchSnapshot();

  component.update(
    <div>
      <Freeze key={ 1 } frozen={ true }>
        <p>Hello, World!</p>
      </Freeze>
      <Freeze key={ 0 } frozen={ true }>
      </Freeze>
    </div>
  );

  expect(component.toJSON()).toMatchSnapshot();
});
