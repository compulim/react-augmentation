# react-augmentation

DOM augmentation operators to simplify UI code and promote data-driven DOM hierarchy

# Operators

At first, augmentation operators may be mind-bending or often feels like Inception. They enable scenarios that could otherwise very difficult to implement.

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

Even all children is unmounted, it will render

```
<div>
  <p>Hello, World!</p>
</div>
```

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
    return (
      <div>
        {
          // Wrap all items in <PersistenceOfVision>, key omitted for sample code clarity
          this.items.map(item => <PersistenceOfVision>{ item }</PersistenceOfVision>)
        }
        {
          // Render additional <PersistenceOfVision> for items removed
          new Array(this.state.numItemsRemoved).fill(<PersistenceOfVision className="fadeOut" />)
        }
      </div>
    );
  }
}
```

Before the user remove "Buy eggs", you render this:

```jsx
<List>
  <PersistenceOfVision>Buy milk</PersistenceOfVision>
  <PersistenceOfVision>Buy eggs</PersistenceOfVision>
</List>
```

And it become HTML:

```jsx
<div>
  <div>Buy milk</div>
  <div>Buy eggs</div>
</div>
```

After the user removed "Buy eggs" from the list, we still render two `<PersistenceOfVision>`, like this:

```jsx
<List>
  <PersistenceOfVision>Buy milk</PersistenceOfVision>
  <PersistenceOfVision className="fadeOut" />
</List>
```

And it corresponding HTML become:

```jsx
<div>
  <div>Buy milk</div>
  <div className="fadeOut">Buy eggs</div>
</div>
```

Although the last one does not have any content, `<PersistenceOfVision>` will temporarily brought back the content, i.e. "Buy eggs".
