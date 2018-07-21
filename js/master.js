

// constants
import { dataset } from './data.js';
const averageCelsius = 13.9;
const averageFahrenheit = 57;
const convertCelsius = (celsius) => Math.round((celsius * 1.8) * 100) / 100;  // converts C to F rounding to nearest hundreth
const endYear = 2018;
const height = 500;
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'June', 'July', 'September', 'October', 'November', 'December'];
const startYear = 1880;
const width = 1300;
const xAxisPadding = 100;
const yAxisPadding = 75;

// create the svg element
const svg = d3.select('main')
  .append('svg')
  .attr('width', width)
  .attr('height', height);


// Scales
// x axis is the year
const xScale = d3.scaleLinear()
  .domain([startYear, endYear])
  .range([yAxisPadding, width]);

// y axis is the month
const yScale = d3.scaleLinear()
  .domain([12, 1]) // the months
  .range([height - xAxisPadding, 0]);


// used for the bars in the visualization.
const barHeight = (height - xAxisPadding) / (months.length + 1); // 12 vertical bars (months)
const barWidth = (width - yAxisPadding) / (endYear - startYear); // 2018 - 1880 = 138 bars horizontally (years)

// populate the svg with data
svg.selectAll('rect')
  .data(dataset)
  .enter()
  .append('rect')
  .attr('x', data => xScale(data.year))
  .attr('y', data => yScale(data.month))
  .attr('width', barWidth)
  .attr('height', barHeight)
  .attr('fill', 'salmon')
  .append('title')
  .text(data => `${months[data.month - 1]}, ${data.year}\nVariance: ${data.variance}°C / ${convertCelsius(data.variance)}°F`);
