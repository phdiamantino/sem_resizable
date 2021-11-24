const MARGIN2 = {LEFT:10, RIGHT:10, TOP:10, BOTTOM:10}
const WIDTH2 = 620 - MARGIN2.LEFT - MARGIN2.RIGHT
const HEIGHT2 = 330 - MARGIN2.TOP - MARGIN2.BOTTOM

// Àrea do SB
const svgSB = d3.select("#sumburst").append("svg") 
        .attr("width", WIDTH2 + MARGIN2.LEFT + MARGIN2.RIGHT)
        .attr("height",HEIGHT2 + MARGIN2.TOP + MARGIN2.BOTTOM)
    .append("g")
        .attr("transform", `translate(${WIDTH2 /2}, ${HEIGHT2 /2})`)

    const partition = d3.partition();

    radius = (Math.min(WIDTH2, HEIGHT2) / 1.8 -20);

    const xSB = d3.scaleLinear()
        .range([0, 2 * Math.PI])
        //.clamp(true);
    const ySB = d3.scaleSqrt()
        .range([0, radius]);



    arc = d3.arc()
        .startAngle(d=> Math.max(0, Math.min(2 * Math.PI, xSB(d.x0))) )
        .endAngle(d=> Math.max(0, Math.min(2 * Math.PI, xSB(d.x1))) )
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius * 1)
        .innerRadius(d=> Math.max(0, ySB(d.y0)) )
        .outerRadius(d=> Math.max(0, ySB(d.y1)) )


    // cria a hierarquia
    function toTree(files) {
        const root = {};
        // Create structure where folder name is also a key in parent object
        for (const {key, value} of files) {
            key.match(/[^\/]+/g).reduce((acc, folder) => {
                if (!acc.folders) acc.folders = {};
                return acc.folders[folder] || (acc.folders[folder] = { key: folder, value: null }); 
            }, root).value = value;
        }
        // Optional: replace folders object by folders array, recursively
        (function recurse(node) {
            if (!node.folders) return;
            node.children = Object.values(node.folders);
            node.children.forEach(recurse);
        })(root);
        return root;
    }



    d3.json("data/rm_technical_debt.json").then(function(dataSB) {

    // Seleção do Dataframe
    updateSB("jUnity")
     d3.select('#formSB')
        .on("change",function(){
            var selectedSB = d3.select(".form-select").node().value;//var selectedPC = d3.select(this).property("value")
            console.log(selectedSB)
            svgSB.selectAll("*").remove();
        updateSB(selectedSB)
        })
        
    function updateSB(selected){ 
        if (selected == 'jUnity'){ 
            data = dataSB.slice(0,754) // usa apenas o repositorio jUnit
            console.log(data.length)
          }else {        
            data = dataSB.slice(755,6838) // usa apenas o repositorio jUnit
            console.log(data.length)
          }

        const arq = d3.nest()
            .key(d=> d.filename)
            .rollup(v=> d3.sum(v, d=> d.debts.length))
            //.rollup(v => v.length)
        .entries(data)
        console.log(arq)
        console.log(arq[0].key.split("/")[0])
        console.log(toTree(arq))
        const arqJson = toTree(arq)

    root = d3.hierarchy(arqJson)
          .sum(d=>+d.value)
          .sort((a, b) => b.value - a.value);
       console.log(root)


       console.log(arq)

    //Legenda
    var tooltipSB = svgSB.append("text")
       .attr("font-size", 13)
       .attr("fill", "#000")
       .attr("fill-opacity", 0)
       .attr("text-anchor", "middle")
       .attr("transform", "translate(" + 0 + "," + (13 + HEIGHT2/2)  +")")
       .style("pointer-events", "none");

    function mouseover(d,i) {
        //console.log(d.parent.data.key)
        tooltipSB.text(d.ancestors().map(d => (d.children ? d : d.parent).data.key).reverse().join("/")  + ": " +
            d.value + " debt" + 
            (d.value > 1 ? "s" : ""))
            .style("font-family", "Verdana")
            //.style("position", "absolute")
            .transition()
                .attr("fill-opacity", 0.9);
        };
    function mouseout() {
        tooltipSB.transition()
            .attr("fill-opacity", 0.0);
        };
    
    //var color =d3.scaleOrdinal().range(d3.quantize(d3.interpolateRainbow, root.children.length + 1));
    //var color = d3.scaleOrdinal(d3.schemeCategory10);
    const color = d3.scaleOrdinal(d3.quantize(d3.interpolateCividis , root.children.length + 1))

    //d3.interpolateLab("steelblue", "brown")  //d3.interpolateViridis  //d3.interpolateMagma
    // d3.interpolateCividis // d3.interpolateCool
    
    function arcVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
      }

    
    //Visualização
        // Add um arco para cada um dos nós na hierarquia
        //Partition(root) adiciona os valores x0, x1, y0 e y1 a cada nó.

    svgSB.selectAll("path")
        .data(partition(root).descendants()) //.data(partition(root).descendants().filter(d => d.depth))
        .enter().append("path")
        //.attr("display", d => d.depth ? null : "none", arc) // area branca central
        //.attr("d", arc)
        .attr("d", d => arc(d))
            //Cor Por Profundidade
        //.style("fill", d=> color((d.children ? d : d.parent).depth)) 
        .style("fill", d=>(d.depth<1) ? "white" :color((d.children ? d : d.parent).depth)) 
            //Cor Por Pasta Principal
        //.style("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.key); }) 
        .style("fill-opacity", d=> 1.1- (d.depth/15))
        .style("stroke-width",0.5)  
        .attr("stroke", "dimgray")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("click",  click)
 //Para mostrar porcentagens
            //let num = (Math.round((d.value / d.data.all) * 100)).toString() + '%';
          //div.html(num)

          

    function click(d) {
        svgSB.transition()
            .duration(300)
            .tween("scale", function() {
                var   xd = d3v4.interpolate(xSB.domain(), [d.x0,  d.x1]),
                      yd = d3v4.interpolate(ySB.domain(), [d.y0, 1]),
                      yr = d3v4.interpolate(ySB.range(), [d.y0 ? 20 : 0, radius]);
                return function(t) { xSB.domain(xd(t));
                                     ySB.domain(yd(t)).range(yr(t));};
                                     })
            .selectAll("path")
                .attrTween("d", d => { return () => arc(d)  })

        }

    }



})