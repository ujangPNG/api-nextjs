// components/Graph.js
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js').then((mod) => mod.Plot), {
  ssr: false,
});

export default function Graph({ expressions }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const x = Array.from({ length: 1000 }, (_, i) => (i / 1000) * 20 - 10); // from -10 to 10
    const traces = expressions
      .filter((expr) => expr.trim() !== '')
      .map((expr, index) => {
        let y;
        try {
          y = x.map((xi) => evaluateExpression(expr, xi));
        } catch (err) {
          y = Array(x.length).fill(NaN);
        }

        return {
          x,
          y,
          type: 'scatter',
          mode: 'lines',
          name: expr,
          line: { color: getColor(index), width: 3 },
          hovertemplate: `x: %{x:.3f}<br>y: %{y:.3f}<extra></extra>`,
        };
      });

    setData(traces);
  }, [expressions]);

  return (
    <div style={{ width: '100%', height: '70vh' }}>
      <Plot
        data={data}
        layout={{
          title: 'Graphing Calculator',
          xaxis: {
            title: 'x',
            zeroline: true,
            zerolinewidth: 2,
            zerolinecolor: '#ccc',
            range: [-10, 10],
            showgrid: true,
            gridcolor: '#eee',
          },
          yaxis: {
            title: 'y',
            zeroline: true,
            zerolinewidth: 2,
            zerolinecolor: '#ccc',
            range: [-10, 10],
            showgrid: true,
            gridcolor: '#eee',
          },
          margin: { l: 50, r: 20, t: 50, b: 50 },
          paper_bgcolor: '#f9f9f9',
          plot_bgcolor: '#fff',
          hovermode: 'closest',
        }}
        config={{
          displayModeBar: true,
          responsive: true,
          displaylogo: false,
          modeBarButtonsToRemove: ['select2d', 'lasso2d'],
        }}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler
      />
    </div>
  );
}

// Simple evaluator using math.js
function evaluateExpression(expr, x) {
  try {
    return math.evaluate(expr.replace(/x/g, `(${x})`), { x });
  } catch (err) {
    return NaN;
  }
}

// Color cycle for multiple functions
function getColor(index) {
  const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f'];
  return colors[index % colors.length];
}