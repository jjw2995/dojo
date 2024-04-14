#### Table of Contents

- [MVP Scope](#mvp-scope)
- [Tech Log](#tech-log)

# Dojo

cloud POS for your stores bootstrapped with [T3 Stack](https://create.t3.gg/) with Drizzle, Tailwind, NextAuth, ShadcnUI.

#### Problem Statement

Sandwich shop of an acquaintance does not use a POS and at rush hour, they would have hard time keeping track of what orders came in. Using free services, I figured building POS was a good practice building moderately complex UI and (maybe) utilize websocket(Ably) for realtime communication. And with real user.

#### With whoom?

all by myself, from design to development

#### how long?

design took 2 months, development ~ 2 months

#### goal

It will be considered sucessful if acquaintance's sandwich shop (that does not use a POS) uses this software to manage rush-hour orders

## MVP scope

#### Store

- [x] create store

#### Items

This page is where user would register items in their menu. Allow CRUD of items, assign taxes and options.

- [ ] CRUD category (CRD)

  - [x] create category
  - [x] category-item list view
  - [ ] update category name
  - [ ] delete

- [x] CRUD item

  - [x] create item
  - [x] read item detail
  - [x] update item
  - [x] delete item

- [ ] CRUD tax (CRD)

  - [x] create tax
  - [x] read tax
  - [ ] update tax name & percent
  - [x] delete tax

- [x] Assign taxes

- [ ] option
  - [ ] CRUD option (CR)

I used CSS bottom:0 with the fixed position property which pushes the element to the footer and fixes it so when the keyboard is raised it pushes it upwards automatically.

#### Order

This page is where hall would use to input orders and receive payments.

- [x] OrderView component

  - [x] responsive layout
    - [x] category-item listView
    - [x] orderListView
    - [] actionButtonView
      - [x] view
      - [] button functional (30%)
  - [x] createOrder

- [x] orderListView
- [x] order edit, add items or delete
- [ ] view saved orders
- [ ] edit saved orders

- [ ] togo
- [ ] table
- [ ] online

#### Cook

This page is for the kitchen stations. Selecting a station will only show items relevent to it.

- [x] create stations
- [x] delete stations
- [ ] show orders
  - [x] filter by station
  - [ ]
- [ ] show orders realtime (websocket ably, SSE? pubsub?)
  - [ ] realtime new order append
  - [ ] (maybe?) realtime station_specific isDone update

#### Security

- [ ] togo/retail order taking
- [ ] passcode set/reset (owner email)
- [ ] owner transfer

## "Future" addons

- [ ] "Eats" integration
- [ ] printer integration
- [ ] work hour logger

## Tech log

- deciding how to do option modal in orderView
  conditional branching, always render conditional

<details>
<summary>
</summary>

TODO: talk about option schema (multiple item ref OR single) & start small with multi selectable.

boolean
select one (1~many, toggle only one)
select

number of togglable
toggle at least...
toggle at most...

4 selectable, toggle 0~1

Initially, I was trying to build the most complete modifier, but decided against it and reined back a little.

I decided to first build "multi choice toggle". With [# of choices, min choices, max choices], I can effectively cover single choice on/off, multi-choice choose none ~ all.

With # of choices, a choice name & choice cost

Options with counters, more akin to drink category will be implemented later with

I thought about allowing items point to same modifiers, but it would be messy in cases where the

It is better to keep modifiers separate, but allow user to copy & edit from other item modifiers.

creating options was easy but to modify them at Order, it will require cursor fn changes

</details>

<details>
<summary>
Is it react-hook-form or is it just me? potential gotchas
</summary>

<br/>
TLDR;

1. `watch("numberField",{default:0})` does not return a number (returns string for some reason)
2. If you use useFieldArray with useForm (and have defined formType), define your fieldArrayType within the formType and align the name (...doc does show this I just missed it).

## 1 `toFixed` is not a function of "Number" type

```js
type OptionInput = {
  numChoices: number;
};

const form = useForm<OptionInput>();
const numChoices = form.watch("numChoices", 0);

//          vvv Error "cannot find toFixed prop"
numChoices.toFixed(0)
```

According to docs and TS LSP, `numChoices.toFixed(0)` shouldn't have any problem as it returns Number and default value of 0 otherwise.

But when I call it, throws an error `numChoices.toFixed is not a function`, meaning that it did not return a type Number.

<br/>

In reality, it is returning a string as below works as expected.

```jsx
Number(numChoices).toFixed(0);
```

I am guessing that RHF is using JSDOC to interface with the app developers and mistake is made somewhere in the chain. I'll report this at later time.

<br/>
<br/>

## 2 Define array field in original useForm hook

I was trying to have a form with meta information and an array of fields.

For example, I wanted to represent a modifer as below with multiple options that could be toggled.

```js
type OptionInput = {
  someMetaInfo: string;
  options: { name: string; price: number }[];
};
```

I searched for RHF way to do array of inputs and landed on [`useFieldArray()` method](https://react-hook-form.com/docs/usefieldarray).

Following the doc, I came to code below midway.

```jsx
type OptionInput = {
  someMetaInfo: string;
};
function OptionCreate() {
  const form = useForm<OptionInput>();
                                   // vvv Error
  const options = useFieldArray({ name: "options", control: form.control });

  return <></>
}
```

where "name" field errors with the following `Type 'string' is not assignable to type 'never'.` I was confused and read the doc again but I was just following along.

Maybe... I need to define the array in formType and useFieldArray needs to refer to it correctly.

```jsx
type OptionInput = {
  someMetaInfo: string;
  options: { name: string; price: number }[];
};
function OptionCreate() {
  const form = useForm<OptionInput>();
  const options = useFieldArray({ name: "options", control: form.control });

  return <></>
}
```

And no error.

### edit

RHF does show how to use useFieldArray in TS, I just didn't notice the TS toggle till now. Number issue on form.watch is still valid though.

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

<br/>

<details>
<summary>
Moving off PlanetScale -> Turso
</summary>

With announcement of PlanetScale to sunset free tier on April 4th, I had to look for another provider that had free tier DB.

</details>

<br/>

<details>
<summary>
Implementing 2 row staggered wrap-around scroll..? (WIP)
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

<br/>

<details>
<summary>
realtime order updates SSE? pubsub? (WIP)
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

<br/>

<!--
<details>
<summary></summary>
</details> -->

<!-- \*\*\* REMOVE CATEGORY base "NOTHING" layout page to simple static page (no need) -->
