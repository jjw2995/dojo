# Dojo

cloud POS for your stores bootstrapped with [T3 Stack](https://create.t3.gg/)

## MVP scope

<!--
<details>
<summary></summary>
</details> -->

### Store

- [x] create store

### Items

- [x] CRD category
- [] U category

- [ ] CRUD item (CRD)

- [ ] tax

  - [] CRUD tax (CRD)
  - [x] assign taxes

- [ ] option

  - [ ] CRUD option
  - [ ] assign options

### Order

- [x] OrderView component

  - [x] responsive layout
    - [x] category-item listView
    - [x] orderListView
    - [] actionButtonView
      - [x] view
      - [] button functional (30%)
  - [x] createOrder

- [ ] togo

  - [x] orderListView
  - [ ] order edit, add items or delete

- [ ] table
- [ ] online

### Kitchen

- [x] create stations
- [x] delete stations
- [ ] show orders
- [ ] show orders realtime (websocket ably)

### Security

- [ ] togo/retail order taking
- [ ] passcode set/reset (owner email)
- [ ] owner transfer

## Potential addons

- [ ] "Eats" integration
- [ ] printer integration
- [ ] work hour logger

## Tech log

<details>
<summary>

### Trying to enforce collapsible behavior only on mobile with only CSS</summary>

To have action buttons collapsible only on mobile, I wanted to know if it could be only be CSS.

I wanted to avoid control of the RadixUI's "Collapsible" if possible and not rely so much on JS.

Part of it was to hide the Collapsible.Trigger.

```jsx
function ActionButtons() {
  return (
    <Collapsible.Root>
      <Collapsible.Content>...buttons</Collapsible.Content>
      <Collapsible.Trigger className="lg:hidden">
        <ChevronDown />
      </Collapsible.Trigger>
    </Collapsible.Root>
  );
}
```

With visual side done, I wanted to see if it's possible to avoid taking over control of open state.

As I was looking into it, there was not a good way to infer width from CSS(tailwind) and to modify state, and realised that I had to take control of it to modify the state in the first place anyways.

In the end, I took the L, implemented useIsScreenLg hook, and taken control of open state of Collapsible

```jsx
export default function useIsScreenLg() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return width >= 1024;
}
```

```jsx
function ActionButtons() {
  const isScreenLg = useIsScreenLg();
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    if (isScreenLg) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isScreenLg]);

  return (
    <Collapsible.Root open={isOpen}>
      <Collapsible.Content>...buttons</Collapsible.Content>
      <Collapsible.Trigger
        className="lg:hidden"
        disabled={isScreenLg}
        onClick={() => {
          setOpen((r) => !r);
        }}
      >
        <ChevronDown />
      </Collapsible.Trigger>
    </Collapsible.Root>
  );
}
```

</details>

<!--
<details>
<summary></summary>
</details> -->

<!-- \*\*\* REMOVE CATEGORY base "NOTHING" layout page to simple static page (no need) -->
