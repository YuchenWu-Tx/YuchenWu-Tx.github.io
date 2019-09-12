$(function(){
    var nowtime;//歌曲定时器
    $(".content_list").mCustomScrollbar();//滚动条
    $(".ado").get(0).volume=0.5;
    getMusic();//添加音乐至html
   //1.遍历加载音乐信息方法getMusic
   function getMusic(){
    $.ajax({url:"../source/musiclist.json",dataType:"json",success:function(data){
      $.each(data,function(index,value){
          var $song=createMusic(index,value);
          $song.appendTo(".content_list ul");
      })
   },error:function(e){
   (e);
   }});
   };
   //2读取一条歌曲信息并插入页面
   function createMusic(index,value){
    //获取音乐编号
    var num1=parseInt($(".title_number").text())+1;
    var num2=parseInt($(".list_number").last().text())+1;
    var num=num1<num2?num2:num1;
    //创建音乐节点
    var $song_list=$(
    "<li class=\"list\">"+
    "<div>"+
          "<div class=\"list_check\">"+
              "<i></i>"+
          "</div>"+
          "<div class=\"list_number\">"+num+"</div>"+
          "<div class=\"list_song\">"+value.name+
              "<div class=\"list_menu\">"+
                  "<a href=\"javascript:;\" title=\"播放\" class=\"play\"></a>"+
                  "<a href=\"javascript:;\" title=\"添加\"></a>"+
                  "<a href=\"javascript:;\" title=\"下载\"></a>"+
                  "<a href=\"javascript:;\" title=\"分享\"></a>"+
              "</div>"+
          "</div>"+ 
          "<div class=\"list_singer\">"+value.singer+"</div>"+
          "<div class=\"list_time\">"+"<span>"+value.time+"</span>"+
                "<a href=\"javascript:;\" title=\"删除\"></a>"+
          "</div>"+
    "</div>"+
    "</li>"
    ) 
    $song_list.get(0).number=num;
    $song_list.get(0).msg=value;
    $song_list.get(0).aplay=0;
     //返回一段带有歌曲信息的html文本
     return $song_list;
   }
   //3.鼠标事件
   mouseEvent();
   function mouseEvent(){
    //1.点击按钮之音乐标题复选款
    $(".content>.content_in>.content_left>.content_list ul>.list_title>div>.title_check>i").click(function(){
        $(this).toggleClass("checked");
   });
    //2.点击按钮之音乐纯净模式
   $(".footer_in>a:nth-of-type(8)").click(function(){
       $(this).toggleClass("only");
  });
    //4.音乐条目移出移入事件
    $("body").delegate(".list","mouseenter",function(){
        $(this).find(".list_time>span").stop().fadeOut(10);
        $(this).find(".list_menu").stop().fadeIn(200);
        $(this).find(".list_time>a").stop().fadeIn(200);
    });
    $("body").delegate(".list","mouseleave",function(){
       $(this).find(".list_menu").stop().fadeOut(10);
       $(this).find(".list_time>a").stop().fadeOut(10);
       $(this).find(".list_time>span").stop().fadeIn(200);
    });
      //5.点击按钮之音乐复选款
    $("body").delegate(".content>.content_in>.content_left>.content_list ul>.list>div>.list_check>i","click",function(){
        $(this).toggleClass("checked");
        if($(this).attr("class").indexOf("checked")==-1)
        $(this).css("opacity","0.5")
        else
        $(this).css("opacity","1");
    })
    //6.点击播放暂停按钮
    $("body").delegate(".content>.content_in>.content_left>.content_list ul>.list .list_song>div>a:nth-child(1)","click",function(){
        $list=$(this).parents(".list"); 
        $playSiblings=$list.siblings().find(".modBgMsg1");//寻找非本歌曲的播放暂停键为暂停键的   
        if($(this).attr("class").indexOf("modBgMsg1")!=-1)//点击的是暂停按钮
        {
        $(this).attr("title","开始");
        $(this).removeClass("modBgMsg1");//本首歌更改播放为暂停键
        $(".footer_in>a:nth-of-type(2)").removeClass("modBgMsg2");
        $list.css("color","rgba(255,255,255,0.5)");
        $list.find(".list_number").removeClass("list_number2");
        $(".ado").get(0).pause();
        clearInterval(nowPgs);
        }
        else//点击的是开始按钮
        {    
            $(this).attr("title","暂停");
            $(this).addClass("modBgMsg1");//本首歌更改播放为暂停键
            $playSiblings.removeClass("modBgMsg1");
            $playSiblings.attr("title","开始");
            $(".footer_in>a:nth-of-type(2)").addClass("modBgMsg2");//更改尾部播放为暂停键
            $list.css("color","rgba(255,255,255,1)");
            $list.siblings().css("color","rgba(255,255,255,0.5)");
            $list.find(".list_number").addClass("list_number2");
            $playSiblings.parents(".list").find(".list_number").removeClass("list_number2");
            //音乐播放
            $msg=$list.get(0).msg;
            $song_name=$msg.name;
            $song_singer=$msg.singer;
            $song_cover=$msg.cover;
            $song_url=$msg.link_url;
            $song_time=$msg.time;
            $currenttime=$(".footer_in .progress .progress_top>span:last-child").text();
            $song_currenttime=parseInt($currenttime.substr(0,2))*60+parseInt($currenttime.substr(3,2));
            $song_duratime=parseInt($song_time.substr(0,2))*60+parseInt($song_time.substr(3,2));
            if(nowPgs)
            clearInterval(nowPgs);
            if($song_url!=$(".ado").attr("src"))//播放新歌
            {   //修改页面内容
                $(".footer_in .progress .progress_top>span:first-child").text($song_name+"/"+$song_singer);
                $(".mask_bg").css("background-image","url("+$song_cover+")");
                $(".song_info>a>img").attr("src",$song_cover);
                $(".song_name>a").text($song_name);
                $(".song_singer>a").text($song_singer);
                $(".song_album>a").text($msg.album);
                $(".ado").attr("src",$song_url);
                progress($song_duratime,0);
                
            }
            else{
                progress($song_duratime,$song_currenttime);
            }
            $(".ado").get(0).play();
        }
    })
     //7.音量控制
     var voice_left=35;
     var statu;
     $(".voice_round").mousedown(function(e){
        ox=e.pageX-voice_left;
        statu=true;
    })
     $(document).mouseup(function(){
     statu=false;
    })
     $(".voice_strip").mousemove(function(event){
         if(statu)
           {left=event.pageX-ox;
           if(left < 0){
           left = 0;
           }
           if(left > 70){
           left = 70;
           }
           $vlm=Math.floor(left/70*100)/100;
           $(".ado").get(0).volume=$vlm;
           $(".voice_round").css('left',left);
           $(".voice_now").width(left);
        }
    })
     $(".voice_strip").click(function(event){
         if(!statu)
             {
             bgleft=$(this).offset().left;    
             left=event.pageX-bgleft;
             if(left < 0){
             left = 0;
             }
             if(left > 70){
             left = 70;
             }
             $vlm=Math.floor(left/70*100)/100;
             $(".ado").get(0).volume=$vlm;
             $(".voice_round").css('left',left);
             $(".voice_now").width(left);
         }
    })
   } 
   //底部更新
   //底部进度条时间控制
   var nowPgs;
   function progress(duratime,currenttime){
       nowPgs=setInterval(function(){
       currenttime=currenttime+0.05;
       currentM=Math.floor(currenttime/60);
       currentM=plusZero(currentM);
       currentS=Math.floor(currenttime-currentM*60);
       currentS=plusZero(currentS);
       width=currenttime/duratime*100;  
       $(".footer_in .progress .progress_top>span:last-child").text(currentM+":"+currentS+" / "+$song_time);
       $(".footer_in .progress .progress_strip .progress_now").css("width",width+"%");
       if(currenttime>=duratime)
       clearInterval(nowPgs);
       },50);
       function plusZero(math){
        if(math<10)
        math="0"+math;
        return math;
     }
   }   
   

});