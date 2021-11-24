// construindo margens 
const MARGIN5 = {LEFT:15 , RIGHT:20, TOP:10, BOTTOM:20}
const WIDTH5 = 230 - MARGIN5.LEFT - MARGIN5.RIGHT
const HEIGHT5 = 700  - MARGIN5.BOTTOM - MARGIN5.TOP


// criando área para as coord paralelas, já editadas
const svgSidebar = d3.select("#sidebarInfo").append("svg") 
        .attr("width", WIDTH5 + MARGIN5.LEFT + MARGIN5.RIGHT)
        .attr("height",HEIGHT5 + MARGIN5.TOP + MARGIN5.BOTTOM)
    .append("g")
        .attr("transform", "translate(" + MARGIN5.LEFT + "," + MARGIN5.TOP + ")")


        /*var databases = ['jUnity','Apache']
        var score = d3.select("#selectRep")
            .selectAll('myOptions')
            .data(databases).enter()
            .append("option")
              .attr("value", d=> d)
              .text(d=> d)*/


// Add the path using this helper function
svgSidebar.append('rect')
  .attr('x', 0)
  .attr('y', 0)
  .attr('width', 200)
  .attr('height', 400)
  .attr('stroke', 'black')
  .attr('fill', '#444');

svgSidebar.append("text")
  .attr("x", 10).attr("y", 20)
  .attr("fill", "rgb(235, 230, 230)")
  .attr("dy", ".35em") //.attr("dy", "0 0.2 -0.1")
  .attr("font-family", "sans-serif")
  .attr("font-size", "18px")
  .attr("font-weight", "bolder")
  .attr("text-decoration", "underline")
  //.attr("stroke","#443")
  //.attr("stroke-width", "0.2px")
  .text("Quantity of Versions")
  info1 = svgSidebar.append("rect")
  .attr('x', 25).attr('y', 38)
  .attr('rx', 20).attr('ry', 38)
  .attr('width', 140).attr('height', 35)
  //.attr('stroke', 'black')
  .attr('fill', "rgb(236, 229, 229)")
  .style("border-width", "4px").style("border-radius", "2px").style("padding", "2px")


svgSidebar.append("text")
  .attr("x", 10).attr("y", 120)
  .attr("fill", "rgb(235, 230, 230)")
  .attr("dy", ".35em") //.attr("dy", "0 0.2 -0.1")
  .attr("font-family", "sans-serif")
  .attr("font-size", "18px")
  .attr("font-weight", "bolder")
  .attr("text-decoration", "underline")
  .text("Quantity of Archives")
  info2 = svgSidebar.append("rect")
  .attr('x', 25).attr('y', 138)
  .attr('rx', 20).attr('ry', 38)
  .attr('width', 140).attr('height', 35)
  .attr('fill', "rgb(236, 229, 229)")
  .style("border-width", "4px").style("border-radius", "2px").style("padding", "2px")

svgSidebar.append("text")
  .attr("x", 20).attr("y", 220)
  .attr("fill", "rgb(235, 230, 230)")
  .attr("dy", ".35em") //.attr("dy", "0 0.2 -0.1")
  .attr("font-family", "sans-serif")
  .attr("font-size", "18px")
  .attr("font-weight", "bolder")
  .attr("text-decoration", "underline")
  .text("Quantity of Debts")
  info3 = svgSidebar.append("rect")
  .attr('x', 25).attr('y', 238)
  .attr('rx', 20).attr('ry', 38)
  .attr('width', 140).attr('height', 35)
  .attr('fill', "rgb(236, 229, 229)")
  .style("border-width", "4px").style("border-radius", "2px").style("padding", "2px")

const debtsSB = [];



d3.json("data/rm_technical_debt.json").then(function(data0) {

  update("jUnity")
  d3.select('#selectRep')
    .on("change", function() { 
      var selectedOption = d3.select(this).property("value")//d3.select("#selectRep").node().value; //
      console.log(selectedOption)
      svgSidebar.selectAll("g").remove();
      debtsSB.length=0;
      update(selectedOption) 
      })


  function update(selectedGroup) {
    //var update = function(selectedGroup) {
    var priority_order = ["CODE_DEBT", "UNKNOWN_DEBT", "DEFECT_DEBT", 
    "REQUIREMENT_DEBT", "TEST_DEBT", "DESIGN_DEBT"];

  
      if (selectedGroup == 'jUnity'){ 
        data1 = data0.slice(0,754) // usa apenas o repositorio jUnit
      }else {
        data1 = data0.slice(755,6838) // usa apenas o repositorio jUnit
      }

        var tm = data1.length  //tamanho do db
        console.log(tm)
  
      // Quantidade e tipos de dts contidos
      for (let i=0; i<tm; i++){
          for (let j=0; j< data1[i].debts.length; j++){
              for (let dt in data1[i].debts[j]){
              }
              debtsSB.push(data1[i].debts[j].name)
          }
      }console.log(debtsSB.length)  //Array total de dividas
  
      const byVersionSB = d3.nest()
          .key(d=> d.reference)
          .key(d=> d.debts[d.debts.length -1].name).sortKeys((a,b) =>priority_order.indexOf(a) - priority_order.indexOf(b))
          .entries(data1)
        console.log(byVersionSB.length) //Array total de Versoes
  
  
      quantVersions = svgSidebar.append("g").append("text")
        .attr("x", 85).attr("y", 62)
        .attr("fill", "#444")
        .attr("font-family", "monospace")
        .attr("font-size", "18px")
        .attr("font-weight", "bolder")
        .text(byVersionSB.length);
  
    svgSidebar.append("g").append("text")
        .attr("x", 75).attr("y", 262)
        .attr("fill", "#444")
        .attr("font-family", "monospace")
        .attr("font-size", "18px")
        .attr("font-weight", "bolder")
        .text(debtsSB.length);
      } 

})



