import React, {useRef, useState, useEffect} from 'react'
import {Chart} from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ChartDataLabels);

const presetColors = [
  '#FF6384', 
  '#36A2EB', 
  '#FFCE56', 
  '#4BC0C0', 
  '#9966FF', 
  '#FF9F40', 
  '#66BB6A', 
  '#D32F2F', 
  '#FFA726', 
  '#7E57C2' 
];

const ChartWheel = ({names, onPick, setSpinning}) => {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        if(!canvasRef.current) return;

        if(chartRef.current){
            chartRef.current.destroy();
        }
//empty wheel display
    const wheelLabels = names.length > 0 ? names : ["Enter Names"];
    const data = new Array(wheelLabels.length).fill(1);
    const colors =  names.length > 0 ? names.map((_, index) => presetColors[index % presetColors.length]) : ['#ca92ca'];
//Chart.js part
    chartRef.current = new Chart(canvasRef.current, {
            type: "pie",
            data: {
                labels: wheelLabels,
               datasets: [
  {
    data: data,
    backgroundColor: colors,
    //dont remove this, there's a built in hover effect
    hoverBackgroundColor: colors, 
    hoverOffset: 0                
  }
]
                
            },
            options: {
                responsive: true,
                 maintainAspectRatio: false,
                plugins: {
                    legend: {display: false},
                    tooltip: {enabled: false},
                    datalabels: {
                        color: "#fff",
                        font: {weight: "bold", size: 14},
                        formatter:(_, ctx) => ctx.chart.data.labels[ctx.dataIndex],

                    }
                },
                rotation: 0,
                animation: {duration: 0},
            },
            plugins: [ChartDataLabels],
        })
    }, [names])

const spin = () => {
  if (!chartRef.current || names.length === 0) return;

  setSpinning(true);
//this calculates where wheel should land
  const sliceAngle = 360 / names.length;
  const randomIndex = Math.floor(Math.random() * names.length);
 //extraOffset so it lands in the middle of the slice
  const extraOffset = sliceAngle / 2;
  const finalAngle = 360 * 10 + (360 - randomIndex * sliceAngle - extraOffset); 
//spin time in ms
  const duration = 6000; 
  const startTime = performance.now();
//deceleration
  const easeOutQuint = (t) => 1 - Math.pow(1 - t, 6); 

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutQuint(progress);
    const currentAngle = finalAngle * easedProgress;

    chartRef.current.options.rotation = currentAngle;
    chartRef.current.update();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      onPick(names[randomIndex]);
    }
  };

  requestAnimationFrame(animate);
};
return (
  <div>
    <div
      className="wheel-wrapper"
      style={{
        width: "400px",
        height: "400px",
        position: "relative",
        overflow: "hidden",
      }}
    >
        <div className="wheel-indicator" />
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      ></canvas>

      <button
  onClick={spin}
  className="spin-button"
  disabled={names.length === 0}
>
  SPIN
</button>
    </div>
  </div>
);
}

export default ChartWheel