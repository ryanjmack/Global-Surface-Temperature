

// constants
import { dataset } from './data.js';
const averageCelsius = 13.9;
const averageFahrenheit = 57;
const convertCelsius = (celsius) => Math.round((celsius * 1.8) * 100) / 100;  // converts C to F rounding to nearest hundreth
const endYear = 2018;
const height = 500;
const legendPadding = 60;
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'June', 'July', 'September', 'October', 'November', 'December'];
const startYear = 1880;
const width = 1300;
const xAxisPadding = 150;
const yAxisPadding = 75;

// create the svg element
const svg = d3.select('main')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .attr('overflow', 'visible');

// Scales
// x axis is the year
const xScale = d3.scaleLinear()
  .domain([startYear, endYear])
  .range([yAxisPadding, width]);

// y axis is the month
const yScale = d3.scaleLinear()
  .domain([12, 1]) // the months
  .range([height - xAxisPadding, 0]);


// find min and max variance in the dataset
const maxVariance = dataset.reduce((a, b) => a = (a < b.variance) ? b.variance : a, -Infinity);
const minVariance = dataset.reduce((a, b) => a = (a > b.variance) ? b.variance : a, Infinity);

// colors used in the graph
const colors = ['#0D095B', '#3249AB', '#127FC0', '#03CFD7', '#01C000', '#01C000', '#F8EF1C', '#FEBB11', '#F26322', '#FE0100'];
// minVariance + (colorStep * i) will give us color index
const colorStep = (maxVariance + Math.abs(minVariance)) / colors.length;

// called when populating the graph with data
const getColor = (variance) => {
  let i = 0;
  while (((i + 1) * colorStep) + minVariance < variance) {
    i++;
  }
  return colors[i];
};


// used for the bars in the visualization.
const barHeight = (((height - xAxisPadding) / months.length) + 2); // 12 vertical bars (months); space closer together by adding 2
const barWidth = (width / (endYear - startYear)) - 1; // 2018 - 1880 = 138 bars horizontally (years); add spacing by subtracting 1

// populate the svg with data
svg.selectAll('rect')
  .data(dataset)
  .enter()
  .append('rect')
  .attr('x', data => xScale(data.year))
  .attr('y', data => yScale(data.month))
  .attr('width', barWidth)
  .attr('height', barHeight)
  .attr('fill', data => getColor(data.variance))
  .append('title')
  .text(data => `${months[data.month - 1]}, ${data.year}\nVariance: ${data.variance}°C / ${convertCelsius(data.variance)}°F`);
