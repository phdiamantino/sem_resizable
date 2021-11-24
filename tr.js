//<script src="https://d3js.org/d3-array.v2.min.js"></script>

const MARGIN3 = {LEFT:30, RIGHT:40, TOP:20, BOTTOM:30}
const WIDTH3 = 620 - MARGIN3.LEFT - MARGIN3.RIGHT
const HEIGHT3 = 250 - MARGIN3.TOP - MARGIN3.BOTTOM


// Add SVG
const svgTR = d3.select("#themeRiver").append("svg")
        .attr("width", WIDTH3 + MARGIN3.LEFT + MARGIN3.RIGHT)
        .attr("height", HEIGHT3 + MARGIN3.TOP + MARGIN3.BOTTOM)
    .append("g")
        .attr("transform", "translate(" + MARGIN3.LEFT + "," + MARGIN3.TOP + ")");

    var tooltipTR = d3.select("#themeRiver")
      .style("font-family", "Verdana" )
      .append("div").attr("class", "remove")
            .style("position", "absolute")
            .style("z-index", "20")
            .style("opacity", 0)
            .style("font-size", 10)
            .style("visibility", "hidden")
            .style("width", "300px")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")
            //.style("border", "solid")
            //.style("background-color", "red")
      var tooltipTRimg  = d3.select("#themeRiver")
        .append("div").attr("class", "remove")
            .style("position", "absolute")
            .style("font-size", 10)
            .style("opacity", 0)
            .style("visibility", "hidden")
            .style("padding", "15px")
      var tooltipTRcloud = d3.select("#wordCloud")
          .append("div").attr("class", "remove")
            .style("position", "absolute")
            .style("opacity", 0)
            .style("visibility", "hidden")
            .style("width", "405px")


  // Legendas
var legendTR = d3.select("#legend_tr").append("svg")
  .attr("width", 450)
  .attr("height", 28)//.attr("transform","translate(50,30)")
  .style("background-color", "silver")
  .style("position", "absolute")
  .style("left", "110")
  .style("border-width", "4px")
  .style("border-radius", "6px")
  .style("padding", "2px")
  .style("border", "1px solid black");
legendTR.append("text").attr("x", 31 ).attr("y", 15).text("Positive Feeling").style("font-size", "14px").attr("alignment-baseline","middle")
legendTR.append("text").attr("x", 180).attr("y", 15).text("Neutral Feeling").style("font-size", "14px").attr("alignment-baseline","middle")
legendTR.append("text").attr("x", 328).attr("y", 15).text("Negative Feeling").style("font-size", "14px").attr("alignment-baseline","middle")
legendTR.append('image').attr('xlink:href', "https://cdn.shopify.com/s/files/1/1061/1924/products/Smiling_Face_Emoji_large.png?v=1571606036").attr('width', 25).attr('height', 25).attr("x", 3)
legendTR.append('image').attr('xlink:href', "https://cdn.shopify.com/s/files/1/1061/1924/products/Neutral_Face_Emoji_1024x1024.png?v=1571606037").attr('width', 25).attr('height', 25).attr("x", 152)
legendTR.append('image').attr('xlink:href', "https://imagepng.org/wp-content/uploads/2017/11/facebook-grr-raiva-icone.png").attr('width', 24).attr('height', 24).attr("x", 302)
        
