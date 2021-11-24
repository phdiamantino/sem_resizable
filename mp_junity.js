const MARGIN4 = {LEFT:10, RIGHT:10, TOP:10, BOTTOM:10}
const WIDTH4 = 490 - MARGIN4.LEFT - MARGIN4.RIGHT
const HEIGHT4 = 410 - MARGIN4.TOP - MARGIN4.BOTTOM

// Àrea da MP
const svgMP = d3v4.select("#multidimencionalProjection").append("svg") 
        .attr("width", WIDTH4 + MARGIN4.LEFT + MARGIN4.RIGHT)
        .attr("height",HEIGHT4 + MARGIN4.TOP + MARGIN4.BOTTOM)
        
// Àrea da TABELA
const svgMPtable = d3v4.select("#multidimencionalProjectionTable").append("svg") 
        .attr("width", 1050)
        .attr("height",90 )
        .attr("stroke","silver")
        .attr('stroke-width', 2)

    /*svgMPtable.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", 70)
      .attr("width", WIDTH4 + 200)
      .style("fill", '#000');*/

      
    //Color Legend container
const legendsvg = svgMP.append("g")
        .style("position", "absolute")
        .attr("class", "legendWrapper")
        .attr("transform", "translate(" + (WIDTH4/7-150) + "," + (15) + ")")
        

  
const maxIter = 10,
      color = d3v4.scaleSequential(d3v4.interpolatePlasma), //interpolatePlasma /interpolateViridis
      xScale = d3v4.scaleLinear()
          .range([0, WIDTH4])

