import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

import { gamma } from 'mathjs';
import { Line } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  CategoryScale
} from 'chart.js';

// Registrazione corretta SOLO dei componenti Chart.js
ChartJS.register(
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);


function generateBetaCurve(alpha, beta) {
  const points = [];
  if (
    !isFinite(alpha) || !isFinite(beta) ||
    alpha <= 0 || beta <= 0
  ) {
    return [];
  }

  const B = gamma(alpha) * gamma(beta) / gamma(alpha + beta);
  for (let p = 0.01; p <= 0.99; p += 0.01) {
    const y = Math.pow(p, alpha - 1) * Math.pow(1 - p, beta - 1) / B;
    points.push({ x: p, y });
  }
  return points;
}



function BayesSimulation() {
  const [successi, setSuccessi] = useState('');
  const [fallimenti, setFallimenti] = useState('');
  const [posterior, setPosterior] = useState(null);
  const[prior, setPrior]=useState(0.5);
  const [strength, setStrength] = useState(2);


  const isFormReady =
    !isNaN(parseInt(successi)) && !isNaN(parseInt(fallimenti));
    const s = Math.max(0, parseInt(successi) || 0);
const f = Math.max(0, parseInt(fallimenti) || 0);

    const alpha = 1 + s;
    const beta = 1 + f;
    const result = alpha / (alpha + beta);

  const calcolaBayes = () => {
    
    setPosterior(result.toFixed(3));
  }
  
  const alphaPrior = prior*strength;
  const betaPrior = (1-prior)*strength;

  const priorCurve = generateBetaCurve(alphaPrior, betaPrior);
  const posteriorCurve = generateBetaCurve(alpha, beta);
  
  const chartCurve = {
  datasets: [
    {
      label: 'Prior',
      data: priorCurve,
      borderColor: '#999',
      tension: 0.3,
      fill: false
    },
    {
      label: 'Posterior',
      data: posteriorCurve,
      borderColor: '#4f46e5',
      tension: 0.3,
      fill: false
    }
  ]
};

const chartOptions = {
  responsive: true,
  scales: {
    x: {
      type: 'linear',
      min: 0,
      max: 1,
      title: {
        display: true,
        text: 'p (probabilità)'
      }
    },
    y: {
      title: {
        display: true,
        text: 'Densità'
      }
    }
  },
  plugins: {
    legend: {
      position: 'top'
    },
    tooltip: {
      callbacks: {
        label: ctx => `f(p) = ${ctx.raw.y}`
      }
    }
  }
};
  
  const posteriorValue = parseFloat(posterior) || 0;

  const chartData = [
    { name: 'A Priori', value: prior },
    { name: 'A Posteriori', value: posteriorValue }
  ];



  return (
    <div className="wrapper">
      <div className="box">
        <div className="header">
          <span>Bayes Simulator</span>
        </div>

       <div className="input_box">
 
  <select
    id="prior"
    className="input-field"
    value={prior}
    onChange={(e) => setPrior(parseFloat(e.target.value))}
  >
    <option value={0.1}>0.1</option>
    <option value={0.2}>0.2</option>
    <option value={0.5}>0.5</option>
    <option value={0.8}>0.8</option>
    <option value={0.9}>0.9</option>
  </select>
   <label htmlFor="prior" className="label">Probabilità a priori:</label>
</div>

<div className="input_box">
          <input
            type="number"
            id="strength"
            className="input-field"
            required
            value={strength}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (val >= 0 || e.target.value === '') {
                setStrength(e.target.value);
                       }
                      }}
           />
          <label htmlFor="strength" className="label">Convinzione:</label>
          
        </div>

        <div className="input_box">
          <input
            type="number"
            id="successi"
            className="input-field"
            required
            value={successi}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (val >= 0 || e.target.value === '') {
                setSuccessi(e.target.value);
                       }
                      }}
           />
          <label htmlFor="successi" className="label">Numero successi:</label>
          <i className="bx bx-check-circle icon"></i>
        </div>

        <div className="input_box">
          <input
            type="number"
            id="fallimenti"
            className="input-field"
            required
             value={fallimenti}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (val >= 0 || e.target.value === '') {
                setFallimenti(e.target.value);
                       }
                      }}
          />
          <label htmlFor="fallimenti" className="label">Numero fallimenti:</label>
          <i className="bx bx-x-circle icon"></i>
        </div>

        <div className="input_box">
          <input
            type="button"
            className="input-submit"
            value="Calcola"
            onClick={calcolaBayes}
            disabled={!isFormReady}
          />
        </div>

        {posterior !== null && (
          <>
            <div className="grafico">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 1]} />
                 <RechartsTooltip wrapperStyle={{ backgroundColor: '#fff' }} />

                  <Bar dataKey="value" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </>
        )}

                        
<div className="grafico" style={{ height: '300px', width: '100%' }}>
  <Line data={chartCurve} options={chartOptions} />
</div>

   

      </div>
    </div>
  );
}

export default BayesSimulation;

   