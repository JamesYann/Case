$(function() { 

    $("#addPlanFunction").click(function(){ //建立新的schedule
        
            var group_id = "";
        
            var url = location.href;
            //var url = req.param('group_id');
            var ary = url.split('?')[1].split('&');
            //此時ary的內容為：
            //ary[0] = 'id=U001'，ary[1] = 'name=GQSM'
        
            //下迴圈去搜尋每個資料參數
            for(i=0;i<=ary.length-1;i++)
            {
                //如果資料名稱為id的話那就把他取出來
                if(ary[i].split('=')[0] == 'group_id')
                group_id = ary[i].split('=')[1];
            }
        
            var planContent = document.getElementById("inputschedule").value;   
            
            if (planContent.length < 1)
            {
                alert('請輸入資料')
            }
            else
            {
                var data = {
                    group_id : group_id,
                    schedule_name : planContent
                };
                
                $.ajax({
                    type:'post',
                    url: '/product/addform',
                    data : data,
                    dataType : JSON                          
                });   
    
                alert('新增成功');
    
                setTimeout(function() {
                    location.reload()
                }, 500);
            }

    
        
    });

}); 

function toAddPlan(){ //跳下一個葉面
    var group_id = "";

    var url = location.href;
    //var url = req.param('group_id');
    var ary = url.split('?')[1].split('&');
    //此時ary的內容為：
    //ary[0] = 'id=U001'，ary[1] = 'name=GQSM'

    //下迴圈去搜尋每個資料參數
    for(i=0;i<=ary.length-1;i++)
    {
        //如果資料名稱為id的話那就把他取出來
        if(ary[i].split('=')[0] == 'group_id')
        group_id = ary[i].split('=')[1];
    }

    location.href = '/product/add/form?group_id=' + group_id ;
};

