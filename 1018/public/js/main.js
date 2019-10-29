$(function() { 
    $("#sortable").sortable(     
    {opacity: 0.7,
        update :function(event,ui){

            var count = 0;
            
            $("#sortable").find(".card").each(function(index, element){
                
                count++;

                var id = $(this).attr("id");                    
            
                var data = {
                place_id : id,
                order_no : count
                };

                $.ajax({
                    type:'post',
                    url: '/schedule/move',
                    data : data,
                    dataType : JSON                                       
                });                    

                
            });
         
            // put_result(ui);
        },
        stop :function(event,ui){

            var count = 1;
            
            $("#sortable").find(".card").each(function(index, element){
                var id = $(this).attr("id");                    

                $("#"+id).find(".card-header").find("strong").html("景點");
                $("#"+id).find(".card-header").find("strong").append(String(count));
                // $("#header" + count).find("strong").html("景點");
                // $("#header" + count).append(String(count));
                count++;
            });
        }
    });  

    $("button").click(function(){     


        if ( confirm("確定刪除嗎？") )  { 

            var id = $(this).attr("id");  
        
            id = id.replace("button","");

            // alert(id);

            $.ajax({
                type:'post',
                url: '/schedule/deleteprocess',
                data : {
                    place_id : id
                },
                dataType : JSON                                       
            });   

            setTimeout(function() {
                location.reload()
            }, 500);
            
            
            // let params = (new URL(document.location)).searchParams;
            // let schedule_id = params.get("schedule_id");
            
            // $.ajax({
            //     type:'get',
            //     url: '/schedule/query',
            //     data : {
            //         schedule_id : schedule_id
            //     },
            //     dataType : JSON                                       
            // }); 
         }
         else{              
            
         };
        
    });


}); 

// function getHeaderText(text){
//     $("#showHeaderText").html("text is : ");
//     $("showHeaderText").append(text + "<br />");
// }

// function put_result(ui){
//     $("#result_box").html("現在の要素のIDの順番は下記のとおりです。<br />");
    
//     $("#sortable").find(".card").each(function(index, element){
//         var id = $(this).attr("id");
//         $("#result_box").append(id+"<br />");
//     });
 
//     if(ui){ // もしドラッグ後であれば
//         // ドラッグされた要素のIDを取得
//         var dragged_id = ui.item[0].id;
//         $("#result_box").append("ドラッグされた要素のIDは"+dragged_id+"です<br />");
//     }
// }
