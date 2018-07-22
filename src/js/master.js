/************************************************************************
File that utilizes the library d3.js visualize some data
************************************************************************/
// constants
import { dataset } from './data.js';
const averageCelsius = 13.9;
const averageFahrenheit = 57;
const convertCelsius = (celsius) => Math.round((celsius * 1.8) * 100) / 100;  // converts C to F rounding to nearest hundreth
const endYear = 2018;
const height = 500;
const legendPadding = 90;
const monthsAbbreviations = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June', 'July.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const startYear = 1880;
const width = 1300;
const xAxisPadding = 170;
const yAxisPadding = 90;


// create the svg element
const svg = d3.select('main')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .attr('overflow', 'visible');


/************************************************************************
 Setup the scales
************************************************************************/
// x axis are the years
const xScale = d3.scaleLinear()
  .domain([startYear, endYear + 1])
  .range([yAxisPadding, width]);

// y axis is the month
const yScale = d3.scaleLinear()
  .domain([12, 1]) // the months
  .range([height - xAxisPadding, 0]);


/************************************************************************
  Colors for the graph based on variance in the data set
************************************************************************/
// find min and max variance in the dataset
const maxVariance = dataset.reduce((a, b) => a = (a < b.variance) ? b.variance : a, -Infinity);
const minVariance = dataset.reduce((a, b) => a = (a > b.variance) ? b.variance : a, Infinity);

// colors used in the graph
const colors = ['#0D095B', '#3249AB', '#127FC0', '#03CFD7', '#01C000', '#01C000', '#F8EF1C', '#FEBB11', '#F26322', '#FE0100'];
const colorsLength = colors.length;
// minVariance + (colorStep * i) will give us color index
const colorStep = (maxVariance + Math.abs(minVariance)) / colorsLength;

// called when populating the graph with data
const getColor = (variance) => {
  let i = 0;
  while (((i + 1) * colorStep) + minVariance < variance) {
    i++;
  }
  return colors[i];
};


/************************************************************************
  populate the svg with data
************************************************************************/
// used for the bars in the visualization.
const barHeight = ((height - xAxisPadding) / (months.length - 1)) - 1; // 12 vertical bars (months); add padding by subtracting 1
const barWidth = (width / (endYear - startYear)) - 1; // 2018 - 1880 = 138 bars horizontally (years); add padding by subtracting 1

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


/************************************************************************
  Add the axes
************************************************************************/
const axesTickSize = 18;
const axesNameFontSize = 25;

const xAxis = d3.axisBottom(xScale)
  .tickFormat(tick => tick);

svg.append('g')
  .attr('transform', `translate(0, ${height - xAxisPadding + barHeight})`)
  .call(xAxis);

svg.append('text')
  .text('Year')
  .attr('id', 'year')
  .attr('font-size', axesNameFontSize)
  .attr('font-weight', 'bold');

const yAxis = d3.axisLeft(yScale)
  .tickFormat(month => monthsAbbreviations[month - 1]);

svg.append('g')
  .attr('id', 'yAxis')
  .attr('transform', `translate(${yAxisPadding - 5}, ${barHeight / 2})`)
  .call(yAxis);

// remove the axis line; keep the ticks
d3.select('#yAxis .domain').remove();

// increase the font size size of the labels on the axes
svg.selectAll('g')
  .attr('font-size', axesTickSize);

svg.append('text')
  .text('Month')
  .attr('id', 'month')
  .attr('font-size', axesNameFontSize)
  .attr('font-weight', 'bold');

// in order to center axis names we need to get the width of the text element and translate half the width
const month = d3.select('#month');
const monthTextWidth = month.node()
  .getBBox()
  .width;

month.attr('transform', `translate(${axesNameFontSize}, ${((height - xAxisPadding + barHeight) / 2) + (monthTextWidth / 2)})rotate(270)`)

const year = d3.select('#year');
const yearTextWidth = year.node()
  .getBBox()
  .width;

year.attr('transform', `translate(${(width / 2) - (yearTextWidth / 2)}, ${height - xAxisPadding + barHeight + axesTickSize + axesNameFontSize * 1.4})`)


/************************************************************************
  Create legend denoting the variance-color scale
************************************************************************/
colors.forEach((color, i) => {
  const fontSize = 15;
  const squareSideLength = barHeight * 1.5;
  const xCoord =  yAxisPadding + (squareSideLength * i);
  const yCoord = height - xAxisPadding + legendPadding;

  svg.append('rect')
    .attr('x', xCoord)
    .attr('y', yCoord)
    .attr('width', squareSideLength)
    .attr('height', squareSideLength)
    .attr('fill', color)
    .attr('stroke', 'black')
    .attr('stoke-width', '1');

  svg.append('text')
    .text(x => {
      let output = `${Math.round((minVariance + (colorStep * i)) * 100) / 100}`;

      if (output > 0) {
        output = `+${output}`;
      }
      if (output.length != 5) { // pad output to hundreth place
        output += '0';
      }

      return output;
    })
    .attr('transform', `translate(${xCoord + (barWidth / 2)}, ${yCoord + squareSideLength + fontSize})`)
    .attr('font-size', fontSize);

  // add the legend title on the last interation
  if (i === colorsLength - 1) {
    svg.append('text')
      .text('Variance from the 20th century mean (celsius)')
      .attr('transform', `translate(${yAxisPadding}, ${yCoord - 4})`);
  }
});