d3v4.queue()
    .defer(d3v4.text, 'tsne.min.js')
    .defer(d3v4.text, 'worker.js')
    .await(function (err, t, w) {
    const worker = new Worker(window.URL.createObjectURL(new Blob([t + w], {
            type: "text/javascript"
    })));
 



d3v4.csv("data/excomment_mp_junit.csv", function (data) {  

  console.log(data.length)

  var brush = d3v4.brush()
    .on("brush", highlightBrushedCircles)
    .on("end", displayTable)      

  svgMP.append("g")
    .call(brush)


          /*function displayTableClick() {          
            // limpeza após mouse-up
            d3.select(this)//.call(brush.move, null);

          var d_clicked = d3v4.selectAll(".brushed").data();
            if (d_clicked.length > 0) {
              clearTableRows();
              d_clicked.forEach(d_row => populateTableRow(d_row))
            } else {
                    clearTableRows();
            }
          }*/

    
      
      const d_extent_x = d3v4.extent(data, d => +d.patern)
      d_extent_x[0] = d_extent_x[0] 
      d_extent_x[1] = d_extent_x[1] 
      console.log(d_extent_x)
      xScale.domain(d_extent_x);

      const d_extent_color = d3v4.extent(data, d => +d.score);
      color.domain(d_extent_color);
      console.log(d_extent_color)
      

        var circles = svgMP.selectAll('circle')
            .data(data).enter().append('circle')
            .attr("pointer-events", "all")
            //.on("click", function(d){ console.log(d.heuristic) +alert("clicked")})
            //.on("mouseover", function (d) { console.log("I saw  mouse!") })
            .attr('r', d => d.r = 4 + 0.7 * d['count_debts'])   //.attr('r', 6)
            .attr('stroke-width', 0.3)
            .attr('opacity', d => 0.4 + 0.5 * d.heuristic)
            .attr("class", "non_brushed")
              .style("fill", d => color(d.score))
              .style("stroke-width", 1)
              /*.on("click", clicked)
              
                  function clicked(d, i) {
                    if (d3v4.event.defaultPrevented) return;
                    console.log(d.heuristic + " /// " +d.score)
                    d3.select(this).transition()
                        .style("fill", "red")
                        .attr('r', d => d.r =5 + 4 + 0.7 * d['count_debts'])
                      .transition()
                      .attr('r', d => d.r = 4 + 0.7 * d['count_debts'])
                        .style("fill", d => color(d.score));
                  }*/
        

        circles.on("click", clicked)

        
              function clicked(d, i) {
                if (d3v4.event.defaultPrevented) return;
                console.log(d.heuristic + " /// " +d.score)
                d3.select(this).transition()
                    .style("fill", "red")
                    .attr('r', d => d.r =5 + 4 + 0.7 * d['count_debts'])
                  .transition()
                    .attr('r', d => d.r = 4 + 0.7 * d['count_debts'])
                    .attr("class", "clicked")
                    .style("fill", "black")
                    .attr('opacity', d => 0.6 + 0.4 * d.heuristic)
                      //.style("fill", d => color(d.score))



                    /*var d_clicked = d3v4.selectAll(".clicked").data();
                    console.log(i)
                      if (d != null) {
                        clearTableRows();
                        d_clicked.forEach(d_row => populateTableRow(d_row))
                      } else {
                        clearTableRows();
                      }*/

               showTableColNames() 
                console.log(d)
                const d_row_filter = [d.filename.substr(0, d.filename.length - 5), /*d_row.reference,*/ d.patern.substr(0, 5), d.heuristic.substr(0, 4),  d.score.substr(0, 4), d.count_debts.substr(0, 1),d.r,d.index,];
                console.log(d_row_filter)
                    d3v4.select("table").append("tr")
                              .attr("class", "row_data")
                              .selectAll("td")
                              .data(d_row_filter).enter()
                              .append("td")
                              .attr("align", (d, i) => i == 0 ? "left" : "right")
                              .text(d => d)
                              .style("border", "1px black solid")
                              .style("padding", "1px")
                              .style("font-weight", "bold")

              } hideTableColNames()
        


        // define randomicamente a posição inicial dos pontos
        let pos = data.map(d => [Math.random() - 0.5, Math.random() - 0.5]);
        let costs = [];
        let s = 0, c = 1;

            

        const lScale = d3v4.scaleLinear()
          .domain([0, d3v4.max(d_extent_color)])
          .range([WIDTH4/4, WIDTH4 -WIDTH4/4])

        legendsvg.selectAll("rect")
          .data(pair(lScale.ticks(10)))
          .enter().append("rect")
            .attr("class", "legendRect")
            .attr("y",5)
            .attr("x", d=> lScale(d[0]))
            .attr("height", 8)
            .attr("width", d=> lScale(d[1]) - lScale(d[0]) )
            .style("fill", d=>  color(d[0]))
          

        //Titulo 
        legendsvg.append("text")
            .attr("class", "legendTitle")
            .attr("x", 147)
            .attr("y", 3)
            .attr("height", 8)
            .attr("width", 20)
            .text("Comments Score")
            .style("font-weight", "bold")
            

        // X axis da legenda
        var lAxis = d3v4.axisBottom(lScale)
          .ticks(13) 
          .tickSize(10)
          //.tickPadding(5)
          .tickFormat(d3v4.format(".0f"))

      legendsvg.append("g")
          .attr("class", "axis") 
          .attr("transform", "translate(" + (0) + "," + (5) + ")")
          .call(lAxis);
      function pair(array) {
            return array.slice(1).map(function(b, i) {
              return [array[i], b];
            });
          }



      // Pan e zoom          
      var zoom = d3v4.zoom()
        .scaleExtent([1, 40])
        .translateExtent([[-100, -100], [WIDTH4 + 90, HEIGHT4 + 100]])
        .on("zoom", zoomed);

      // PLOTA EIXOS
      var xAxis = d3v4.axisBottom(xScale)
          .ticks((WIDTH4 + 2) / (HEIGHT4 + 2) * 10)
          .tickSize(HEIGHT4)
          .tickPadding(8 - HEIGHT4);
      var yAxis = d3v4.axisRight(xScale)
          .ticks(10)
          .tickSize(WIDTH4)
          .tickPadding(8 - WIDTH4);

      svgMP.call(zoom);
        function zoomed() {
          circles.attr("transform", d3v4.event.transform)
            xAxis.scale(d3v4.event.transform.rescaleX(xScale))
            yAxis.scale(d3v4.event.transform.rescaleY(xScale))
          }
        d3v4.select("button")
          .on("click", resetted);
      
      function resetted() {
            svgMP.transition()
                .duration(750)
                .call(zoom.transform, d3v4.zoomIdentity);}


      // Funções TSNE
        const forcetsne = d3v4.forceSimulation(data)
        .alphaDecay(0)
        .alpha(0.1)
        .force('tsne', function(alpha){
          data.forEach((d,i) => {
            // itera sobre POS e define as novas posições dos pontos
            d.x += alpha * (240*pos[i][0] - d.x);
            d.y += alpha * (240*pos[i][1] - d.y);
            //console.log(d)
          });
        })
        .force('orientation', function(){
          let tx = 0,
              ty = 0;
          data.forEach((d,i) => {
            tx += d.x * d.patern;
            ty += d.y * d.patern;
          });
          let angle = Math.atan2(ty,tx);
          s = Math.sin(angle);
          c = Math.cos(angle);
        })
        // d.r responsavel pela aplicação da forma (movimentação dos pontos) 
        .force('collide', d3v4.forceCollide().radius(d => 1 + d.r)) //d => 1 + d.r
        .on('tick', function () {
          //Posição da Vis
          circles
            .attr('cx', d => 200 + xScale(d.x*s - d.y*c))
            .attr('cy', d => 200 + xScale(d.x*c + d.y*s))
            //.attr("class", "non_brushed")
          circles.append('g')
          .append('title')
            .text(d => d.filename)
            
        });

    
        worker.onmessage = function (e) {
            if (e.data.pos) pos = e.data.pos;
            if (e.data.iterations) { 
              costs[e.data.iterations] = e.data.cost;
            }
            if (e.data.stop) { 
              console.log("stopped with message", e.data);
              forcetsne.alphaDecay(0.02);
              worker.terminate();
            }
        };
        worker.postMessage({
            nIter: maxIter,
            // dim: 2,
            perplexity: 30.0,
            // earlyExaggeration: 4.0,
            //learningRate: 100.0,
            metric: 'euclidean', //'manhattan', //'euclidean',
            data: data
        });


          //Função Brush
          function highlightBrushedCircles() {

            if (d3v4.event.selection != null) {
                  // Preserva/reverte os circulos não selecionados
                circles.attr("class", "non_brushed")
                        .attr("r", d => d.r = 4 + 0.7 * d['count_debts'])
                        .style("fill", d => color(d.score));
                

                var brush_coords = d3v4.brushSelection(this);
                  // style brushed circles 
                circles.filter(function (){
                          var cx = d3v4.select(this).attr("cx"),
                              cy = d3v4.select(this).attr("cy");
                            return isBrushed(brush_coords, cx, cy);
                     })
                    .attr('r', d => d.r = 4 + 0.7 * d['count_debts'])
                    .attr("class", "brushed")
                    //.attr("stroke","red")
                    //.attr('stroke-width', 0.5)
                    .style("fill", "black")
                    .attr('opacity', d => 0.6 + 0.4 * d.heuristic);  
            }

          }

            function displayTable() {
                 // desconsidera pontos não selecionados 
                if (!d3v4.event.selection) return;
                
                 // limpeza após mouse-up
                 d3.select(this).call(brush.move, null);

                 // limpeza após mouse-up
                var d_brushed =  d3v4.selectAll(".brushed").data();
                // Cria a tabela se um ou mais elementos forem escovados
                if (d_brushed.length > 0) {
                    clearTableRows();
                    d_brushed.forEach(d_row => populateTableRow(d_row))
                } else {
                    clearTableRows();
                }

                /*var d_clicked = d3v4.selectAll(".brushed").data();
                if (d_clicked.length > 0) {
                  clearTableRows();
                  d_clicked.forEach(d_row => populateTableRow(d_row))
                } else {
                        clearTableRows();
                }*/
          }


          svgMPtable.append("g")
              .call(brush);


               function update(){
                d3v4.selectAll(".form-check-input").each(function(d){
                  cb = d3.select(this);
                  grp = cb.property("value")
                  // Se estiver marcado, a força é aplicada
                  if(cb.property("checked")){
                    forcetsne.force('collide', d3v4.forceCollide().radius(d => 1 + d.r))
                  // Se estiver desmarcado, atua sem a força
                  }else{
                    forcetsne.force('collide', d3v4.forceCollide().radius(d => 1 + 0))
                  }
                })
              }
              // Quando o botão muda, executa a atualização
              d3v4.selectAll(".form-check-input").on("change",update);
              // Inicializa no começo
              update()
              
            

  });




      // Função limpeza do brush e tabela
  function clearTableRows() {
        hideTableColNames();
        d3v4.selectAll(".row_data").remove();
    }

    function isBrushed(brush_coords, cx, cy) {
          var x0 = brush_coords[0][0],
              x1 = brush_coords[1][0],
              y0 = brush_coords[0][1],
              y1 = brush_coords[1][1];
          return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
    }

    function hideTableColNames() {
      d3v4.select("table").style("visibility", "hidden");    }

    function showTableColNames() {
      d3v4.select("table").style("visibility", "visible");   }



    function populateTableRow(d_row) {
        showTableColNames();

          const d_row_filter = [d_row.filename.substr(0, d_row.filename.length - 5), /*d_row.reference,*/ d_row.patern.substr(0, 5), d_row.heuristic.substr(0, 4),  d_row.score.substr(0, 4), d_row.count_debts.substr(0, 1),d_row.r,d_row.index];
          d3v4.select("table").append("tr")
            .attr("class", "row_data")
            .selectAll("td")
            .data(d_row_filter).enter()
            .append("td")
            .attr("align", (d, i) => console.log(d) + i == 0 ? "left" : "right")
            .text(d => d)
            .style("border", "1px black solid")
            .style("padding", "1px")
            .style("font-weight", "bold")
    }


});


