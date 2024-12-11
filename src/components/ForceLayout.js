import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const ForceLayout = ({ data, colorBy, onTweetClick, selectedTweets }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const width = 800;
    const height = 1300;
    const margin = 250;
    const rowHeight = 400;
    const circleRadius = 5;
    const months = [...new Set(data.map((d) => d.Month))];

    const svg = d3.select(svgRef.current);

    const simulation = d3
      .forceSimulation(data)
      .force("x", d3.forceX(width / 2).strength(0.05))
      .force(
        "y",
        d3
          .forceY((d) => {
            const monthIndex = months.indexOf(d.Month);
            return margin + rowHeight * monthIndex;
          })
          .strength(0.2)
      )
      .force("collision", d3.forceCollide(circleRadius + 2));

    simulation.on("tick", () => {
      data.forEach((d) => {
        d.fx = d.x;
        d.fy = d.y;
      });
    });

    for (let i = 0; i < 300; i++) {
      simulation.tick();
    }

    simulation.stop();

    svg
      .selectAll(".month-label")
      .data(months)
      .enter()
      .append("text")
      .attr("x", 0)
      .attr("y", (_, i) => margin + rowHeight * i - 20)
      .attr("text-anchor", "start")
      .style("font-size", "14px")
      .text((d) => d);

    svg
      .selectAll(".row-line")
      .data(months)
      .enter()
      .append("line")
      .attr("x1", margin)
      .attr("x2", width - margin)
      .attr("y1", (_, i) => margin + rowHeight * i)
      .attr("y2", (_, i) => margin + rowHeight * i)
      .attr("stroke", "#ccc")
      .attr("stroke-dasharray", "4 4");

    svg
      .attr("width", width)
      .attr("height", height)
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", circleRadius)
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .on("click", (event, d) => onTweetClick(d));
  }, [data, onTweetClick]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const sentimentColorScale = d3
      .scaleLinear()
      .domain([-1, 0, 1])
      .range(["red", "#ECECEC", "green"]);

    const subjectivityColorScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range(["white", "blue"]);

    const colorScale =
      colorBy === "Sentiment" ? sentimentColorScale : subjectivityColorScale;

    svg
      .selectAll("circle")
      .attr("fill", (d) => colorScale(d[colorBy]))
      .attr("stroke", (d) =>
        selectedTweets.some((tweet) => tweet.idx === d.idx) ? "black" : "none"
      )
      .attr("stroke-width", 2);

    updateLegend(svg, colorBy);
  }, [colorBy, selectedTweets]);

  const updateLegend = (svg, colorBy) => {
    svg.select("#legend-group").remove();

    const legendGroup = svg.append("g").attr("id", "legend-group");

    const legendWidth = 20;
    const legendHeight = 200;
    const legendX = 760;
    const legendY = 30;

    const legendScale =
      colorBy === "Sentiment"
        ? d3.scaleLinear().domain([-1, 0, 1]).range(["green", "#ECECEC", "red"])
        : d3.scaleLinear().domain([0, 1]).range(["blue", "white"]);

    const gradient = legendGroup
      .append("defs")
      .append("linearGradient")
      .attr("id", "legend-gradient")
      .attr("x1", "0%")
      .attr("x2", "0%")
      .attr("y1", "0%")
      .attr("y2", "100%");
      

    gradient
      .selectAll("stop")
      .data(legendScale.ticks(5))
      .enter()
      .append("stop")
      .attr("offset", (d, i) => (i / 4) * 100 + "%")
      .attr("stop-color", (d) => legendScale(d));

    legendGroup
      .append("rect")
      .attr("x", legendX)
      .attr("y", legendY)
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#legend-gradient)");

    legendGroup
      .append("text")
      .attr("x", legendX - 10)
      .attr("y", legendY)
      .text(colorBy === "Sentiment" ? "Positive" : "Subjective")
      .style("font-size", "12px")
      .style("text-anchor", "end");

    legendGroup
      .append("text")
      .attr("x", legendX - 10)
      .attr("y", legendY + legendHeight)
      .text(colorBy === "Sentiment" ? "Negative" : "Objective")
      .style("font-size", "12px")
      .style("text-anchor", "end");

  };

  return <svg ref={svgRef}></svg>;
};

export default ForceLayout;
