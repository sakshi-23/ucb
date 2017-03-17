
$(function() {

$("#mynetwork").css("height",($(window).height())+"px");
$("#mynetwork").css("width",($(window).width()-50)+"px");
var color = d3.scaleOrdinal(d3.schemeCategory20b);
 $("#submit").on("click",function(){
        reMake();


    });

    $("select").on("change",function(){
        reMake()
    })

     $("#highlightText").on("blur",function(){
         val = this.value.split(":");
         if(val.length<2)
            return
        d3.selectAll(".doc")
          .style("border", function(d) {
           if(this.getAttribute(val[0])==val[1])
           return "1px solid red";
           })

    });
 function reMake(){
//    keys = ['City', 'State', 'Current_hospital', 'Medical School','Internship', 'Residency', 'Grants_count',
//                    'Pubs_count', 'Awards_count', 'Memberships_count', 'Certificates_count']
//
        $("#mynetwork").html("");

        mynetwork
        similarity_params={}
        $(".dropdown-menu input").each(function(){
            similarity_params[$(this).attr("id")]=$(this).val()
        })
//        similarity_params={'Pubs_count':1,'Awards_count':5}
        $.ajax({
            type: "GET",
            url: "/data/get-all-doctors2",
            data: {
                    "search_params": $("#searchText").val(),
                    "limit":$("#limit").val(),
                    "threshold":$("#threshold").val(),
                    "similarity_params":JSON.stringify(similarity_params)
                    },
            contentType: "application/json",
            success: function (result) {
                graph=JSON.parse(result);
                createGraph(graph);
            },
            error: function (xhr, textStatus, errorThrown) { console.log(textStatus + ':' + errorThrown); }
            });
    }

    function createGraph(graph){
        color_val= $("#colorText").val();
        graph.nodes.forEach(function(d) {
            d.color = color(d[color_val]);
        });

        var gC = -5*graph.links.length


        // create an array with nodes
        var nodes = new vis.DataSet(graph.nodes
        );

        // create an array with edges
        var edges = new vis.DataSet(graph.links
           );

        // create a network
        var container = document.getElementById('mynetwork');

        // provide the data in the vis format
        var data = {
            nodes: nodes,
            edges: edges
        };
       var options = {
      nodes: {
        shape: 'dot',
        scaling: {
          min: 10,
          max: 30
        },
        font: {
          size: 12,
          face: 'Tahoma'
        }
      },
      edges: {
        width: 0.15,
        color:  'gray',
        smooth: {
          type: 'continuous'
        }
      },
      physics: {
        stabilization: false,
        barnesHut: {
          gravitationalConstant: gC,
          springConstant: 0.001,
          springLength: 200
        }
      },
      interaction: {

        tooltipDelay: 200,
        hideEdgesOnDrag: true
      }

    };

        // initialize your network!
        var network = new vis.Network(container, data, options);


    }




    reMake()

});