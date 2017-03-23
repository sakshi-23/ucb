var d3_category20 = ["rgb(211, 211, 211)",'rgb(31, 119, 180)', 'rgb(174, 199, 232)', 'rgb(255, 127, 14)', 'rgb(255, 187, 120)', 'rgb(44, 160, 44)', 'rgb(152, 223, 138)', 'rgb(214, 39, 40)', 'rgb(255, 152, 150)', 'rgb(148, 103, 189)', 'rgb(197, 176, 213)', 'rgb(140, 86, 75)', 'rgb(196, 156, 148)', 'rgb(227, 119, 194)', 'rgb(247, 182, 210)', 'rgb(127, 127, 127)', 'rgb(199, 199, 199)', 'rgb(188, 189, 34)', 'rgb(219, 219, 141)', 'rgb(23, 190, 207)', 'rgb(158, 218, 229)',"#feba94", "#0bf990", "#ffaefe", "#c9fecd", "#7fff0c", "#ffbe37", "#a9d858", "#e8e6fd", "#02fee1", "#feec91", "#ffb5ca", "#cecab1", "#7bde8d", "#0bff5c", "#b3e914", "#b7fdff", "#d4ce2c", "#95d0ff", "#93ff6a", "#d0c0ff", "#b6d484", "#77dbc2", "#fec16d", "#f5ff7b", "#47ffba", "#fffcc9", "#55fcff", "#f4fff2", "#ffd702", "#c3ff9a", "#dfc78d", "#fecfc6", "#b1cfd2", "#e5c854", "#02fc1a", "#8bfecc", "#68e270", "#ebff51", "#fed2fb", "#5be532", "#cbd367", "#a9d3b4", "#c3fd61", "#71d9e0", "#ebffaf", "#90d9a3", "#2ee761", "#b7d630", "#d5c5c9", "#8bdf34", "#cad7a4", "#feb2e4", "#fff240", "#b4e7ff", "#39e2b3", "#feddb9", "#7cffa1", "#bec8f0", "#a0f277", "#affdb5", "#affde5", "#feea61", "#15e1d3", "#a3fd36", "#ddfc0e", "#d3de01", "#d1cd7b", "#7afee7", "#ecc62b", "#e0f98f", "#ffe9ea", "#9ada76", "#79d9f8", "#cdfe7f", "#f8ccdb", "#2ce590", "#c5ebdc", "#ffcb8f", "#ddf1ce", "#96d5cc", "#e7c670", "#ceda51", "#ffb8ab", "#dbf5fe", "#f1bdfe", "#66fd62", "#d8c2e0", "#69ff84", "#a1df91", "#5aff3e", "#fec307", "#80fab3", "#22deeb", "#fec658", "#d8ded9", "#c6eeaa", "#ebe5a1", "#f7e9d4", "#8af4ef", "#f1e977", "#82e054", "#9af592", "#c2c9dc", "#d7f561", "#6fddb1", "#edc0a4", "#b8db73", "#b7fe07", "#7ae208", "#a3de44", "#8bfd4e", "#f0f259", "#93d3e1", "#9fe6c1", "#e6ffc5", "#acd49f", "#4ce29e", "#d7e48b", "#fbdd95", "#b8cfbe", "#66e34c", "#e6d40b", "#21fff5", "#dfd0ff"]
var seq  =['#f7fbff','#deebf7','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#08519c','#08306b']
var all_doctors;
var results;
if(!d3.scaleOrdinal){
    d3.scaleOrdinal = d3.scale.ordinal
    d3.scaleOrdinal = d3.scale.ordinal
    d3.schemeCategory10 =d3_category20;
}
var color = d3.scaleOrdinal(d3_category20);
var colorSeq = d3.scaleOrdinal().domain([0,9]).range(seq);
var colorBorder=d3.scaleOrdinal(d3.schemeCategory10);
var keys_all=['fullname','NPI','city','Alignment_for_Partnership', 'Awards_count', 'BRV_N_1', 'BRV_OL_Investigator',  'Certificates_count', 'Comments', 'Current_MSL', 'Disease_State', 'Drop_down_menu_key', 'Education', 'Elderly', 'Grants_count', 'Hospital', 'Interaction_MSL', 'KOL_Classification',  'MSL', 'Memberships_count',  'One_Key_ID', 'Organization', 'Pubs_count', 'Reason_for_Unalignment',   'Social_Media_Presence', 'Specialty', 'state', 'Strategic_Designation',  'Territory', 'Top_100','URL']
var keys=['fullname','NPI','city','state', 'Current_hospital']
var colorTextValue=sortTextValue=searchTextValue=limitValue='';
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

 function showDetails(d){
        if(d3.event){
             d3.selectAll(".node").classed('selected',false);
          d3.select(d3.event.target).classed('selected',true);
        }

        var str_html =[];
        for (var i in keys_all){
            var key = keys_all[i];
            var val  = d[key];
            if (!val || val=="undefined"){
               continue;
            }
            str_html.push("<div data-attr='"+key+":"+val+"' class='physician-details'><span>"+key.toUpperCase()+":</span><strong><span>"+val+"</span></strong></div>")
            $('#sidebar-menu').html(str_html);
        }
         $('body').removeClass('nav-sm').addClass('nav-md');

    }

      function reMake(){
        $(".loader").show();
        similarity_params={}
        $(".dropdown-menu input").each(function(){
            similarity_params[$(this).attr("id")]=$(this).val()
        })
        d3.selectAll("g").remove();
        $("#grid").html('');
        $.ajax({
            type: "GET",
            url: "/data/get-all-doctors",
            data: {
                    "search_params": $("#searchText").val(),
                    "limit":$("#limit").val(),
                    "threshold":$("#threshold").val()?$("#threshold").val():4,
                    "similarity_params":JSON.stringify(similarity_params)
                    },
            contentType: "application/json",
            success: function (result) {
                results=JSON.parse(result);
                createVis(results);
                var all_doctors =results.nodes;
                var dic = {"KOL_national_count":0,"KOL_local_count":0,"KOL_regional_count":0,"Top_100_count":0,"count":all_doctors.length}
                for (var i in all_doctors){
                     if (all_doctors[i]["Top_100"] && all_doctors[i]["Top_100"]=="Yes"){
                        dic["Top_100_count"]+=1
                     }
                     if (all_doctors[i]["KOL_Classification"] && all_doctors[i]["KOL_Classification"]=="National"){
                        dic["KOL_national_count"]+=1
                     }
                      if (all_doctors[i]["KOL_Classification"] && all_doctors[i]["KOL_Classification"]=="Regional"){
                        dic["KOL_regional_count"]+=1
                     }
                      if (all_doctors[i]["KOL_Classification"] && all_doctors[i]["KOL_Classification"]=="Local"){
                        dic["KOL_local_count"]+=1
                     }
                }
                for (var d in dic){
                    $("#"+d+" .count").html(dic[d]);
                }

            },
            error: function (xhr, textStatus, errorThrown) { console.log(textStatus + ':' + errorThrown); }
            });
    }

