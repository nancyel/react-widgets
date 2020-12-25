# React Widgets app

> Another react app, to get a better idea of how React works

### Learning points

- 10 Hooks (`useSomething`)

  - useState, useEffect, useContext
    - useState: a function that lets you use state in a functional component
    - useEffect: a function similar to lifecycle methods
  - useReducer, useCallback, useMemo
  - useRef, useImperativeHandle, useLayoutEffect
  - useDebugValue

- Functional components (FC) don't have access to lifecycle methods that are available to class components.
- But FC has the **useEffect Hook**, and it can be configured to handle 3 different possible scenarios:

  ```
  when:
    case1: a component is first rendered to the screen
    case2: a component is first rendered && rerenders
    case3: a component is first rendered && rerenders && some piece of data has changed
  ```

  The same thing is implemented in the code:

  ```
  useEffect(function, when to call this function);
  ```

### useEffect in detail

---

Scenario: How to implement a search function to be invoked, only when the condition is met? The condition being:

- when the user input in the search box contains a term, and
- it stays the same for a while (~500ms)

Otherwise, if we simply use the onInputChange callback, an API call will be made every time the input text is updated. Now if we use a timer, how can we reset the timer every time the input text is updated?

---

1. Function

- Note that async-await syntax cannot be used directly in the first argument of the useEffect function. Three possible approaches include:

  - Create a helper function and invoke it (recommended)

    ```js
    const [results, setResults] = useState([]);

    useEffect(() => {
      const helper = async () => {
        const { data } = await axios.get("endpoint", "options");
        setResults(data.item);
      };

      helper();
    }, []);
    ```

  - Invoke the above function as IFFE

  - Use Promise-based syntax

- Can call a return function, which is invoked after rerender (not invoked during initial render). Note that this return function is called prior to the provided function in the first argument.

  ```js
  useEffect(() => {
    // set up a timer
    const timeoutId = setTimeout(() => {
      if (term) {
        search();
      }
    }, 500);

    // when the term changes, cancel the timer
    // using an identifier emitted from setTimeout function
    return () => {
      clearTimeout(timeoutId);
    };
  }, [term]);
  ```

2. When to call this function

- the second argument is called a dependency array. The rule says all the props and states that are being called inside useEffect should be listed out in this array.

  ```js
  useEffect(() => {
    if (term) {
      console.log("test");
    }
  }, [term]);
  ```

  - case1: an empty array ([])
  - case2: no array (this is rarely the case)
  - case3: some values in the array ([term])

### useState in detail

---

Scenario: how to open and close a dropdown menu?
This is automatically handled by [Bootstrap](https://getbootstrap.com/docs/4.0/components/dropdowns/), but how would you do the same thing in the world of React? By making use of `useState`, template literals, and ternary operators.

---

```js
const [open, setOpen] = useState(false);

<div className={`menu ${open ? "visible transition" : ""}`}>
  {renderedOptions}
</div>;
```

### useRef in detail

---

Scenario: how to close the dropdown menu when clicking outside the dropdown?
(Not just the top div part, or the JSX element created by the Dropdown component)

---

useRef allows us to get direct access to a DOM element. If we can get a reference to a top-level element in Dropdown component, then we can differentiate it from the rest of the elements in the `document.body`.

<br />
### Navigation with Route component
Whenever we provide one JSX inside of another JSX tag, the inner element is provided to the outer one as a prop called `children`. The following implementation works but not ideal, as clicking each route would result in completely reloading the index.js file.

```js
return (
  <div>
    <Header />
    <Route path="/">
      <Accordion items={items} />
    </Route>
    <Route path="/list">
      <Search />
    </Route>
  </div>
);
```

Hard reload (or full page reload) causes unnecessary network traffic. A better approach to navigation would be adding another component (called `Link`) that emits a navigation event on click, then using a piece of state that tracks the current pathname and updating the url accordingly.
