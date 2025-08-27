// components/FunctionInput.js
import { useState } from 'react';

export default function FunctionInput({ onAddExpression }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onAddExpression(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <div className="relative flex-grow">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none">
          f(x) =
        </span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., x^2 or sin(x)"
          className="w-full pl-14 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          aria-label="Math expression"
        />
      </div>
      <button
        type="submit"
        className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
      >
        Plot
      </button>
    </form>
  );
}