d3v4.csv("data/excomment_mp_completo.csv", function (data2) {  

  /* 
  1 - unir os datasets (fazer um só)
  2 - colocar a condicional nessa vis
  3 - Provavelmente criar uma nova div para buscar o select
  4 -  Passos 2 e 3 na MP
  */

  updateSidebar2("jUnity")  
  d3.select('#formSide')
     .on("change",function(){
         var selectedSide = d3.select("#selectRep").node().value;//var selectedPC = d3.select(this).property("value")
         console.log(selectedSide)
         //svgSidebar.selectAll("g").remove();
         updateSidebar2(selectedSide)
     })


  function updateSidebar2(selectedSide) {

    if (selectedSide == 'jUnity'){ 
      data = data2.slice(0,160) // usa apenas o repositorio jUnit
    }else {
      data = data2.slice(161,1830) // usa apenas o repositorio jUnit
    }

    const arqLength = data.length  //tamanho do db
    console.log(arqLength)

    svgSidebar.append("g")
      .attr("class", "arqLength").append("text")
      .attr("x", 80).attr("y", 162)
      .attr("fill", "#444")
      .attr("font-family", "monospace")
      .attr("font-size", "18px")
      .attr("font-weight", "bolder")
      .text(arqLength + 1);

  }
  

});



 /*
// Dataset
d3.json("data/rm_technical_debt.json").then(function(data0) {

  var priority_order = ["CODE_DEBT", "UNKNOWN_DEBT", "DEFECT_DEBT", 
  "REQUIREMENT_DEBT", "TEST_DEBT", "DESIGN_DEBT"];

  var initialRep = function(group){

    if (group == 'jUnity'){ 
      data1 = data0.slice(0,754) // usa apenas o repositorio jUnit
      var tm = data1.length  //tamanho do db
      console.log(tm)

    // Quantidade e tipos de dts contidos
    for (let i=0; i<tm; i++){
        for (let j=0; j< data1[i].debts.length; j++){
            for (let dt in data1[i].debts[j]){
            }
            debtsSB.push(data1[i].debts[j].name)
        }
    }console.log(debtsSB.length)  //Array total de dividas

    const byVersionSB = d3.nest()
        .key(d=> d.reference)
        .key(d=> d.debts[d.debts.length -1].name).sortKeys((a,b) =>priority_order.indexOf(a) - priority_order.indexOf(b))
        .entries(data1)
      console.log(byVersionSB.length) //Array total de Versoes


    quantVersions = svgSidebar.append("g").append("text")
      .attr("x", 85).attr("y", 62)
      .attr("fill", "#444")
      .attr("font-family", "monospace")
      .attr("font-size", "18px")
      .attr("font-weight", "bolder")
      .text(byVersionSB.length);

  svgSidebar.append("g").append("text")
      .attr("x", 75).attr("y", 262)
      .attr("fill", "#444")
      .attr("font-family", "monospace")
      .attr("font-size", "18px")
      .attr("font-weight", "bolder")
      .text(debtsSB.length);
    } 
    
    
    
    
    else {
    data1 = data0.slice(755,6838) // usa apenas o repositorio APACHE
    var tm = data1.length  //tamanho do db
    console.log(tm)

    for (let i=0; i<tm; i++){
        for (let j=0; j< data1[i].debts.length; j++){
            for (let dt in data1[i].debts[j]){
            }
            debtsSB.push(data1[i].debts[j].name)
        }
    }console.log(debtsSB.length)  //Array total de dividas


    const byVersionSB = d3.nest()
        .key(d=> d.reference)
        .key(d=> d.debts[d.debts.length -1].name).sortKeys((a,b) =>priority_order.indexOf(a) - priority_order.indexOf(b))
        .entries(data1)
      console.log(byVersionSB.length) //Array total de Versoes


  svgSidebar.append("g").append("text")
      .attr("x", 85).attr("y", 62)
      .attr("fill", "#444")
      .attr("font-family", "monospace")
      .attr("font-size", "18px")
      .attr("font-weight", "bolder")
      .text(byVersionSB.length);

  svgSidebar.append("g").append("text")
      .attr("x", 75).attr("y", 262)
      .attr("fill", "#444")
      .attr("font-family", "monospace")
      .attr("font-size", "18px")
      .attr("font-weight", "bolder")
      .text(debtsSB.length);
    }}



          // Create initial graph
          initialRep("jUnity")  
          d3.select("select")
              .on("change",function(d){
                  var selectedRep = d3.select(this).property("value")
                  console.log(this.value); 
                  //d3.select("#remove").remove();
                  svgSidebar.selectAll("g").remove();
                  debtsSB.length = 0; // Resetar array
                  initialRep(selectedRep)
                  
              })

})
*/


