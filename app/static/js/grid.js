
$(function() {

    $("#colorText").on("blur",changeColor);
    $("#highlightText").on("blur",changeHighlight);

     $("#sortText").on("blur",function(){
        var val = this.value;
        if (val == sortTextValue)
            return;
        sortTextValue =val;
        createVis();
    });

     $("#grid").on("click",'.doc',function(){
        $(".doc").removeClass("selected");
        $(this).addClass("selected");
        var d ={};
        for (var i in keys_all){
            var key = keys_all[i];
            var val = $(this).attr(key);
            d[key]=val;
        }
        showDetails(d);
    });

    $('#grid').jscroll();

    $("#select-view").val("gridview");


});


function changeHighlight(){
     var val = $("#highlightText").val().split(":");
     d3.selectAll(".doc").style("opacity",0.7);
     if(val.length==2){
        d3.selectAll("#grid .doc")
          .style("border", function(d) {
           if(this.getAttribute(val[0]) && this.getAttribute(val[0])==val[1])
            return "2px solid #ffff8c";
           })
           .style("opacity",function(d){
              if(this.getAttribute(val[0])!=val[1]) //Error check
                return "0.8";
              else if(this.getAttribute(val[0])==val[1])
                return 1
           })
    }
    else{
         d3.selectAll(".doc")
          .style("border", function(d) {
          if(this.getAttribute(val[0]) && this.getAttribute(val[0])!='undefined')
             return "1px solid "+colorBorder(this.getAttribute(val[0]));
           })
    }


}

function changeColor(){
    var val = $("#colorText").val();
    color = d3.scaleOrdinal(d3_category20);
    colorSeq = d3.scaleQuantize().domain([0,9]).range(seq);
    var all_divergent =true
    var unique = {};
    d3.selectAll(".doc")
      .style("background", function() {
        var data  = this.getAttribute(val);
        if(isNaN(parseInt(data))){
            if (!(data in unique))
                unique[data]=1;
                unique[data]+=1;
            return color(data);
        }
        else{
            all_divergent=false

            if(parseInt(data)>9){
                data=9
                unique[">="+data]=1;
            }
            else{
                if (!(data in unique))
                unique[data]=0;
                unique[data]+=1;
            }

            return colorSeq(parseInt(data));
        }
       })
       var div_html=""
       if(all_divergent){
        for (key in unique){
            if(key!="null")
            div_html+="<div class='legend-item data-attr='"+val+":"+key+"'><div class='doc' style='background:"+color(key)+"'></div><span>"+key+"("+unique[key]+")"+"</span></div>"
        }
       }
       else{
       for (key in unique){
           if(key!="null" && key!='undefined')
            div_html+="<div class='legend-item data-attr='"+val+":"+key+"''><div class='doc' style='background:"+colorSeq(key)+"'></div><span>"+key+"("+unique[key]+")"+"</span></div>"
        }

       }
       $(".legend").html(div_html);
}

    function createVis(input){
        var all_doctors =input.nodes;
        $(".loader").show();
        var content=[]
        sort_key = $("#sortText").val();
        all_doctors.sort(function(a, b){
            var keyA =a[sort_key] ,
                keyB = b[sort_key];
            // Compare the 2 dates
            if(keyA==undefined || !keyA )
                return 1;
            if(keyB==undefined ||!keyB)
                return -1;

            if(keyA < keyB) return -1;
            if(keyA > keyB) return 1;
            return 0;
        });
        var size= Math.sqrt(($(window).width()-150)*($(window).height()-300)/ all_doctors.length) +"px";
        for (var i in all_doctors){
             var txt = ""
             var attributes=""
             for (var k in keys){
                key=keys[k];
                txt+=key.toUpperCase()+":"+all_doctors[i][key]+" | ";
             }
             for (var k in keys_all){
                key=keys_all[k];
                if (all_doctors[i][key])
                 attributes+=key+"='"+all_doctors[i][key]+"' ";

             }
            content.push("<span style='width:"+size+";height:"+size+"' class='doc' "+attributes+" title='"+txt+"'></span>");
        }
        $(".loader").hide();
        $("#grid").html(content.join(""))
        changeColor();
        changeHighlight();



    }