var format = d3.timeParse("%Y-%m-%d")    
var datearray = [];
function version(s) {if (s >=(new Date("Mon Dec 27 2004 22:00:00 GMT-0200 (Horário de Verão de Brasília)")) && (s <(new Date("Mon Apr 13 2009 21:00:00 GMT-0300 (Horário Padrão de Brasília)")))) {
    return "r3.8.2";
  } else if (s >=(new Date("Mon Apr 13 2009 21:00:00 GMT-0300 (Horário Padrão de Brasília)")) && (s <(new Date("Mon Jul 27 2009 21:00:00 GMT-0300 (Horário Padrão de Brasília)")))) {
    return "r4.6"
  } else if (s >=(new Date("Mon Jul 27 2009 21:00:00 GMT-0300 (Horário Padrão de Brasília)")) && (s <(new Date("Mon Nov 30 2009 22:00:00 GMT-0200 (Horário de Verão de Brasília)")))) {
    return "r4.7"
  }else if (s >=(new Date("Mon Nov 30 2009 22:00:00 GMT-0200 (Horário de Verão de Brasília)")) && (s <(new Date("Sun Aug 21 2011 21:00:00 GMT-0300 (Horário Padrão de Brasília)")))) {
    return "r4.8"
  }else if (s >=(new Date("Sun Aug 21 2011 21:00:00 GMT-0300 (Horário Padrão de Brasília)")) && (s <(new Date("Wed Sep 28 2011 21:00:00 GMT-0300 (Horário Padrão de Brasília)")))) {
    return "r4.9"
  }else if (s >=(new Date("Wed Sep 28 2011 21:00:00 GMT-0300 (Horário Padrão de Brasília)")) && (s <(new Date("Mon Nov 12 2012 22:00:00 GMT-0200 (Horário de Verão de Brasília)")))) {
    return "r4.10"
  }else if (s >=(new Date("Mon Nov 12 2012 22:00:00 GMT-0200 (Horário de Verão de Brasília)")) && (s <(new Date("Wed Dec 03 2014 22:00:00 GMT-0200 (Horário de Verão de Brasília)")))) {
    return "r4.11"
  }else if (s >=(new Date("Wed Dec 03 2014 22:00:00 GMT-0200 (Horário de Verão de Brasília)")) && (s <(new Date("Tue Feb 20 2017 21:00:00 GMT-0300 (Horário Padrão de Brasília)")))) {
    return "r4.12"
  }else {
    return "master"
  }}

function seq(j){if(j =="r3.8.2"){
  return 0
} else if(j =="r3.8.2"){
  return 0
}else if(j =="r4.6"){
  return 1
}else if(j =="r4.7"){
  return 2
}else if(j =="r4.8"){
  return 3
}else if(j =="r4.9"){
  return 4
}else if(j =="r4.10"){
  return 5
}else if(j =="r4.11"){
  return 6
}else if(j =="r4.12"){
  return 7
}else if(j =="master"){
  return 8
}
}


function sentiment(b){if(b==0){
  return 'url("https://cdn.shopify.com/s/files/1/1061/1924/products/Smiling_Face_Emoji_large.png?v=1571606036")'
} else if (b>0){
  return 'url("https://cdn.shopify.com/s/files/1/1061/1924/products/Neutral_Face_Emoji_1024x1024.png?v=1571606037")'
} 
return 'url("https://imagepng.org/wp-content/uploads/2017/11/facebook-grr-raiva-icone.png")'
}


