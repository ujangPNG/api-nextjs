// pages/index.js
import Head from 'next/head';
import { useState } from 'react';
import Graph from '../components/Graph';
import FunctionInput from '../components/FunctionInput';

// Import mathjs for expression parsing
import 'mathjs';

// Polyfill global `math` for browser
if (typeof window !== 'undefined' && !window.math) {
  window.math = require('mathjs');
}

export default function Home() {
  const [expressions, setExpressions] = useState(['x^2', 'sin(x)', 'x']);

  const addExpression = (expr) => {
    setExpressions((prev) => [...prev, expr]);
  };

  const removeExpression = (index) => {
    setExpressions((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <Head>
        <title>Graphing Calculator | Like Desmos</title>
        <meta name="description" content="A Desmos-like graphing calculator built with Next.js and Plotly" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <header className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">📊 Graphing Calculator</h1>
            <p className="text-gray-600 mt-2">Enter functions to plot – supports <code className="bg-gray-200 px-1 rounded">x^2</code>, <code>sin(x)</code>, <code>sqrt(x)</code>, etc.</p>
          </header>

          <FunctionInput onAddExpression={addExpression} />

          {/* Expression List */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Functions:</h2>
            <ul className="space-y-1">
              {expressions.map((expr, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="font-mono bg-gray-200 px-2 py-1 rounded text-sm">{expr}</span>
                  <button
                    onClick={() => removeExpression(i)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Graph */}
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <Graph expressions={expressions} />
          </div>

          {/* Instructions */}
          <footer className="mt-8 text-center text-sm text-gray-500">
            <p>Uses <strong>math.js</strong> for parsing and <strong>Plotly.js</strong> for rendering.</p>
            <p>Try: <code>cos(x)</code>, <code>abs(x)</code>, <code>log(x)</code>, <code>x^3 - 3*x</code></p>
          </footer>
        </div>
      </div>
    </>
  );
}