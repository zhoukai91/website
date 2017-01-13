(function(root,factory,plug){
	factory(root.jQuery,plug);
})(window,function($,plug){
	var __PROTOTYPE__ = {
		//初始化架构层面的dom的样式，初始化一些属性
		_init : function(){
			this.$sectionWrap = this.addClass("section-wrapper")
			.find("ul:first")
			.addClass("section-wrap section-animate")
			.children("li").addClass("section").parent();
			this.$sections = this.$sectionWrap.find("li.section");
			this.index = 0;//当前页码
			this.last = this.$sections.length-1;
			this.lock = true;//用来作为锁标识

			
		},
		//生成旁边的序列按钮
		_serials : function(){
			if(!this.showSerial)return;
			this.$serials = $("<ul></ul>");
			for(var i=0;i<this.$sections.length;i++){
				this.$serials.append("<li class='"+(!i?"curr":"")+"'><a href='#'></a></li>");
			}
			this.$serials.addClass("serial");
			this.append(this.$serials);
		},

		_links : function () {

		},
		//封装了自定义事件的触发机制
		_attachEvent : function(event,args){
			this.trigger(event,args);
		},
		_bind : function(){
			var $links = $('div#tosection a');
			var $self = this;//
			this.on("mousewheel",function(e){
				if($self.lock&&($(document.body).width()>768)){
					$self.lock = false;
					var dir = e.originalEvent.deltaY<0;
					var beforeIndex = $self.index;
					dir?$self.index--:$self.index++;
					$self.index = Math.min($self.index,$self.last);
					$self.index = Math.max($self.index,0);
					if(beforeIndex==$self.index){
						$self.lock = true;
						return;
					}
					$self._attachEvent("beforeWheel",{
						before : beforeIndex,
						beforeDOM : $self.$sections.eq(beforeIndex),
						after : $self.index,
						afterDOM : $self.$sections.eq($self.index)
					});
					$self.$sectionWrap.css({
						"transform": "translateY(-"+$self.index+"00%)",
						"-moz-transform": "translateY(-"+$self.index+"00%)",
						"-webkit-transform": "translateY(-"+$self.index+"00%)",
						"-o-transform": "translateY(-"+$self.index+"00%)"
					});
					setTimeout(function(){
						$self.lock = true;
						$self._attachEvent("afterWheel",{
							before : beforeIndex,
							beforeDOM : $self.$sections.eq(beforeIndex),
							after : $self.index,
							afterDOM : $self.$sections.eq($self.index)
						});
						this.showSerial&&
								$self.$serials
									.children()
									.eq($self.index)
									.addClass("curr")
									.siblings()
									.removeClass("curr");
					},1000);
				}
			});
			$links.on('click',function(){
				if($(document.body).width()<768) return true;
				index = $(this).data('jq-section');
				$self.index = index;
				console.log($self.index);
				$self.$sectionWrap.css({
					"transform": "translateY(-"+$self.index+"00%)",
					"-moz-transform": "translateY(-"+$self.index+"00%)",
					"-webkit-transform": "translateY(-"+$self.index+"00%)",
					"-o-transform": "translateY(-"+$self.index+"00%)"
				});
				return false;
			});
		}
	};
	var __DEFAULTS__ = {
		showSerial : true//是否显示serial按钮
	}; 
	$.fn[plug] = function(options){
		//扩展功能
		$.extend(this,__PROTOTYPE__,__DEFAULTS__,options);
		this._init();//初始化
		this._serials();//生成序列
		this._bind();//设置功能事件
		return this;
	}
},"sectionWrapper");