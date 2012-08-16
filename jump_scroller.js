/*
Plugin Name: Jump Scroller
Plugin URI: https://github.com/fenchurch/jquery_plugins/ 
Description: Easy scrolling to DOM Objects, includes a nav locker
Version: 1.0.0
Author: Rusty Gibbs
Author URI:http://www.wickedidol.com
License: GPL

This software comes without any warranty.
*/

if(!console){
	console = {log:function(){return;}}
}
(function($){
	var plugin = "jump_scroller",
	//Plugin Vars
	$$,o,data,scrolling,
	$w = $(window),
	//Public Methods
	methods = {
		init	:function(id, options){
			//Set init Data and options with the private init
			__.init(options);
			__.listen.init();			
			//Make methods public			
			$.extend(this, methods);
			return this;
		},
		scrollTo:function($this, options){
			if( !o ) __.init
			__.animate.scroll( $this );
		}
	},
	//Private Methods
	__ = {
		init:	function(options){
			//User Options
			o = $.extend(true, {
				lockClass:'locked',
				activeClass:'current-menu-item',
				duration:"slow",
				easing:"swing",
				tag:"a",
				attr:"data-object-id",
				hash:"#",
				prefix:""
			}, options);
			//Data needed 
			//Note: This will probably get moved outside of the init 
			//and collected on demand for ajax loaded elements
			data = {
				y	:$$.position().top,
				last	:null,
				stack	:$$.find(o.tag),
				matches	:$()
			};
			//Check stack for hashes to scroll to
			//
			data.stack.each(function(i){
				$t = $(this);
				cur = $(o.hash + o.prefix + $t.attr(o.attr) );
				if( cur.length ) data.matches = data.matches.add(cur);
				else data.stack = data.stack.not($t);
			});
			//Initialize the listeners
		},
		
		//Listen for
		//Menu Clicks
		//Manual Scroll
		//	Menu lock past initial position
		//	Menu Item activate

		listen:{
			init:function(){
				data.stack.click(__.listen.click);
				$w.scroll(__.listen.scroll);
			},
			click:function(e){
				//Prevent Jumping to Hash 
				e.preventDefault();
				target = $(e.target);
				__.action.activate( target );
				__.animate.scroll( $(o.hash + o.prefix + target.attr(o.attr)));
			},
			scroll:function(){
				s = $w.scrollTop();
				__.action.lock(s);
				__.action.manual(s);
			}
		},
		//Actions for
		//	Locking (position:fixed) the Menu Bar
		//	Menu Item Activate
		//	Menu Item Deactivate
		//	Manual Scrolling
		action:{
			lock:function(scroll){
				//If scroll is below $$ initial position, add the lockclass
				__.test.max( scroll, data.y, $$, o.lockClass);
			},
			activate:function(item){
				__.action.deactivate();
				if(!item.hasClass(o.activeClass))
					item.addClass(o.activeClass);
			},
			deactivate:function(){
				$$.find("."+o.activeClass).removeClass(o.activeClass);
			},
			manual:function(scroll){
				if( scrolling ) return;
				var activated = false;
				data.matches.each(function(i){
					$t = $(this);
					y = $t.position().top;
					if( __.test.range(
						scroll, 
						y, 
						y + ( $t.height() )
					)){	
						__.action.activate($(data.stack[i]));	
						activated = true;
					}
				});
				if(!activated) __.action.activate($(data.stack[0]));
			}
		},
		//Animate for
		//	Menu Item click	
		animate:{
			scroll:function(to){
				scrolling = true;
				prop = {scrollTop:to.position().top};
				opt = {	duration:o.duration,
					easing:o.easing,
					complete:function(){
						scrolling = false;
					}
				}
				$("html,body").animate(prop, opt);
			}
		},
		//General Testing
		test:{
			range:function(a,b0,b1){
				if( a >= b0 && a < b1 )
					return true;
				else
					return false;
			},
			max:function(a,b,c,d){
				if( a > b )
					if( c && ! c.hasClass( d ) ){c.addClass( d );}
					else	return true;
				else
					if( a < b && c && c.hasClass( d ) ){c.removeClass( d );}
					else	return false;
			}
		}
	}
	//Jquery Constructor
	$.fn[plugin] = function(method){
		$$ = this;
		//If method is in methods, apply this to methods[method] function
		if(typeof methods[method] === 'function'){
			return methods[method].apply( this, Array.prototype.slice.call(arguments, 1));
		}else if(typeof method === 'object' || !method || !(methods[method])){
			return methods.init.apply(this, arguments);
		}else{
			$.error("Method." + method + ' does not exist on $.fn.'+plugin);
		}
	}
	$[plugin] = function(options){
		return undefined;
	}
})(jQuery);
