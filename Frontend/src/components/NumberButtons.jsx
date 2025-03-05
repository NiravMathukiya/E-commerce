import React, { useState } from "react";

const NumberButtons = () => {
  const numbers = Array.from({ length: 100 }, (_, i) => i + 1);
  const [values, setValues] = useState(numbers); // Initialize with [1,2,3,...,100]
  const [clickCount, setClickCount] = useState(new Array(100).fill(0)); // Track clicks

  const handleClick = (index) => {
    setClickCount((prevCount) => {
      const newCount = [...prevCount];
      newCount[index] += 1; // Increase click count
      return newCount;
    });

    setValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] += clickCount[index] % 2 === 0 ? 1 : -1; // Odd → +1, Even → -1
      return newValues;
    });
  };

  return (
    <div className="grid grid-cols-10 gap-2 p-4">
      {values.map((num, index) => (
        <button
          key={index}
          onClick={() => handleClick(index)}
          className="px-3 py-2 rounded-md text-white bg-blue-500"
        >
          {num}
        </button>
      ))}
    </div>
  );
};

export default NumberButtons;
