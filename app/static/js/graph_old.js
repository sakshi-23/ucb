$(function() {
    $("#colorText").on("blur",function(){
        var unique = {};
        color = d3.scaleOrdinal(d3_category20);
        colorSeq = d3.scaleQuantize().domain([0,9]).range(seq);
        val = this.value;
        all_divergent=true;
        svg.selectAll("circle")
          .attr("fill", function(d) {
           var data  = d[val]
            if(isNaN(parseInt(data))){
                if (!(data in unique))
                unique[data]=0;
                unique[data]+=1;
                return color(data);
            }

            else{
                all_divergent=false
                if(parseInt(data)>9)
                    data=9
                return colorSeq(parseInt(data));
           }})

           var div_html=""
       if(all_divergent){
        for (key in unique){
            if(key!="null" && key!='undefined')
            div_html+="<div class='legend-item'><div class='doc' style='background:"+color(key)+"'></div><span>"+key+"("+unique[key]+")"+"</span></div>"
        }
       }
       $(".legend").html(div_html);
    } )




    $("#highlightText").on("blur",function(){
     var val = this.value.split(":");
     if(val.length==2){
        svg.selectAll("circle")
          .style("stroke", function(d) {
           if(d[val[0]]==val[1])
           return "yellow";
           })
           .style("stroke-width", function(d) {
            if(d[val[0]]==val[1])
                return "2px";
            return "1px"
            });
       }
       else{
        svg.selectAll("circle").style("stroke","")
                                .style("stroke-width","1px");
       }

    });

    $("#update").on("click",function(){
        reMake();
    })
    $("#select-view").val("graphview");


});

var svg = d3.select("svg"),
        width = $(window).width()*.85,
        height = $(window).height()-150;
var radius=6;

var forceCharge = d3.forceManyBody();
forceCharge.distanceMax(50)


function createVis(graph){
    radius = 6*width/graph.nodes.length;
    if (radius>8)
        radius=8;
    if (radius<4)
        radius=4;
    simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", forceCharge)
        .force("center", d3.forceCenter(width / 2, height / 2));

    svg.selectAll("g").remove();

    svg
        .attr("width",width)
        .attr("height",height)

    var link = svg
        .append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

    link.append("title")
      .text(function(d) {
        return d.connection_param
        })

    var node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(graph.nodes)
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", radius)
      .on("click",showDetails)
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
          )

    node.append("title")
      .text(function(d) {
        var txt = ""
         for (var i in keys){
            key=keys[i]
            txt+=key+":"+d[key]+"|"
        }
      return txt; });

    simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

    simulation.force("link")
      .links(graph.links);

    function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
        .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });

    }
    $(".loader").hide();

    $("#colorText").trigger("blur");
    $("#highlightText").trigger("blur");

}


function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}