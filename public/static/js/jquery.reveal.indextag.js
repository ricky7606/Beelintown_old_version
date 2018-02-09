(function($) {

/*---------------------------
 Defaults for Reveal
----------------------------*/
	 
/*---------------------------
 Listener for data-reveal-id attributes
----------------------------*/

	$('a[data-reveal-id]').live('click', function(e) {
		e.preventDefault();
		var modalLocation = $(this).attr('data-reveal-id');
		var tag = $(this).attr('data-tag');
		var tagId = $(this).attr('data-tag-id');
		var type = $(this).attr('data-type');
		var page = $(this).attr('data-page');
		if(type=='tags'){
			$("#current_tag").html("<a href=\"javascript:void(0);\" class='tag' title=\"点击查看添加该标签的用户\" data-reveal-id=\"tag_box\" data-animation=\"fade\" data-tag=\""+tag+"\" data-tag-id=\""+tagId+"\" data-type=\"users\">"+tag+"</a>");
		}else if($("#userid").val() != ''){
			$("#current_tag").html("<span class='tag' onclick='chkTag(\""+tagId+"\")' title=\"点击添加该标签\">"+tag+"</span>"); 
		}else{
			$("#current_tag").html("<span class='tag' onclick='showNoLogin();'>"+tag+"</span> ");
		}
		if(type == 'tags'){
			$("#box_title").html('子标签列表');
			$("#tips").html('tips: 也可以点击该父标签查看添加该标签的用户');
		}else{
			$("#box_title").html('标签用户列表');
			$("#tips").html('tips: 也可以直接点击添加该标签');
		}
		$("#data_list").html("<img src='/static/images/loading.gif'>");
		
		if(type == 'tags'){
			//获取子标签
			$.post('/index/usertags/getMoreTags', {tagid:tagId,page:page}, function(msg) {
				if(msg == ''){
					xcsoft.error('没有更多的子标签',2000);
					$("#data_list").html("没有更多的子标签");
				}else{
					tmpStr = "";
					tmpArr = msg.split('###');
					tmpArr2 = tmpArr[0].split('___');
					total_page = tmpArr2[0];
					current_page = tmpArr2[1];
					if(current_page==''){current_page=1;}
					tmpArr = tmpArr[1].split('$$$');
					tmpArr.forEach(function(value){
						if(value != ''){
							tmpArr2 = value.split('___');
							if(tmpArr2[2] == 'true'){
								tmpStr += "<a href=\"javascript:void(0);\" class='tag_parent' title=\"有下一级子标签\" data-reveal-id=\"tag_box\" data-animation=\"fade\" data-tag=\""+tmpArr2[0]+"\" data-tag-id=\""+tmpArr2[1]+"\" data-type=\"tags\">";
								tmpStr += tmpArr2[0];
								tmpStr += "</a> ";
							}else{
								tmpStr += " <a href=\"javascript:void(0);\" class='tag' title=\"点击查看添加该标签的用户\" data-reveal-id=\"tag_box\" data-animation=\"fade\" data-tag=\""+tmpArr2[0]+"\" data-tag-id=\""+tmpArr2[1]+"\" data-type=\"users\">";
								tmpStr += tmpArr2[0];
								tmpStr += "</a> ";
							}
						}
					});
					tmpStr += "<div style=\"padding-top:20px;\">";
					if(parseInt(current_page)>1){
						tmpStr += "<a class=\"prevNextBtn\" href=\"javascript:void(0);\" class='tag_parent' title=\"上一页\" data-reveal-id=\"tag_box\" data-animation=\"fade\" data-tag=\""+tag+"\" data-tag-id=\""+tagId+"\" data-type=\"tags\" data-page=\""+(parseInt(current_page)-1)+"\">上一页</a>";
					}
					tmpStr += "<span>( "+current_page+"/"+total_page+" )</span>";
					if(parseInt(current_page) < parseInt(total_page)){
						tmpStr += "<a class=\"prevNextBtn\" href=\"javascript:void(0);\" class='tag_parent' title=\"下一页\" data-reveal-id=\"tag_box\" data-animation=\"fade\" data-tag=\""+tag+"\" data-tag-id=\""+tagId+"\" data-type=\"tags\" data-page=\""+(parseInt(current_page)+1)+"\">下一页</a>";
					}
					tmpStr += "</div>";
					$("#data_list").html(tmpStr);
				}
			});
		}else{
			//获取用户列表
			$.post('/index/usertags/getTagUsers', {tagid:tagId}, function(msg) {
				if(msg == ''){
					xcsoft.error('暂时还没有用户添加该标签',2000);
					$("#data_list").html("暂时还没有用户添加该标签");
				}else{
					$("#data_list").html('');
					tmpStr = "<div style='margin-left:50px; margin-right:50px; text-align:left;'><i class=\"am-icon-users am-icon-sm\"></i> 以下用户已经添加了该标签，您可以加入TA们！<br />";
					tmpArr = msg.split('$$$');
					tmpArr.forEach(function(value){
						if(value != ''){
							tmpArr2 = value.split('###');
							if(tmpArr2[2] != ''){
								tmpStr += "<img src=\""+tmpArr2[2]+"\" class=\"user_pic\" style=\"margin-right:20px;\"> ";
							}else{
								tmpStr += "<img src=\"/static/images/profile_pic.jpg\" class=\"user_pic\" style=\"margin-right:20px;\"> ";
							}
							tmpStr += "<a href=\"/index/userreplydetail?userid="+tmpArr2[0]+"\" title=\"点击查看该用户\" target=\"details\" style=\"margin-right:40px;\">"+tmpArr2[1]+"</a>";
						}
					});
					tmpStr += "</div>";
					$("#data_list").html(tmpStr);
				}
			});
		}
		
		$('#'+modalLocation).reveal($(this).data());
		$("html,body").css({overflow:"hidden"}); //禁用滚动条
	});

/*---------------------------
 Extend and Execute
----------------------------*/

    $.fn.reveal = function(options) {
        
        
        var defaults = {  
	    	animation: 'fadeAndPop', //fade, fadeAndPop, none
		    animationspeed: 300, //how fast animtions are
		    closeonbackgroundclick: true, //if you click background will modal close?
		    dismissmodalclass: 'close-reveal-modal' //the class of a button or element that will close an open modal
    	}; 
    	
        //Extend dem' options
        var options = $.extend({}, defaults, options); 
	
        return this.each(function() {
        
/*---------------------------
 Global Variables
----------------------------*/
        	var modal = $(this),
        		topMeasure  = parseInt(modal.css('top')),
				topOffset = modal.height() + topMeasure,
          		locked = false,
				modalBG = $('.reveal-modal-bg');

/*---------------------------
 Create Modal BG
----------------------------*/
			if(modalBG.length == 0) {
				modalBG = $('<div class="reveal-modal-bg" />').insertAfter(modal);
			}		    
     
/*---------------------------
 Open & Close Animations
----------------------------*/
			//Entrance Animations
			modal.bind('reveal:open', function () {
			  modalBG.unbind('click.modalEvent');
				$('.' + options.dismissmodalclass).unbind('click.modalEvent');
				if(!locked) {
					lockModal();
					if(options.animation == "fadeAndPop") {
						modal.css({'top': $(document).scrollTop()-topOffset, 'opacity' : 0, 'visibility' : 'visible'});
						modalBG.fadeIn(options.animationspeed/2);
						modal.delay(options.animationspeed/2).animate({
							"top": $(document).scrollTop()+topMeasure + 'px',
							"opacity" : 1
						}, options.animationspeed,unlockModal());					
					}
					if(options.animation == "fade") {
						//modal.css({'opacity' : 0, 'visibility' : 'visible', 'top': $(document).scrollTop()+topMeasure});
						modal.css({'opacity' : 0, 'visibility' : 'visible', 'top': $(document).scrollTop()+100});
						modalBG.fadeIn(options.animationspeed/2);
						modal.delay(options.animationspeed/2).animate({
							"opacity" : 1
						}, options.animationspeed,unlockModal());					
					} 
					if(options.animation == "none") {
						modal.css({'visibility' : 'visible', 'top':$(document).scrollTop()+topMeasure});
						modalBG.css({"display":"block"});	
						unlockModal()				
					}
				}
				modal.unbind('reveal:open');
			}); 	

			//Closing Animation
			modal.bind('reveal:close', function () {
			  if(!locked) {
					lockModal();
					if(options.animation == "fadeAndPop") {
						modalBG.delay(options.animationspeed).fadeOut(options.animationspeed);
						modal.animate({
							"top":  $(document).scrollTop()-topOffset + 'px',
							"opacity" : 0
						}, options.animationspeed/2, function() {
							modal.css({'top':topMeasure, 'opacity' : 1, 'visibility' : 'hidden'});
							unlockModal();
						});					
					}  	
					if(options.animation == "fade") {
						modalBG.delay(options.animationspeed).fadeOut(options.animationspeed);
						modal.animate({
							"opacity" : 0
						}, options.animationspeed, function() {
							modal.css({'opacity' : 1, 'visibility' : 'hidden', 'top' : topMeasure});
							unlockModal();
						});					
					}  	
					if(options.animation == "none") {
						modal.css({'visibility' : 'hidden', 'top' : topMeasure});
						modalBG.css({'display' : 'none'});	
					}		
				}
				modal.unbind('reveal:close');
			});     
   	
/*---------------------------
 Open and add Closing Listeners
----------------------------*/
        	//Open Modal Immediately
    	modal.trigger('reveal:open')
			
			//Close Modal Listeners
			var closeButton = $('.' + options.dismissmodalclass).bind('click.modalEvent', function () {
			  modal.trigger('reveal:close');
			  $("html,body").css({overflow:"auto"}); //启动滚动条
			});
			
			if(options.closeonbackgroundclick) {
				modalBG.css({"cursor":"pointer"})
				modalBG.bind('click.modalEvent', function () {
				  modal.trigger('reveal:close');
				  $("html,body").css({overflow:"auto"}); //启动滚动条

				});
			}
			$('body').keyup(function(e) {
        		if(e.which===27){ modal.trigger('reveal:close'); $("html,body").css({overflow:"auto"});} // 27 is the keycode for the Escape key
			});
			
			
/*---------------------------
 Animations Locks
----------------------------*/
			function unlockModal() { 
				locked = false;
			}
			function lockModal() {
				locked = true;
			}	
			
        });//each call
    }//orbit plugin call
})(jQuery);
        
