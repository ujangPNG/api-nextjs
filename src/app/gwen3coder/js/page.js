// pages/index.js
import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Plot component to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function GraphingCalculator() {
  const [equations, setEquations] = useState([
    { id: 1, expression: 'x^2', color: '#FF0000' }
  ]);
  const [newEquation, setNewEquation] = useState('');
  const [xRange, setXRange] = useState([-10, 10]);
  const [yRange, setYRange] = useState([-10, 10]);
  const [gridVisible, setGridVisible] = useState(true);
  const [error, setError] = useState('');
  const nextId = useRef(2);

  // Generate data points for all equations
  const generateData = () => {
    return equations.map(eq => {
      const [x, y] = generatePoints(eq.expression);
      return {
        x,
        y,
        type: 'scatter',
        mode: 'lines',
        name: eq.expression,
        line: { color: eq.color },
        hovertemplate: `${eq.expression}<br>(%{x}, %{y})<extra></extra>`
      };
    });
  };

  // Generate x and y points for an equation
  const generatePoints = (expression) => {
    const [xMin, xMax] = xRange;
    const points = [];
    const step = (xMax - xMin) / 500;
    
    for (let x = xMin; x <= xMax; x += step) {
      try {
        // Replace math functions with JS equivalents
        let expr = expression
          .replace(/\^/g, '**')
          .replace(/sin/g, 'Math.sin')
          .replace(/cos/g, 'Math.cos')
          .replace(/tan/g, 'Math.tan')
          .replace(/sqrt/g, 'Math.sqrt')
          .replace(/log/g, 'Math.log10')
          .replace(/ln/g, 'Math.log')
          .replace(/abs/g, 'Math.abs')
          .replace(/pi/g, 'Math.PI')
          .replace(/e/g, 'Math.E');
        
        // Create function and evaluate
        const func = new Function('x', `return ${expr}`);
        const y = func(x);
        
        // Check for valid numbers
        if (isFinite(y)) {
          points.push([x, y]);
        }
      } catch (e) {
        // Skip invalid points
        continue;
      }
    }
    
    return [
      points.map(p => p[0]), // x values
      points.map(p => p[1])  // y values
    ];
  };

  // Add new equation
  const handleAddEquation = () => {
    if (!newEquation.trim()) return;
    
    try {
      // Test the equation
      generatePoints(newEquation);
      
      setEquations([
        ...equations,
        {
          id: nextId.current++,
          expression: newEquation,
          color: getRandomColor()
        }
      ]);
      setNewEquation('');
      setError('');
    } catch (err) {
      setError('Invalid equation: ' + err.message);
    }
  };

  // Remove equation
  const handleRemoveEquation = (id) => {
    setEquations(equations.filter(eq => eq.id !== id));
  };

  // Update equation
  const handleUpdateEquation = (id, newExpression) => {
    setEquations(equations.map(eq => 
      eq.id === id ? { ...eq, expression: newExpression } : eq
    ));
  };

  // Random color generator
  const getRandomColor = () => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFBE0B', '#FB5607',
      '#8338EC', '#3A86FF', '#06D6A0', '#118AB2', '#073B4C'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Reset view
  const resetView = () => {
    setXRange([-10, 10]);
    setYRange([-10, 10]);
  };

  // Zoom in/out
  const zoom = (factor) => {
    const [xMin, xMax] = xRange;
    const [yMin, yMax] = yRange;
    const xCenter = (xMin + xMax) / 2;
    const yCenter = (yMin + yMax) / 2;
    const xRangeNew = (xMax - xMin) * factor;
    const yRangeNew = (yMax - yMin) * factor;
    
    setXRange([xCenter - xRangeNew/2, xCenter + xRangeNew/2]);
    setYRange([yCenter - yRangeNew/2, yCenter + yRangeNew/2]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Desmos-like Graphing Calculator</h1>
          <p className="text-gray-400">Enter equations to visualize mathematical functions</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-1 bg-gray-800 rounded-xl p-6 h-fit">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Add Equation</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newEquation}
                  onChange={(e) => setNewEquation(e.target.value)}
                  placeholder="e.g., x^2, sin(x)"
                  className="flex-1 bg-gray-700 rounded-lg px-4 py-2 text-white"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddEquation()}
                />
                <button
                  onClick={handleAddEquation}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
                >
                  Add
                </button>
              </div>
              {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Equations</h2>
              <div className="space-y-3">
                {equations.map((eq) => (
                  <div key={eq.id} className="flex items-center gap-2 bg-gray-700 p-3 rounded-lg">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: eq.color }}
                    ></div>
                    <input
                      type="text"
                      value={eq.expression}
                      onChange={(e) => handleUpdateEquation(eq.id, e.target.value)}
                      className="flex-1 bg-gray-600 rounded px-2 py-1 text-white"
                    />
                    <button
                      onClick={() => handleRemoveEquation(eq.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">View Controls</h2>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => zoom(0.8)}
                  className="bg-gray-700 hover:bg-gray-600 py-2 rounded-lg transition"
                >
                  Zoom In
                </button>
                <button 
                  onClick={() => zoom(1.2)}
                  className="bg-gray-700 hover:bg-gray-600 py-2 rounded-lg transition"
                >
                  Zoom Out
                </button>
                <button 
                  onClick={resetView}
                  className="bg-gray-700 hover:bg-gray-600 py-2 rounded-lg transition col-span-2"
                >
                  Reset View
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">Show Grid</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={gridVisible}
                  onChange={() => setGridVisible(!gridVisible)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Graph Area */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-xl p-4 h-[600px]">
              {typeof window !== 'undefined' && (
                <Plot
                  data={generateData()}
                  layout={{
                    title: '',
                    paper_bgcolor: 'transparent',
                    plot_bgcolor: 'transparent',
                    font: { color: 'white' },
                    margin: { t: 20, b: 40, l: 50, r: 20 },
                    xaxis: {
                      range: xRange,
                      gridcolor: gridVisible ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                      zerolinecolor: 'rgba(255, 255, 255, 0.3)',
                      showgrid: gridVisible,
                      zeroline: true,
                      showline: true,
                      linecolor: 'rgba(255, 255, 255, 0.3)'
                    },
                    yaxis: {
                      range: yRange,
                      gridcolor: gridVisible ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                      zerolinecolor: 'rgba(255, 255, 255, 0.3)',
                      showgrid: gridVisible,
                      zeroline: true,
                      showline: true,
                      linecolor: 'rgba(255, 255, 255, 0.3)'
                    },
                    showlegend: true,
                    hovermode: 'closest'
                  }}
                  config={{
                    displayModeBar: false,
                    responsive: true
                  }}
                  useResizeHandler={true}
                  style={{ width: '100%', height: '100%' }}
                />
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Supported functions: sin, cos, tan, sqrt, log, ln, abs, pi, e</p>
          <p>Example expressions: x^2, sin(x), sqrt(x+2), 2*x+3</p>
        </div>
      </div>
    </div>
  );
}