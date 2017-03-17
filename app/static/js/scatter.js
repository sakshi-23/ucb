var all_doctors;
$(function() {
     radius=6;
     padding=1;
     $("#colorText").on("blur",function(){
        var unique = {};
        color = d3.scale.category20();
        colorSeq = d3.scale.ordinal().domain([0,9]).range(seq);
//        colorSeq = d3.scaleQuantize().domain([0,9]).range(seq);
//        colorSeq =  d3.scaleOrdinal(d3_category20);
        val = this.value;


        all_divergent=true;
        svg.selectAll("circle")
          .style("fill", function(d) {
           var data  = d[val]
            if(isNaN(parseInt(data))){
                if (!(data in unique))
                unique[data]=0;
                unique[data]+=1;
                if(data==null || data==undefined){
                    return "gray";
                }
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
            div_html+="<div class='legend-item data-attr='"+val+":"+key+"'><div class='doc' style='background:"+color(key)+"'></div><span>"+key+"("+unique[key]+")"+"</span></div>"
        }
       }
       else{
       for (key in unique){
            if(key!="null")
            div_html+="<div class='legend-item data-attr='"+val+":"+key+"''><div class='doc' style='background:"+colorSeq(key)+"'></div><span>"+key+"("+unique[key]+")"+"</span></div>"
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

    });

     $("input[name='param']").on("blur",function(){
        createVis(all_doctors);

     });

    $("#update").on("click",function(){
        reMake();
    })
    $("#select-view").val("scatterview");


});

var svg = d3.select("svg"),
        width = $(window).width()-300,
        height = $(window).height()-250,
        margin = {top: 20, right: 20, bottom: 30, left: 50};


function getUnique(data,param){
    var vals= {}
    for (var i in data){
        vals[data[i][param]]=1
    }
    return Object.keys(vals);
}


    var controls = d3.select(".right-tile").append("label")
        .attr("id", "controls");
    var checkbox = controls.append("input")
        .attr("id", "collisiondetection")
        .attr("type", "checkbox");
    controls.append("span")
        .text("Collision detection");

function createVis(input){
    color = d3.scale.category20();
        colorSeq = d3.scale.ordinal().domain([0,9]).range(seq);
    var xParam = $("#xParam").val();
    var yParam = $("#yParam").val();
    var data = input.nodes;
    all_doctors=input;
    svg.selectAll("g").remove();
     svg.selectAll("circle").remove();

    var g = svg
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + (margin.left)+ "," + margin.top + ")");
    var y = d3.scale.linear().range([height, 0]);
    var x = d3.scale.linear().range([0, width]);
    y.domain([-3, d3.max(data, function(d) { return d[yParam]+2; })]);
    x.domain([-3, d3.max(data, function(d) { return d[xParam] })]);


     if(isNaN(y.domain()[1])){
         if(d3.scalePoint){
            y = d3.scalePoint().domain(getUnique(data,yParam)).range([ height,0]);
         }
         else{
             y =d3.scale.ordinal()
        .domain(getUnique(data,yParam))
        .rangePoints([ height,0]);
         }
     }

     if(isNaN(x.domain()[1])){
        if(d3.scalePoint){
             x = d3.scalePoint().domain(getUnique(data,xParam)).range([0, width]);
        }
          else{
        x =d3.scale.ordinal()
        .domain(getUnique(data,xParam))
        .rangePoints([0, width]);

     }


     }




//       var node =g
//      .selectAll("circle")
//      .data(data)
//      .enter().append("circle")
//      .attr("r", 6)
//      .attr("class", "node")
//      .style("opacity", "0.6")
//      .style("stroke", "#949494")
//      .attr("cx", function(d) { return x(d[xParam])+Math.random()*5 })
//      .attr("cy", function(d) { return y(d[yParam])+Math.random()*5; })
//      .on("click",showDetails)






  var force = d3.layout.force()
    .nodes(data)
    .size([width, height])
    .on("tick", tick)
    .charge(-1)
    .gravity(0)
    .chargeDistance(20);
//
//  x.domain(d3.extent(data, function(d) { return d[xParam]; })).nice();
//  y.domain(d3.extent(data, function(d) { return d[yParam]; })).nice();

  // Set initial positions
  data.forEach(function(d) {
    d.x = x(d[xParam]);
    d.y = y(d[yParam]);
    d.radius = radius;
  });

    var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text(xParam);

  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(30,0)")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(yParam)


    d3.selectAll(".tick")
       .style("opacity",function(d){
            if (d<0) return 0});

  var node = svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 6)
      .style("opacity", 0.6)
      .style("stroke", "#949494")
      .attr("cx", function(d) { return x(d[xParam]) })
      .attr("cy", function(d) { return y(d[yParam]) })
      .on("click",showDetails)


  d3.select("#collisiondetection").on("change", function() {
    force.resume();
  });

  force.start();

  function tick(e) {
    node.each(moveTowardDataPosition(e.alpha));

    if (checkbox.node().checked) node.each(collide(e.alpha));

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }

  function moveTowardDataPosition(alpha) {
    return function(d) {
      d.x += (x(d[xParam]) - d.x) * 0.1 * alpha;
      d.y += (y(d[yParam]) - d.y) * 0.1 * alpha;
    };
  }

  // Resolve collisions between nodes.
  function collide(alpha) {
    var quadtree = d3.geom.quadtree(data);
    return function(d) {
      var r = d.radius + radius + padding,
          nx1 = d.x - r,
          nx2 = d.x + r,
          ny1 = d.y - r,
          ny2 = d.y + r;
      quadtree.visit(function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== d)) {
          var x = d.x - quad.point.x,
              y = d.y - quad.point.y,
              l = Math.sqrt(x * x + y * y),
              r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
          if (l < r) {
            l = (l - r) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            quad.point.x += x;
            quad.point.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    };
  }






//
//
//
//
//  // Add the X Axis
//  g.append("g")
//      .attr("transform", "translate(0," + height + ")")
//      .call(d3.axisBottom(x));
//
// // Add the Y Axis
//  g.append("g")
//      .call(d3.axisLeft(y))
//      .attr("transform",
//          "translate(" + (-margin.left/4)+ ",0 )");
//
//  g.append("text")
//      .attr("transform", "rotate(-90)")
//      .attr("y", 0 - margin.left)
//      .attr("x",0 - (height / 2))
//      .attr("dy", "1em")
//      .style("text-anchor", "middle")
//      .text(yParam);
//
//g.append("text")
//      .attr("transform",
//            "translate(" + ((width + margin.right + margin.left)/2) + " ," +
//                           (height + margin.bottom ) + ")")
//      .style("text-anchor", "middle")
//      .text(xParam);










    node.append("title")
      .text(function(d) {
        var txt = ""
         for (var i in keys){
            key=keys[i]
            txt+=key+":"+d[key]+"|"
        }
      return txt; });





    $(".loader").hide();
     $("#colorText").trigger("blur");
    $("#highlightText").trigger("blur");

}
