const MARGIN4 = {LEFT:10, RIGHT:10, TOP:10, BOTTOM:10}
const WIDTH4 = 550 - MARGIN4.LEFT - MARGIN4.RIGHT
const HEIGHT4 = 370 - MARGIN4.TOP - MARGIN4.BOTTOM

// Àrea do SB
const svgMP = d3.select("#multidimencionalProjection").append("svg") 
        .attr("width", WIDTH4 + MARGIN4.LEFT + MARGIN4.RIGHT)
        .attr("height",HEIGHT4 + MARGIN4.TOP + MARGIN4.BOTTOM)
    //.append("g")
        //.attr("transform", `translate(${WIDTH4 /2}, ${HEIGHT4 /2})`)

var x = d3.scaleLinear().range([MARGIN4.LEFT, WIDTH4]),
    y = d3.scaleLinear().range([HEIGHT4, MARGIN4.TOP]);

var color = d3.scaleSequential(d3.interpolatePlasma)
    
    
d3.csv("data/excomment_mp_junit.csv",d3.autoType).then(function(data) {

        var n = data.length;

        var d_extent_x = d3.extent(data, d => +d.patern),
            d_extent_y = d3.extent(data, d => +d.score),
            d_extent_tol = d3.extent(data, d => +d.heuristic);

        x.domain(d_extent_x);
        y.domain(d_extent_y);
        console.log(d_extent_tol)
        color.domain(d_extent_tol);

        var axis_x = d3.axisBottom(x),
            axis_y = d3.axisLeft(y);

        svgMP.append("g")
           .attr("id", "axis_x")
           .attr("transform", "translate(0," + (HEIGHT4 + MARGIN4.BOTTOM/2) +")")
           //.call(axis_x);

        svgMP.append("g")
           .attr("id", "axis_y")
           .attr("transform", "translate(" + (MARGIN4.LEFT/2) + ", 0)")
           //.call(axis_y);

        d3.select("#axis_x")
          .append("text")
          .attr("transform", "translate(360, -10)");
        d3.select("#axis_y")
          .append("text")
          .attr("transform", "rotate(-90) translate(-20, 15)");

        var circles = svgMP.append("g")
                         .selectAll("circle")
                         .data(data)
                         .enter()
                         .append("circle")
                         .attr("r", 4)
                         .attr("cx", (d) => x(+d.patern))
                         .attr("cy", (d) => y(+d.score))
                         .attr("class", "non_brushed")
                         .style("fill", (d) => color(+d.heuristic));


        function highlightBrushedCircles() {

            if (d3.event.selection != null) {

                // revert circles to initial style
                circles.attr("class", "non_brushed")
                             .attr("r", 5)
                       .style("fill", (d) => color(+d.Tolerance));

                var brush_coords = d3.brushSelection(this);

                // style brushed circles
                circles.filter(function (){

                           var cx = d3.select(this).attr("cx"),
                               cy = d3.select(this).attr("cy");

                           return isBrushed(brush_coords, cx, cy);
                       })
                             .attr("r", 7)
                       .attr("class", "brushed")
                             .style("fill", "black");
            }
        }

        function displayTable() {

            // disregard brushes w/o selections  
            // ref: http://bl.ocks.org/mbostock/6232537
            if (!d3.event.selection) return;

            // programmed clearing of brush after mouse-up
            // ref: https://github.com/d3/d3-brush/issues/10
            d3.select(this).call(brush.move, null);

            var d_brushed =  d3.selectAll(".brushed").data();

            // populate table if one or more elements is brushed
            if (d_brushed.length > 0) {
                clearTableRows();
                d_brushed.forEach(d_row => populateTableRow(d_row))
            } else {
                clearTableRows();
            }
        }

        var brush = d3.brush()
                      .on("brush", highlightBrushedCircles)
                      .on("end", displayTable); 

        svgMP.append("g")
           .call(brush);
    });

    function clearTableRows() {

        hideTableColNames();
        d3.selectAll(".row_data").remove();
    }

    function isBrushed(brush_coords, cx, cy) {

         var x0 = brush_coords[0][0],
             x1 = brush_coords[1][0],
             y0 = brush_coords[0][1],
             y1 = brush_coords[1][1];

        return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
    }

    function hideTableColNames() {
        d3.select("table").style("visibility", "hidden");
    }

    function showTableColNames() {
        d3.select("table").style("visibility", "visible");
    }

    function populateTableRow(d_row) {

        showTableColNames();

        var d_row_filter = [d_row.reference, d_row.count_reference, d_row.indicators, d_row.debts];

        d3.select("table")
          .append("tr")
          .attr("class", "row_data")
          .selectAll("td")
          .data(d_row_filter)
          .enter()
          .append("td")
          .attr("align", (d, i) => i == 0 ? "left" : "right")
          .text(d => d);


}
    
        
        

     
