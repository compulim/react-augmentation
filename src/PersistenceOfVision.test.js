import React    from 'react';
import renderer from 'react-test-renderer';

import PersistenceOfVision from './PersistenceOfVision';

it('passthru when not removed', () => {
  const component = renderer.create(
    <PersistenceOfVision className="passed">
      <p>Hello, World!</p>
    </PersistenceOfVision>
  );

  expect(component.toJSON()).toMatchSnapshot();

  component.update(
    <PersistenceOfVision className="passed-not-persisted">
      <p>Aloha!</p>
    </PersistenceOfVision>
  );

  expect(component.toJSON()).toMatchSnapshot();
});

it('persist and unpersist correctly', () => {
  const component = renderer.create(
    <PersistenceOfVision>
      <p>Hello, World!</p>
    </PersistenceOfVision>
  );

  expect(component.toJSON()).toMatchSnapshot();

  component.update(
    <PersistenceOfVision />
  );

  expect(component.toJSON()).toMatchSnapshot();
});

it('initial persist correctly', () => {
  const component = renderer.create(
    <PersistenceOfVision />
  );

  expect(component.toJSON()).toMatchSnapshot();
});

it('passthru and persist multiple children correctly', () => {
  const component = renderer.create(
    <PersistenceOfVision>
      <p>How are you?</p>
      <p>I am fine.</p>
    </PersistenceOfVision>
  );

  expect(component.toJSON()).toMatchSnapshot();

  component.update(
    <PersistenceOfVision />
  );

  expect(component.toJSON()).toMatchSnapshot();
});

it('should emit onPersist when unmount', () => {
  let numHandlePersist = 0;
  const component = renderer.create(
    <PersistenceOfVision onPersist={ () => numHandlePersist++ }>
      <p>Hello, World!</p>
    </PersistenceOfVision>
  );

  component.update(
    <PersistenceOfVision onPersist={ () => numHandlePersist++ } />
  );

  expect(numHandlePersist).toBe(1);
});
