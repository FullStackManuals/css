  /**
   * jQuery中Cookie读写操作的封装
   * @type {Object}
   */
  jQuery.cookie = function(name, value, options) {
      if (typeof value != 'undefined') { // name and value given, set cookie
          options = options || {};
          if (value === null) {
              value = '';
              options.expires = -1;
          }
          var expires = '';
          if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
              var date;
              if (typeof options.expires == 'number') {
                  date = new Date();
                  date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
              } else {
                  date = options.expires;
              }
              expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
          }
          var path = options.path ? '; path=' + options.path : '';
          var domain = options.domain ? '; domain=' + options.domain : '';
          var secure = options.secure ? '; secure' : '';
          document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
      } else { // only name given, get cookie
          var cookieValue = null;
          if (document.cookie && document.cookie != '') {
              var cookies = document.cookie.split(';');
              for (var i = 0; i < cookies.length; i++) {
                  var cookie = jQuery.trim(cookies[i]);
                  // Does this cookie string begin with the name we want?
                  if (cookie.substring(0, name.length + 1) == (name + '=')) {
                      cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                      break;
                  }
              }
          }
          return cookieValue;
      }
  };




  var Global = {};
  Global.folding = function(s) {
      s.hover(function() {
          $(this).addClass('on');
      }, function() {
          $(this).removeClass('on');
      });
  };
  
  //取得标识里定位data位置的rel和标识着此项信息的name
	(function(id){
			var tag = $(id);
			if(!tag.length){return};
			Global.rel = tag.attr('rel');
			Global.name = tag.attr('name');
			Global.pathname = (Global.rel ? '/' + Global.rel : '') + '/' + Global.name + '.htm';
			if (Global.isLocal) {
				Global.url = Global.rootPath + Global.pathname;
			} else {
				Global.url = location.href;
				Global.rootPath = Global.url.replace(Global.pathname, "");
			}
	})('#category');
  
 window.topDocument = window.top.document;
 
  /*
   * 功能 ：导航树的展开收起、点击后的iframe跳转
   *
   * 依赖jquery.js;
   */
  (function() {

      var dytree = $('#dytree', topDocument);
      var iframe = $('#archives', topDocument),
          allLinks = dytree.find('a'),
          allFolder = dytree.find('.haschild'),
          allList = dytree.find('ul');

      //让父页面中的左侧的导航树中对应子页面正在打开的项 被选中.
      (function() {
          if (!Global.name) {
              return false;
          }
          var url = Global.pathname.slice(1),
              onLink = dytree.find('a[href="' + url + '"]'),
              onLinkList = onLink.parents('ul'),
              onLinkFolder = onLinkList.siblings('.haschild'),
              onFolder = onLink.parents('.haschild'),
              onFolderList = onFolder.siblings('ul');

          //选中链接
          allLinks.removeClass('on');
          onLink.addClass('on');

          //收起所有文件夹。
          allFolder.removeClass('open')
          allList.removeClass('unfold');

          //展开被选中的链接之上的文件夹。
          onLinkFolder.addClass('open');
          onLinkList.addClass('unfold');
          onFolder.addClass('open');
          onFolderList.addClass('unfold');
      })();

      if (Global.notIE && dytree.prop('loaded')) {
          return;
      }


      //展开与收起的切换
      allFolder.on({
          click: function() {
              var _this = $(this),
                  item = _this,
                  list = item.siblings('ul');

              item.hasClass('open') ? item.removeClass('open') : item.addClass('open');
              list.hasClass('unfold') ? list.removeClass('unfold') : list.addClass('unfold');
          }
      })

      //点击链接时更改右侧iframe的地址,显示当前选择,阻止默认行为
      dytree.on("click", "a", function(e) {
          //阻止默认行为
          e.preventDefault();
          var _this = $(this),
              iframeSrc = _this.attr('href');

          //更改右侧iframe地址
          iframe.attr('src', iframeSrc);

          //显示当前选择
          allLinks.removeClass('on');
          _this.addClass('on');

      });

      dytree.prop('loaded', true);

  })();
  
  //运行示例代码以及相关操作
	(function(){
		var example = $('#example'),
			content = example.find('textarea'),
			btnRun = example.find('.g-btn-sure');

		if (example.length) {


			//运行代码
			if (Global.isLocal && gteWin7) {

				//如果是win7下的chm版本，不支持直接打开浏览器运行
				btnRun.on({
					click: function(e) {
						e.preventDefault();
						if (confirm('本次操作将在浏览器中打开，请从手册在线版中点击运行按钮')) {
							var codeWin = window.open(Global.url);
						}
					}
				});
			} else {
				btnRun.on({
					click: function(e) {
						e.preventDefault();
						var codeWin = window.open();
						codeWin.document.write(content.val());
						codeWin.document.close();
					}
				});
			}

			//复制代码
			Global.copy(example.find(".g-btn-copy"), content.val());
		}
	})();

  /*
 * 建立下拉菜单
 *
 * 参数s为jquery包裹之后的下拉菜单最外层的容器,参数id为标识;
 */
