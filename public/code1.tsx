import * as React from 'react';

const Button = () => {
  const [counter, setCounter] = React.useState<number>(0);

  const increase = () => setCounter((prev) => prev + 1);

  return <button onClick={increase}>{counter}</button>;
};

const user = {
  name: 'Lorem',
  age: 26,
};

console.log(user);
//           ^?
