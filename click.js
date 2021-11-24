 let zoomSvg1 = d3.behavior.zoom()
        .scaleExtent([0.5,20])
        .translate([0, 0])
        .scale(0)
        .on("zoom", () => {
            d3.selectAll("#dot1, .selection1")
            .attr("transform",
                    "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
            .attr('cursor', 'pointer');
            svg1ZoomX = d3.event.translate[0];
            svg1ZoomY = d3.event.translate[1];
            svg1ZoomScale = d3.event.scale;
        });

    let zoomSvg2 = d3.behavior.zoom()
        .on("zoom", () => {
            d3.selectAll(".selection2, #dot2")
                .attr("transform",
                    "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
                .attr('cursor', 'pointer');
            svg2ZoomX = d3.event.translate[0];
            svg2ZoomY = d3.event.translate[1];
            svg2ZoomScale = d3.event.scale;
        });

    let div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    let coordsSvg1 = [];
    let lineSvg1 = d3.svg.line();
    let dragSvg1 = d3.behavior.drag()

        .on("dragstart", function() {
            coordsSvg1 = [];
            svg = d3.select(this);
            svg.selectAll(".selection1").remove();
            svg.append("path").attr({"class": "selection1"});
        })

        .on("drag", function() {
            coordsSvg1.push(d3.mouse(this));

            svg = d3.select(this);
            svg.select(".selection1").attr({
                d: lineSvg1(coordsSvg1)
            });
            svg.selectAll("circle").each(function(d) {
                point1 = [d3.select(this).attr("cx"), d3.select(this).attr("cy")];

                if (pointInPolygon1(point1, coordsSvg1)) {

                    if (selected.indexOf(d.id) === -1) {
                        selected.push(d.id);
                    }
                }
            });
            highlight1(selected);
        })

        .on("dragend", function() {
            svg = d3.select(this);
            if (coordsSvg1.length === 0) {
                d3.selectAll("svg path").remove();
                unhighlight1();
                return;
            }
            svg.append("path").attr({
                "class": "terminator1",
                d: lineSvg1([coordsSvg[0], coordsSvg[coordsSvg1.length-1]])
            });
        });

    function pointInPolygon1(xyPoint1, coordMouse1) {

        let xi, xj, i, intersect,
            x = svg1XBrushScala(xyPoint1[0]),
            y = svg1YBrushScala(xyPoint1[1]),
            inside = false;

        for (let i = 0, j = coordMouse1.length - 1; i < coordMouse1.length; j = i++) {
            xi = coordMouse1[i][0],
                yi = coordMouse1[i],
                xj = coordMouse1[j][0],
                yj = coordMouse1[j][1],
                intersect = ((yi > y) != (yj > y))
                    && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }

    function unhighlight1() {
        d3.selectAll("circle").classed("highlighted1", false);
    }

    function highlight1(ids1) {
        unhighlight1();
        d3.selectAll("circle").filter(function(d) {
            return ids1.indexOf(d.id) > -1;
        })
            .classed("highlighted1", true)
            .transition()
            .duration(200)
            .attr('r', rBrush)
            .attr("fill", "#e66101")
            .attr("stroke", "black")
            .attr("opacity", 0.9);

        visaoTabularBrushLivre(ids1);
    }

    svg1 = d3.select("svg#mainsvg")
        .append("svg")
        .attr("id", "svg1")
        .attr("height", height)
        .attr("width", width);


// brush click
    let click = (d) => {
        if (selected.indexOf(d.id) === -1) {
                selected.push(d.id);
            }

        d3.selectAll("circle.pt" + d.id)
            .attr("opacity", 0.9);
    };

// remover brush

    // brush click
    let removeBrush = () => {
        updateColor();
        visaoTabular.selectAll("tr, td, th").remove();
        selected = [];
        svg.selectAll(".selection1").remove();
        svg.selectAll(".selection2").remove();
    };