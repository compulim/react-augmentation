# react-augmentation

DOM augmentation operators to simplify UI code and promote data-driven DOM hierarchy

# Operators

At first, augmentation operators may be mind-bending or often feels like Inception. They enable scenarios that could otherwise very difficult to implement.

## Pipe

When you put elements in `<Inlet>`, they will be rendered to `<Outlet>` with same `name`.

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

But it might not be easily done because at the time you create the modal, you might be deep in the DOM. To talk to outmost DOM hierarchy, that means you either need a global store like Redux, or writing a modal service using React context.

Furthermore, if the content of the dialog box has rich or lively content, it will be difficult to implement using Redux.

### How you use it?

You wrap `<Modal>` in `<Inlet>` and put side-by-side to where its lifetime is managed. Then you put `<Outlet>` as the last child of `<body>`. When `<Inlet>` get rendered, all of its content will be piped to `<Outlet>`.

```jsx
<body>
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
</body>
```

## Persistence of vision

When the content of `<PersistenceOfVision>` is emptied, they will be persisted.

### Why you need it?

When you implement fade out animation for an unmounting element.

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

Inside `<List>`, you can use `<PersistenceOfVision>`:

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

Before the user remove "Buy eggs", the DOM looks like this:

```jsx
<List>
  <PersistenceOfVision>Buy milk</PersistenceOfVision>
  <PersistenceOfVision>Buy eggs</PersistenceOfVision>
</List>
```

After the user removed "Buy eggs" from the list, we still render two `<PersistenceOfVision>`, like this:

```jsx
<List>
  <PersistenceOfVision>Buy milk</PersistenceOfVision>
  <PersistenceOfVision className="fadeOut" />
</List>
```

Although the last one does not have any content, `<PersistenceOfVision>` will temporarily brought back the content, i.e. "Buy eggs".