d3.csv("data/excomment_sentiments_completo_quintil.csv",d3.autoType).then(function(dataTR) {

  dataTR.forEach(function(d) {
      d.score = +d.score;
      d.value = +d.value;
  });
  console.log(dataTR);  
  
  updateTR("jUnity")
  d3.select('#formTR')
  .on("change",function(){
        var selectedTR = d3.select(".form-select").node().value;//var selectedPC = d3.select(this).property("value")
          console.log(selectedTR)
        svgTR.selectAll("*").remove();
        d3.select(".path").remove();
        updateTR(selectedTR)
      })
      
      
  function updateTR(selectedGroup) {

    if (selectedGroup == 'jUnity'){ 
      //flag
      var data = dataTR.slice(0,1449) // usa apenas o repositorio jUnit
    }else {
      //flag
      var data = dataTR.slice(1450,21466) // usa apenas o repositorio Apache
    }
  
    // Create initial graph
    initialGraph("Quintil")  
      d3.select("#custom-select-tr")
          .on("change",function(d){
              var selectedQ = d3.select("#custom-select-tr").node().value; // d3.select(this).property("value") 
              console.log(selectedQ);
              //svgTR.select("#remove").remove(); 
              //d3.select("#remove").remove();  
              svgTR.selectAll("*").remove();
              d3.select(".path").remove(); 
              initialGraph(selectedQ)
      })

            console.log(d3.select("#custom-select-tr").node().value)


          // Function to create the initial graph
          function initialGraph(group){
            console.log(group)
            
            if (group == 'Quintil'){ 

              var nest = d3.nest()
                .key(d=> d.date).key(d=>d.Quintil)
                .entries(data)
                console.log(nest);

                var keys_score = [0,1,2,3,4];
                var color= d3.scaleLinear()
                  .domain(keys_score)   
                  .range(d3.schemeYlOrBr[5]) ;
          
            }else {
              var nest = d3.nest()
                .key(d=> d.date).key(d=>d.Decil)
                .entries(data)
                console.log(nest);

                var keys_score = [0,1,2,3,4,5,6,7,8,9];
                var color= d3.scaleLinear()
                  .domain(keys_score)   
                  .range(d3.schemeYlOrBr[7]);
            }
              
            console.log(nest)




              var stackedData = d3.stack()
                    .keys(keys_score)
                    .offset(d3.stackOffsetWiggle) //.offset(d3.stackOffsetSilhouette//stackOffsetWiggle)
                    .value((d,key)=> d.values[key] ==  undefined?0: 
                                  /*d.values[key].values,*/ d3.sum(d.values[key].values.map((s,a,i)=>s.score))  )
                (nest)
                console.log(stackedData)
            
        // Add X & Y axis      
            // X axis  
            var xScale =  d3.scaleTime()
                    .domain(d3.extent(data, d=> d.date))
                    .range([0, WIDTH3]);
                svgTR.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + HEIGHT3 + ")")
                    .call(d3.axisBottom(xScale))
                    .select(".domain").remove();
                svgTR.selectAll(".tick line").attr("stroke", "#b8b8b8")
                    //Colocar nome TIME(YEAR)
                svgTR.append("text")
                    .attr("text-anchor", "end")
                    .attr("x", WIDTH3-450)
                    .attr("y", HEIGHT3-15 )
                    .text("Time (Year)")
                    
            // Y axis 
            var yScale = d3.scaleLinear()
                    .domain([d3.min(stackedData, l => d3.min(l, d => d[0])),
                            d3.max(stackedData, l => d3.max(l, d => d[1]))]).nice()
                    .range([ HEIGHT3, 0 ])
                svgTR.append("g")
                    .attr("class", "y axis")
                    .call(d3.axisLeft(yScale).ticks(0).tickSize(3));
          
            var area = d3.area()
                    .curve(d3.curveMonotoneX)
                    .x((d,i)=> xScale(new Date(d.data.key)))
                    .y0(d=> yScale(d[0]))
                    .y1(d=> yScale(d[1]))

        

            // Elementos de interação
            svgTR.selectAll(".layer")
                .attr("opacity", 1)
                .on("mouseover", function(d, i) {
                svgTR.selectAll(".layer")
                .transition().duration(250)
            })

            // Mouseover
            var mouseover = function(d) {
              d3.select(this)
                tooltipTR.style("opacity", 1)
                  d3.selectAll(".myArea").style("opacity", .3)
                  d3.select(this)
                      .style("stroke", "#121212") //black #121212
                      .style("opacity", 1),
                tooltipTRimg.style("opacity", 1),
                tooltipTRcloud.style("opacity", 1)
                }

                
            //Exibe informações ao passar o mouse
            mousemove = function(d,i) {
              
              //console.log(d)
              mousex = d3.mouse(this);
              mousex = mousex[0];
              var invertedx = xScale.invert(mousex);
              var selected = (d)
              var feeling = sentiment(d3.sum(d[seq(version(invertedx))].data.values[d.key].values.map(s=>s.sentiment)))
              //var words = d[seq(version(invertedx))].data.values[d.key].values.map(s=>s.words)
              var words = d[seq(version(invertedx))].data.values[d.key].values.map(s=>s['words'])
                words_cleaned = words.filter(function(val){if(val)return val}).join(", ").split(",") // remove nulls e une as strings
              var resultwords = d[seq(version(invertedx))].data.values[d.key].values.map(s=>s['resultwords'])
                result_cleaned = resultwords.filter(function(val){if(val)return val}).join(", ").split(",")

                function nthMostCommon(str, amount) {
                  const stickyWords =["you","the","i","","in","if","so","an", "a","testrule","+","45","8"];
                  var splitUp = str
                  const wordsArray = splitUp.filter(function(x){
                    return !stickyWords.includes(x) ;
                            });
                    var wordOccurrences = {}
                    for (var i = 0; i < wordsArray.length; i++) {
                        wordOccurrences['_'+wordsArray[i]] = ( wordOccurrences['_'+wordsArray[i]] || 0 ) + 1;
                    }
                    var result = Object.keys(wordOccurrences).reduce(function(acc, currentKey) {
                        for (var i = 0; i < amount; i++) {
                            if (!acc[i]) {
                                //acc[i] = { word: currentKey.slice(1, currentKey.length), occurences: wordOccurrences[currentKey] };
                                acc[i] = currentKey.slice(1, currentKey.length);
                                break;
                            } else if (acc[i].occurences < wordOccurrences[currentKey]) {
                                //acc.splice(i, 0, { word: currentKey.slice(1, currentKey.length), occurences: wordOccurrences[currentKey] });
                                acc.splice(i, currentKey.slice(1, currentKey.length));
                                if (acc.length > amount)
                                    acc.pop();
                                break;
                            }
                        }  return acc;
                    }, []);
                    return result;
                }

              //console.log(resultwords)
              for (var k = 0; k < selected.length; k++) {
                  datearray[k] = new Date(selected[k].data.key)
              }
              d3.select(this)
                  .classed("hover", true)
                  .attr("stroke-width", "0.5px"),
              tooltipTRimg
                  .style("position", "absolute")
                  .style("visibility", "visible")
                  //.style("background-color", "silver")
                  .style("background-image", feeling)
                  .style('background-size','cover') 
                  .style("top",  (d3.mouse(this)[1])+50 + "px")
                  .style("left", (d3.mouse(this)[0]+60)+ "px");
              //sentiment(d3.sum(d[seq(version(invertedx))].data.values[d.key].values.map(s=>s.sentiment)))
              tooltipTR.html("<b>"+"Score: " +"</b>" + (d.key + 1)
                                +"</br>"+"<b>"+"Version: "+"</b>"+ version(invertedx))
                    .style("visibility", "visible")
                    .style("top",  (d3.mouse(this)[1]) + "px")
                    .style("left", (d3.mouse(this)[0]+50)+ "px");
              tooltipTRcloud.html("<b>"+"Main Words: " +"</b>" +  nthMostCommon(words_cleaned, 7))
                    .style("visibility", "visible")
                    .style("top", "40px")
                    .style("left", "40px");

                    var initialWord = function(w){
                          
                      if (w == 'words'){
                        tooltipTRcloud.html("<i>"+nthMostCommon(words_cleaned, 7) +"</i>" )
                          .style("visibility", "visible")
                          .style("top", "35px")
                          .style("left", "190px");
                      } else {
                        tooltipTRcloud.html("<i>"+nthMostCommon(result_cleaned, 7) +"</i>" )
                          .style("visibility", "visible")
                          .style("top", "40px")
                          .style("left", "190px");
                      }
                    }
                  
                    var selected  = d3.select('input[name=colorButton]:checked').attr('value');
                    initialWord(selected)
                  
                    d3.selectAll("input").on("change", function(s){
                      initialWord(this.value)
                  
                  });

            }

            //Retornar o gráfico de volta ao normal
            var mouseleave = function(d,i) {
            tooltipTR.style("opacity", 0)
            d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none")
                .transition().duration(250)
                .attr("opacity", "1");
            d3.select(this)
                .classed("hover", false)
                .attr("stroke-width", "0px"), 
            tooltipTR.style("visibility", "hidden")
            tooltipTRimg.style("visibility", "hidden")
            tooltipTRcloud.style("visibility", "hidden")
            }

            // Exbibe a área 
            svgTR.selectAll(".layer")
                  .data(stackedData).enter()
                  .append("path").attr("class", "myArea")
                  .style("stroke-width",0.3)
                  //.style("fill",d=> console.log(d))
                  .style("fill", ((d,i)=> color(i+1)))
                  .attr("d",area)
                  .on("mousemove", mousemove)
                  .on("mouseover", mouseover)
                  .on("mouseleave", mouseleave)

         }
  
     }

              
          // Criar linha vertical - mouse
    var vertical = d3.select("#themeRiver")
      .append("path").attr("class", "remove")
      .style("position", "absolute")
      .style("z-index", "19")
      .style("width", "1.65px")
      .style("height", "190px")
      .style("top", "60px")
      .style("bottom", "20px")
      .style("left", "0px")
      .style("right", "200px")
      .style("background", "#ff5")
         
    d3.select("#themeRiver")
      .on("mousemove", function(){  
            mousex = d3.mouse(this);
            mousex = mousex[0] + 5;
            vertical.style("left", mousex + "px" )})
      .on("mouseover", function(){  
            mousex = d3.mouse(this);
            mousex = mousex[0] + 5; 
            vertical.style("left", mousex + "px")})

})
