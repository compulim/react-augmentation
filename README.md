# react-augmentation

DOM augmentation operators to simplify UI code and promote data-driven DOM hierarchy.

# Background

At first, augmentation operators may be mind-bending, unnecessary, and feels like [Inception](http://www.imdb.com/title/tt1375666/) or, even worse, anti-pattern. They enable scenarios that could otherwise very difficult to implement.

## What is data-driven DOM hierarchy?

Use JSX as how it is designed to use.

### Passing array of items

Assume you want to pass a list of item to render.

#### Anti-pattern

```jsx
<List items={ ['Buy eggs', 'Buy milk'] } />
```

This is bad, because array passed into `<List>` can differ from time to time even they have same content. React use reference equal to look for changes. You can use memoize function to patch the issue.

#### The right way

```jsx
<List>
  <List.Item>Buy eggs</List.Item>
  <List.Item>Buy milk</List.Item>
</List>
```

Use `props.children` to pass items. As a bonus, you can also pass rich and live content.

You may need the anti-pattern because you want to have temporal or permanent control on the lifetime of the items, e.g. for fade out animation. If you allow the user to remove item as needed, it will either break animation, or make the component very complicated to use.

### Deterministic and traceability

Consider you want to show a modal on topmost layer (last child of `<body>`). You may end up either using a global store or build a function, that would be `this.props.dispatch(ModalActions.show())` or `MessageBox.show()` respectively.

Then later on, when you want to put rich and live content in the dialog box, you will need to update the global store or call `MessageBox.show()` continuously. What's worse, if you need to put an `<input>` in the modal, it will become very difficult.

Updating the modal manually and continuously is a plausible workaround, but you will be trading deterministic and traceability. Debugging would become difficult. Saving the current browser state become a complicated business because the modal is non-deterministic.

The better way is to create the modal close to where it is needed. But keeping the modal in the topmost layer means you need to manipulate DOM manually, which is a big no-no for React.

# Operators

We build a list of augmentation operators to make data-driven DOM hierarchy a possibility.

Supported operators:

* [Pipe](#pipe)
* [Persistence of vision](#persistence-of-vision)

## Pipe

### How it works?

When you put elements in `<Inlet>`, they will be rendered to `<Outlet>` with same `name`.

#### Your code

```jsx
<body>
  <PipeProvider>
    <div>
      <Inlet name="greeting">
        <p>Hello, World!</p>
      </Inlet>
    </div>
    <div>
      <Outlet name="greeting" />
    </div>
  </PipeProvider>
</body>
```

#### Would become

```jsx
<body>
  <PipeProvider>
    <div>
      <!-- The original place for Inlet -->
    </div>
    <div>
      <!-- The replaced tag for Outlet -->
      <div>
        <p>Hello, World!</p>
      </div>
    </div>
  </PipeProvider>
</body>
```

### Why you need it?

When the user click "Submit", you want to create a new `<Modal>` and append to `<body>`. This confirm modal will be on top of everything on the page, like this DOM hierarchy:

```jsx
<body>
  <form>
    <button onClick={ this.handleSubmit }>Submit</button>
  </form>
  <Modal title="Confirm">
    <p>Are you sure to submit the form?</p>
    <button>Yes</button>
    <button>No</button>
  </Modal>
</body>
```

But it might not be easily done because at the time you create the modal, you might be deep in the DOM. To talk to outmost DOM hierarchy, that means you either need a global store like Redux, or writing a modal service using context.

Furthermore, if the content of the dialog box has rich or lively content, it will be complicated to implement using Redux.

### How you use it?

You wrap `<Modal>` in `<Inlet>` and put side-by-side to where its lifetime is managed. Then you put `<Outlet>` as the last child of `<body>`. When `<Inlet>` get rendered, all of its content will be piped to `<Outlet>`.

```jsx
<body>
  <PipeProvider>
    <form>
      <button onClick={ this.handleSubmit }>Submit</button>
      <Inlet name="modal">
        <Modal title="Confirm">
          <p>Are you sure to submit the form?</p>
          <button>Yes</button>
          <button>No</button>
        </Modal>
      </Inlet>
    </form>
    <Outlet name="modal" />
  </PipeProvider>
</body>
```

To support pipe operator, you need to wrap your app in `<PipeProvider>`, or wrap the common ancestor of `<Inlet>` and `<Outlet>` component. This is required because pipe operator is implemented using React context.

## Persistence of vision

### How it works?

When the content of `<PersistenceOfVision>` is emptied, they will be persisted.

#### Your code

Initially, you write

```jsx
<PersistenceOfVision>
  <p>Hello, World!</p>
</PersistenceOfVision>
```

Then mutate it into

```jsx
<PersistenceOfVision />
```

#### Would become

```
<div>
  <p>Hello, World!</p>
</div>
```

The unmounted element is persisted on the page temporarily.

### Why you need it?

Animate an unmounting element. Enables user of your component to unmount children as needed.

For example, you implement an UI library for a list component named `<List>`. You expect user of your `<List>` component should produce a DOM hierarchy like this:

```jsx
<List>
  <List.Item>Buy milk</List.Item>
  <List.Item>Buy eggs</List.Item>
</List>
```

When "Buy eggs" is removed, you want to make it fade out rather than removing it immediately. But since the lifetime of `<List.Item>` is controlled by the user of your UI library. When `<List.Item>Buy eggs</List.Item>` is unmounted, it will be removed immediately. Thus, you cannot implement a fade out animation.

You can opt for an alternative solution by forcing item lifetime controlled by `<List>`, like this:

```jsx
<List items={ ['Buy milk', 'Buy eggs'] } />
```

But there are few disadvantages to this pattern:

* Since `items` is an array, if every `render()` produce a new array, it will impact performance. User of your component need to implement memoization themselves
* Supporting rich content (i.e. DOM elements) is not trivial

### How you use it?

Inside `<List>`, you deploy `<PersistenceOfVision>`:

```js
class List extends React.Component {
  componentWillReceiveProps(nextProps) {
    // Remember how many items were removed
    this.setState(() => ({
      numItemsRemoved: Math.max(0, this.props.items.length - nextProps.items.length)
    }))
  }

  render() {
    // It is important to add empty items and rendering the list together with existing items
    // This is because the internal handling of key in React
    const allItems = this.items.concat(new Array(this.state.numItemsRemoved).fill());

    return (
      <div>
        {
          allItems.map((item, index) =>
            <PersistenceOfVision
              className={ item ? '' : 'fadeOut' }
              key      ={ index }
            >
              { item }
            </PersistenceOfVision>
          )
        }
      </div>
    );
  }
}
```

Before the user remove "Buy eggs", React render this:

```jsx
<List>
  <PersistenceOfVision>Buy milk</PersistenceOfVision>
  <PersistenceOfVision>Buy eggs</PersistenceOfVision>
</List>
```

Which become

```jsx
<div>
  <div>Buy milk</div>
  <div>Buy eggs</div>
</div>
```

After we removed "Buy eggs" from the list, we still render two `<PersistenceOfVision>`, like this:

```jsx
<List>
  <PersistenceOfVision>Buy milk</PersistenceOfVision>
  <PersistenceOfVision className="fadeOut" />
</List>
```

Which would become

```jsx
<div>
  <div>Buy milk</div>
  <div className="fadeOut">Buy eggs</div>
</div>
```

Although the last one does not have any content, `<PersistenceOfVision>` will temporarily brought back the content, i.e. "Buy eggs".

### Caveats

#### Temporal effect

Persistence of vision should only be used for short period of time. This is because the effect is temporal and its non-deterministic nature.

#### Using "key" props

If you are using "key" props in an array of `<PersistenceOfVision>`, make sure you render all `<PoV>` in a single `Array.map()` loop. Consider the keys in between these two scenarios:

```jsx
<ul>
  {
    [<div key="1">ABC</div>, <div key="2">DEF</div>]
  }
</ul>
```

And

```jsx
<ul>
  {
    [<div key="1">ABC</div>]
  }
  {
    [<div key="2">DEF</div>]
  }
</ul>
```

Although two outcomes are the same, the keys of two "DEF" are different. When React is reconciling the first scenario into the second, "DEF" will get destroyed and reconstructed. This is because the first "DEF" is rendered in the *first* array, and the second "DEF" is rendered in *another* array.

# Contributions

Like us? [Star](https://github.com/compulim/react-augmentation/stargazers) us.

Found an issue? [File](https://github.com/compulim/react-augmentation/issues) a minimal repro to us.