(function(){
	var creatMenu = function(s){

		// 定义知识库
		// 作用 ：定义creatMenu的知识库,应用场景：iframe内部的下拉关联菜单。
		// 结构 ：每个数据的索引值+'htm'为自己的url地址,有子项的数据url地址为index.html.
		// 		  第一个值为每个属性自己的名字，不填的话默认与索引值相同。
		// 		  第二个值为假如自己有子项，那么自己被选中的时候显示的文字。
		this.data = {

			'index' : ['速查表快速通道','速查表快速通道'],
			introduction : {
				'index' : ['简介','其他简介条目'],
				'change-list' : ['更新历史'],
				'about-this-handbook' : ['关于本手册'],
				'what-is-css' : ['关于样式表'],
				'about-me' : ['关于作者'],
				'guide' : ['阅读及使用指引'],
				'thanks' : ['鸣谢'],
				'contribute' : ['捐赠']
			},

			properties : {
				'index' : ['属性列表','其他属性参考'],
				positioning : {
					'index' : ['定位(Positioning)','其它定位属性参考'],
					'position' : [],
					'z-index' : [],
					'top' : [],
					'right' : [],
					'bottom' : [],
					'left' : [],
					'clip' : []
				},
				layout : {
					'index' : ['布局(Layout)','其它布局属性参考'],
					'display' : [],
					'float' : [],
					'clear' : [],
					'visibility' : [],
					'overflow' : [],
					'overflow-x' : [],
					'overflow-y' : []
					//'rotation' : [],
					//'rotation-point' : []
				},
				dimension : {
					'index' : ['尺寸(Ddimension)','其它尺寸属性参考'],
					'width' : [],
					'min-width' : [],
					'max-width' : [],
					'height' : [],
					'min-height' : [],
					'max-height' : []
				},
				margin : {
					'index' : ['外补白(Margin)','其它外补白属性参考'],
					'margin' : [],
					'margin-top' : [],
					'margin-right' : [],
					'margin-bottom' : [],
					'margin-left' : []
				},
				padding : {
					'index' : ['内补白(Padding)','其它内补白属性参考'],
					'padding' : [],
					'padding-top' : [],
					'padding-right' : [],
					'padding-bottom' : [],
					'padding-left' : []
				},
				border : {
					'index' : ['边框(Border)','其它边框属性参考'],
					'border' : [],
					'border-width' : [],
					'border-style' : [],
					'border-color' : [],
					'border-top' : [],
					'border-top-width' : [],
					'border-top-style' : [],
					'border-top-color' : [],
					'border-right' : [],
					'border-right-width' : [],
					'border-right-style' : [],
					'border-right-color' : [],
					'border-bottom' : [],
					'border-bottom-width' : [],
					'border-bottom-style' : [],
					'border-bottom-color' : [],
					'border-left' : [],
					'border-left-width' : [],
					'border-left-style' : [],
					'border-left-color' : [],
					'border-radius' : [],
					'border-top-left-radius' : [],
					'border-top-right-radius' : [],
					'border-bottom-right-radius' : [],
					'border-bottom-left-radius' : [],
					'box-shadow' : [],
					'border-image' : [],
					'border-image-source' : [],
					'border-image-slice' : [],
					'border-image-width' : [],
					'border-image-outset' : [],
					'border-image-repeat' : []
				},
				background : {
					'index' : ['背景(Background)','其它背景属性参考'],
					'background' : [],
					'background-color' : [],
					'background-image' : [],
					'background-repeat' : [],
					'background-attachment' : [],
					'background-position' : [],
					'background-origin' : [],
					'background-clip' : [],
					'background-size' : []
				},
				color : {
					'index' : ['颜色(Color)','其它颜色属性参考'],
					'color' : [],
					'opacity' : []
				},
				font : {
					'index' : ['字体(Font)','其它字体属性参考'],
					'font' : [],
					'font-style' : [],
					'font-variant' : [],
					'font-weight' : [],
					'font-size' : [],
					'font-family' : [],
					'font-stretch' : [],
					'font-size-adjust' : []
				},
				text : {
					'index' : ['字体(text)','其它文本属性参考'],
					'text-transform' : [],
					'white-space' : [],
					'tab-size' : [],
					'word-break' : [],
					'word-wrap' : [],
					'overflow-wrap' : [],
					'text-align' : [],
					'text-align-last' : [],
					'text-justify' : [],
					'word-spacing' : [],
					'letter-spacing' : [],
					'text-indent' : [],
					'vertical-align' : [],
					'line-height' : [],
					'text-size-adjust' : []
				},
				'text-decoration' : {
					'index' : ['文本装饰(Text Decoration)','其它文本装饰属性'],
					'text-decoration' : [],
					'text-decoration-line' : [],
					'text-decoration-color' : [],
					'text-decoration-style' : [],
					'text-decoration-skip' : [],
					'text-underline-position' : [],
					'text-shadow' : []
				},
				'writing-modes' : {
					'index' : ['书写模式(Writing Modes)','其它书写模式属性'],
					'direction' : [],
					'unicode-bidi' : []
				},
				'list' : {
					'index' : ['列表(list)','其它列表属性参考'],
					'list-style' : [],
					'list-style-image' : [],
					'list-style-position' : [],
					'list-style-type' : []
				},
				'table' : {
					'index' : ['表格(table)','其它表格属性参考'],
					'table-layout' : [],
					'border-collapse' : [],
					'border-spacing' : [],
					'caption-side' : [],
					'empty-cells' : []
				},
				'content' : {
					'index' : ['内容(Content)','其它内容属性参考'],
					'content' : [],
					'counter-increment' : [],
					'counter-reset' : [],
					'quotes' : []
				},
				'user-interface' : {
					'index' : ['用户界面(User Interface)','其它用户界面属性'],
					'appearance' : [],
					'text-overflow' : [],
					'outline' : [],
					'outline-width' : [],
					'outline-color' : [],
					'outline-style' : [],
					'outline-offset' : [],
					'nav-index' : [],
					'nav-up' : [],
					'nav-right' : [],
					'nav-down' : [],
					'nav-left' : [],
					'cursor' : [],
					'zoom' : [],
					'box-sizing' : [],
					'resize' : [],
					'ime-mode' : [],
					'user-select' : [],
					'pointer-events' : []
				},
				'multi-column' : {
					'index' : ['多栏(Multi-column)','其它多栏属性参考'],
					'columns' : [],
					'columns-width' : [],
					'columns-count' : [],
					'columns-gap' : [],
					'columns-rule' : [],
					'columns-rule-width' : [],
					'columns-rule-style' : [],
					'columns-rule-color' : [],
					'columns-span' : [],
					'columns-fill' : [],
					'columns-break-before' : [],
					'columns-break-after' : [],
					'columns-break-inside' : []
				},
				'flexible-box' : {
					'index' : ['弹性盒模型(Flexible Box)(旧)','其它弹性盒模型属性'],
					'box-orient' : [],
					'box-pack' : [],
					'box-align' : [],
					'box-flex' : [],
					'box-flex-group' : [],
					'box-ordinal-group' : [],
					'box-direction' : [],
					'box-lines' : []
				},
				'flex' : {
					'index' : ['弹性盒模型(Flexible Box)(新)','其它弹性盒模型属性'],
					'flex' : [],
					'flex-basis' : [],
					'flex-direction' : [],
					'flex-flow' : [],
					'flex-grow' : [],
					'flex-shrink' : [],
					'flex-wrap' : [],
					'align-contnet' : [],
					'align-items' : [],
					'align-self' : [],
					'justify-content' : [],
					'order' : []
				},
				'transform' : {
					'index' : ['变换(Transform)','其它变换属性参考'],
					'transform' : [],
					'transform-origin' : [],
					'transform-style' : [],
					'perspective' : [],
					'perspective-origin' : [],
					'backface-visibility' : []
				},
				'transition' : {
					'index' : ['过渡(Transition)','其它过渡属性参考'],
					'transition' : [],
					'transition-property' : [],
					'transition-duration' : [],
					'transition-timing-function' : [],
					'transition-delay' : []
				},
				'animation' : {
					'index' : ['动画(Animation)','其它动画属性参考'],
					'animation' : [],
					'animation-name' : [],
					'animation-duration' : [],
					'animation-timing-function' : [],
					'animation-delay' : [],
					'animation-iteration-count' : [],
					'animation-direction' : [],
					'animation-play-state' : [],
					'animation-fill-mode' : []
				},
				'printing' : {
					'index' : ['打印(printing)','其它打印属性参考'],
					'page' : [],
					'page-break-before' : [],
					'page-break-after' : [],
					'page-break-inside' : []
				},
				'media-queries' : {
					'index' : ['媒体查询(Media Queries)','其它媒体查询属性'],
					'width' : [],
					'height' : [],
					'device-width' : [],
					'device-height' : [],
					'orientation' : [],
					'aspect-ratio' : [],
					'color' : [],
					'color-index' : [],
					'monochrome' : [],
					'resolution' : [],
					'scan' : [],
					'grid' : []
				},
				'only-ie' : {
					'index' : ['Only IE','Only IE属性'],
					'scrollbar-3dlight-color' : [],
					'scrollbar-darkshadow-color	' : [],
					'scrollbar-highlight-color' : [],
					'scrollbar-shadow-color' : [],
					'scrollbar-arrow-color' : [],
					'scrollbar-face-color' : [],
					'scrollbar-track-color	' : [],
					'scrollbar-base-color' : [],
					'filter' : [],
					'behavior' : []
				},
				'only-firefox' : {
					'index' : ['Only Firefox','Only Firefox属性'],
					'border-colors' : [],
					'border-top-colors' : [],
					'border-right-colors' : [],
					'border-bottom-colors' : [],
					'border-left-colors' : []
				},
				'only-webkit' : {
					'index' : ['Only Webkit','Only Webkit属性'],
					'box-reflect' : [],
					'text-fill-color' : [],
					'text-stroke' : [],
					'text-stroke-width' : [],
					'text-stroke-color' : [],
					'tap-highlight-color' : [],
					'user-drag' : []
				}
			},

			rules : {
				'index' : ['语法与规则','其它语法与规则参考'],
				'!important' : [],
				'comment' : [],
				'@import' : [],
				'@charset' : [],
				'@media' : [],
				'@font-face' : [],
				'@page' : [],
				'@keyframes' : [],
				'@supports' : []
			},

			selectors : {
				'index' : ['选择符列表','其他选择符参考'],
				'element' : {
					'index' : ['元素选择符','其它元素选择符参考'],
					'all' : ['通配选择符(*)'],
					'e' : ['类型选择符(E)'],
					'id' : ['ID选择符(E#id)'],
					'class' : ['类选择符(E.class)']
				},
				'relationship' : {
					'index' : ['关系选择符','其它关系选择符参考'],
					'ef' : ['包含选择符(E F)'],
					'e-child-f' : ['子选择符(E>F)'],
					'e-adjacent-f' : ['相邻选择符(E+F)'],
					'e-brother-f' : ['兄弟选择符(E~F)']
				},
				'attribute' : {
					'index' : ['属性选择符','其它属性选择符参考'],
					'att' : ['E[att]'],
					'att2' : ['E[att="val"]'],
					'att3' : ['E[att~="val"]'],
					'att4' : ['E[att^="val"]'],
					'att5' : ['E[att$="val"]'],
					'att6' : ['E[att*="val"]'],
					'att7' : ['E[att|="val"]']
				},
				'pseudo-classes' : {
					'index' : ['伪类选择符','其它伪类选择符'],
					'link' : ['E:link'],
					'visited' : ['E:visited'],
					'hover' : ['E:hover'],
					'active' : ['E:active'],
					'focus' : ['E:focus'],
					'lang(fr)' : ['E:lang(fr)'],
					'not(s)' : ['E:not(s)'],
					'root' : ['E:root'],
					'first-child' : ['E:first-child'],
					'last-child' : ['E:last-child'],
					'only-child' : ['E:only-child'],
					'nth-child(n)' : ['E:nth-child(n)'],
					'nth-last-child(n)' : ['E:nth-last-child(n)'],
					'first-of-type' : ['E:first-of-type'],
					'last-of-type' : ['E:last-of-type'],
					'only-of-type' : ['E:only-of-type'],
					'nth-of-type(n)' : ['E:nth-of-type(n)'],
					'nth-last-of-type(n)' : ['E:nth-last-of-type(n)'],
					'empty' : ['E:empty'],
					'checked' : ['E:checked'],
					'enabled' : ['E:enabled'],
					'disabled' : ['E:disabled'],
					'target' : ['E:target'],
					'@page-first' : ['@page-first'],
					'@page-left' : ['@page-left'],
					'@page-right' : ['@page-right']
				},
				'pseudo-element' : {
					'index' : ['伪对象选择符','其它伪对象选择符'],
					'first-letter' : ['E::first-letter'],
					'first-line' : ['E::first-line'],
					'before' : ['E::before'],
					'after' : ['E::after'],
					'placeholder' : ['E::placeholder'],
					'selection' : ['E::selection']
				}
			},

			values : {
				'index' : ['取值 Values','其它取值与单位参考'],
				'length' : {
					'index' : ['长度(Length)','长度值与单位参考'],
					'length' : ['&lt;length&gt;'],
					'em' : [],
					'ex' : [],
					'ch' : [],
					'rem' : [],
					'vw' : [],
					'vh' : [],
					'vmax' : [],
					'vmin' : [],
					'cm' : [],
					'mm' : [],
					'q' : [],
					'in' : [],
					'pt' : [],
					'pc' : [],
					'px' : []
				},
				'angle' : {
					'index' : ['角度(Angle)','角度值与单位参考'],
					'angle' : ['&lt;angle&gt;'],
					'deg' : [],
					'grad' : [],
					'rad' : [],
					'turn' : []
				},
				'time' : {
					'index' : ['时间(Time)','时间值与单位参考'],
					'time' : ['&lt;time&gt;'],
					's' : [],
					'ms' : []
				},
				'frequency' : {
					'index' : ['频率(Frequency)','频率值与单位参考'],
					'frequency' : ['&lt;frequency&gt;'],
					'Hz' : [],
					'kHz' : []
				},
				'layout-specific' : {
					'index' : ['布局(Layout-specific)','布局值与单位参考'],
					'fraction' : ['&lt;fraction&gt;'],
					'grid' : ['&lt;grid&gt;'],
					'fr' : [],
					'gr' : []
				},
				'resolution' : {
					'index' : ['分辨率(Resolution)','其它分辨率单位参考'],
					'resolution' : ['&lt;resolution&gt;'],
					'dpi' : [],
					'dpcm' : [],
					'dppx' : []
				},
				'color' : {
					'index' : ['颜色(Color)','其它颜色值参考'],
					'color' : ['&lt;color&gt;'],
					'color-name' : ['Color Name'],
					'hex' : ['HEX'],
					'rgb' : ['RGB'],
					'rgba' : ['RGBA'],
					'hsl' : ['HSL'],
					'hsla' : ['HSLA'],
					'transparent' : [],
					'currentColor' : []
				},
				'textual' : {
					'index' : ['文本(Textual)','其它文本值参考'],
					'inherit' : [],
					'initial' : [],
					'string' : ['&lt;string&gt;'],
					'url' : ['&lt;url&gt;'],
					'identifier' : ['&lt;identifier&gt;']
				},
				'content' : {
					'index' : ['生成内容(Content)','其它生成内容值参考'],
					'counter()' : [],
					'counters()' : [],
					'attr()' : []
				},
				'functional' : {
					'index' : ['函数(Functional)','其它函数值参考'],
					'calc()' : [],
					'min()' : [],
					'max()' : [],
					'toggle()' : []
				},
				'image' : {
					'index' : ['图像(Image)','其它图像值参考'],
					'image' : ['&lt;image&gt;'],
					'image()' : [],
					'image-set()' : [],
					'gradient' : ['&lt;gradient&gt;'],
					'linear-gradient()' : [],
					'radial-gradient()' : [],
					'repeating-linear-gradient()' : [],
					'repeating-radial-gradient()' : []
				},
				'numeric' : {
					'index' : ['数字(Numeric)','其它数字值参考'],
					'number' : ['&lt;number&gt;'],
					'integer' : ['&lt;integer&gt;'],
					'percentage' : ['&lt;percentage&gt;']
				}
			},

			appendix : {
				'index' : ['附录 Appendix','其它CSS附录参考'],
				'color-keywords' : ['颜色关键字(Color Keywords)'],
				'media-types' : ['媒体类型(Media Types)']
			},

			hack : {
				'index' : ['CSS Hack','其它CSS Hack参考'],
				'conditions' : ['条件Hack'],
				'properties' : ['属性级Hack'],
				'selectors' : ['选择符级Hack']
			},

			experience : {
				'index' : ['问题和经验','其它问题和经验参考'],
				'refer' : ['参考资源列表'],
				'bugs' : ['Bugs和解决方案'],
				'skill' : ['技巧和经验'],
				'other' : ['其它经验']
			}
		}
		this.searchData();
		this.drawMenu(s);
	}

	//根据标识取得此项的知识库
	creatMenu.prototype.searchData = function (){
		var i = 0,
			arr = Global.rel.split('/') || [],
			len = arr.length,
			temp;
		for (i ; i<len ; i++){
			temp = arr[i];
			if(temp != ''){
				this.data = this.data[temp];
			}
		}
	}

	//根据知识库里的内容绘制出下拉菜单
	creatMenu.prototype.drawMenu = function (s){
		var menu = $(s),
			title = menu.find('strong'),
			list = menu.find('ul'),
			listHtml = '',
			url='',
			name='',
			key,
			val;
		for(key in this.data){
			if (key == 'index'){continue;}
			else{
				val = this.data[key];
				if (val instanceof Array){
					name = val.length==0?key:val[0];
					url = key+'.htm';
				}else{
					name = val.index[0];
					url = key+'/index.htm';
				}
				listHtml += '<li><a href="'+url+'">'+name+'</a>'+'</li>';
			}
		}
		title.html(this.data.index[1]);
		list.html(listHtml);
	}

	//创建实例
	var s=$('#guide .g-combobox');
	if(s.length){new creatMenu(s);}
})();