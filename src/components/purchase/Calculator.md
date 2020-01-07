```js
import { CalculatorProvider } from "./CalculatorContext";

const onSubmit = ({ type, value }) =>
  alert(`Submit "${type}" with value "${value}"`);

<CalculatorProvider>
  <Calculator onSubmit={onSubmit} />
</CalculatorProvider>;
```
