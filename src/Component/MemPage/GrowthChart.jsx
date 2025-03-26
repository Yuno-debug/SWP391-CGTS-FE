import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const GrowthChart = ({ chartData }) => {
  return (
    <div className="growth-chart-container">
      <h3>Growth Chart</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis
            dataKey="date"
            tickFormatter={(tick) => {
              // Check if tick is a valid timestamp
              const date = new Date(tick);
              if (isNaN(date.getTime())) {
                // If tick is not a valid timestamp, assume it's a month number
                return `Month ${tick}`;
              }
              return date.toLocaleDateString("vi-VN", { month: "short", year: "2-digit" });
            }}
            tick={{ fontSize: 14 }}
          />
          <YAxis label={{ value: "Value", angle: -90, position: "insideLeft", offset: -5 }} />
          <Tooltip
            labelFormatter={(label) => {
              // Check if label is a valid timestamp
              const date = new Date(label);
              if (isNaN(date.getTime())) {
                // If label is not a valid timestamp, assume it's a month number
                return `Month ${label}`;
              }
              return date.toLocaleDateString("vi-VN", { month: "short", year: "numeric" });
            }}
          />
          <Legend verticalAlign="top" height={36} />
          <Line type="monotone" dataKey="weight" stroke="#8884d8" strokeWidth={2} name="Weight (kg)" dot={{ r: 4 }} />
          <Line type="monotone" dataKey="height" stroke="#82ca9d" strokeWidth={2} name="Height (cm)" dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GrowthChart;