$(function() {
     var $input = $('#refresh');

    $input.val() == 'yes' ? location.reload(true) : $input.val('yes');

   $("#searchText").val(getUrlParameter('searchText'));
   $("#limit").val(getUrlParameter('limit'));
   $("#colorText").val(getUrlParameter('colorText'));
   $("#highlightText").val(getUrlParameter('highlightText'));
   $("#sortText").val(getUrlParameter('sortText'));




     $("#searchText").on("blur",function(){
        var val = this.value;
        if (val == searchTextValue)
            return;
        searchTextValue =val;
        reMake();
    });
    $("#limit").on("blur",function(){
        var val = this.value;
        if (val == limitValue)
            return;
        limitValue =val;
        reMake();
    });
     $("body").on("click",'.physician-details',function(){
            $(".physician-details").removeClass("selected");
            $(this).addClass("selected");

            if($(this).attr("data-attr").split(":")[0]=='URL'){
                     window.open($(this).attr("data-attr").substring(4), '', '');
                    return;
            }

         $("#highlightText").val($(this).attr("data-attr"));
         $("#highlightText").trigger("blur");
    })

     $("#select-view").on("change",function(){
        window.location.href = "/"+$(this).val()+"?search_params="+$("#searchText").val()+"&limit="+$("#limit").val()+"&colorText="+$("#colorText").val()+"&highlightText="+$("#highlightText").val()+"&sortText="+$("#sortText").val();
    })

    reMake();

    });

//
//$(".right_col").on("click",function(e){
//
//     var container = $("#grid");
//     var container2 = $("svg");
//    if (!container.is(e.target) && container.has(e.target).length === 0 &&
//            !container2.is(e.target) && container2.has(e.target).length === 0 )
//            $("#highlightText").val("").trigger("blur");
//})

$("body").on("click",function(){
    var url =window.location.href.split("?")[0];
    var url= url+"?search_params="+$("#searchText").val()+"&limit="+$("#limit").val()+"&colorText="+$("#colorText").val()+"&highlightText="+$("#highlightText").val()+"&sortText="+$("#sortText").val();

     window.history.pushState(null, document.title, url);
    })


$(".filter-selected").on("click",function(){
   if( $(this).html()=="Filter highlighted")
    {

    var val = $("#highlightText").val().split(":");
        if (val.length!=2)
            return;
    var filterGraph = {"nodes":[],"links":[]};

    for (var i in results.nodes){
        var cur =results.nodes[i];
        if(cur[val[0]]==val[1])
            filterGraph.nodes.push(cur);

    }

      for (var i in results.links){
        var cur =results.links[i];
        if(cur[val[0]]==val[1])
            filterGraph.links.push(cur);

    }

    createVis(filterGraph);
    $(this).html("UnFilter highlighted")

   }
   else{
    $(this).html("Filter highlighted")
    createVis(results);

   }






       });


