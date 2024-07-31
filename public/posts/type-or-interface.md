---
title: "type vs. interface 어떤걸 사용하지?"
tags: "typescript"
date: "2024-07-31 11:23"
---

### 궁금한 이유

타입스크립트에서 타입을 정의하는 방법은 `type`과 `interface` 두 가지가 있다.
왜 두 가지가 필요할까? 그리고 나는 어떻게 정의해야 더 좋을까? 궁금해졌다.

#### 타입스크립트의 `type`

`type`은 새로운 타입을 정의할 때 사용한다. 타입 별칭(Type Alias)이라고도 하는데,
`string`, `number` 같은 `기본타입`과 `복잡한 객체`나 `유니온 타입`을 정의할 수 있다.

```typescript
type Point = {
  x: number;
  y: number;
};

type ID = number | string;
```

위 예시와 같이 `Point`는 `x`, `y` 속성을 가지는 객체를 정의한다.
`ID` 는 `number` 또는 `string` 타입을 가질 수 있는 유니온 타입으로 정의된다.

##### 장점

- 유니온, 교차, 제네릭 타입 등 다양한 타입을 정의할 수 있어 유연하다.
- 복잡한 타입을 간단하게 표현할 수 있다.

#### 타입스크립트의 `interface`

`interface` 는 클래스나 객체의 구조를 정의할 때 사용한다.
이는 클래스가 특정 속성과 메서드를 구현하도록 강제하는 역할을 한다.

```typescript
interface Point {
  x: number;
  y: number;
}

interface Shape {
  color: string;
}

interface Circle extends Shape {
  radius: number;
}
```

위 예시와 같이 `Point`는 `x`, `y` 속성을 가지는 객체를 정의한다.
`Shape` 는 `color` 속성을 가지며, `Circle`은 `Shape`를 상속받아 `radius` 속성을 추가로 정의한다.

##### 장점

- 인터페이스는 다른 인터페이스를 상속받아 확장할 수 있어, 코드 재사용성 및 가독성이 좋다.
- 특정 구조를 구현하도록 강제하여 일관성을 유지할 수 있다.

#### `type` 과 `interface` 의 공통점

##### 일반적인 정의

```typescript
type Point = {
  x: number;
  y: number;
};

interface Point {
  x: number;
  y: number;
}
```

##### 인덱스 시그니처 정의

```typescript
type Dict = { [key: string]: string };
interface Dict {
  [key: string]: string;
}
```

##### 함수 타입 정의

```typescript
type Func = (x: number) => string;
interface Func {
  (x: number): string;
}
```

##### 제네릭 사용

```typescript
type Point<T> = {
  x: T;
  y: T;
};

interface Point {
  x: T;
  y: T;
}
```

##### 확장

```typescript
type PointWithZ = Point & { z: number }; // 교차타입을 통한 흉내

interface PointWithZ extends Point {
  z: number;
}
```

기본적인 정의는 `type` 이나 `interface` 나 다를게 없다.
큰 차이는 보이지 않으나, 확장에서는 `interface` 가 가독성이 좋아보인다.

#### `type` 과 `interface` 의 차이점

##### 유니온

```typescript
type FooOrBar = "foo" | "bar";
```

`interface` 는 유니온 타입을 지원하지 않는다.

```typescript
type Foo = "foo";
type Bar = "bar";
interface FooBar {
  [key: string]: Foo | Bar;
}
```

위와 같은 형태로 정의하는 것은 가능하지만, 우리가 의도한 `'foo' | 'bar'` 만을 얻을 수는 없다.

##### 복잡한 구조

```typescript
type ComplexVariable = (Foo | Bar) & { baz: string };

type Pair = [number, number];
type StringList = string[];
type NamedNumbers = [string, ...number[]];
```

위와 같은 정의는 `type` 으로만 가능하다.
일반적으로 `type`이 더 사용성이 좋아보인다.

위 `Pair` 를 흉내내려면 다음과 같이 `interface` 로 할 수 있다.

```typescript
interface Pair {
  0: number;
  1: number;
  length: 2;
}

const a: Pair = [1, 2]; // ok - type Pair
const b: Pair = [1, 2]; // ok - interface Pair
```

그러나 굳이 이렇게 정의할 필요는 없으며, 일반적으로 `type`을 사용하는 것이 편리하다. 하지만 `interface`만을 사용해야 하는 이유도 존재하는데, 아래에서 설명할 `선언 병합`을 살펴보자.

##### 선언 병합(Declaration Merging)

```typescript
interface State {
  foo: string;
  bar: string;
}

interface State {
  baz: number;
}

const state: State = {
  foo: "foo",
  bar: "bar",
  baz: 1123,
}; // ok
```

위 예와 같이 속성을 확장하는 방법을 `선언 병합`이라고 한다.
이는 버전 관리가 되는 라이브러리에서 `타입이 호환성을 맞추거나 확장`하기 위해 사용된다.

##### 선언 병합 사례

React 의 기본 타입 정의

```typescript
// @types/react/index.d.ts
declare namespace React {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // 기본 속성들
    className?: string;
    id?: string;
    // 기타 여러 속성들
  }
}
```

사용자 정의 속성 추가

```typescript
// custom-react-types.d.ts
import "react";

declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    "data-test-id"?: string;
  }
}
```

사용자 정의 속성 사용

```typescript
// App.tsx
import React from "react";

const App: React.FC = () => {
  return (
    <div data-test-id="main-container">
      <h1 data-test-id="header">Hello, world!</h1>
    </div>
  );
};

export default App;
```

먼저 `React` 에 해당 `interface` 가 정의된다.
`declare module "react" { }`를 통해서 `react`를 확장한다
동일한 `interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T>` `interface` 를 선언병합하여 `data-test-id`의 속성을 추가한다.
이로써 `data-test-id`를 사용할 수 있게 된다.

##### 마치며

설정 자체가 복잡하고 조건이 다양하다면 `type` 을 사용해서 효율적으로 설정하는 것이 좋다.
개인적으로도 `type` 으로 일관되게 코드를 작성하는 것이 좋을 것 같다.

참고 문헌인 `Effective Typescript` 에서는
"두 가지 방법으로 모두 표현할 수 있는 간단한 객체 타입이라면 일관성과 보강의 관점에서 고려해 봐야 한다."라고 말하고 있다.

"일관되게 `interface` 로 작업되고 있는 코드베이스라면 당연히 `interface` 를 따라야하고, 아직 스타일이 확립되지 않았다면, 향후에 보강의 가능성이 있을지 생각해야한다."고 덧붙인다.

또한 `프로젝트 내부적으로 사용되는 타입에 선언 병합이 발생하는 것은 잘못된 설계입니다. 따라서 이럴 때는 타입을 사용해야 합니다.` 라고 경고한다.

결론적으로, 일반적인 경우에는 `type` 을 사용하는 것이 좋으며, 외부의 확장성을 제공해야 하는 라이브러리를 작업하는 상황에서는 해당 부분에 대해서만 `interface` 를 제공하는 것이 좋다 생각한다.

일반 프로젝트라면 사용성이 좋은 `type` 쓰자.

### Ref

[Effective Typescript 2장, 6장](https://effectivetypescript.com/)  
[Typescript Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html)
