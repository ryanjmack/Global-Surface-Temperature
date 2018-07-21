

// constants
import { dataset } from './data.js';
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


// populate the svg with data
svg.selectAll('rect')
  .data(dataset)
  .enter()
  .append('rect')
  .attr('x', data => xScale(data.year))
  .attr('y', data => yScale(data.month))
  .attr('width', (width - yAxisPadding) / (endYear - startYear))
  .attr('height', (height - xAxisPadding) / months.length)
  .attr('fill', 'salmon');
