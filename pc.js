// Opção de mostrar total de dívidas naquela versão (linha) ao mouseover

// firebase init
// Select "Hosting: Configure and deploy..."
// Selecionar -> Public N N N N
// final -> firebase deploy


/*
  <script src="pc.js"></script>
  <script src="mp.js"></script>
  <script src="sbb.js"></script>
  <script src="tr.js"></script>
*/

// construindo margens 
const MARGIN = {LEFT:50 , RIGHT:10, TOP:40, BOTTOM:20}
const WIDTH = 490 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 200  - MARGIN.BOTTOM


// criando área para as coord paralelas, já editadas
const svgPC = d3.select("#parallelCordinates").append("svg") 
        .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
        .attr("height",HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
    .append("g")
        .attr("transform", "translate(" + MARGIN.LEFT + "," + MARGIN.TOP + ")");

const debts = []; 

var tooltipPC = d3.select("#parallelCordinates")
    .style("font-family", "Verdana" )
    .append("div").attr("class", "remove")
    .style("position", "relative")

    //var data =[]


d3.json("data/rm_technical_debt.json").then(function(dataPC) {

        // Create initial graph
     updatePC("jUnity") 
     d3.select('.form-group')
        .on("change",function(){
            var selectedPC = d3.select("#selectRep").node().value;//var selectedPC = d3.select(this).property("value")
            console.log(selectedPC)
            svgPC.selectAll("*").remove();
        updatePC(selectedPC)
        })

    
    // Function to create the initial graph
    function updatePC(selectedPC){ 
    //var updatePC = function (selectedPC){

    if (selectedPC == 'jUnity'){ 

    data = dataPC.slice(0,754) // usa apenas o repositorio jUnit, comentar se quiser testar todo repositório
    const tm = data.length  //tamanho do db

    // Quantidade e tipos de dts contidos
    for (let i=0; i<tm; i++){
        for (let j=0; j< data[i].debts.length; j++){
            for (let dt in data[i].debts[j]){
                //console.log(data[i].debts[j].name)  mostra as dividas contidas
            }
            debts.push(data[i].debts[j].name)
        }
    }
    //console.log(debts.length)  //Array total de dividas

    //Transformação dos dados
    //Dados com versões como chave
    var priority_order = ["CODE_DEBT", "UNKNOWN_DEBT", "DEFECT_DEBT", 
    "REQUIREMENT_DEBT", "TEST_DEBT", "DESIGN_DEBT"];

    const byVersion = d3.nest()
        .key(d=> d.reference)
        .key(d=> d.debts[d.debts.length -1].name).sortKeys((a,b) =>priority_order.indexOf(a) - priority_order.indexOf(b))
        .entries(data)


        // PRE PROCESSAMENTO
        //Construção do dataset p/ eixos corretos
        const dataset = new Array();
        for (version_pc in byVersion){
            dataset[version_pc] = {key: byVersion[version_pc].key, values:{}}//dataset[version_pc] = {key: byVersion[version_pc].key,  values:{key:"debts",values:"score"}}
            len = byVersion[version_pc].values.length;
            keys = byVersion[version_pc].values.map(d=>(d.key))  //campo para analise
            dataset[version_pc].values = new Array();
            for (dt in priority_order){
                dataset[version_pc].values[dt] = {key:priority_order[dt], values:function(){}}
            }
        }
        i=[];
        for (version_pc in dataset){
            len = dataset[version_pc].values.length;
            keys = byVersion[version_pc].values.map(d=>(d.key))
            values = byVersion[version_pc].values.map(d=>(d.values))
            //console.log(values)
            t=0
            while (t<len){
                dataset[version_pc].values[t] = {key:priority_order[t],
                    values: keys.indexOf(dataset[version_pc].values[t].key) == -1? ""
                            :values[t] == undefined?values[t-1] :values[t]                                  
                    }
                t++
            }
        }   console.log(dataset)

 
    //Dados com dividas como chave  
    const byDebts = d3.nest()
        .key(d=> d.debts[d.debts.length -1].name).sortKeys((a,b) =>priority_order.indexOf(a) - priority_order.indexOf(b))
        .key(d=> d.reference)
        .rollup(v => v.length, d => d.debts[d.debts.length -1].name)
        //.rollup(v=> d3.sum(v, d=> d.debts.length))
        .entries(data)
            //dimensões
        var dimensions  =[]
            for (i in byDebts){ dimensions.push(byDebts[i].key) }
            //console.log(dimensions)

        var versoes  =[]
            for (i in byVersion){ versoes.push(byVersion[i].key) }
            versoes = versoes.sort()                 // ordenar
            versoes.push(versoes.splice(0,1)[0])     // ordenar
            //console.log(versoes)

                //Construção do dataset BYDEBTS p/ eixos corretos
            const dts = new Array();
            for (version_pc in byDebts){
                dts[version_pc] = {key: byDebts[version_pc].key, values:{}}//dataset[version] = {key: byVersion[version].key,  values:{key:"debts",values:"score"}}
                len = byDebts[version_pc].values.length;
                keys = byDebts[version_pc].values.map(d=>(d.key))  //campo para analise
                dts[version_pc].values = new Array();
                for (v in versoes){
                    dts[version_pc].values[v] = {key:versoes[v], values:function(){}}
                    }
              }
            i=[];
            for (dt in dts){
                len = dts[dt].values.length;
                keys = byDebts[dt].values.map(d=>(d.key))
                //console.log(keys)
                values = byDebts[dt].values.map(d=>(d.value))
                //console.log(values)
                t=0
                while (t<len){
                    dts[dt].values[t] = {key:versoes[t],
                        values: keys.indexOf(dts[dt].values[t].key) == -1? 0
                                :values[t] == undefined?values[keys.indexOf(dts[dt].values[t].key)] :values[t]                                  
                        }
                    t++
                }
            }   console.log(dts)



  // Construindo os eixos 
  yPC = {}
  for (i in dimensions) {
    var name = dimensions[i];
    yPC[name] = d3.scaleLinear()
        .domain([(byDebts[i]["values"].length >=byVersion.length)? d3.min(byDebts[i]["values"], d => d.value): 0,
                d3.max(byDebts[i]["values"], d => d.value)])
        .range([HEIGHT, 0])
    }
    console.log(byDebts)

    var xPC = d3.scalePoint()
            .domain(dimensions)
            .range([0, WIDTH],1)


            
// A função path pega uma linha como entrada e retorna as coordenadas xey da linha a ser desenhada
function path(d) {
    var line = (d.values.map((k,i)=> [k.key, k.values.length])) 
    var line2 = dimensions.map((p,i)=> (line[p,i]==undefined)
                                                ?[p,0]
                                                :line[p,i])  
    //return d3.line()(dimensions.map((p,i)=>  [position(p), yPC[p](line2[i][1])]))
    return d3.line()(dimensions.map((p,i)=> [position(p), yPC[line2[i][0]](line2[i][1])]))
  }
console.log(dataset)
console.log(dataset[0].key)
console.log(dataset[0].values.length)


 //Funções p/ arrastar
function position(d) {
        var v = dragging[d];
        return v == null ? xPC(d) : v;
    }
function transition(g) {
        return g.transition().duration(500);    
    }

var dragging = {},
    foreground;
    
foreground = svgPC.append("g")
    .attr("class", "foreground")
    .selectAll("path")
    .data(dataset)
    .enter().append("path")
    .attr("d", path);


                
  // Desenhando os eixos
  var g = svgPC.selectAll(".dimension")
    // Para cada dimensão, adiciono um elemento 'g':
    .data(dimensions).enter().append("g")
    .attr("class", "dimension")
    .attr("transform", d=> "translate(" + xPC(d) + ")")
    .call(d3.drag()
        //.subject(function(d) { return {x: xPC(d) }; })
        .on("start", function(d) {
            dragging[d] = xPC(d) +console.log(d) + console.log(xPC(d)) ;
            //background.attr("visibility", "hidden");
            })
        .on("drag", function(d) {
            dragging[d] = Math.min(WIDTH, Math.max(0, d3.event.x));
            foreground.attr("d", path);
            dimensions.sort((a,b) =>position(a) - position(b));
            xPC.domain(dimensions);
            g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
            })
        .on("end", function(d) {
            delete dragging[d];
            transition(d3.select(this)).attr("transform", "translate(" + xPC(d) + ")");
            transition(foreground).attr("d", path);

    }))


    // informação adicional ao mouseover
svgPC.selectAll("path")
    .on("mouseover",d=>{
        console.log(d.key) +
        d3.select("#versions")
        tooltipPC.html("Version "+ d.key + "<br>" +" Total debts in this version: " + d3.sum(d.values, j=> j.values.length))
        .style("visibility", "visible")
        .style("width", "400px")
        .style("height", "50px")
        .style("top", "-15px")
        .style("left", "50px")
        .style("padding", "0px")
    })
    .append("title")
    .text(d=> "Version: "+ d.key)

        g.append("g")
            .attr("class", "axis")
            .each(function(d) { d3.select(this).call(d3.axisLeft().scale(yPC[d])); })
        g.append("text")
            .style("text-anchor", "middle")
            .attr("y", -20)
            .text(function(d) { return d; })
            .text(d => d.replace("_", " "))  // retira o _Debt dos nomes
            .style("font-size", "11px")
            .attr("transform", "rotate(-15)" );//rotaçao no nome
    
            
      }else {
          
        data = dataPC.slice(755,6838) // usa apenas o repositorio jUnit, comentar se quiser testar todo repositório
        const tm = data.length  //tamanho do db
        //console.log(tm)
        // Quantidade e tipos de dts contidos
        for (let i=0; i<tm; i++){
            for (let j=0; j< data[i].debts.length; j++){
                for (let dt in data[i].debts[j]){
                    //console.log(data[i].debts[j].name)  mostra as dividas contidas
                }
                debts.push(data[i].debts[j].name)
            }
        }
        //console.log(debts.length)  //Array total de dividas
    
        //Transformação dos dados
        //Dados com versões como chave
        var priority_order =["BUILD_DEBT", "DOCUMENTATION_DEBT", "CODE_DEBT", "UNKNOWN_DEBT", 
        "DEFECT_DEBT", "REQUIREMENT_DEBT", "TEST_DEBT", "DESIGN_DEBT"]
    
        const byVersion = d3.nest()
            .key(d=> d.reference)
            .key(d=> d.debts[d.debts.length -1].name).sortKeys((a,b) =>priority_order.indexOf(a) - priority_order.indexOf(b))
            .entries(data)
        console.log(byVersion)
    
            // PRE PROCESSAMENTO
            //Construção do dataset p/ eixos corretos
            const dataset = new Array();
            for (version_pc in byVersion){
                dataset[version_pc] = {key: byVersion[version_pc].key, values:{}}//dataset[version_pc] = {key: byVersion[version_pc].key,  values:{key:"debts",values:"score"}}
                len = byVersion[version_pc].values.length;
                keys = byVersion[version_pc].values.map(d=>(d.key))  //campo para analise
                dataset[version_pc].values = new Array();
                for (dt in priority_order){
                    dataset[version_pc].values[dt] = {key:priority_order[dt], values:function(){}}
                }
            }
            i=[];
            for (version_pc in dataset){
                len = dataset[version_pc].values.length;
                keys = byVersion[version_pc].values.map(d=>(d.key))
                values = byVersion[version_pc].values.map(d=>(d.values))
                //console.log(keys)
                t=0
                while (t<len){
                    dataset[version_pc].values[t] = {key:priority_order[t],
                        values: keys.indexOf(dataset[version_pc].values[t].key) == -1? ""
                                :values[t] == undefined?values[t-1] :values[t]                                  
                        }
                    t++
                }
            }   console.log(dataset)
    
     
        //Dados com dividas como chave  
        const byDebts = d3.nest()
            .key(d=> d.debts[d.debts.length -1].name).sortKeys((a,b) =>priority_order.indexOf(a) - priority_order.indexOf(b))
            .key(d=> d.reference)
            .rollup(v => v.length, d => d.debts[d.debts.length -1].name)
            //.rollup(v=> d3.sum(v, d=> d.debts.length))
            .entries(data)
                //dimensões
            var dimensions  =[]
                for (i in byDebts){ dimensions.push(byDebts[i].key) }
                //console.log(dimensions)
    
            var versoes  =[]
                for (i in byVersion){ versoes.push(byVersion[i].key) }
                versoes = versoes.sort()                 // ordenar
                versoes.push(versoes.splice(0,1)[0])     // ordenar
                //console.log(versoes)
    
                    //Construção do dataset BYDEBTS p/ eixos corretos
                const dts = new Array();
                for (version_pc in byDebts){
                    dts[version_pc] = {key: byDebts[version_pc].key, values:{}}//dataset[version] = {key: byVersion[version].key,  values:{key:"debts",values:"score"}}
                    len = byDebts[version_pc].values.length;
                    keys = byDebts[version_pc].values.map(d=>(d.key))  //campo para analise
                    dts[version_pc].values = new Array();
                    for (v in versoes){
                        dts[version_pc].values[v] = {key:versoes[v], values:function(){}}
                        }
                  }
                i=[];
                for (dt in dts){
                    len = dts[dt].values.length;
                    keys = byDebts[dt].values.map(d=>(d.key))
                    //console.log(keys)
                    values = byDebts[dt].values.map(d=>(d.value))
                    //console.log(values)
                    t=0
                    while (t<len){
                        dts[dt].values[t] = {key:versoes[t],
                            values: keys.indexOf(dts[dt].values[t].key) == -1? 0
                                    :values[t] == undefined?values[keys.indexOf(dts[dt].values[t].key)] :values[t]                                  
                            }
                        t++
                    }
                }  
    
    
      // Construindo os eixos 
      yPC = {}
      for (i in dimensions) {
        var name = dimensions[i];
        yPC[name] = d3.scaleLinear()
            .domain([(byDebts[i]["values"].length >=byVersion.length)? d3.min(byDebts[i]["values"], d => d.value): 0,
                    d3.max(byDebts[i]["values"], d => d.value)])
            .range([HEIGHT, 0])
        }
        //console.log(byDebts)
    
        var xPC = d3.scalePoint()
                .domain(dimensions)
                .range([0, WIDTH],1)
    
    
                
    // A função path pega uma linha como entrada e retorna as coordenadas xey da linha a ser desenhada
    function path(d) {
        var line = (d.values.map((k,i)=> [k.key, k.values==undefined?24 :k.values.length])) 
        var line2 = dimensions.map((p,i)=> line[p,i]) 
        return d3.line()(dimensions.map((p,i)=> [position(p), yPC[line2[i][0]](line2[i][1])]))
      }
    
     
    
     //Funções p/ arrastar
    function position(d) {
            var v = dragging[d];
            return v == null ? xPC(d) : v;
        }
    function transition(g) {
            return g.transition().duration(500);    
        }
    
    var dragging = {},
        foreground;
    
        
    foreground = svgPC.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(dataset)
        .enter().append("path")
        .attr("d", path);
    
    
                    
      // Desenhando os eixos
      var g = svgPC.selectAll(".dimension")
        // Para cada dimensão, adiciono um elemento 'g':
        .data(dimensions).enter().append("g")
        .attr("class", "dimension")
        .attr("transform", d=> "translate(" + xPC(d) + ")")
        .call(d3.drag()
            //.subject(function(d) { return {x: xPC(d) }; })
            .on("start", function(d) {
                dragging[d] = xPC(d) +console.log(d) + console.log(xPC(d)) ;
                //background.attr("visibility", "hidden");
                })
            .on("drag", function(d) {
                dragging[d] = Math.min(WIDTH, Math.max(0, d3.event.x));
                foreground.attr("d", path);
                dimensions.sort((a,b) =>position(a) - position(b));
                xPC.domain(dimensions);
                g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
                })
            .on("end", function(d) {
                delete dragging[d];
                transition(d3.select(this)).attr("transform", "translate(" + xPC(d) + ")");
                transition(foreground).attr("d", path);
        }))
    
    
        // informação adicional ao mouseover
    svgPC.selectAll("path")
        .on("mouseover",d=>{
            console.log(d.key) +
            d3.select("#versions")
            tooltipPC.html("Version "+ d.key + "<br>" +" Total debts in this version: " + d3.sum(d.values, j=> j.values.length))
            .style("visibility", "visible")
            .style("width", "400px")
            .style("height", "50px")
            .style("top", "-15px")
            .style("left", "50px")
            .style("padding", "0px")
            /*.style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")*/
        })
        .append("title")
        .text(d=> "Version: "+ d.key)
    
    
    
    
            g.append("g")
                .attr("class", "axis")
                .each(function(d) { d3.select(this).call(d3.axisLeft().scale(yPC[d])); })
            g.append("text")
                .style("text-anchor", "middle")
                .attr("y", -20)
                .text(function(d) { return d; })
                .text(d => d.replace("_", " "))  // retira o _Debt dos nomes
                .style("font-size", "11px")
                .attr("transform", "rotate(-15)" );//rotaçao no nome
            /*g.append("text")
                .style("text-anchor", "middle")
                .attr("y", -20)
                .attr("x", -7)
                .text(d => d.replace("_", " "))  // retira o _Debt dos nomes
                .style("fill", "black")
                .style("font-size", "11px")
                .style("font-family", "sans-serif")
                .attr("transform", "rotate(-15)" );//rotaçao no nome*/
    
                //ADD O NOME DEBTS NO CABEÇALHO
        /*svgPC.append("text")
                .text("Debts")
                .attr("fill", "black")
                .style("font-family", "sans-serif")
                .style("font-size", "15px")
                .attr("x", -70)
                .attr("y", -15)
                .style("background-color", "silver")*/

      }
      
    }
    
})