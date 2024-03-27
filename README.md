# Dojo

cloud POS for your stores bootstrapped with [T3 Stack](https://create.t3.gg/)

This app is to be used as a typical point of sales (POS) software

### Which tech stack

[T3 Stack](https://create.t3.gg/) with Drizzle, Tailwind, NextAuth, ShadcnUI

### With whoom?

- all by myself, from design to development

### how long?

design took 2 months, development ~ 2 months

### goal

It will be considered sucessful if acquaintance's sandwich shop (that does not use a POS) uses this software to manage rush-hour orders

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
Moving off of PlanetScale -> Turso
</summary>

With announcement of PlanetScale to sunset free tier on April 4th, I had to look for another provider that had free tier DB.

</details>

<details>
<summary>
Moving off of PlanetScale -> Turso
</summary>

With announcement of PlanetScale to sunset free tier on April 4th, I had to look for another provider that had free tier DB.

</details>

<details>
<summary>
Implementing 2 row staggered wrap-around scroll (WIP)
</summary>

### I have a list of orders that kitchen needs to see.

**First**, I wanted to have a desktop view that would be 2 rows, staggered wrap-around scroll, where element leaves from top row right side and enters from bottom left side.

I tried searching for a way to do it with just CSS, but there were only simple 2 row scrollable flexbox that would have top and bottom rows locked together.

As far as I can find, there is no good way to have one flexbox/grid with 2 rows to have a overflowing on the top left side and have overflow on bottom right side.

So 2 separate flexboxes it is.

**Second?** was how to append paginated/new orders to start and end of items, without scroll position change and weird flickers

https://github.com/bvaughn/react-virtualized/blob/HEAD/docs/creatingAnInfiniteLoadingList.md

react virtualized? fibre?

**Thrid?** sync top and bottom scroll to have desired staggered scroll effect.

useRef? intersection observer?

TODO: will comeback to it to actually implement.

</details>

<details>
<summary>
Trying to enforce collapsible behavior only on mobile with CSS
</summary>

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

As I was looking into it, there was not a good way to infer width from CSS(tailwind) and to trigger state modification, and realised that I had to take control of it to modify the state in the first place anyways.

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
