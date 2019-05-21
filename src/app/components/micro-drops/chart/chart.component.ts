import { Component, ElementRef, Input, OnChanges, ViewChild, ViewEncapsulation, HostListener } from '@angular/core';
import * as d3 from 'd3';
import { DataModel } from '../../../entity/chart.model';
//TODO:1.中文标签 2.可点击取消显示 3.自动坐标轴 4.缩略值显示 5.网格线 6.异步获取数值显示 7.图表大小自动缩放
@Component({
  selector: 'app-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})

export class ChartComponent implements OnChanges{
  
  @ViewChild('chart')
  private chartContainer: ElementRef;

  constructor() { 
  }

  ngOnChanges(): void {
    //this.createChart();
  }

  onResize() {
    //this.createChart();  
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.createChart();

  }
  private createChart(){
    const element = this.chartContainer.nativeElement;
    //const data = this.data;  
    
    var lineArr = [];
    var MAX_LENGTH = 100;
    var duration = 500;
    var chart = this.realTimeLineChart();

    function randomNumberBounds(min, max) {
      return Math.floor(Math.random() * max) + min;
    }

    function seedData() {
      var now = new Date();
      for (var i = 0; i < MAX_LENGTH; ++i) {
        lineArr.push({
          time: new Date(now.getTime() - ((MAX_LENGTH - i) * duration)),
          x: randomNumberBounds(0, 5),
          y: randomNumberBounds(0, 2.5),
          z: randomNumberBounds(0, 10),
          m: randomNumberBounds(9, 4),
          n: randomNumberBounds(11, 4)
        });
      }
    }

    function updateData() {
      var now = new Date();

      var lineData = {
        time: now,
        x: randomNumberBounds(0, 5),
        y: randomNumberBounds(0, 2.5),
        z: randomNumberBounds(0, 10),
        m: randomNumberBounds(9, 4),
        n: randomNumberBounds(11, 4)
      };
      lineArr.push(lineData);

      if (lineArr.length > 30) {
        lineArr.shift();
      }
      d3.select(element).datum(lineArr).call(chart);
    }

    function resize() {
      if (d3.select(element+" svg").empty()) {
        return;
      }
      chart.width(+d3.select(element).style("width").replace(/(px)/g, ""));
      d3.select(element).call(chart);
    }

      seedData();
      window.setInterval(updateData, 500);
      d3.select(element).datum(lineArr).call(chart);
      d3.select(window).on('resize', resize);  //TODO: whats window means?
  }
    private realTimeLineChart(){
        var  margin = {top: 20, right: 20, bottom: 20, left: 20},
          width = 600,
          height = 400,
          duration = 500,
          color = d3.schemeCategory10;
    
      function chart(selection) {
        // Based on https://bl.ocks.org/mbostock/3884955
        selection.each(function(data:any) {
          data = ["x", "y", "z","m","n"].map(function(c:any) {
            return {
              label: c,
              values: data.map(function(d:any) {
                return {time: +d.time, value: d[c]};
              })
            };
          });
    
          var t = d3.transition().duration(duration).ease(d3.easeLinear),
              x = d3.scaleTime().rangeRound([0, width-margin.left-margin.right]),
              y = d3.scaleLinear().rangeRound([height-margin.top-margin.bottom, 0]),
              z = d3.scaleOrdinal(color);
    
          var xMin = d3.min(data, function(c:any) { return d3.min(c.values, function(d:any) { return d.time; })});
          var xMax = new Date(new Date(d3.max(data, function(c:any) {
            return d3.max(c.values, function(d:any) { return d.time; })
          })).getTime() - (duration*2));
    
          x.domain([Number(xMin), xMax]);
          y.domain([0,15]);
          z.domain(data.map(function(c:any) { return c.label; }));
    
          var line = d3.line()
            .curve(d3.curveBasis)
            .x(function(d:any) { return x(d.time); })
            .y(function(d:any) { return y(d.value); });
    
          var svg = d3.select(this).selectAll("svg").data([data]);
          var gEnter = svg.enter().append("svg").append("g");
          gEnter.append("g").attr("class", "axis x");
          gEnter.append("g").attr("class", "axis y");
          gEnter.append("defs").append("clipPath")
              .attr("id", "clip")
            .append("rect")
              .attr("width", width-margin.left-margin.right)
              .attr("height", height-margin.top-margin.bottom);
          gEnter.append("g")
              .attr("class", "lines")
              .attr("clip-path", "url(#clip)")
            .selectAll(".data").data(data).enter()
              .append("path")
                .attr("class", "data");
          var legendEnter = gEnter.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(" + (width-margin.right-margin.left-75) + ",25)");
          legendEnter.append("rect")
            .attr("width", 50)
            .attr("height", 75)
            .attr("fill", "#ffffff")
            .attr("fill-opacity", 0.7);
          legendEnter.selectAll("text")
            .data(data).enter()
            .append("text")
              .attr("y", function(d, i) { return (i*20) + 25; })
              .attr("x", 5)
              .attr("fill", function(d:any) { return z(d.label); });
    
          var svg1 = selection.select("svg");
          svg1.attr('width', width).attr('height', height);
          var g = svg1.select("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
          g.select("g.axis.x")
            .attr("transform", "translate(0," + (height-margin.bottom-margin.top) + ")")
            .transition(t)
            .call(d3.axisBottom(x).ticks(5));
          g.select("g.axis.y")
            .transition(t)
            .attr("class", "axis y")
            .call(d3.axisLeft(y));
    
          g.select("defs clipPath rect")
            .transition(t)
            .attr("width", width-margin.left-margin.right)
            .attr("height", height-margin.top-margin.right);
    
          g.selectAll("g path.data")
            .data(data)
            .style("stroke", function(d:any) { return z(d.label); })
            .style("stroke-width", 1)
            .style("fill", "none")
            .transition()
            .duration(duration)
            .ease(d3.easeLinear)
            .on("start", tick);

          

          g.selectAll("g .legend text")
            .data(data)
            .text(function(d:any) {

              let datakind=["吸光度","光开关1","光开关2","光开关3","光开关4"];
                return d.label + ": " + d.values[d.values.length-1].value;
            });
    
          // For transitions https://bl.ocks.org/mbostock/1642874
          function tick() {
            d3.select(this)
              .attr("d", function(d:any) { return line(d.values); })
              .attr("transform", null);
    
            var xMinLess = new Date(new Date(xMin).getTime() - duration);
            d3.active(this)
                .attr("transform", "translate(" + x(xMinLess) + ",0)")
              .transition()
                .on("start", tick);
          }
        });
      }
    
      chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
      };
    
      chart.width = function(_) {
        if (!arguments.length) return width;
        width = _;
        return chart;
      };
    
      chart.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        return chart;
      };
    
      chart.color = function(_) {
        if (!arguments.length) return color;
        color = _;
        return chart;
      };
    
      chart.duration = function(_) {
        if (!arguments.length) return duration;
        duration = _;
        return chart;
      };
    
      return chart;
    }

    
}