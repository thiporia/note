---
title: "React 내 외부 변수와 useMemo에 대한 고민"
tags: "React, useMemo, 메모리"
date: "2024-07-12 01:13"
---

### 궁금한 이유

React 컴포넌트 내에 의존성이 없는 상수 값에 대해서는 보통 외부 변수로 선언해왔다.  
다만, 이 경우 메모리를 계속 점유하는 문제가 있는데 정확히 어떤 영향이 있는 걸까? 궁금해졌다.

#### 1. 컴포넌트 외부 변수 선언

##### 기본 개념 및 사용 사례

컴포넌트 외부에 선언된 변수는 모듈 스코프에 존재하며, 해당 모듈이 처음 로드될 때 한 번만 초기화된다.

```javascript
const ITEMS_PER_PAGE = 20;
const API_BASE_URL = "https://api.example.com";

function PaginatedList() {
  // 컴포넌트 로직
}
```

이러한 방식은 다음과 같은 경우에 특히 유용.

1. 설정 값이나 상수 (내 경우)
2. 유틸리티 함수 (내 경우)
3. 전역적으로 사용되는 데이터 구조

##### 복잡한 초기화 로직

때로는 복잡한 초기화 로직이 필요한 경우가 있다.
이런 경우 즉시 실행 함수(IIFE)를 사용할 수 있다.

```javascript
// 불변이라면 너무 좋다.
const complexData = (() => {
  const result = {};
  for (let i = 0; i < 1000; i++) {
    result[`key${i}`] = Math.random();
  }
  return result;
})();

function DataVisualizer() {
  // complexData를 사용하여 데이터 시각화
}
```

장점:

- 앱 시작 시 한 번만 실행되므로, 렌더링 성능에 영향을 주지 않는다.
- 모든 컴포넌트 인스턴스에서 공유되므로 메모리 사용이 효율적이다. (내가 생각한 장점)

단점:

- 앱의 초기 로드 시간이 길어질 수 있다.
- 동적으로 변경되어야 하는 데이터에는 적합하지 않다.

##### 메모리 관리와 가비지 컬렉션

외부 변수는 모듈의 생명주기와 연결되어 있어, 일반적으로 앱이 실행되는 동안 메모리에 계속 존재.

장점:

- 자주 사용되는 데이터의 경우, 반복적인 재생성을 피할 수 있다.

단점:

- 큰 데이터 구조를 저장할 경우, 앱의 전체 수명 동안 메모리를 차지한다.

```javascript
// 잠재적인 메모리 누수의 원인이 될 수 있다
const hugeArray = new Array(1000000).fill("🐘");

function HugeDataComponent() {
  return <div>{hugeArray.length} items in memory</div>;
}
```

이 경우, `hugeArray`는 앱이 실행되는 동안 계속 메모리를 차지하고, 컴포넌트가 언마운트되어도 해제되지 않는다.

##### React의 Fiber 아키텍처와의 상호작용

React의 Fiber 아키텍처는 렌더링 작업을 작은 단위로 분할하고 우선순위를 지정.
외부 변수는 이 프로세스에 직접적인 영향을 받지 않는다. (완전 별도의 프로세스)

```javascript
const heavyCalculation = (() => {
  let result = 0;
  for (let i = 0; i < 1000000000; i++) {
    result += i;
  }
  return result;
})();

function HeavyComponent() {
  return <div>Result: {heavyCalculation}</div>;
}
```

이 경우, `heavyCalculation`은 모듈 로드 시 한 번만 실행되므로, React의 렌더링 프로세스 중에는 성능에 영향을 주지 않는다.
하지만 초기 로드 시간은 길어질 수 있다.

#### 2. 컴포넌트 내부 `useMemo` 사용

##### 기본 개념 및 사용 사례

`useMemo`는 계산 비용이 높은 연산의 결과를 메모이제이션하는 데 사용.
이는 불필요한 재계산을 방지하여 성능을 최적화.

```javascript
function ExpensiveComponent({ data }) {
  const processedData = useMemo(() => {
    return data.map((item) => expensive_calculation(item));
  }, [data]);

  return <div>{/* processedData를 사용하여 렌더링 */}</div>;
}
```

이 방식은 다음과 같은 경우에 특히 유용:

1. props나 state에 기반한 복잡한 계산 (일반적인 사용)
2. 렌더링 최적화가 필요한 경우
3. 부모 컴포넌트의 불필요한 리렌더링으로부터 보호가 필요한 경우

##### 메모리 관리와 가비지 컬렉션

`useMemo`로 생성된 값은 컴포넌트 인스턴스의 생명주기와 연결되어 있다. (mount / unmount)

```javascript
function MemoryEfficientComponent({ hugeProp }) {
  const processedData = useMemo(() => {
    return hugeProp.map((item) => expensiveProcess(item));
  }, [hugeProp]);

  return <div>{/* processedData 사용 */}</div>;
}
```

이 경우:

- `processedData`는 컴포넌트가 마운트될 때 생성되고, 언마운트될 때 가비지 컬렉션의 대상.
- `hugeProp`이 변경되지 않는 한, 재렌더링 시에도 `processedData`는 재계산되지 않는다.

