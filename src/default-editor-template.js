'use strict'
module.exports = `
  <!DOCTYPE html>
  <html>
    <meta charset="utf-8">
    <script src="http://d3js.org/d3.v3.js"></script>
    <body>
      <script>
var width = window.innerWidth;
var height = window.innerHeight;
var svg = d3.select('body').append('svg')
  .attr({width: width, height: height});
var rect = svg.append('rect')
  .attr({width: 100, height: 100})
  .style('fill', 'steelblue');
      </script>
    </body>
  </html>
`