##### 주의사항: 과도한 `useMemo` 사용

`useMemo`를 과도하게 사용하면 오히려 성능 저하를 일으킬 수 있다.
이 부분이 내가 가장 우려했던 부분인데, 우리는 큰 의미를 두지않고, useMemo 를 도배하는 경우가 종종 있다.

```javascript
function OverOptimizedComponent({ data }) {
  // 대부분의 경우 불필요한 최적화
  const item = useMemo(
    () => ({ id: data.id, name: data.name }),
    [data.id, data.name]
  );

  return <div>{item.name}</div>;
}
```

이 경우, 메모이제이션 자체의 오버헤드가 간단한 객체 생성 비용보다 크다.

#### 3. 실제 성능 비교 및 최적화 전략

##### 대규모 리스트 렌더링 최적화

대규모 리스트를 렌더링할 때, 아이템의 불필요한 리렌더링을 방지하는 것이 중요.

```javascript
const LargeList = React.memo(function LargeList({ items }) {
  console.log("LargeList render");
  return (
    <ul>
      {items.map((item) => (
        <ListItem key={item.id} item={item} />
      ))}
    </ul>
  );
});

const ListItem = React.memo(function ListItem({ item }) {
  console.log("ListItem render:", item.id);
  return <li>{item.name}</li>;
});

function App() {
  const [items, setItems] = useState(() =>
    Array.from({ length: 10000 }, (_, i) => ({ id: i, name: `Item ${i}` }))
  );
  const [count, setCount] = useState(0);

  const memoizedItems = useMemo(() => items, [items]);

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>
      <LargeList items={memoizedItems} />
    </div>
  );
}
```

이 예제에서:

1. `LargeList`와 `ListItem`은 `React.memo`로 감싸져 있어, props가 변경되지 않으면 리렌더링되지 않음.
2. `items` 상태는 `useMemo`를 통해 메모이제이션. 이로 인해 `App` 컴포넌트가 리렌더링되어도 (예: `count` 상태가 변경될 때) `LargeList`의 props는 변경되지 않아 리렌더링을 방지할 수 있다.

##### 성능 측정

React DevTools의 Profiler를 사용하여 이러한 최적화의 효과를 측정할 수 있다.
특히 "Record why each component rendered while profiling" 옵션을 활성화하면 각 컴포넌트가 왜 리렌더링되었는지 확인할 수 있다.

#### 4. 서버 사이드 렌더링 (SSR) 고려사항

SSR 환경에서는 변수 선언 방식에 따라 다른 결과를 얻을 수 있다.

##### 외부 변수 사용 시

```javascript
let visitorCount = 0;

function VisitorCounter() {
  visitorCount++;
  return <div>방문자 수: {visitorCount}</div>;
}
```

SSR 환경에서 이 컴포넌트를 사용하면:

- 모든 요청에 대해 `visitorCount`가 공유 됨. (전역변수처럼 사용하는 경우)
- 동시에 여러 요청을 처리할 경우, 레이스 컨디션이 발생할 수 있다.

##### `useMemo` 사용 시

```javascript
function VisitorCounter() {
  const visitorCount = useMemo(() => {
    // 서버에서 현재 방문자 수를 가져오는 로직
    return fetchCurrentVisitorCount();
  }, []);

  return <div>방문자 수: {visitorCount}</div>;
}
```

이 경우:

- 각 요청마다 독립적으로 `visitorCount`가 계산 됨.
- 서버의 상태를 정확히 반영할 수 있다. (일반적으로 우리가 사용하는 경우)

### 결론

변수 선언 위치와 메모이제이션 전략의 선택은 애플리케이션의 특성, 데이터의 성질, 그리고 컴포넌트의 라이프사이클을 고려하여 신중하게 결정해야 한다.

- 기존처럼 외부 변수는 `정적`이고 `전역`적인 데이터, `설정값`, `유틸리티 함수` 등에 적합.
- `useMemo`는 컴포넌트 내부의 복잡한 계산, 렌더링 최적화, 그리고 동적으로 변하는 데이터에 적합.

실제 애플리케이션에서는 이 두 가지 방식을 적절히 조합하여 사용하는 것이 일반적이다.
성능 최적화는 항상 측정 가능한 문제에 기반하여 이루어져야 하며, 과도한 최적화는 오히려 코드의 복잡성을 증가시키고 유지보수를 어렵게 만들 수 있음을 명심해야 한다.

### Ref

[useMemo](https://react.dev/reference/react/useMemo)  
[memo](https://react.dev/reference/react/memo)  
[skipping re-rendering](https://react.dev/reference/react/memo#skipping-re-rendering-when-props-are-unchanged)  
[Before You memo() - Dan Abramov](https://overreacted.io/before-you-memo/)  
[When to useMemo and useCallback - Kent C. Dodds](https://kentcdodds.com/blog/usememo-and-usecallback)  
[React Fiber](https://github.com/acdlite/react-fiber-architecture)  
[mdn - Memory management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)  
[A Complete Guide to React Rendering Behavior](https://blog.isquaredsoftware.com/2020/05/blogged-answers-a-mostly-complete-guide-to-react-rendering-behavior/)
