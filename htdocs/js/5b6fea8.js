/*
 * Copyright (C) 2009 Joel Sutherland.
 * Liscenced under the MIT liscense
 */
(function ($) {
    $.fn.filterable = function (settings) {
        settings = $.extend({
            useHash: false,
            animationSpeed: 1000,
            show: {
                width: 'show',
                opacity: 'show'
            },
            hide: {
                width: 'hide',
                opacity: 'hide'
            },
            useTags: true,
            tagSelector: '#portfolio-filter a',
            selectedTagClass: 'current',
            allTag: 'all'
        }, settings);
        return $(this).each(function () {
            $(this).bind("filter", function (e, tagToShow) {
                if (settings.useTags) {
                    $(settings.tagSelector).removeClass(settings.selectedTagClass);
                    $(settings.tagSelector + '[href=' + tagToShow + ']').addClass(settings.selectedTagClass)
                }
                $(this).trigger("filterportfolio", [tagToShow.substr(1)])
            });
            $(this).bind("filterportfolio", function (e, classToShow) {
                if (classToShow == settings.allTag) {
                    $(this).trigger("show")
                } else {
                    $(this).trigger("show", ['.' + classToShow]);
                    $(this).trigger("hide", [':not(.' + classToShow + ')'])
                } if (settings.useHash) {
                    location.hash = '#' + classToShow
                }
            });
            $(this).bind("show", function (e, selectorToShow) {
                $(this).children(selectorToShow).animate(settings.show, settings.animationSpeed)
            });
            $(this).bind("hide", function (e, selectorToHide) {
                $(this).children(selectorToHide).animate(settings.hide, settings.animationSpeed)
            });
            if (settings.useHash) {
                if (location.hash != '') $(this).trigger("filter", [location.hash]);
                else $(this).trigger("filter", ['#' + settings.allTag])
            }
            if (settings.useTags) {
                $(settings.tagSelector).click(function () {
                    $('#portfolio-list').trigger("filter", [$(this).attr('href')]);
                    $(settings.tagSelector).removeClass('current');
                    $(this).addClass('current')
                })
            }
        })
    }
})(jQuery);
$(document).ready(function () {
    $('#portfolio-list').filterable()
});
/*
 * Playlist Object for the jPlayer Plugin
 * http://www.jplayer.org
 *
 * Copyright (c) 2009 - 2013 Happyworm Ltd
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * Author: Mark J Panaghiston
 * Version: 2.3.0
 * Date: 20th April 2013
 *
 * Requires:
 *  - jQuery 1.7.0+
 *  - jPlayer 2.3.0+
 */
(function(b, f) {
	jPlayerPlaylist = function(a, c, d) {
		var e = this;
		this.current = 0;
		this.removing = this.shuffled = this.loop = !1;
		this.cssSelector = b.extend({}, this._cssSelector, a);
		this.options = b.extend(!0, {
			keyBindings: {
				next: {
					key: 39,
					fn: function() {
						e.next()
					}
				},
				previous: {
					key: 37,
					fn: function() {
						e.previous()
					}
				}
			}
		}, this._options, d);
		this.playlist = [];
		this.original = [];
		this._initPlaylist(c);
		this.cssSelector.title = this.cssSelector.cssSelectorAncestor + " .jp-title";
		this.cssSelector.playlist = this.cssSelector.cssSelectorAncestor + " .jp-playlist";
		this.cssSelector.next = this.cssSelector.cssSelectorAncestor + " .jp-next";
		this.cssSelector.previous = this.cssSelector.cssSelectorAncestor + " .jp-previous";
		this.cssSelector.shuffle = this.cssSelector.cssSelectorAncestor + " .jp-shuffle";
		this.cssSelector.shuffleOff = this.cssSelector.cssSelectorAncestor + " .jp-shuffle-off";
		this.options.cssSelectorAncestor = this.cssSelector.cssSelectorAncestor;
		this.options.repeat = function(a) {
			e.loop = a.jPlayer.options.loop
		};
		b(this.cssSelector.jPlayer).bind(b.jPlayer.event.ready, function() {
			e._init()
		});
		b(this.cssSelector.jPlayer).bind(b.jPlayer.event.ended, function() {
			e.next()
		});
		b(this.cssSelector.jPlayer).bind(b.jPlayer.event.play, function() {
			b(this).jPlayer("pauseOthers")
		});
		b(this.cssSelector.jPlayer).bind(b.jPlayer.event.resize, function(a) {
			a.jPlayer.options.fullScreen ? b(e.cssSelector.title).show() : b(e.cssSelector.title).hide()
		});
		b(this.cssSelector.previous).click(function() {
			e.previous();
			b(this).blur();
			return !1
		});
		b(this.cssSelector.next).click(function() {
			e.next();
			b(this).blur();
			return !1
		});
		b(this.cssSelector.shuffle).click(function() {
			e.shuffle(!0);
			return !1
		});
		b(this.cssSelector.shuffleOff).click(function() {
			e.shuffle(!1);
			return !1
		}).hide();
		this.options.fullScreen || b(this.cssSelector.title).hide();
		b(this.cssSelector.playlist + " ul").empty();
		this._createItemHandlers();
		b(this.cssSelector.jPlayer).jPlayer(this.options)
	};
	jPlayerPlaylist.prototype = {
		_cssSelector: {
			jPlayer: "#jquery_jplayer_1",
			cssSelectorAncestor: "#jp_container_1"
		},
		_options: {
			playlistOptions: {
				autoPlay: !1,
				loopOnPrevious: !1,
				shuffleOnLoop: !0,
				enableRemoveControls: !1,
				displayTime: "slow",
				addTime: "fast",
				removeTime: "fast",
				shuffleTime: "slow",
				itemClass: "jp-playlist-item",
				freeGroupClass: "jp-free-media",
				freeItemClass: "jp-playlist-item-free",
				removeItemClass: "jp-playlist-item-remove"
			}
		},
		option: function(a, b) {
			if (b === f) return this.options.playlistOptions[a];
			this.options.playlistOptions[a] = b;
			switch (a) {
				case "enableRemoveControls":
					this._updateControls();
					break;
				case "itemClass":
				case "freeGroupClass":
				case "freeItemClass":
				case "removeItemClass":
					this._refresh(!0), this._createItemHandlers()
			}
			return this
		},
		_init: function() {
			var a =
				this;
			this._refresh(function() {
				a.options.playlistOptions.autoPlay ? a.play(a.current) : a.select(a.current)
			})
		},
		_initPlaylist: function(a) {
			this.current = 0;
			this.removing = this.shuffled = !1;
			this.original = b.extend(!0, [], a);
			this._originalPlaylist()
		},
		_originalPlaylist: function() {
			var a = this;
			this.playlist = [];
			b.each(this.original, function(b) {
				a.playlist[b] = a.original[b]
			})
		},
		_refresh: function(a) {
			var c = this;
			if (a && !b.isFunction(a)) b(this.cssSelector.playlist + " ul").empty(), b.each(this.playlist, function(a) {
				b(c.cssSelector.playlist +
					" ul").append(c._createListItem(c.playlist[a]))
			}), this._updateControls();
			else {
				var d = b(this.cssSelector.playlist + " ul").children().length ? this.options.playlistOptions.displayTime : 0;
				b(this.cssSelector.playlist + " ul").slideUp(d, function() {
					var d = b(this);
					b(this).empty();
					b.each(c.playlist, function(a) {
						d.append(c._createListItem(c.playlist[a]))
					});
					c._updateControls();
					b.isFunction(a) && a();
					c.playlist.length ? b(this).slideDown(c.options.playlistOptions.displayTime) : b(this).show()
				})
			}
		},
		_createListItem: function(a) {
			var c =
				this,
				d = "<li><div class='fullwidth lightbox'>",
				d = d + ("<a href='javascript:;' class='" + this.options.playlistOptions.removeItemClass + "'>&times;</a>");
			if (a.free) {
				var e = !0,
					d = d + ("<span class='" + this.options.playlistOptions.freeGroupClass + "'>(");
				b.each(a, function(a, f) {
					b.jPlayer.prototype.format[a] && (e ? e = !1 : d += " | ", d += "<a class='" + c.options.playlistOptions.freeItemClass + "' href='" + f + "' tabindex='1'>" + a + "</a>")
				});
				d += ")</span>"
			}
			d += "<a href='javascript:;' class='" + this.options.playlistOptions.itemClass + "' tabindex='1'><span class='jp-playpause'><em class='fa fa-play'></em><em class='fa fa-pause'></em></span><span class='title-song'>" + a.title + (a.artist ?
				"</span><span class='jp-artist'>" + a.artist + "</span>":"")+"</a>";
				if (a.dwnload || a.amzstore || a.appstore || a.soundcloud || a.grvstore) {
				d += "<span class='jp-social-option'>";
				if (a.dwnload) {
						d += "<a class='jp-dwnload' href='"+a.dwnload+"'>Download</a>";
				}
				if (a.soundcloud) {
					d += "<a class='jp-soundcloud'  href='"+a.soundcloud+"'>Sound Cloud</a>";
				}
				if (a.grvstore) {
					d += "<a class='jp-grvstore'  href='"+a.grvstore+"'>Groove</a>";
				}
				if (a.appstore) {
					d += "<a class='jp-appstore'  href='"+a.appstore+"'>Apple Store</a>";
				}
				if (a.amzstore) {
					d += "<a class='jp-amzstore'  href='"+a.amzstore+"'>Amazon</a>";
				}
				d += "</span>";
				}
				if(a.jptime){
					d += "<span class='jp-jptime'>"+a.jptime+"</span>";
				}
				if(a.lyrice){
					d += "<a href='#' data-title=''  class='jp-lyrice '><em class='fa fa-file-o'></em></a><div style='display:none' class='lyrice-song-box'>"+a.lyrice+"</div>";
					setTimeout(loadListItemPlay,100)
				}
				if(a.url){
					d += "<a  href='"+a.url+"' class='jp-share'><em class='fa fa-share-square-o'></em></a>";
				}
			return d += "</div></li>"
		},
		_createItemHandlers: function() {
			var a = this;
			b(this.cssSelector.playlist).off("click", "a." + this.options.playlistOptions.itemClass).on("click", "a." + this.options.playlistOptions.itemClass, function() {
				var c = b(this).parent().parent().index();
				a.current !== c ? a.play(c) : b(a.cssSelector.jPlayer).jPlayer("play");
				b(this).blur();
				return !1
			});
			b(this.cssSelector.playlist).off("click", "a." + this.options.playlistOptions.freeItemClass).on("click",
				"a." + this.options.playlistOptions.freeItemClass, function() {
					b(this).parent().parent().find("." + a.options.playlistOptions.itemClass).click();
					b(this).blur();
					return !1
				});
			b(this.cssSelector.playlist).off("click", "a." + this.options.playlistOptions.removeItemClass).on("click", "a." + this.options.playlistOptions.removeItemClass, function() {
				var c = b(this).parent().parent().index();
				a.remove(c);
				b(this).blur();
				return !1
			})
		},
		_updateControls: function() {
			this.options.playlistOptions.enableRemoveControls ? b(this.cssSelector.playlist +
				" ." + this.options.playlistOptions.removeItemClass).show() : b(this.cssSelector.playlist + " ." + this.options.playlistOptions.removeItemClass).hide();
			this.shuffled ? (b(this.cssSelector.shuffleOff).show(), b(this.cssSelector.shuffle).hide()) : (b(this.cssSelector.shuffleOff).hide(), b(this.cssSelector.shuffle).show())
		},
		_highlight: function(a) {
			this.playlist.length && a !== f && (b(this.cssSelector.playlist + " .jp-playlist-current").removeClass("jp-playlist-current"), b(this.cssSelector.playlist + " li:nth-child(" + (a + 1) +
				")").addClass("jp-playlist-current").find(".jp-playlist-item").addClass("jp-playlist-current"), b(this.cssSelector.title + " li").html(this.playlist[a].title + (this.playlist[a].artist ? " <span class='jp-artist'>by " + this.playlist[a].artist + "</span>" : "")))
		},
		setPlaylist: function(a) {
			this._initPlaylist(a);
			this._init()
		},
		add: function(a, c) {
			b(this.cssSelector.playlist + " ul").append(this._createListItem(a)).find("li:last-child").hide().slideDown(this.options.playlistOptions.addTime);
			this._updateControls();
			this.original.push(a);
			this.playlist.push(a);
			c ? this.play(this.playlist.length - 1) : 1 === this.original.length && this.select(0)
		},
		remove: function(a) {
			var c = this;
			if (a === f) return this._initPlaylist([]), this._refresh(function() {
				b(c.cssSelector.jPlayer).jPlayer("clearMedia")
			}), !0;
			if (this.removing) return !1;
			a = 0 > a ? c.original.length + a : a;
			0 <= a && a < this.playlist.length && (this.removing = !0, b(this.cssSelector.playlist + " li:nth-child(" + (a + 1) + ")").slideUp(this.options.playlistOptions.removeTime, function() {
				b(this).remove();
				if (c.shuffled) {
					var d =
						c.playlist[a];
					b.each(c.original, function(a) {
						if (c.original[a] === d) return c.original.splice(a, 1), !1
					})
				} else c.original.splice(a, 1);
				c.playlist.splice(a, 1);
				c.original.length ? a === c.current ? (c.current = a < c.original.length ? c.current : c.original.length - 1, c.select(c.current)) : a < c.current && c.current-- : (b(c.cssSelector.jPlayer).jPlayer("clearMedia"), c.current = 0, c.shuffled = !1, c._updateControls());
				c.removing = !1
			}));
			return !0
		},
		select: function(a) {
			a = 0 > a ? this.original.length + a : a;
			0 <= a && a < this.playlist.length ? (this.current =
				a, this._highlight(a), b(this.cssSelector.jPlayer).jPlayer("setMedia", this.playlist[this.current])) : this.current = 0
		},
		play: function(a) {
			a = 0 > a ? this.original.length + a : a;
			0 <= a && a < this.playlist.length ? this.playlist.length && (this.select(a), b(this.cssSelector.jPlayer).jPlayer("play")) : a === f && b(this.cssSelector.jPlayer).jPlayer("play")
		},
		pause: function() {
			b(this.cssSelector.jPlayer).jPlayer("pause")
		},
		next: function() {
			var a = this.current + 1 < this.playlist.length ? this.current + 1 : 0;
			this.loop ? 0 === a && this.shuffled && this.options.playlistOptions.shuffleOnLoop &&
				1 < this.playlist.length ? this.shuffle(!0, !0) : this.play(a) : 0 < a && this.play(a)
		},
		previous: function() {
			var a = 0 <= this.current - 1 ? this.current - 1 : this.playlist.length - 1;
			(this.loop && this.options.playlistOptions.loopOnPrevious || a < this.playlist.length - 1) && this.play(a)
		},
		shuffle: function(a, c) {
			var d = this;
			a === f && (a = !this.shuffled);
			(a || a !== this.shuffled) && b(this.cssSelector.playlist + " ul").slideUp(this.options.playlistOptions.shuffleTime, function() {
				(d.shuffled = a) ? d.playlist.sort(function() {
					return 0.5 - Math.random()
				}) :
					d._originalPlaylist();
				d._refresh(!0);
				c || !b(d.cssSelector.jPlayer).data("jPlayer").status.paused ? d.play(0) : d.select(0);
				b(this).slideDown(d.options.playlistOptions.shuffleTime)
			})
		}
	}
})(jQuery);
function loadListItemPlay() {
	jQuery(".album-detail .wrapper-payerlsit ul li") .each(function(index, el) {
	jQuery(this) .find("a.jp-lyrice") .attr("href", "#tabbox-for-play-"+index+"");
	jQuery(this) .find("a.jp-lyrice") .next() .attr("id", "tabbox-for-play-"+index+"");
	});
}
/**
 * BxSlider v4.1.2 - Fully loaded, responsive content slider
 * http://bxslider.com
 *
 * Copyright 2014, Steven Wanderski - http://stevenwanderski.com - http://bxcreative.com
 * Written while drinking Belgian ales and listening to jazz
 *
 * Released under the MIT license - http://opensource.org/licenses/MIT
 */
!function(t){var e={},s={mode:"horizontal",slideSelector:"",infiniteLoop:!0,hideControlOnEnd:!1,speed:500,easing:null,slideMargin:0,startSlide:0,randomStart:!1,captions:!1,ticker:!1,tickerHover:!1,adaptiveHeight:!1,adaptiveHeightSpeed:500,video:!1,useCSS:!0,preloadImages:"visible",responsive:!0,slideZIndex:50,touchEnabled:!0,swipeThreshold:50,oneToOneTouch:!0,preventDefaultSwipeX:!0,preventDefaultSwipeY:!1,pager:!0,pagerType:"full",pagerShortSeparator:" / ",pagerSelector:null,buildPager:null,pagerCustom:null,controls:!0,nextText:"Next",prevText:"Prev",nextSelector:null,prevSelector:null,autoControls:!1,startText:"Start",stopText:"Stop",autoControlsCombine:!1,autoControlsSelector:null,auto:!1,pause:4e3,autoStart:!0,autoDirection:"next",autoHover:!1,autoDelay:0,minSlides:1,maxSlides:1,moveSlides:0,slideWidth:0,onSliderLoad:function(){},onSlideBefore:function(){},onSlideAfter:function(){},onSlideNext:function(){},onSlidePrev:function(){},onSliderResize:function(){}};t.fn.bxSlider=function(n){if(0==this.length)return this;if(this.length>1)return this.each(function(){t(this).bxSlider(n)}),this;var o={},r=this;e.el=this;var a=t(window).width(),l=t(window).height(),d=function(){o.settings=t.extend({},s,n),o.settings.slideWidth=parseInt(o.settings.slideWidth),o.children=r.children(o.settings.slideSelector),o.children.length<o.settings.minSlides&&(o.settings.minSlides=o.children.length),o.children.length<o.settings.maxSlides&&(o.settings.maxSlides=o.children.length),o.settings.randomStart&&(o.settings.startSlide=Math.floor(Math.random()*o.children.length)),o.active={index:o.settings.startSlide},o.carousel=o.settings.minSlides>1||o.settings.maxSlides>1,o.carousel&&(o.settings.preloadImages="all"),o.minThreshold=o.settings.minSlides*o.settings.slideWidth+(o.settings.minSlides-1)*o.settings.slideMargin,o.maxThreshold=o.settings.maxSlides*o.settings.slideWidth+(o.settings.maxSlides-1)*o.settings.slideMargin,o.working=!1,o.controls={},o.interval=null,o.animProp="vertical"==o.settings.mode?"top":"left",o.usingCSS=o.settings.useCSS&&"fade"!=o.settings.mode&&function(){var t=document.createElement("div"),e=["WebkitPerspective","MozPerspective","OPerspective","msPerspective"];for(var i in e)if(void 0!==t.style[e[i]])return o.cssPrefix=e[i].replace("Perspective","").toLowerCase(),o.animProp="-"+o.cssPrefix+"-transform",!0;return!1}(),"vertical"==o.settings.mode&&(o.settings.maxSlides=o.settings.minSlides),r.data("origStyle",r.attr("style")),r.children(o.settings.slideSelector).each(function(){t(this).data("origStyle",t(this).attr("style"))}),c()},c=function(){r.wrap('<div class="bx-wrapper"><div class="bx-viewport"></div></div>'),o.viewport=r.parent(),o.loader=t('<div class="bx-loading" />'),o.viewport.prepend(o.loader),r.css({width:"horizontal"==o.settings.mode?100*o.children.length+215+"%":"auto",position:"relative"}),o.usingCSS&&o.settings.easing?r.css("-"+o.cssPrefix+"-transition-timing-function",o.settings.easing):o.settings.easing||(o.settings.easing="swing"),f(),o.viewport.css({width:"100%",overflow:"hidden",position:"relative"}),o.viewport.parent().css({maxWidth:p()}),o.settings.pager||o.viewport.parent().css({margin:"0 auto 0px"}),o.children.css({"float":"horizontal"==o.settings.mode?"left":"none",listStyle:"none",position:"relative"}),o.children.css("width",u()),"horizontal"==o.settings.mode&&o.settings.slideMargin>0&&o.children.css("marginRight",o.settings.slideMargin),"vertical"==o.settings.mode&&o.settings.slideMargin>0&&o.children.css("marginBottom",o.settings.slideMargin),"fade"==o.settings.mode&&(o.children.css({position:"absolute",zIndex:0,display:"none"}),o.children.eq(o.settings.startSlide).css({zIndex:o.settings.slideZIndex,display:"block"})),o.controls.el=t('<div class="bx-controls" />'),o.settings.captions&&P(),o.active.last=o.settings.startSlide==x()-1,o.settings.video&&r.fitVids();var e=o.children.eq(o.settings.startSlide);"all"==o.settings.preloadImages&&(e=o.children),o.settings.ticker?o.settings.pager=!1:(o.settings.pager&&T(),o.settings.controls&&C(),o.settings.auto&&o.settings.autoControls&&E(),(o.settings.controls||o.settings.autoControls||o.settings.pager)&&o.viewport.after(o.controls.el)),g(e,h)},g=function(e,i){var s=e.find("img, iframe").length;if(0==s)return i(),void 0;var n=0;e.find("img, iframe").each(function(){t(this).one("load",function(){++n==s&&i()}).each(function(){this.complete&&t(this).load()})})},h=function(){if(o.settings.infiniteLoop&&"fade"!=o.settings.mode&&!o.settings.ticker){var e="vertical"==o.settings.mode?o.settings.minSlides:o.settings.maxSlides,i=o.children.slice(0,e).clone().addClass("bx-clone"),s=o.children.slice(-e).clone().addClass("bx-clone");r.append(i).prepend(s)}o.loader.remove(),S(),"vertical"==o.settings.mode&&(o.settings.adaptiveHeight=!0),o.viewport.height(v()),r.redrawSlider(),o.settings.onSliderLoad(o.active.index),o.initialized=!0,o.settings.responsive&&t(window).bind("resize",Z),o.settings.auto&&o.settings.autoStart&&H(),o.settings.ticker&&L(),o.settings.pager&&q(o.settings.startSlide),o.settings.controls&&W(),o.settings.touchEnabled&&!o.settings.ticker&&O()},v=function(){var e=0,s=t();if("vertical"==o.settings.mode||o.settings.adaptiveHeight)if(o.carousel){var n=1==o.settings.moveSlides?o.active.index:o.active.index*m();for(s=o.children.eq(n),i=1;i<=o.settings.maxSlides-1;i++)s=n+i>=o.children.length?s.add(o.children.eq(i-1)):s.add(o.children.eq(n+i))}else s=o.children.eq(o.active.index);else s=o.children;return"vertical"==o.settings.mode?(s.each(function(){e+=t(this).outerHeight()}),o.settings.slideMargin>0&&(e+=o.settings.slideMargin*(o.settings.minSlides-1))):e=Math.max.apply(Math,s.map(function(){return t(this).outerHeight(!1)}).get()),e},p=function(){var t="100%";return o.settings.slideWidth>0&&(t="horizontal"==o.settings.mode?o.settings.maxSlides*o.settings.slideWidth+(o.settings.maxSlides-1)*o.settings.slideMargin:o.settings.slideWidth),t},u=function(){var t=o.settings.slideWidth,e=o.viewport.width();return 0==o.settings.slideWidth||o.settings.slideWidth>e&&!o.carousel||"vertical"==o.settings.mode?t=e:o.settings.maxSlides>1&&"horizontal"==o.settings.mode&&(e>o.maxThreshold||e<o.minThreshold&&(t=(e-o.settings.slideMargin*(o.settings.minSlides-1))/o.settings.minSlides)),t},f=function(){var t=1;if("horizontal"==o.settings.mode&&o.settings.slideWidth>0)if(o.viewport.width()<o.minThreshold)t=o.settings.minSlides;else if(o.viewport.width()>o.maxThreshold)t=o.settings.maxSlides;else{var e=o.children.first().width();t=Math.floor(o.viewport.width()/e)}else"vertical"==o.settings.mode&&(t=o.settings.minSlides);return t},x=function(){var t=0;if(o.settings.moveSlides>0)if(o.settings.infiniteLoop)t=o.children.length/m();else for(var e=0,i=0;e<o.children.length;)++t,e=i+f(),i+=o.settings.moveSlides<=f()?o.settings.moveSlides:f();else t=Math.ceil(o.children.length/f());return t},m=function(){return o.settings.moveSlides>0&&o.settings.moveSlides<=f()?o.settings.moveSlides:f()},S=function(){if(o.children.length>o.settings.maxSlides&&o.active.last&&!o.settings.infiniteLoop){if("horizontal"==o.settings.mode){var t=o.children.last(),e=t.position();b(-(e.left-(o.viewport.width()-t.width())),"reset",0)}else if("vertical"==o.settings.mode){var i=o.children.length-o.settings.minSlides,e=o.children.eq(i).position();b(-e.top,"reset",0)}}else{var e=o.children.eq(o.active.index*m()).position();o.active.index==x()-1&&(o.active.last=!0),void 0!=e&&("horizontal"==o.settings.mode?b(-e.left,"reset",0):"vertical"==o.settings.mode&&b(-e.top,"reset",0))}},b=function(t,e,i,s){if(o.usingCSS){var n="vertical"==o.settings.mode?"translate3d(0, "+t+"px, 0)":"translate3d("+t+"px, 0, 0)";r.css("-"+o.cssPrefix+"-transition-duration",i/1e3+"s"),"slide"==e?(r.css(o.animProp,n),r.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",function(){r.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"),D()})):"reset"==e?r.css(o.animProp,n):"ticker"==e&&(r.css("-"+o.cssPrefix+"-transition-timing-function","linear"),r.css(o.animProp,n),r.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",function(){r.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"),b(s.resetValue,"reset",0),N()}))}else{var a={};a[o.animProp]=t,"slide"==e?r.animate(a,i,o.settings.easing,function(){D()}):"reset"==e?r.css(o.animProp,t):"ticker"==e&&r.animate(a,speed,"linear",function(){b(s.resetValue,"reset",0),N()})}},w=function(){for(var e="",i=x(),s=0;i>s;s++){var n="";o.settings.buildPager&&t.isFunction(o.settings.buildPager)?(n=o.settings.buildPager(s),o.pagerEl.addClass("bx-custom-pager")):(n=s+1,o.pagerEl.addClass("bx-default-pager")),e+='<div class="bx-pager-item"><a href="" data-slide-index="'+s+'" class="bx-pager-link">'+n+"</a></div>"}o.pagerEl.html(e)},T=function(){o.settings.pagerCustom?o.pagerEl=t(o.settings.pagerCustom):(o.pagerEl=t('<div class="bx-pager" />'),o.settings.pagerSelector?t(o.settings.pagerSelector).html(o.pagerEl):o.controls.el.addClass("bx-has-pager").append(o.pagerEl),w()),o.pagerEl.on("click","a",I)},C=function(){o.controls.next=t('<a class="bx-next" href="">'+o.settings.nextText+"</a>"),o.controls.prev=t('<a class="bx-prev" href="">'+o.settings.prevText+"</a>"),o.controls.next.bind("click",y),o.controls.prev.bind("click",z),o.settings.nextSelector&&t(o.settings.nextSelector).append(o.controls.next),o.settings.prevSelector&&t(o.settings.prevSelector).append(o.controls.prev),o.settings.nextSelector||o.settings.prevSelector||(o.controls.directionEl=t('<div class="bx-controls-direction" />'),o.controls.directionEl.append(o.controls.prev).append(o.controls.next),o.controls.el.addClass("bx-has-controls-direction").append(o.controls.directionEl))},E=function(){o.controls.start=t('<div class="bx-controls-auto-item"><a class="bx-start" href="">'+o.settings.startText+"</a></div>"),o.controls.stop=t('<div class="bx-controls-auto-item"><a class="bx-stop" href="">'+o.settings.stopText+"</a></div>"),o.controls.autoEl=t('<div class="bx-controls-auto" />'),o.controls.autoEl.on("click",".bx-start",k),o.controls.autoEl.on("click",".bx-stop",M),o.settings.autoControlsCombine?o.controls.autoEl.append(o.controls.start):o.controls.autoEl.append(o.controls.start).append(o.controls.stop),o.settings.autoControlsSelector?t(o.settings.autoControlsSelector).html(o.controls.autoEl):o.controls.el.addClass("bx-has-controls-auto").append(o.controls.autoEl),A(o.settings.autoStart?"stop":"start")},P=function(){o.children.each(function(){var e=t(this).find("img:first").attr("title");void 0!=e&&(""+e).length&&t(this).append('<div class="bx-caption"><span>'+e+"</span></div>")})},y=function(t){o.settings.auto&&r.stopAuto(),r.goToNextSlide(),t.preventDefault()},z=function(t){o.settings.auto&&r.stopAuto(),r.goToPrevSlide(),t.preventDefault()},k=function(t){r.startAuto(),t.preventDefault()},M=function(t){r.stopAuto(),t.preventDefault()},I=function(e){o.settings.auto&&r.stopAuto();var i=t(e.currentTarget),s=parseInt(i.attr("data-slide-index"));s!=o.active.index&&r.goToSlide(s),e.preventDefault()},q=function(e){var i=o.children.length;return"short"==o.settings.pagerType?(o.settings.maxSlides>1&&(i=Math.ceil(o.children.length/o.settings.maxSlides)),o.pagerEl.html(e+1+o.settings.pagerShortSeparator+i),void 0):(o.pagerEl.find("a").removeClass("active"),o.pagerEl.each(function(i,s){t(s).find("a").eq(e).addClass("active")}),void 0)},D=function(){if(o.settings.infiniteLoop){var t="";0==o.active.index?t=o.children.eq(0).position():o.active.index==x()-1&&o.carousel?t=o.children.eq((x()-1)*m()).position():o.active.index==o.children.length-1&&(t=o.children.eq(o.children.length-1).position()),t&&("horizontal"==o.settings.mode?b(-t.left,"reset",0):"vertical"==o.settings.mode&&b(-t.top,"reset",0))}o.working=!1,o.settings.onSlideAfter(o.children.eq(o.active.index),o.oldIndex,o.active.index)},A=function(t){o.settings.autoControlsCombine?o.controls.autoEl.html(o.controls[t]):(o.controls.autoEl.find("a").removeClass("active"),o.controls.autoEl.find("a:not(.bx-"+t+")").addClass("active"))},W=function(){1==x()?(o.controls.prev.addClass("disabled"),o.controls.next.addClass("disabled")):!o.settings.infiniteLoop&&o.settings.hideControlOnEnd&&(0==o.active.index?(o.controls.prev.addClass("disabled"),o.controls.next.removeClass("disabled")):o.active.index==x()-1?(o.controls.next.addClass("disabled"),o.controls.prev.removeClass("disabled")):(o.controls.prev.removeClass("disabled"),o.controls.next.removeClass("disabled")))},H=function(){o.settings.autoDelay>0?setTimeout(r.startAuto,o.settings.autoDelay):r.startAuto(),o.settings.autoHover&&r.hover(function(){o.interval&&(r.stopAuto(!0),o.autoPaused=!0)},function(){o.autoPaused&&(r.startAuto(!0),o.autoPaused=null)})},L=function(){var e=0;if("next"==o.settings.autoDirection)r.append(o.children.clone().addClass("bx-clone"));else{r.prepend(o.children.clone().addClass("bx-clone"));var i=o.children.first().position();e="horizontal"==o.settings.mode?-i.left:-i.top}b(e,"reset",0),o.settings.pager=!1,o.settings.controls=!1,o.settings.autoControls=!1,o.settings.tickerHover&&!o.usingCSS&&o.viewport.hover(function(){r.stop()},function(){var e=0;o.children.each(function(){e+="horizontal"==o.settings.mode?t(this).outerWidth(!0):t(this).outerHeight(!0)});var i=o.settings.speed/e,s="horizontal"==o.settings.mode?"left":"top",n=i*(e-Math.abs(parseInt(r.css(s))));N(n)}),N()},N=function(t){speed=t?t:o.settings.speed;var e={left:0,top:0},i={left:0,top:0};"next"==o.settings.autoDirection?e=r.find(".bx-clone").first().position():i=o.children.first().position();var s="horizontal"==o.settings.mode?-e.left:-e.top,n="horizontal"==o.settings.mode?-i.left:-i.top,a={resetValue:n};b(s,"ticker",speed,a)},O=function(){o.touch={start:{x:0,y:0},end:{x:0,y:0}},o.viewport.bind("touchstart",X)},X=function(t){if(o.working)t.preventDefault();else{o.touch.originalPos=r.position();var e=t.originalEvent;o.touch.start.x=e.changedTouches[0].pageX,o.touch.start.y=e.changedTouches[0].pageY,o.viewport.bind("touchmove",Y),o.viewport.bind("touchend",V)}},Y=function(t){var e=t.originalEvent,i=Math.abs(e.changedTouches[0].pageX-o.touch.start.x),s=Math.abs(e.changedTouches[0].pageY-o.touch.start.y);if(3*i>s&&o.settings.preventDefaultSwipeX?t.preventDefault():3*s>i&&o.settings.preventDefaultSwipeY&&t.preventDefault(),"fade"!=o.settings.mode&&o.settings.oneToOneTouch){var n=0;if("horizontal"==o.settings.mode){var r=e.changedTouches[0].pageX-o.touch.start.x;n=o.touch.originalPos.left+r}else{var r=e.changedTouches[0].pageY-o.touch.start.y;n=o.touch.originalPos.top+r}b(n,"reset",0)}},V=function(t){o.viewport.unbind("touchmove",Y);var e=t.originalEvent,i=0;if(o.touch.end.x=e.changedTouches[0].pageX,o.touch.end.y=e.changedTouches[0].pageY,"fade"==o.settings.mode){var s=Math.abs(o.touch.start.x-o.touch.end.x);s>=o.settings.swipeThreshold&&(o.touch.start.x>o.touch.end.x?r.goToNextSlide():r.goToPrevSlide(),r.stopAuto())}else{var s=0;"horizontal"==o.settings.mode?(s=o.touch.end.x-o.touch.start.x,i=o.touch.originalPos.left):(s=o.touch.end.y-o.touch.start.y,i=o.touch.originalPos.top),!o.settings.infiniteLoop&&(0==o.active.index&&s>0||o.active.last&&0>s)?b(i,"reset",200):Math.abs(s)>=o.settings.swipeThreshold?(0>s?r.goToNextSlide():r.goToPrevSlide(),r.stopAuto()):b(i,"reset",200)}o.viewport.unbind("touchend",V)},Z=function(){var e=t(window).width(),i=t(window).height();(a!=e||l!=i)&&(a=e,l=i,r.redrawSlider(),o.settings.onSliderResize.call(r,o.active.index))};return r.goToSlide=function(e,i){if(!o.working&&o.active.index!=e)if(o.working=!0,o.oldIndex=o.active.index,o.active.index=0>e?x()-1:e>=x()?0:e,o.settings.onSlideBefore(o.children.eq(o.active.index),o.oldIndex,o.active.index),"next"==i?o.settings.onSlideNext(o.children.eq(o.active.index),o.oldIndex,o.active.index):"prev"==i&&o.settings.onSlidePrev(o.children.eq(o.active.index),o.oldIndex,o.active.index),o.active.last=o.active.index>=x()-1,o.settings.pager&&q(o.active.index),o.settings.controls&&W(),"fade"==o.settings.mode)o.settings.adaptiveHeight&&o.viewport.height()!=v()&&o.viewport.animate({height:v()},o.settings.adaptiveHeightSpeed),o.children.filter(":visible").fadeOut(o.settings.speed).css({zIndex:0}),o.children.eq(o.active.index).css("zIndex",o.settings.slideZIndex+1).fadeIn(o.settings.speed,function(){t(this).css("zIndex",o.settings.slideZIndex),D()});else{o.settings.adaptiveHeight&&o.viewport.height()!=v()&&o.viewport.animate({height:v()},o.settings.adaptiveHeightSpeed);var s=0,n={left:0,top:0};if(!o.settings.infiniteLoop&&o.carousel&&o.active.last)if("horizontal"==o.settings.mode){var a=o.children.eq(o.children.length-1);n=a.position(),s=o.viewport.width()-a.outerWidth()}else{var l=o.children.length-o.settings.minSlides;n=o.children.eq(l).position()}else if(o.carousel&&o.active.last&&"prev"==i){var d=1==o.settings.moveSlides?o.settings.maxSlides-m():(x()-1)*m()-(o.children.length-o.settings.maxSlides),a=r.children(".bx-clone").eq(d);n=a.position()}else if("next"==i&&0==o.active.index)n=r.find("> .bx-clone").eq(o.settings.maxSlides).position(),o.active.last=!1;else if(e>=0){var c=e*m();n=o.children.eq(c).position()}if("undefined"!=typeof n){var g="horizontal"==o.settings.mode?-(n.left-s):-n.top;b(g,"slide",o.settings.speed)}}},r.goToNextSlide=function(){if(o.settings.infiniteLoop||!o.active.last){var t=parseInt(o.active.index)+1;r.goToSlide(t,"next")}},r.goToPrevSlide=function(){if(o.settings.infiniteLoop||0!=o.active.index){var t=parseInt(o.active.index)-1;r.goToSlide(t,"prev")}},r.startAuto=function(t){o.interval||(o.interval=setInterval(function(){"next"==o.settings.autoDirection?r.goToNextSlide():r.goToPrevSlide()},o.settings.pause),o.settings.autoControls&&1!=t&&A("stop"))},r.stopAuto=function(t){o.interval&&(clearInterval(o.interval),o.interval=null,o.settings.autoControls&&1!=t&&A("start"))},r.getCurrentSlide=function(){return o.active.index},r.getCurrentSlideElement=function(){return o.children.eq(o.active.index)},r.getSlideCount=function(){return o.children.length},r.redrawSlider=function(){o.children.add(r.find(".bx-clone")).outerWidth(u()),o.viewport.css("height",v()),o.settings.ticker||S(),o.active.last&&(o.active.index=x()-1),o.active.index>=x()&&(o.active.last=!0),o.settings.pager&&!o.settings.pagerCustom&&(w(),q(o.active.index))},r.destroySlider=function(){o.initialized&&(o.initialized=!1,t(".bx-clone",this).remove(),o.children.each(function(){void 0!=t(this).data("origStyle")?t(this).attr("style",t(this).data("origStyle")):t(this).removeAttr("style")}),void 0!=t(this).data("origStyle")?this.attr("style",t(this).data("origStyle")):t(this).removeAttr("style"),t(this).unwrap().unwrap(),o.controls.el&&o.controls.el.remove(),o.controls.next&&o.controls.next.remove(),o.controls.prev&&o.controls.prev.remove(),o.pagerEl&&o.settings.controls&&o.pagerEl.remove(),t(".bx-caption",this).remove(),o.controls.autoEl&&o.controls.autoEl.remove(),clearInterval(o.interval),o.settings.responsive&&t(window).unbind("resize",Z))},r.reloadSlider=function(t){void 0!=t&&(n=t),r.destroySlider(),d()},d(),this}}(jQuery);
/*
 * jPlayer Plugin for jQuery JavaScript Library
 * http://www.jplayer.org
 *
 * Copyright (c) 2009 - 2013 Happyworm Ltd
 * Licensed under the MIT license.
 * http://opensource.org/licenses/MIT
 *
 * Author: Mark J Panaghiston
 * Version: 2.4.0
 * Date: 5th June 2013
 */

(function(b, f) {
	"function" === typeof define && define.amd ? define(["jquery"], f) : b.jQuery ? f(b.jQuery) : f(b.Zepto)
})(this, function(b, f) {
	b.fn.jPlayer = function(a) {
		var c = "string" === typeof a,
			d = Array.prototype.slice.call(arguments, 1),
			e = this;
		a = !c && d.length ? b.extend.apply(null, [!0, a].concat(d)) : a;
		if (c && "_" === a.charAt(0)) return e;
		c ? this.each(function() {
			var c = b(this).data("jPlayer"),
				h = c && b.isFunction(c[a]) ? c[a].apply(c, d) : c;
			if (h !== c && h !== f) return e = h, !1
		}) : this.each(function() {
			var c = b(this).data("jPlayer");
			c ? c.option(a || {}) : b(this).data("jPlayer", new b.jPlayer(a, this))
		});
		return e
	};
	b.jPlayer = function(a, c) {
		if (arguments.length) {
			this.element = b(c);
			this.options = b.extend(!0, {}, this.options, a);
			var d = this;
			this.element.bind("remove.jPlayer", function() {
				d.destroy()
			});
			this._init()
		}
	};
	"function" !== typeof b.fn.stop && (b.fn.stop = function() {});
	b.jPlayer.emulateMethods = "load play pause";
	b.jPlayer.emulateStatus = "src readyState networkState currentTime duration paused ended playbackRate";
	b.jPlayer.emulateOptions = "muted volume";
	b.jPlayer.reservedEvent =
		"ready flashreset resize repeat error warning";
	b.jPlayer.event = {};
	b.each("ready flashreset resize repeat click error warning loadstart progress suspend abort emptied stalled play pause loadedmetadata loadeddata waiting playing canplay canplaythrough seeking seeked timeupdate ended ratechange durationchange volumechange".split(" "), function() {
		b.jPlayer.event[this] = "jPlayer_" + this
	});
	b.jPlayer.htmlEvent = "loadstart abort emptied stalled loadedmetadata loadeddata canplay canplaythrough ratechange".split(" ");
	b.jPlayer.pause = function() {
		b.each(b.jPlayer.prototype.instances, function(a, c) {
			c.data("jPlayer").status.srcSet && c.jPlayer("pause")
		})
	};
	b.jPlayer.timeFormat = {
		showHour: !1,
		showMin: !0,
		showSec: !0,
		padHour: !1,
		padMin: !0,
		padSec: !0,
		sepHour: ":",
		sepMin: ":",
		sepSec: ""
	};
	var l = function() {
		this.init()
	};
	l.prototype = {
		init: function() {
			this.options = {
				timeFormat: b.jPlayer.timeFormat
			}
		},
		time: function(a) {
			var c = new Date(1E3 * (a && "number" === typeof a ? a : 0)),
				b = c.getUTCHours();
			a = this.options.timeFormat.showHour ? c.getUTCMinutes() : c.getUTCMinutes() +
				60 * b;
			c = this.options.timeFormat.showMin ? c.getUTCSeconds() : c.getUTCSeconds() + 60 * a;
			b = this.options.timeFormat.padHour && 10 > b ? "0" + b : b;
			a = this.options.timeFormat.padMin && 10 > a ? "0" + a : a;
			c = this.options.timeFormat.padSec && 10 > c ? "0" + c : c;
			b = "" + (this.options.timeFormat.showHour ? b + this.options.timeFormat.sepHour : "");
			b += this.options.timeFormat.showMin ? a + this.options.timeFormat.sepMin : "";
			return b += this.options.timeFormat.showSec ? c + this.options.timeFormat.sepSec : ""
		}
	};
	var m = new l;
	b.jPlayer.convertTime = function(a) {
		return m.time(a)
	};
	b.jPlayer.uaBrowser = function(a) {
		a = a.toLowerCase();
		var b = /(opera)(?:.*version)?[ \/]([\w.]+)/,
			d = /(msie) ([\w.]+)/,
			e = /(mozilla)(?:.*? rv:([\w.]+))?/;
		a = /(webkit)[ \/]([\w.]+)/.exec(a) || b.exec(a) || d.exec(a) || 0 > a.indexOf("compatible") && e.exec(a) || [];
		return {
			browser: a[1] || "",
			version: a[2] || "0"
		}
	};
	b.jPlayer.uaPlatform = function(a) {
		var b = a.toLowerCase(),
			d = /(android)/,
			e = /(mobile)/;
		a = /(ipad|iphone|ipod|android|blackberry|playbook|windows ce|webos)/.exec(b) || [];
		b = /(ipad|playbook)/.exec(b) || !e.exec(b) && d.exec(b) ||
			[];
		a[1] && (a[1] = a[1].replace(/\s/g, "_"));
		return {
			platform: a[1] || "",
			tablet: b[1] || ""
		}
	};
	b.jPlayer.browser = {};
	b.jPlayer.platform = {};
	var j = b.jPlayer.uaBrowser(navigator.userAgent);
	j.browser && (b.jPlayer.browser[j.browser] = !0, b.jPlayer.browser.version = j.version);
	j = b.jPlayer.uaPlatform(navigator.userAgent);
	j.platform && (b.jPlayer.platform[j.platform] = !0, b.jPlayer.platform.mobile = !j.tablet, b.jPlayer.platform.tablet = !! j.tablet);
	b.jPlayer.getDocMode = function() {
		var a;
		b.jPlayer.browser.msie && (document.documentMode ?
			a = document.documentMode : (a = 5, document.compatMode && "CSS1Compat" === document.compatMode && (a = 7)));
		return a
	};
	b.jPlayer.browser.documentMode = b.jPlayer.getDocMode();
	b.jPlayer.nativeFeatures = {
		init: function() {
			var a = document,
				b = a.createElement("video"),
				d = {
					w3c: "fullscreenEnabled fullscreenElement requestFullscreen exitFullscreen fullscreenchange fullscreenerror".split(" "),
					moz: "mozFullScreenEnabled mozFullScreenElement mozRequestFullScreen mozCancelFullScreen mozfullscreenchange mozfullscreenerror".split(" "),
					webkit: " webkitCurrentFullScreenElement webkitRequestFullScreen webkitCancelFullScreen webkitfullscreenchange ".split(" "),
					webkitVideo: "webkitSupportsFullscreen webkitDisplayingFullscreen webkitEnterFullscreen webkitExitFullscreen  ".split(" ")
				}, e = ["w3c", "moz", "webkit", "webkitVideo"],
				g, h;
			this.fullscreen = b = {
				support: {
					w3c: !! a[d.w3c[0]],
					moz: !! a[d.moz[0]],
					webkit: "function" === typeof a[d.webkit[3]],
					webkitVideo: "function" === typeof b[d.webkitVideo[2]]
				},
				used: {}
			};
			g = 0;
			for (h = e.length; g < h; g++) {
				var f = e[g];
				if (b.support[f]) {
					b.spec =
						f;
					b.used[f] = !0;
					break
				}
			}
			if (b.spec) {
				var k = d[b.spec];
				b.api = {
					fullscreenEnabled: !0,
					fullscreenElement: function(b) {
						b = b ? b : a;
						return b[k[1]]
					},
					requestFullscreen: function(a) {
						return a[k[2]]()
					},
					exitFullscreen: function(b) {
						b = b ? b : a;
						return b[k[3]]()
					}
				};
				b.event = {
					fullscreenchange: k[4],
					fullscreenerror: k[5]
				}
			} else b.api = {
				fullscreenEnabled: !1,
				fullscreenElement: function() {
					return null
				},
				requestFullscreen: function() {},
				exitFullscreen: function() {}
			}, b.event = {}
		}
	};
	b.jPlayer.nativeFeatures.init();
	b.jPlayer.focus = null;
	b.jPlayer.keyIgnoreElementNames =
		"INPUT TEXTAREA";
	var n = function(a) {
		var c = b.jPlayer.focus,
			d;
		c && (b.each(b.jPlayer.keyIgnoreElementNames.split(/\s+/g), function(b, c) {
			if (a.target.nodeName.toUpperCase() === c.toUpperCase()) return d = !0, !1
		}), d || b.each(c.options.keyBindings, function(d, g) {
			if (g && a.which === g.key && b.isFunction(g.fn)) return a.preventDefault(), g.fn(c), !1
		}))
	};
	b.jPlayer.keys = function(a) {
		b(document.documentElement).unbind("keydown.jPlayer");
		a && b(document.documentElement).bind("keydown.jPlayer", n)
	};
	b.jPlayer.keys(!0);
	b.jPlayer.prototype = {
		count: 0,
		version: {
			script: "2.4.0",
			needFlash: "2.4.0",
			flash: "unknown"
		},
		options: {
			swfPath: "js",
			solution: "html, flash",
			supplied: "mp3",
			preload: "metadata",
			volume: 0.8,
			muted: !1,
			wmode: "opaque",
			backgroundColor: "#000000",
			cssSelectorAncestor: "#jp_container_1",
			cssSelector: {
				videoPlay: ".jp-video-play",
				play: ".jp-play",
				pause: ".jp-pause",
				stop: ".jp-stop",
				seekBar: ".jp-seek-bar",
				playBar: ".jp-play-bar",
				mute: ".jp-mute",
				unmute: ".jp-unmute",
				volumeBar: ".jp-volume-bar",
				volumeBarValue: ".jp-volume-bar-value",
				volumeMax: ".jp-volume-max",
				currentTime: ".jp-current-time",
				duration: ".jp-duration",
				fullScreen: ".jp-full-screen",
				restoreScreen: ".jp-restore-screen",
				repeat: ".jp-repeat",
				repeatOff: ".jp-repeat-off",
				gui: ".jp-gui",
				noSolution: ".jp-no-solution"
			},
			smoothPlayBar: !1,
			fullScreen: !1,
			fullWindow: !1,
			autohide: {
				restored: !1,
				full: !0,
				fadeIn: 200,
				fadeOut: 600,
				hold: 1E3
			},
			loop: !1,
			repeat: function(a) {
				a.jPlayer.options.loop ? b(this).unbind(".jPlayerRepeat").bind(b.jPlayer.event.ended + ".jPlayer.jPlayerRepeat", function() {
					b(this).jPlayer("play")
				}) : b(this).unbind(".jPlayerRepeat")
			},
			nativeVideoControls: {},
			noFullWindow: {
				msie: /msie [0-6]\./,
				ipad: /ipad.*?os [0-4]\./,
				iphone: /iphone/,
				ipod: /ipod/,
				android_pad: /android [0-3]\.(?!.*?mobile)/,
				android_phone: /android.*?mobile/,
				blackberry: /blackberry/,
				windows_ce: /windows ce/,
				iemobile: /iemobile/,
				webos: /webos/
			},
			noVolume: {
				ipad: /ipad/,
				iphone: /iphone/,
				ipod: /ipod/,
				android_pad: /android(?!.*?mobile)/,
				android_phone: /android.*?mobile/,
				blackberry: /blackberry/,
				windows_ce: /windows ce/,
				iemobile: /iemobile/,
				webos: /webos/,
				playbook: /playbook/
			},
			timeFormat: {},
			keyEnabled: !1,
			audioFullScreen: !1,
			keyBindings: {
				play: {
					key: 32,
					fn: function(a) {
						a.status.paused ? a.play() : a.pause()
					}
				},
				fullScreen: {
					key: 13,
					fn: function(a) {
						(a.status.video || a.options.audioFullScreen) && a._setOption("fullScreen", !a.options.fullScreen)
					}
				},
				muted: {
					key: 8,
					fn: function(a) {
						a._muted(!a.options.muted)
					}
				},
				volumeUp: {
					key: 38,
					fn: function(a) {
						a.volume(a.options.volume + 0.1)
					}
				},
				volumeDown: {
					key: 40,
					fn: function(a) {
						a.volume(a.options.volume - 0.1)
					}
				}
			},
			verticalVolume: !1,
			idPrefix: "jp",
			noConflict: "jQuery",
			emulateHtml: !1,
			errorAlerts: !1,
			warningAlerts: !1
		},
		optionsAudio: {
			size: {
				width: "0px",
				height: "0px",
				cssClass: ""
			},
			sizeFull: {
				width: "0px",
				height: "0px",
				cssClass: ""
			}
		},
		optionsVideo: {
			size: {
				width: "480px",
				height: "270px",
				cssClass: "jp-video-270p"
			},
			sizeFull: {
				width: "100%",
				height: "100%",
				cssClass: "jp-video-full"
			}
		},
		instances: {},
		status: {
			src: "",
			media: {},
			paused: !0,
			format: {},
			formatType: "",
			waitForPlay: !0,
			waitForLoad: !0,
			srcSet: !1,
			video: !1,
			seekPercent: 0,
			currentPercentRelative: 0,
			currentPercentAbsolute: 0,
			currentTime: 0,
			duration: 0,
			videoWidth: 0,
			videoHeight: 0,
			readyState: 0,
			networkState: 0,
			playbackRate: 1,
			ended: 0
		},
		internal: {
			ready: !1
		},
		solution: {
			html: !0,
			flash: !0
		},
		format: {
			mp3: {
				codec: 'audio/mpeg; codecs="mp3"',
				flashCanPlay: !0,
				media: "audio"
			},
			m4a: {
				codec: 'audio/mp4; codecs="mp4a.40.2"',
				flashCanPlay: !0,
				media: "audio"
			},
			oga: {
				codec: 'audio/ogg; codecs="vorbis"',
				flashCanPlay: !1,
				media: "audio"
			},
			wav: {
				codec: 'audio/wav; codecs="1"',
				flashCanPlay: !1,
				media: "audio"
			},
			webma: {
				codec: 'audio/webm; codecs="vorbis"',
				flashCanPlay: !1,
				media: "audio"
			},
			fla: {
				codec: "audio/x-flv",
				flashCanPlay: !0,
				media: "audio"
			},
			rtmpa: {
				codec: 'audio/rtmp; codecs="rtmp"',
				flashCanPlay: !0,
				media: "audio"
			},
			m4v: {
				codec: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
				flashCanPlay: !0,
				media: "video"
			},
			ogv: {
				codec: 'video/ogg; codecs="theora, vorbis"',
				flashCanPlay: !1,
				media: "video"
			},
			webmv: {
				codec: 'video/webm; codecs="vorbis, vp8"',
				flashCanPlay: !1,
				media: "video"
			},
			flv: {
				codec: "video/x-flv",
				flashCanPlay: !0,
				media: "video"
			},
			rtmpv: {
				codec: 'video/rtmp; codecs="rtmp"',
				flashCanPlay: !0,
				media: "video"
			}
		},
		_init: function() {
			var a = this;
			this.element.empty();
			this.status =
				b.extend({}, this.status);
			this.internal = b.extend({}, this.internal);
			this.options.timeFormat = b.extend({}, b.jPlayer.timeFormat, this.options.timeFormat);
			this.internal.cmdsIgnored = b.jPlayer.platform.ipad || b.jPlayer.platform.iphone || b.jPlayer.platform.ipod;
			this.internal.domNode = this.element.get(0);
			this.options.keyEnabled && !b.jPlayer.focus && (b.jPlayer.focus = this);
			this.formats = [];
			this.solutions = [];
			this.require = {};
			this.htmlElement = {};
			this.html = {};
			this.html.audio = {};
			this.html.video = {};
			this.flash = {};
			this.css = {};
			this.css.cs = {};
			this.css.jq = {};
			this.ancestorJq = [];
			this.options.volume = this._limitValue(this.options.volume, 0, 1);
			b.each(this.options.supplied.toLowerCase().split(","), function(c, d) {
				var e = d.replace(/^\s+|\s+$/g, "");
				if (a.format[e]) {
					var f = !1;
					b.each(a.formats, function(a, b) {
						if (e === b) return f = !0, !1
					});
					f || a.formats.push(e)
				}
			});
			b.each(this.options.solution.toLowerCase().split(","), function(c, d) {
				var e = d.replace(/^\s+|\s+$/g, "");
				if (a.solution[e]) {
					var f = !1;
					b.each(a.solutions, function(a, b) {
						if (e === b) return f = !0, !1
					});
					f || a.solutions.push(e)
				}
			});
			this.internal.instance = "jp_" + this.count;
			this.instances[this.internal.instance] = this.element;
			this.element.attr("id") || this.element.attr("id", this.options.idPrefix + "_jplayer_" + this.count);
			this.internal.self = b.extend({}, {
				id: this.element.attr("id"),
				jq: this.element
			});
			this.internal.audio = b.extend({}, {
				id: this.options.idPrefix + "_audio_" + this.count,
				jq: f
			});
			this.internal.video = b.extend({}, {
				id: this.options.idPrefix + "_video_" + this.count,
				jq: f
			});
			this.internal.flash = b.extend({}, {
				id: this.options.idPrefix + "_flash_" + this.count,
				jq: f,
				swf: this.options.swfPath + (".swf" !== this.options.swfPath.toLowerCase().slice(-4) ? (this.options.swfPath && "/" !== this.options.swfPath.slice(-1) ? "/" : "") + "Jplayer.swf" : "")
			});
			this.internal.poster = b.extend({}, {
				id: this.options.idPrefix + "_poster_" + this.count,
				jq: f
			});
			b.each(b.jPlayer.event, function(b, c) {
				a.options[b] !== f && (a.element.bind(c + ".jPlayer", a.options[b]), a.options[b] = f)
			});
			this.require.audio = !1;
			this.require.video = !1;
			b.each(this.formats, function(b, c) {
				a.require[a.format[c].media] = !0
			});
			this.options = this.require.video ? b.extend(!0, {}, this.optionsVideo, this.options) : b.extend(!0, {}, this.optionsAudio, this.options);
			this._setSize();
			this.status.nativeVideoControls = this._uaBlocklist(this.options.nativeVideoControls);
			this.status.noFullWindow = this._uaBlocklist(this.options.noFullWindow);
			this.status.noVolume = this._uaBlocklist(this.options.noVolume);
			b.jPlayer.nativeFeatures.fullscreen.api.fullscreenEnabled && this._fullscreenAddEventListeners();
			this._restrictNativeVideoControls();
			this.htmlElement.poster =
				document.createElement("img");
			this.htmlElement.poster.id = this.internal.poster.id;
			this.htmlElement.poster.onload = function() {
				(!a.status.video || a.status.waitForPlay) && a.internal.poster.jq.show()
			};
			this.element.append(this.htmlElement.poster);
			this.internal.poster.jq = b("#" + this.internal.poster.id);
			this.internal.poster.jq.css({
				width: this.status.width,
				height: this.status.height
			});
			this.internal.poster.jq.hide();
			this.internal.poster.jq.bind("click.jPlayer", function() {
				a._trigger(b.jPlayer.event.click)
			});
			this.html.audio.available = !1;
			this.require.audio && (this.htmlElement.audio = document.createElement("audio"), this.htmlElement.audio.id = this.internal.audio.id, this.html.audio.available = !! this.htmlElement.audio.canPlayType && this._testCanPlayType(this.htmlElement.audio));
			this.html.video.available = !1;
			this.require.video && (this.htmlElement.video = document.createElement("video"), this.htmlElement.video.id = this.internal.video.id, this.html.video.available = !! this.htmlElement.video.canPlayType && this._testCanPlayType(this.htmlElement.video));
			this.flash.available = this._checkForFlash(10.1);
			this.html.canPlay = {};
			this.flash.canPlay = {};
			b.each(this.formats, function(b, c) {
				a.html.canPlay[c] = a.html[a.format[c].media].available && "" !== a.htmlElement[a.format[c].media].canPlayType(a.format[c].codec);
				a.flash.canPlay[c] = a.format[c].flashCanPlay && a.flash.available
			});
			this.html.desired = !1;
			this.flash.desired = !1;
			b.each(this.solutions, function(c, d) {
				if (0 === c) a[d].desired = !0;
				else {
					var e = !1,
						f = !1;
					b.each(a.formats, function(b, c) {
						a[a.solutions[0]].canPlay[c] && ("video" ===
							a.format[c].media ? f = !0 : e = !0)
					});
					a[d].desired = a.require.audio && !e || a.require.video && !f
				}
			});
			this.html.support = {};
			this.flash.support = {};
			b.each(this.formats, function(b, c) {
				a.html.support[c] = a.html.canPlay[c] && a.html.desired;
				a.flash.support[c] = a.flash.canPlay[c] && a.flash.desired
			});
			this.html.used = !1;
			this.flash.used = !1;
			b.each(this.solutions, function(c, d) {
				b.each(a.formats, function(b, c) {
					if (a[d].support[c]) return a[d].used = !0, !1
				})
			});
			this._resetActive();
			this._resetGate();
			this._cssSelectorAncestor(this.options.cssSelectorAncestor);
			!this.html.used && !this.flash.used ? (this._error({
				type: b.jPlayer.error.NO_SOLUTION,
				context: "{solution:'" + this.options.solution + "', supplied:'" + this.options.supplied + "'}",
				message: b.jPlayer.errorMsg.NO_SOLUTION,
				hint: b.jPlayer.errorHint.NO_SOLUTION
			}), this.css.jq.noSolution.length && this.css.jq.noSolution.show()) : this.css.jq.noSolution.length && this.css.jq.noSolution.hide();
			if (this.flash.used) {
				var c, d = "jQuery=" + encodeURI(this.options.noConflict) + "&id=" + encodeURI(this.internal.self.id) + "&vol=" + this.options.volume +
						"&muted=" + this.options.muted;
				if (b.jPlayer.browser.msie && (9 > Number(b.jPlayer.browser.version) || 9 > b.jPlayer.browser.documentMode)) {
					d = ['<param name="movie" value="' + this.internal.flash.swf + '" />', '<param name="FlashVars" value="' + d + '" />', '<param name="allowScriptAccess" value="always" />', '<param name="bgcolor" value="' + this.options.backgroundColor + '" />', '<param name="wmode" value="' + this.options.wmode + '" />'];
					c = document.createElement('<object id="' + this.internal.flash.id + '" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="0" height="0" tabindex="-1"></object>');
					for (var e = 0; e < d.length; e++) c.appendChild(document.createElement(d[e]))
				} else e = function(a, b, c) {
					var d = document.createElement("param");
					d.setAttribute("name", b);
					d.setAttribute("value", c);
					a.appendChild(d)
				}, c = document.createElement("object"), c.setAttribute("id", this.internal.flash.id), c.setAttribute("name", this.internal.flash.id), c.setAttribute("data", this.internal.flash.swf), c.setAttribute("type", "application/x-shockwave-flash"), c.setAttribute("width", "1"), c.setAttribute("height", "1"), c.setAttribute("tabindex",
					"-1"), e(c, "flashvars", d), e(c, "allowscriptaccess", "always"), e(c, "bgcolor", this.options.backgroundColor), e(c, "wmode", this.options.wmode);
				this.element.append(c);
				this.internal.flash.jq = b(c)
			}
			this.html.used && (this.html.audio.available && (this._addHtmlEventListeners(this.htmlElement.audio, this.html.audio), this.element.append(this.htmlElement.audio), this.internal.audio.jq = b("#" + this.internal.audio.id)), this.html.video.available && (this._addHtmlEventListeners(this.htmlElement.video, this.html.video), this.element.append(this.htmlElement.video),
				this.internal.video.jq = b("#" + this.internal.video.id), this.status.nativeVideoControls ? this.internal.video.jq.css({
					width: this.status.width,
					height: this.status.height
				}) : this.internal.video.jq.css({
					width: "0px",
					height: "0px"
				}), this.internal.video.jq.bind("click.jPlayer", function() {
					a._trigger(b.jPlayer.event.click)
				})));
			this.options.emulateHtml && this._emulateHtmlBridge();
			this.html.used && !this.flash.used && setTimeout(function() {
					a.internal.ready = !0;
					a.version.flash = "n/a";
					a._trigger(b.jPlayer.event.repeat);
					a._trigger(b.jPlayer.event.ready)
				},
				100);
			this._updateNativeVideoControls();
			this.css.jq.videoPlay.length && this.css.jq.videoPlay.hide();
			b.jPlayer.prototype.count++
		},
		destroy: function() {
			this.clearMedia();
			this._removeUiClass();
			this.css.jq.currentTime.length && this.css.jq.currentTime.text("");
			this.css.jq.duration.length && this.css.jq.duration.text("");
			b.each(this.css.jq, function(a, b) {
				b.length && b.unbind(".jPlayer")
			});
			this.internal.poster.jq.unbind(".jPlayer");
			this.internal.video.jq && this.internal.video.jq.unbind(".jPlayer");
			this._fullscreenRemoveEventListeners();
			this === b.jPlayer.focus && (b.jPlayer.focus = null);
			this.options.emulateHtml && this._destroyHtmlBridge();
			this.element.removeData("jPlayer");
			this.element.unbind(".jPlayer");
			this.element.empty();
			delete this.instances[this.internal.instance]
		},
		enable: function() {},
		disable: function() {},
		_testCanPlayType: function(a) {
			try {
				return a.canPlayType(this.format.mp3.codec), !0
			} catch (b) {
				return !1
			}
		},
		_uaBlocklist: function(a) {
			var c = navigator.userAgent.toLowerCase(),
				d = !1;
			b.each(a, function(a, b) {
				if (b && b.test(c)) return d = !0, !1
			});
			return d
		},
		_restrictNativeVideoControls: function() {
			this.require.audio && this.status.nativeVideoControls && (this.status.nativeVideoControls = !1, this.status.noFullWindow = !0)
		},
		_updateNativeVideoControls: function() {
			this.html.video.available && this.html.used && (this.htmlElement.video.controls = this.status.nativeVideoControls, this._updateAutohide(), this.status.nativeVideoControls && this.require.video ? (this.internal.poster.jq.hide(), this.internal.video.jq.css({
					width: this.status.width,
					height: this.status.height
				})) :
				this.status.waitForPlay && this.status.video && (this.internal.poster.jq.show(), this.internal.video.jq.css({
					width: "0px",
					height: "0px"
				})))
		},
		_addHtmlEventListeners: function(a, c) {
			var d = this;
			a.preload = this.options.preload;
			a.muted = this.options.muted;
			a.volume = this.options.volume;
			a.addEventListener("progress", function() {
				c.gate && (d.internal.cmdsIgnored && 0 < this.readyState && (d.internal.cmdsIgnored = !1), d._getHtmlStatus(a), d._updateInterface(), d._trigger(b.jPlayer.event.progress))
			}, !1);
			a.addEventListener("timeupdate",
				function() {
					c.gate && (d._getHtmlStatus(a), d._updateInterface(), d._trigger(b.jPlayer.event.timeupdate))
				}, !1);
			a.addEventListener("durationchange", function() {
				c.gate && (d._getHtmlStatus(a), d._updateInterface(), d._trigger(b.jPlayer.event.durationchange))
			}, !1);
			a.addEventListener("play", function() {
				c.gate && (d._updateButtons(!0), d._html_checkWaitForPlay(), d._trigger(b.jPlayer.event.play))
			}, !1);
			a.addEventListener("playing", function() {
				c.gate && (d._updateButtons(!0), d._seeked(), d._trigger(b.jPlayer.event.playing))
			}, !1);
			a.addEventListener("pause", function() {
				c.gate && (d._updateButtons(!1), d._trigger(b.jPlayer.event.pause))
			}, !1);
			a.addEventListener("waiting", function() {
				c.gate && (d._seeking(), d._trigger(b.jPlayer.event.waiting))
			}, !1);
			a.addEventListener("seeking", function() {
				c.gate && (d._seeking(), d._trigger(b.jPlayer.event.seeking))
			}, !1);
			a.addEventListener("seeked", function() {
				c.gate && (d._seeked(), d._trigger(b.jPlayer.event.seeked))
			}, !1);
			a.addEventListener("volumechange", function() {
				c.gate && (d.options.volume = a.volume,
					d.options.muted = a.muted, d._updateMute(), d._updateVolume(), d._trigger(b.jPlayer.event.volumechange))
			}, !1);
			a.addEventListener("suspend", function() {
				c.gate && (d._seeked(), d._trigger(b.jPlayer.event.suspend))
			}, !1);
			a.addEventListener("ended", function() {
				c.gate && (b.jPlayer.browser.webkit || (d.htmlElement.media.currentTime = 0), d.htmlElement.media.pause(), d._updateButtons(!1), d._getHtmlStatus(a, !0), d._updateInterface(), d._trigger(b.jPlayer.event.ended))
			}, !1);
			a.addEventListener("error", function() {
				c.gate && (d._updateButtons(!1),
					d._seeked(), d.status.srcSet && (clearTimeout(d.internal.htmlDlyCmdId), d.status.waitForLoad = !0, d.status.waitForPlay = !0, d.status.video && !d.status.nativeVideoControls && d.internal.video.jq.css({
						width: "0px",
						height: "0px"
					}), d._validString(d.status.media.poster) && !d.status.nativeVideoControls && d.internal.poster.jq.show(), d.css.jq.videoPlay.length && d.css.jq.videoPlay.show(), d._error({
						type: b.jPlayer.error.URL,
						context: d.status.src,
						message: b.jPlayer.errorMsg.URL,
						hint: b.jPlayer.errorHint.URL
					})))
			}, !1);
			b.each(b.jPlayer.htmlEvent,
				function(e, g) {
					a.addEventListener(this, function() {
						c.gate && d._trigger(b.jPlayer.event[g])
					}, !1)
				})
		},
		_getHtmlStatus: function(a, b) {
			var d = 0,
				e = 0,
				g = 0,
				f = 0;
			isFinite(a.duration) && (this.status.duration = a.duration);
			d = a.currentTime;
			e = 0 < this.status.duration ? 100 * d / this.status.duration : 0;
			"object" === typeof a.seekable && 0 < a.seekable.length ? (g = 0 < this.status.duration ? 100 * a.seekable.end(a.seekable.length - 1) / this.status.duration : 100, f = 0 < this.status.duration ? 100 * a.currentTime / a.seekable.end(a.seekable.length - 1) : 0) : (g = 100,
				f = e);
			b && (e = f = d = 0);
			this.status.seekPercent = g;
			this.status.currentPercentRelative = f;
			this.status.currentPercentAbsolute = e;
			this.status.currentTime = d;
			this.status.videoWidth = a.videoWidth;
			this.status.videoHeight = a.videoHeight;
			this.status.readyState = a.readyState;
			this.status.networkState = a.networkState;
			this.status.playbackRate = a.playbackRate;
			this.status.ended = a.ended
		},
		_resetStatus: function() {
			this.status = b.extend({}, this.status, b.jPlayer.prototype.status)
		},
		_trigger: function(a, c, d) {
			a = b.Event(a);
			a.jPlayer = {};
			a.jPlayer.version = b.extend({}, this.version);
			a.jPlayer.options = b.extend(!0, {}, this.options);
			a.jPlayer.status = b.extend(!0, {}, this.status);
			a.jPlayer.html = b.extend(!0, {}, this.html);
			a.jPlayer.flash = b.extend(!0, {}, this.flash);
			c && (a.jPlayer.error = b.extend({}, c));
			d && (a.jPlayer.warning = b.extend({}, d));
			this.element.trigger(a)
		},
		jPlayerFlashEvent: function(a, c) {
			if (a === b.jPlayer.event.ready)
				if (this.internal.ready) {
					if (this.flash.gate) {
						if (this.status.srcSet) {
							var d = this.status.currentTime,
								e = this.status.paused;
							this.setMedia(this.status.media);
							0 < d && (e ? this.pause(d) : this.play(d))
						}
						this._trigger(b.jPlayer.event.flashreset)
					}
				} else this.internal.ready = !0, this.internal.flash.jq.css({
					width: "0px",
					height: "0px"
				}), this.version.flash = c.version, this.version.needFlash !== this.version.flash && this._error({
					type: b.jPlayer.error.VERSION,
					context: this.version.flash,
					message: b.jPlayer.errorMsg.VERSION + this.version.flash,
					hint: b.jPlayer.errorHint.VERSION
				}), this._trigger(b.jPlayer.event.repeat), this._trigger(a);
			if (this.flash.gate) switch (a) {
				case b.jPlayer.event.progress:
					this._getFlashStatus(c);
					this._updateInterface();
					this._trigger(a);
					break;
				case b.jPlayer.event.timeupdate:
					this._getFlashStatus(c);
					this._updateInterface();
					this._trigger(a);
					break;
				case b.jPlayer.event.play:
					this._seeked();
					this._updateButtons(!0);
					this._trigger(a);
					break;
				case b.jPlayer.event.pause:
					this._updateButtons(!1);
					this._trigger(a);
					break;
				case b.jPlayer.event.ended:
					this._updateButtons(!1);
					this._trigger(a);
					break;
				case b.jPlayer.event.click:
					this._trigger(a);
					break;
				case b.jPlayer.event.error:
					this.status.waitForLoad = !0;
					this.status.waitForPlay = !0;
					this.status.video && this.internal.flash.jq.css({
						width: "0px",
						height: "0px"
					});
					this._validString(this.status.media.poster) && this.internal.poster.jq.show();
					this.css.jq.videoPlay.length && this.status.video && this.css.jq.videoPlay.show();
					this.status.video ? this._flash_setVideo(this.status.media) : this._flash_setAudio(this.status.media);
					this._updateButtons(!1);
					this._error({
						type: b.jPlayer.error.URL,
						context: c.src,
						message: b.jPlayer.errorMsg.URL,
						hint: b.jPlayer.errorHint.URL
					});
					break;
				case b.jPlayer.event.seeking:
					this._seeking();
					this._trigger(a);
					break;
				case b.jPlayer.event.seeked:
					this._seeked();
					this._trigger(a);
					break;
				case b.jPlayer.event.ready:
					break;
				default:
					this._trigger(a)
			}
			return !1
		},
		_getFlashStatus: function(a) {
			this.status.seekPercent = a.seekPercent;
			this.status.currentPercentRelative = a.currentPercentRelative;
			this.status.currentPercentAbsolute = a.currentPercentAbsolute;
			this.status.currentTime = a.currentTime;
			this.status.duration = a.duration;
			this.status.videoWidth = a.videoWidth;
			this.status.videoHeight = a.videoHeight;
			this.status.readyState =
				4;
			this.status.networkState = 0;
			this.status.playbackRate = 1;
			this.status.ended = !1
		},
		_updateButtons: function(a) {
			a === f ? a = !this.status.paused : this.status.paused = !a;
			this.css.jq.play.length && this.css.jq.pause.length && (a ? (this.css.jq.play.hide(), this.css.jq.pause.show()) : (this.css.jq.play.show(), this.css.jq.pause.hide()));
			this.css.jq.restoreScreen.length && this.css.jq.fullScreen.length && (this.status.noFullWindow ? (this.css.jq.fullScreen.hide(), this.css.jq.restoreScreen.hide()) : this.options.fullWindow ? (this.css.jq.fullScreen.hide(),
				this.css.jq.restoreScreen.show()) : (this.css.jq.fullScreen.show(), this.css.jq.restoreScreen.hide()));
			this.css.jq.repeat.length && this.css.jq.repeatOff.length && (this.options.loop ? (this.css.jq.repeat.hide(), this.css.jq.repeatOff.show()) : (this.css.jq.repeat.show(), this.css.jq.repeatOff.hide()))
		},
		_updateInterface: function() {
			this.css.jq.seekBar.length && this.css.jq.seekBar.width(this.status.seekPercent + "%");
			this.css.jq.playBar.length && (this.options.smoothPlayBar ? this.css.jq.playBar.stop().animate({
				width: this.status.currentPercentAbsolute + "%"
			}, 250, "linear") : this.css.jq.playBar.width(this.status.currentPercentRelative + "%"));
			this.css.jq.currentTime.length && this.css.jq.currentTime.text(this._convertTime(this.status.currentTime));
			this.css.jq.duration.length && this.css.jq.duration.text(this._convertTime(this.status.duration))
		},
		_convertTime: l.prototype.time,
		_seeking: function() {
			this.css.jq.seekBar.length && this.css.jq.seekBar.addClass("jp-seeking-bg")
		},
		_seeked: function() {
			this.css.jq.seekBar.length && this.css.jq.seekBar.removeClass("jp-seeking-bg")
		},
		_resetGate: function() {
			this.html.audio.gate = !1;
			this.html.video.gate = !1;
			this.flash.gate = !1
		},
		_resetActive: function() {
			this.html.active = !1;
			this.flash.active = !1
		},
		setMedia: function(a) {
			var c = this,
				d = !1,
				e = this.status.media.poster !== a.poster;
			this._resetMedia();
			this._resetGate();
			this._resetActive();
			b.each(this.formats, function(e, f) {
				var j = "video" === c.format[f].media;
				b.each(c.solutions, function(b, e) {
					if (c[e].support[f] && c._validString(a[f])) {
						var g = "html" === e;
						j ? (g ? (c.html.video.gate = !0, c._html_setVideo(a), c.html.active = !0) : (c.flash.gate = !0, c._flash_setVideo(a), c.flash.active = !0), c.css.jq.videoPlay.length && c.css.jq.videoPlay.show(), c.status.video = !0) : (g ? (c.html.audio.gate = !0, c._html_setAudio(a), c.html.active = !0) : (c.flash.gate = !0, c._flash_setAudio(a), c.flash.active = !0), c.css.jq.videoPlay.length && c.css.jq.videoPlay.hide(), c.status.video = !1);
						d = !0;
						return !1
					}
				});
				if (d) return !1
			});
			if (d) {
				if ((!this.status.nativeVideoControls || !this.html.video.gate) && this._validString(a.poster)) e ? this.htmlElement.poster.src = a.poster : this.internal.poster.jq.show();
				this.status.srcSet = !0;
				this.status.media = b.extend({}, a);
				this._updateButtons(!1);
				this._updateInterface()
			} else this._error({
				type: b.jPlayer.error.NO_SUPPORT,
				context: "{supplied:'" + this.options.supplied + "'}",
				message: b.jPlayer.errorMsg.NO_SUPPORT,
				hint: b.jPlayer.errorHint.NO_SUPPORT
			})
		},
		_resetMedia: function() {
			this._resetStatus();
			this._updateButtons(!1);
			this._updateInterface();
			this._seeked();
			this.internal.poster.jq.hide();
			clearTimeout(this.internal.htmlDlyCmdId);
			this.html.active ? this._html_resetMedia() : this.flash.active &&
				this._flash_resetMedia()
		},
		clearMedia: function() {
			this._resetMedia();
			this.html.active ? this._html_clearMedia() : this.flash.active && this._flash_clearMedia();
			this._resetGate();
			this._resetActive()
		},
		load: function() {
		
			this.status.srcSet ? this.html.active ? this._html_load() : this.flash.active && this._flash_load() : this._urlNotSetError("load")
		},
		focus: function() {
			this.options.keyEnabled && (b.jPlayer.focus = this)
		},
		play: function(a) {
			a = "number" === typeof a ? a : NaN;
			this.status.srcSet ? (this.focus(), this.html.active ? this._html_play(a) :
				this.flash.active && this._flash_play(a)) : this._urlNotSetError("play")
		},
		videoPlay: function() {
			this.play()
		},
		pause: function(a) {
			a = "number" === typeof a ? a : NaN;
			this.status.srcSet ? this.html.active ? this._html_pause(a) : this.flash.active && this._flash_pause(a) : this._urlNotSetError("pause")
		},
		pauseOthers: function() {
			var a = this;
			b.each(this.instances, function(b, d) {
				a.element !== d && d.data("jPlayer").status.srcSet && d.jPlayer("pause")
			})
		},
		stop: function() {
			this.status.srcSet ? this.html.active ? this._html_pause(0) : this.flash.active &&
				this._flash_pause(0) : this._urlNotSetError("stop")
		},
		playHead: function(a) {
			a = this._limitValue(a, 0, 100);
			this.status.srcSet ? this.html.active ? this._html_playHead(a) : this.flash.active && this._flash_playHead(a) : this._urlNotSetError("playHead")
		},
		_muted: function(a) {
			this.options.muted = a;
			this.html.used && this._html_mute(a);
			this.flash.used && this._flash_mute(a);
			!this.html.video.gate && !this.html.audio.gate && (this._updateMute(a), this._updateVolume(this.options.volume), this._trigger(b.jPlayer.event.volumechange))
		},
		mute: function(a) {
			a = a === f ? !0 : !! a;
			this._muted(a)
		},
		unmute: function(a) {
			a = a === f ? !0 : !! a;
			this._muted(!a)
		},
		_updateMute: function(a) {
			a === f && (a = this.options.muted);
			this.css.jq.mute.length && this.css.jq.unmute.length && (this.status.noVolume ? (this.css.jq.mute.hide(), this.css.jq.unmute.hide()) : a ? (this.css.jq.mute.hide(), this.css.jq.unmute.show()) : (this.css.jq.mute.show(), this.css.jq.unmute.hide()))
		},
		volume: function(a) {
			a = this._limitValue(a, 0, 1);
			this.options.volume = a;
			this.html.used && this._html_volume(a);
			this.flash.used &&
				this._flash_volume(a);
			!this.html.video.gate && !this.html.audio.gate && (this._updateVolume(a), this._trigger(b.jPlayer.event.volumechange))
		},
		volumeBar: function(a) {
			if (this.css.jq.volumeBar.length) {
				var c = b(a.currentTarget),
					d = c.offset(),
					e = a.pageX - d.left,
					g = c.width();
				a = c.height() - a.pageY + d.top;
				c = c.height();
				this.options.verticalVolume ? this.volume(a / c) : this.volume(e / g)
			}
			this.options.muted && this._muted(!1)
		},
		volumeBarValue: function() {},
		_updateVolume: function(a) {
			a === f && (a = this.options.volume);
			a = this.options.muted ?
				0 : a;
			this.status.noVolume ? (this.css.jq.volumeBar.length && this.css.jq.volumeBar.hide(), this.css.jq.volumeBarValue.length && this.css.jq.volumeBarValue.hide(), this.css.jq.volumeMax.length && this.css.jq.volumeMax.hide()) : (this.css.jq.volumeBar.length && this.css.jq.volumeBar.show(), this.css.jq.volumeBarValue.length && (this.css.jq.volumeBarValue.show(), this.css.jq.volumeBarValue[this.options.verticalVolume ? "height" : "width"](100 * a + "%")), this.css.jq.volumeMax.length && this.css.jq.volumeMax.show())
		},
		volumeMax: function() {
			this.volume(1);
			this.options.muted && this._muted(!1)
		},
		_cssSelectorAncestor: function(a) {
			var c = this;
			this.options.cssSelectorAncestor = a;
			this._removeUiClass();
			this.ancestorJq = a ? b(a) : [];
			a && 1 !== this.ancestorJq.length && this._warning({
				type: b.jPlayer.warning.CSS_SELECTOR_COUNT,
				context: a,
				message: b.jPlayer.warningMsg.CSS_SELECTOR_COUNT + this.ancestorJq.length + " found for cssSelectorAncestor.",
				hint: b.jPlayer.warningHint.CSS_SELECTOR_COUNT
			});
			this._addUiClass();
			b.each(this.options.cssSelector, function(a, b) {
				c._cssSelector(a, b)
			});
			this._updateInterface();
			this._updateButtons();
			this._updateAutohide();
			this._updateVolume();
			this._updateMute()
		},
		_cssSelector: function(a, c) {
			var d = this;
			"string" === typeof c ? b.jPlayer.prototype.options.cssSelector[a] ? (this.css.jq[a] && this.css.jq[a].length && this.css.jq[a].unbind(".jPlayer"), this.options.cssSelector[a] = c, this.css.cs[a] = this.options.cssSelectorAncestor + " " + c, this.css.jq[a] = c ? b(this.css.cs[a]) : [], this.css.jq[a].length && this.css.jq[a].bind("click.jPlayer", function(c) {
				c.preventDefault();
				d[a](c);
				b(this).blur()
			}), c && 1 !== this.css.jq[a].length && this._warning({
				type: b.jPlayer.warning.CSS_SELECTOR_COUNT,
				context: this.css.cs[a],
				message: b.jPlayer.warningMsg.CSS_SELECTOR_COUNT + this.css.jq[a].length + " found for " + a + " method.",
				hint: b.jPlayer.warningHint.CSS_SELECTOR_COUNT
			})) : this._warning({
				type: b.jPlayer.warning.CSS_SELECTOR_METHOD,
				context: a,
				message: b.jPlayer.warningMsg.CSS_SELECTOR_METHOD,
				hint: b.jPlayer.warningHint.CSS_SELECTOR_METHOD
			}) : this._warning({
				type: b.jPlayer.warning.CSS_SELECTOR_STRING,
				context: c,
				message: b.jPlayer.warningMsg.CSS_SELECTOR_STRING,
				hint: b.jPlayer.warningHint.CSS_SELECTOR_STRING
			})
		},
		seekBar: function(a) {
			if (this.css.jq.seekBar.length) {
				var c = b(a.currentTarget),
					d = c.offset();
				a = a.pageX - d.left;
				c = c.width();
				this.playHead(100 * a / c)
			}
		},
		playBar: function() {},
		repeat: function() {
			this._loop(!0)
		},
		repeatOff: function() {
			this._loop(!1)
		},
		_loop: function(a) {
			this.options.loop !== a && (this.options.loop = a, this._updateButtons(), this._trigger(b.jPlayer.event.repeat))
		},
		currentTime: function() {},
		duration: function() {},
		gui: function() {},
		noSolution: function() {},
		option: function(a, c) {
			var d = a;
			if (0 === arguments.length) return b.extend(!0, {}, this.options);
			if ("string" === typeof a) {
				var e = a.split(".");
				if (c === f) {
					for (var d = b.extend(!0, {}, this.options), g = 0; g < e.length; g++)
						if (d[e[g]] !== f) d = d[e[g]];
						else return this._warning({
							type: b.jPlayer.warning.OPTION_KEY,
							context: a,
							message: b.jPlayer.warningMsg.OPTION_KEY,
							hint: b.jPlayer.warningHint.OPTION_KEY
						}), f;
					return d
				}
				for (var g = d = {}, h = 0; h < e.length; h++) h < e.length - 1 ? (g[e[h]] = {}, g = g[e[h]]) : g[e[h]] =
					c
			}
			this._setOptions(d);
			return this
		},
		_setOptions: function(a) {
			var c = this;
			b.each(a, function(a, b) {
				c._setOption(a, b)
			});
			return this
		},
		_setOption: function(a, c) {
			var d = this;
			switch (a) {
				case "volume":
					this.volume(c);
					break;
				case "muted":
					this._muted(c);
					break;
				case "cssSelectorAncestor":
					this._cssSelectorAncestor(c);
					break;
				case "cssSelector":
					b.each(c, function(a, b) {
						d._cssSelector(a, b)
					});
					break;
				case "fullScreen":
					if (this.options[a] !== c) {
						var e = b.jPlayer.nativeFeatures.fullscreen.used.webkitVideo;
						if (!e || e && !this.status.waitForPlay) e ||
							(this.options[a] = c), c ? this._requestFullscreen() : this._exitFullscreen(), e || this._setOption("fullWindow", c)
					}
					break;
				case "fullWindow":
					this.options[a] !== c && (this._removeUiClass(), this.options[a] = c, this._refreshSize());
					break;
				case "size":
					!this.options.fullWindow && this.options[a].cssClass !== c.cssClass && this._removeUiClass();
					this.options[a] = b.extend({}, this.options[a], c);
					this._refreshSize();
					break;
				case "sizeFull":
					this.options.fullWindow && this.options[a].cssClass !== c.cssClass && this._removeUiClass();
					this.options[a] =
						b.extend({}, this.options[a], c);
					this._refreshSize();
					break;
				case "autohide":
					this.options[a] = b.extend({}, this.options[a], c);
					this._updateAutohide();
					break;
				case "loop":
					this._loop(c);
					break;
				case "nativeVideoControls":
					this.options[a] = b.extend({}, this.options[a], c);
					this.status.nativeVideoControls = this._uaBlocklist(this.options.nativeVideoControls);
					this._restrictNativeVideoControls();
					this._updateNativeVideoControls();
					break;
				case "noFullWindow":
					this.options[a] = b.extend({}, this.options[a], c);
					this.status.nativeVideoControls =
						this._uaBlocklist(this.options.nativeVideoControls);
					this.status.noFullWindow = this._uaBlocklist(this.options.noFullWindow);
					this._restrictNativeVideoControls();
					this._updateButtons();
					break;
				case "noVolume":
					this.options[a] = b.extend({}, this.options[a], c);
					this.status.noVolume = this._uaBlocklist(this.options.noVolume);
					this._updateVolume();
					this._updateMute();
					break;
				case "emulateHtml":
					this.options[a] !== c && ((this.options[a] = c) ? this._emulateHtmlBridge() : this._destroyHtmlBridge());
					break;
				case "timeFormat":
					this.options[a] =
						b.extend({}, this.options[a], c);
					break;
				case "keyEnabled":
					this.options[a] = c;
					!c && this === b.jPlayer.focus && (b.jPlayer.focus = null);
					break;
				case "keyBindings":
					this.options[a] = b.extend(!0, {}, this.options[a], c);
					break;
				case "audioFullScreen":
					this.options[a] = c
			}
			return this
		},
		_refreshSize: function() {
			this._setSize();
			this._addUiClass();
			this._updateSize();
			this._updateButtons();
			this._updateAutohide();
			this._trigger(b.jPlayer.event.resize)
		},
		_setSize: function() {
			this.options.fullWindow ? (this.status.width = this.options.sizeFull.width,
				this.status.height = this.options.sizeFull.height, this.status.cssClass = this.options.sizeFull.cssClass) : (this.status.width = this.options.size.width, this.status.height = this.options.size.height, this.status.cssClass = this.options.size.cssClass);
			this.element.css({
				width: this.status.width,
				height: this.status.height
			})
		},
		_addUiClass: function() {
			this.ancestorJq.length && this.ancestorJq.addClass(this.status.cssClass)
		},
		_removeUiClass: function() {
			this.ancestorJq.length && this.ancestorJq.removeClass(this.status.cssClass)
		},
		_updateSize: function() {
			this.internal.poster.jq.css({
				width: this.status.width,
				height: this.status.height
			});
			!this.status.waitForPlay && this.html.active && this.status.video || this.html.video.available && this.html.used && this.status.nativeVideoControls ? this.internal.video.jq.css({
				width: this.status.width,
				height: this.status.height
			}) : !this.status.waitForPlay && (this.flash.active && this.status.video) && this.internal.flash.jq.css({
				width: this.status.width,
				height: this.status.height
			})
		},
		_updateAutohide: function() {
			var a =
				this,
				b = function() {
					a.css.jq.gui.fadeIn(a.options.autohide.fadeIn, function() {
						clearTimeout(a.internal.autohideId);
						a.internal.autohideId = setTimeout(function() {
							a.css.jq.gui.fadeOut(a.options.autohide.fadeOut)
						}, a.options.autohide.hold)
					})
				};
			this.css.jq.gui.length && (this.css.jq.gui.stop(!0, !0), clearTimeout(this.internal.autohideId), this.element.unbind(".jPlayerAutohide"), this.css.jq.gui.unbind(".jPlayerAutohide"), this.status.nativeVideoControls ? this.css.jq.gui.hide() : this.options.fullWindow && this.options.autohide.full || !this.options.fullWindow && this.options.autohide.restored ? (this.element.bind("mousemove.jPlayer.jPlayerAutohide", b), this.css.jq.gui.bind("mousemove.jPlayer.jPlayerAutohide", b), this.css.jq.gui.hide()) : this.css.jq.gui.show())
		},
		fullScreen: function() {
			this._setOption("fullScreen", !0)
		},
		restoreScreen: function() {
			this._setOption("fullScreen", !1)
		},
		_fullscreenAddEventListeners: function() {
			var a = this,
				c = b.jPlayer.nativeFeatures.fullscreen;
			c.api.fullscreenEnabled && c.event.fullscreenchange && ("function" !== typeof this.internal.fullscreenchangeHandler &&
				(this.internal.fullscreenchangeHandler = function() {
					a._fullscreenchange()
				}), document.addEventListener(c.event.fullscreenchange, this.internal.fullscreenchangeHandler, !1))
		},
		_fullscreenRemoveEventListeners: function() {
			var a = b.jPlayer.nativeFeatures.fullscreen;
			this.internal.fullscreenchangeHandler && document.addEventListener(a.event.fullscreenchange, this.internal.fullscreenchangeHandler, !1)
		},
		_fullscreenchange: function() {
			this.options.fullScreen && !b.jPlayer.nativeFeatures.fullscreen.api.fullscreenElement() &&
				this._setOption("fullScreen", !1)
		},
		_requestFullscreen: function() {
			var a = this.ancestorJq.length ? this.ancestorJq[0] : this.element[0],
				c = b.jPlayer.nativeFeatures.fullscreen;
			c.used.webkitVideo && (a = this.htmlElement.video);
			c.api.fullscreenEnabled && c.api.requestFullscreen(a)
		},
		_exitFullscreen: function() {
			var a = b.jPlayer.nativeFeatures.fullscreen,
				c;
			a.used.webkitVideo && (c = this.htmlElement.video);
			a.api.fullscreenEnabled && a.api.exitFullscreen(c)
		},
		_html_initMedia: function(a) {
			var c = b(this.htmlElement.media).empty();
			b.each(a.track || [], function(a, b) {
				var g = document.createElement("track");
				g.setAttribute("kind", b.kind ? b.kind : "");
				g.setAttribute("src", b.src ? b.src : "");
				g.setAttribute("srclang", b.srclang ? b.srclang : "");
				g.setAttribute("label", b.label ? b.label : "");
				b.def && g.setAttribute("default", b.def);
				c.append(g)
			});
			this.htmlElement.media.src = this.status.src;
			"none" !== this.options.preload && this._html_load();
			this._trigger(b.jPlayer.event.timeupdate)
		},
		_html_setFormat: function(a) {
			var c = this;
			b.each(this.formats, function(b, e) {
				if (c.html.support[e] &&
					a[e]) return c.status.src = a[e], c.status.format[e] = !0, c.status.formatType = e, !1
			})
		},
		_html_setAudio: function(a) {
			this._html_setFormat(a);
			this.htmlElement.media = this.htmlElement.audio;
			this._html_initMedia(a)
		},
		_html_setVideo: function(a) {
			this._html_setFormat(a);
			this.status.nativeVideoControls && (this.htmlElement.video.poster = this._validString(a.poster) ? a.poster : "");
			this.htmlElement.media = this.htmlElement.video;
			this._html_initMedia(a)
		},
		_html_resetMedia: function() {
			this.htmlElement.media && (this.htmlElement.media.id ===
				this.internal.video.id && !this.status.nativeVideoControls && this.internal.video.jq.css({
					width: "0px",
					height: "0px"
				}), this.htmlElement.media.pause())
		},
		_html_clearMedia: function() {
			this.htmlElement.media && (this.htmlElement.media.src = "about:blank", this.htmlElement.media.load())
		},
		_html_load: function() {
			this.status.waitForLoad && (this.status.waitForLoad = !1, this.htmlElement.media.load());
			clearTimeout(this.internal.htmlDlyCmdId)
		},
		_html_play: function(a) {
			var b = this,
				d = this.htmlElement.media;
			this._html_load();
			if (isNaN(a)) d.play();
			else {
				this.internal.cmdsIgnored && d.play();
				try {
					if (!d.seekable || "object" === typeof d.seekable && 0 < d.seekable.length) d.currentTime = a, d.play();
					else throw 1;
				} catch (e) {
					this.internal.htmlDlyCmdId = setTimeout(function() {
						b.play(a)
					}, 250);
					return
				}
			}
			this._html_checkWaitForPlay()
		},
		_html_pause: function(a) {
			var b = this,
				d = this.htmlElement.media;
			0 < a ? this._html_load() : clearTimeout(this.internal.htmlDlyCmdId);
			d.pause();
			if (!isNaN(a)) try {
				if (!d.seekable || "object" === typeof d.seekable && 0 < d.seekable.length) d.currentTime = a;
				else throw 1;
			} catch (e) {
				this.internal.htmlDlyCmdId = setTimeout(function() {
					b.pause(a)
				}, 250);
				return
			}
			0 < a && this._html_checkWaitForPlay()
		},
		_html_playHead: function(a) {
			var b = this,
				d = this.htmlElement.media;
			this._html_load();
			try {
				if ("object" === typeof d.seekable && 0 < d.seekable.length) d.currentTime = a * d.seekable.end(d.seekable.length - 1) / 100;
				else if (0 < d.duration && !isNaN(d.duration)) d.currentTime = a * d.duration / 100;
				else throw "e";
			} catch (e) {
				this.internal.htmlDlyCmdId = setTimeout(function() {
					b.playHead(a)
				}, 250);
				return
			}
			this.status.waitForLoad ||
				this._html_checkWaitForPlay()
		},
		_html_checkWaitForPlay: function() {
			this.status.waitForPlay && (this.status.waitForPlay = !1, this.css.jq.videoPlay.length && this.css.jq.videoPlay.hide(), this.status.video && (this.internal.poster.jq.hide(), this.internal.video.jq.css({
				width: this.status.width,
				height: this.status.height
			})))
		},
		_html_volume: function(a) {
			this.html.audio.available && (this.htmlElement.audio.volume = a);
			this.html.video.available && (this.htmlElement.video.volume = a)
		},
		_html_mute: function(a) {
			this.html.audio.available &&
				(this.htmlElement.audio.muted = a);
			this.html.video.available && (this.htmlElement.video.muted = a)
		},
		_flash_setAudio: function(a) {
			var c = this;
			try {
				b.each(this.formats, function(b, d) {
					if (c.flash.support[d] && a[d]) {
						switch (d) {
							case "m4a":
							case "fla":
								c._getMovie().fl_setAudio_m4a(a[d]);
								break;
							case "mp3":
								c._getMovie().fl_setAudio_mp3(a[d]);
								break;
							case "rtmpa":
								c._getMovie().fl_setAudio_rtmp(a[d])
						}
						c.status.src = a[d];
						c.status.format[d] = !0;
						c.status.formatType = d;
						return !1
					}
				}), "auto" === this.options.preload && (this._flash_load(),
					this.status.waitForLoad = !1)
			} catch (d) {
				this._flashError(d)
			}
		},
		_flash_setVideo: function(a) {
			var c = this;
			try {
				b.each(this.formats, function(b, d) {
					if (c.flash.support[d] && a[d]) {
						switch (d) {
							case "m4v":
							case "flv":
								c._getMovie().fl_setVideo_m4v(a[d]);
								break;
							case "rtmpv":
								c._getMovie().fl_setVideo_rtmp(a[d])
						}
						c.status.src = a[d];
						c.status.format[d] = !0;
						c.status.formatType = d;
						return !1
					}
				}), "auto" === this.options.preload && (this._flash_load(), this.status.waitForLoad = !1)
			} catch (d) {
				this._flashError(d)
			}
		},
		_flash_resetMedia: function() {
			this.internal.flash.jq.css({
				width: "0px",
				height: "0px"
			});
			this._flash_pause(NaN)
		},
		_flash_clearMedia: function() {
			try {
				this._getMovie().fl_clearMedia()
			} catch (a) {
				this._flashError(a)
			}
		},
		_flash_load: function() {
			try {
				this._getMovie().fl_load()
			} catch (a) {
				this._flashError(a)
			}
			this.status.waitForLoad = !1
		},
		_flash_play: function(a) {
			try {
				this._getMovie().fl_play(a)
			} catch (b) {
				this._flashError(b)
			}
			this.status.waitForLoad = !1;
			this._flash_checkWaitForPlay()
		},
		_flash_pause: function(a) {
			try {
				this._getMovie().fl_pause(a)
			} catch (b) {
				this._flashError(b)
			}
			0 < a && (this.status.waitForLoad = !1, this._flash_checkWaitForPlay())
		},
		_flash_playHead: function(a) {
			try {
				this._getMovie().fl_play_head(a)
			} catch (b) {
				this._flashError(b)
			}
			this.status.waitForLoad || this._flash_checkWaitForPlay()
		},
		_flash_checkWaitForPlay: function() {
			this.status.waitForPlay && (this.status.waitForPlay = !1, this.css.jq.videoPlay.length && this.css.jq.videoPlay.hide(), this.status.video && (this.internal.poster.jq.hide(), this.internal.flash.jq.css({
				width: this.status.width,
				height: this.status.height
			})))
		},
		_flash_volume: function(a) {
			try {
				this._getMovie().fl_volume(a)
			} catch (b) {
				this._flashError(b)
			}
		},
		_flash_mute: function(a) {
			try {
				this._getMovie().fl_mute(a)
			} catch (b) {
				this._flashError(b)
			}
		},
		_getMovie: function() {
			return document[this.internal.flash.id]
		},
		_getFlashPluginVersion: function() {
			var a = 0,
				b;
			if (window.ActiveXObject) try {
				if (b = new ActiveXObject("ShockwaveFlash.ShockwaveFlash")) {
					var d = b.GetVariable("$version");
					d && (d = d.split(" ")[1].split(","), a = parseInt(d[0], 10) + "." + parseInt(d[1], 10))
				}
			} catch (e) {} else navigator.plugins && 0 < navigator.mimeTypes.length && (b = navigator.plugins["Shockwave Flash"]) && (a = navigator.plugins["Shockwave Flash"].description.replace(/.*\s(\d+\.\d+).*/,
				"$1"));
			return 1 * a
		},
		_checkForFlash: function(a) {
			var b = !1;
			this._getFlashPluginVersion() >= a && (b = !0);
			return b
		},
		_validString: function(a) {
			return a && "string" === typeof a
		},
		_limitValue: function(a, b, d) {
			return a < b ? b : a > d ? d : a
		},
		_urlNotSetError: function(a) {
			this._error({
				type: b.jPlayer.error.URL_NOT_SET,
				context: a,
				message: b.jPlayer.errorMsg.URL_NOT_SET,
				hint: b.jPlayer.errorHint.URL_NOT_SET
			})
		},
		_flashError: function(a) {
			var c;
			c = this.internal.ready ? "FLASH_DISABLED" : "FLASH";
			this._error({
				type: b.jPlayer.error[c],
				context: this.internal.flash.swf,
				message: b.jPlayer.errorMsg[c] + a.message,
				hint: b.jPlayer.errorHint[c]
			});
			this.internal.flash.jq.css({
				width: "1px",
				height: "1px"
			})
		},
		_error: function(a) {
			this._trigger(b.jPlayer.event.error, a);
			this.options.errorAlerts && this._alert("Error!" + (a.message ? "\n\n" + a.message : "") + (a.hint ? "\n\n" + a.hint : "") + "\n\nContext: " + a.context)
		},
		_warning: function(a) {
			this._trigger(b.jPlayer.event.warning, f, a);
			this.options.warningAlerts && this._alert("Warning!" + (a.message ? "\n\n" + a.message : "") + (a.hint ? "\n\n" + a.hint : "") + "\n\nContext: " +
				a.context)
		},
		_alert: function(a) {
			alert("jPlayer " + this.version.script + " : id='" + this.internal.self.id + "' : " + a)
		},
		_emulateHtmlBridge: function() {
			var a = this;
			b.each(b.jPlayer.emulateMethods.split(/\s+/g), function(b, d) {
				a.internal.domNode[d] = function(b) {
					a[d](b)
				}
			});
			b.each(b.jPlayer.event, function(c, d) {
				var e = !0;
				b.each(b.jPlayer.reservedEvent.split(/\s+/g), function(a, b) {
					if (b === c) return e = !1
				});
				e && a.element.bind(d + ".jPlayer.jPlayerHtml", function() {
					a._emulateHtmlUpdate();
					var b = document.createEvent("Event");
					b.initEvent(c, !1, !0);
					a.internal.domNode.dispatchEvent(b)
				})
			})
		},
		_emulateHtmlUpdate: function() {
			var a = this;
			b.each(b.jPlayer.emulateStatus.split(/\s+/g), function(b, d) {
				a.internal.domNode[d] = a.status[d]
			});
			b.each(b.jPlayer.emulateOptions.split(/\s+/g), function(b, d) {
				a.internal.domNode[d] = a.options[d]
			})
		},
		_destroyHtmlBridge: function() {
			var a = this;
			this.element.unbind(".jPlayerHtml");
			b.each((b.jPlayer.emulateMethods + " " + b.jPlayer.emulateStatus + " " + b.jPlayer.emulateOptions).split(/\s+/g), function(b, d) {
				delete a.internal.domNode[d]
			})
		}
	};
	b.jPlayer.error = {
		FLASH: "e_flash",
		FLASH_DISABLED: "e_flash_disabled",
		NO_SOLUTION: "e_no_solution",
		NO_SUPPORT: "e_no_support",
		URL: "e_url",
		URL_NOT_SET: "e_url_not_set",
		VERSION: "e_version"
	};
	b.jPlayer.errorMsg = {
		FLASH: "jPlayer's Flash fallback is not configured correctly, or a command was issued before the jPlayer Ready event. Details: ",
		FLASH_DISABLED: "jPlayer's Flash fallback has been disabled by the browser due to the CSS rules you have used. Details: ",
		NO_SOLUTION: "No solution can be found by jPlayer in this browser. Neither HTML nor Flash can be used.",
		NO_SUPPORT: "It is not possible to play any media format provided in setMedia() on this browser using your current options.",
		URL: "Media URL could not be loaded.",
		URL_NOT_SET: "Attempt to issue media playback commands, while no media url is set.",
		VERSION: "jPlayer " + b.jPlayer.prototype.version.script + " needs Jplayer.swf version " + b.jPlayer.prototype.version.needFlash + " but found "
	};
	b.jPlayer.errorHint = {
		FLASH: "Check your swfPath option and that Jplayer.swf is there.",
		FLASH_DISABLED: "Check that you have not display:none; the jPlayer entity or any ancestor.",
		NO_SOLUTION: "Review the jPlayer options: support and supplied.",
		NO_SUPPORT: "Video or audio formats defined in the supplied option are missing.",
		URL: "Check media URL is valid.",
		URL_NOT_SET: "Use setMedia() to set the media URL.",
		VERSION: "Update jPlayer files."
	};
	b.jPlayer.warning = {
		CSS_SELECTOR_COUNT: "e_css_selector_count",
		CSS_SELECTOR_METHOD: "e_css_selector_method",
		CSS_SELECTOR_STRING: "e_css_selector_string",
		OPTION_KEY: "e_option_key"
	};
	b.jPlayer.warningMsg = {
		CSS_SELECTOR_COUNT: "The number of css selectors found did not equal one: ",
		CSS_SELECTOR_METHOD: "The methodName given in jPlayer('cssSelector') is not a valid jPlayer method.",
		CSS_SELECTOR_STRING: "The methodCssSelector given in jPlayer('cssSelector') is not a String or is empty.",
		OPTION_KEY: "The option requested in jPlayer('option') is undefined."
	};
	b.jPlayer.warningHint = {
		CSS_SELECTOR_COUNT: "Check your css selector and the ancestor.",
		CSS_SELECTOR_METHOD: "Check your method name.",
		CSS_SELECTOR_STRING: "Check your css selector is a string.",
		OPTION_KEY: "Check your option name."
	}
});
(function(a,b,c){"use strict";var d=a.document,e=a.Modernizr,f=function(a){return a.charAt(0).toUpperCase()+a.slice(1)},g="Moz Webkit O Ms".split(" "),h=function(a){var b=d.documentElement.style,c;if(typeof b[a]=="string")return a;a=f(a);for(var e=0,h=g.length;e<h;e++){c=g[e]+a;if(typeof b[c]=="string")return c}},i=h("transform"),j=h("transitionProperty"),k={csstransforms:function(){return!!i},csstransforms3d:function(){var a=!!h("perspective");if(a){var c=" -o- -moz- -ms- -webkit- -khtml- ".split(" "),d="@media ("+c.join("transform-3d),(")+"modernizr)",e=b("<style>"+d+"{#modernizr{height:3px}}"+"</style>").appendTo("head"),f=b('<div id="modernizr" />').appendTo("html");a=f.height()===3,f.remove(),e.remove()}return a},csstransitions:function(){return!!j}},l;if(e)for(l in k)e.hasOwnProperty(l)||e.addTest(l,k[l]);else{e=a.Modernizr={_version:"1.6ish: miniModernizr for Isotope"};var m=" ",n;for(l in k)n=k[l](),e[l]=n,m+=" "+(n?"":"no-")+l;b("html").addClass(m)}if(e.csstransforms){var o=e.csstransforms3d?{translate:function(a){return"translate3d("+a[0]+"px, "+a[1]+"px, 0) "},scale:function(a){return"scale3d("+a+", "+a+", 1) "}}:{translate:function(a){return"translate("+a[0]+"px, "+a[1]+"px) "},scale:function(a){return"scale("+a+") "}},p=function(a,c,d){var e=b.data(a,"isoTransform")||{},f={},g,h={},j;f[c]=d,b.extend(e,f);for(g in e)j=e[g],h[g]=o[g](j);var k=h.translate||"",l=h.scale||"",m=k+l;b.data(a,"isoTransform",e),a.style[i]=m};b.cssNumber.scale=!0,b.cssHooks.scale={set:function(a,b){p(a,"scale",b)},get:function(a,c){var d=b.data(a,"isoTransform");return d&&d.scale?d.scale:1}},b.fx.step.scale=function(a){b.cssHooks.scale.set(a.elem,a.now+a.unit)},b.cssNumber.translate=!0,b.cssHooks.translate={set:function(a,b){p(a,"translate",b)},get:function(a,c){var d=b.data(a,"isoTransform");return d&&d.translate?d.translate:[0,0]}}}var q,r;e.csstransitions&&(q={WebkitTransitionProperty:"webkitTransitionEnd",MozTransitionProperty:"transitionend",OTransitionProperty:"oTransitionEnd otransitionend",transitionProperty:"transitionend"}[j],r=h("transitionDuration"));var s=b.event,t=b.event.handle?"handle":"dispatch",u;s.special.smartresize={setup:function(){b(this).bind("resize",s.special.smartresize.handler)},teardown:function(){b(this).unbind("resize",s.special.smartresize.handler)},handler:function(a,b){var c=this,d=arguments;a.type="smartresize",u&&clearTimeout(u),u=setTimeout(function(){s[t].apply(c,d)},b==="execAsap"?0:100)}},b.fn.smartresize=function(a){return a?this.bind("smartresize",a):this.trigger("smartresize",["execAsap"])},b.Isotope=function(a,c,d){this.element=b(c),this._create(a),this._init(d)};var v=["width","height"],w=b(a);b.Isotope.settings={resizable:!0,layoutMode:"masonry",containerClass:"isotope",itemClass:"isotope-item",hiddenClass:"isotope-hidden",hiddenStyle:{opacity:0,scale:.001},visibleStyle:{opacity:1,scale:1},containerStyle:{position:"relative",overflow:"hidden"},animationEngine:"best-available",animationOptions:{queue:!1,duration:800},sortBy:"original-order",sortAscending:!0,resizesContainer:!0,transformsEnabled:!0,itemPositionDataEnabled:!1},b.Isotope.prototype={_create:function(a){this.options=b.extend({},b.Isotope.settings,a),this.styleQueue=[],this.elemCount=0;var c=this.element[0].style;this.originalStyle={};var d=v.slice(0);for(var e in this.options.containerStyle)d.push(e);for(var f=0,g=d.length;f<g;f++)e=d[f],this.originalStyle[e]=c[e]||"";this.element.css(this.options.containerStyle),this._updateAnimationEngine(),this._updateUsingTransforms();var h={"original-order":function(a,b){return b.elemCount++,b.elemCount},random:function(){return Math.random()}};this.options.getSortData=b.extend(this.options.getSortData,h),this.reloadItems(),this.offset={left:parseInt(this.element.css("padding-left")||0,10),top:parseInt(this.element.css("padding-top")||0,10)};var i=this;setTimeout(function(){i.element.addClass(i.options.containerClass)},0),this.options.resizable&&w.bind("smartresize.isotope",function(){i.resize()}),this.element.delegate("."+this.options.hiddenClass,"click",function(){return!1})},_getAtoms:function(a){var b=this.options.itemSelector,c=b?a.filter(b).add(a.find(b)):a,d={position:"absolute"};return c=c.filter(function(a,b){return b.nodeType===1}),this.usingTransforms&&(d.left=0,d.top=0),c.css(d).addClass(this.options.itemClass),this.updateSortData(c,!0),c},_init:function(a){this.$filteredAtoms=this._filter(this.$allAtoms),this._sort(),this.reLayout(a)},option:function(a){if(b.isPlainObject(a)){this.options=b.extend(!0,this.options,a);var c;for(var d in a)c="_update"+f(d),this[c]&&this[c]()}},_updateAnimationEngine:function(){var a=this.options.animationEngine.toLowerCase().replace(/[ _\-]/g,""),b;switch(a){case"css":case"none":b=!1;break;case"jquery":b=!0;break;default:b=!e.csstransitions}this.isUsingJQueryAnimation=b,this._updateUsingTransforms()},_updateTransformsEnabled:function(){this._updateUsingTransforms()},_updateUsingTransforms:function(){var a=this.usingTransforms=this.options.transformsEnabled&&e.csstransforms&&e.csstransitions&&!this.isUsingJQueryAnimation;a||(delete this.options.hiddenStyle.scale,delete this.options.visibleStyle.scale),this.getPositionStyles=a?this._translate:this._positionAbs},_filter:function(a){var b=this.options.filter===""?"*":this.options.filter;if(!b)return a;var c=this.options.hiddenClass,d="."+c,e=a.filter(d),f=e;if(b!=="*"){f=e.filter(b);var g=a.not(d).not(b).addClass(c);this.styleQueue.push({$el:g,style:this.options.hiddenStyle})}return this.styleQueue.push({$el:f,style:this.options.visibleStyle}),f.removeClass(c),a.filter(b)},updateSortData:function(a,c){var d=this,e=this.options.getSortData,f,g;a.each(function(){f=b(this),g={};for(var a in e)!c&&a==="original-order"?g[a]=b.data(this,"isotope-sort-data")[a]:g[a]=e[a](f,d);b.data(this,"isotope-sort-data",g)})},_sort:function(){var a=this.options.sortBy,b=this._getSorter,c=this.options.sortAscending?1:-1,d=function(d,e){var f=b(d,a),g=b(e,a);return f===g&&a!=="original-order"&&(f=b(d,"original-order"),g=b(e,"original-order")),(f>g?1:f<g?-1:0)*c};this.$filteredAtoms.sort(d)},_getSorter:function(a,c){return b.data(a,"isotope-sort-data")[c]},_translate:function(a,b){return{translate:[a,b]}},_positionAbs:function(a,b){return{left:a,top:b}},_pushPosition:function(a,b,c){b=Math.round(b+this.offset.left),c=Math.round(c+this.offset.top);var d=this.getPositionStyles(b,c);this.styleQueue.push({$el:a,style:d}),this.options.itemPositionDataEnabled&&a.data("isotope-item-position",{x:b,y:c})},layout:function(a,b){var c=this.options.layoutMode;this["_"+c+"Layout"](a);if(this.options.resizesContainer){var d=this["_"+c+"GetContainerSize"]();this.styleQueue.push({$el:this.element,style:d})}this._processStyleQueue(a,b),this.isLaidOut=!0},_processStyleQueue:function(a,c){var d=this.isLaidOut?this.isUsingJQueryAnimation?"animate":"css":"css",f=this.options.animationOptions,g=this.options.onLayout,h,i,j,k;i=function(a,b){b.$el[d](b.style,f)};if(this._isInserting&&this.isUsingJQueryAnimation)i=function(a,b){h=b.$el.hasClass("no-transition")?"css":d,b.$el[h](b.style,f)};else if(c||g||f.complete){var l=!1,m=[c,g,f.complete],n=this;j=!0,k=function(){if(l)return;var b;for(var c=0,d=m.length;c<d;c++)b=m[c],typeof b=="function"&&b.call(n.element,a,n);l=!0};if(this.isUsingJQueryAnimation&&d==="animate")f.complete=k,j=!1;else if(e.csstransitions){var o=0,p=this.styleQueue[0],s=p&&p.$el,t;while(!s||!s.length){t=this.styleQueue[o++];if(!t)return;s=t.$el}var u=parseFloat(getComputedStyle(s[0])[r]);u>0&&(i=function(a,b){b.$el[d](b.style,f).one(q,k)},j=!1)}}b.each(this.styleQueue,i),j&&k(),this.styleQueue=[]},resize:function(){this["_"+this.options.layoutMode+"ResizeChanged"]()&&this.reLayout()},reLayout:function(a){this["_"+this.options.layoutMode+"Reset"](),this.layout(this.$filteredAtoms,a)},addItems:function(a,b){var c=this._getAtoms(a);this.$allAtoms=this.$allAtoms.add(c),b&&b(c)},insert:function(a,b){this.element.append(a);var c=this;this.addItems(a,function(a){var d=c._filter(a);c._addHideAppended(d),c._sort(),c.reLayout(),c._revealAppended(d,b)})},appended:function(a,b){var c=this;this.addItems(a,function(a){c._addHideAppended(a),c.layout(a),c._revealAppended(a,b)})},_addHideAppended:function(a){this.$filteredAtoms=this.$filteredAtoms.add(a),a.addClass("no-transition"),this._isInserting=!0,this.styleQueue.push({$el:a,style:this.options.hiddenStyle})},_revealAppended:function(a,b){var c=this;setTimeout(function(){a.removeClass("no-transition"),c.styleQueue.push({$el:a,style:c.options.visibleStyle}),c._isInserting=!1,c._processStyleQueue(a,b)},10)},reloadItems:function(){this.$allAtoms=this._getAtoms(this.element.children())},remove:function(a,b){this.$allAtoms=this.$allAtoms.not(a),this.$filteredAtoms=this.$filteredAtoms.not(a);var c=this,d=function(){a.remove(),b&&b.call(c.element)};a.filter(":not(."+this.options.hiddenClass+")").length?(this.styleQueue.push({$el:a,style:this.options.hiddenStyle}),this._sort(),this.reLayout(d)):d()},shuffle:function(a){this.updateSortData(this.$allAtoms),this.options.sortBy="random",this._sort(),this.reLayout(a)},destroy:function(){var a=this.usingTransforms,b=this.options;this.$allAtoms.removeClass(b.hiddenClass+" "+b.itemClass).each(function(){var b=this.style;b.position="",b.top="",b.left="",b.opacity="",a&&(b[i]="")});var c=this.element[0].style;for(var d in this.originalStyle)c[d]=this.originalStyle[d];this.element.unbind(".isotope").undelegate("."+b.hiddenClass,"click").removeClass(b.containerClass).removeData("isotope"),w.unbind(".isotope")},_getSegments:function(a){var b=this.options.layoutMode,c=a?"rowHeight":"columnWidth",d=a?"height":"width",e=a?"rows":"cols",g=this.element[d](),h,i=this.options[b]&&this.options[b][c]||this.$filteredAtoms["outer"+f(d)](!0)||g;h=Math.floor(g/i),h=Math.max(h,1),this[b][e]=h,this[b][c]=i},_checkIfSegmentsChanged:function(a){var b=this.options.layoutMode,c=a?"rows":"cols",d=this[b][c];return this._getSegments(a),this[b][c]!==d},_masonryReset:function(){this.masonry={},this._getSegments();var a=this.masonry.cols;this.masonry.colYs=[];while(a--)this.masonry.colYs.push(0)},_masonryLayout:function(a){var c=this,d=c.masonry;a.each(function(){var a=b(this),e=Math.ceil(a.outerWidth(!0)/d.columnWidth);e=Math.min(e,d.cols);if(e===1)c._masonryPlaceBrick(a,d.colYs);else{var f=d.cols+1-e,g=[],h,i;for(i=0;i<f;i++)h=d.colYs.slice(i,i+e),g[i]=Math.max.apply(Math,h);c._masonryPlaceBrick(a,g)}})},_masonryPlaceBrick:function(a,b){var c=Math.min.apply(Math,b),d=0;for(var e=0,f=b.length;e<f;e++)if(b[e]===c){d=e;break}var g=this.masonry.columnWidth*d,h=c;this._pushPosition(a,g,h);var i=c+a.outerHeight(!0),j=this.masonry.cols+1-f;for(e=0;e<j;e++)this.masonry.colYs[d+e]=i},_masonryGetContainerSize:function(){var a=Math.max.apply(Math,this.masonry.colYs);return{height:a}},_masonryResizeChanged:function(){return this._checkIfSegmentsChanged()},_fitRowsReset:function(){this.fitRows={x:0,y:0,height:0}},_fitRowsLayout:function(a){var c=this,d=this.element.width(),e=this.fitRows;a.each(function(){var a=b(this),f=a.outerWidth(!0),g=a.outerHeight(!0);e.x!==0&&f+e.x>d&&(e.x=0,e.y=e.height),c._pushPosition(a,e.x,e.y),e.height=Math.max(e.y+g,e.height),e.x+=f})},_fitRowsGetContainerSize:function(){return{height:this.fitRows.height}},_fitRowsResizeChanged:function(){return!0},_cellsByRowReset:function(){this.cellsByRow={index:0},this._getSegments(),this._getSegments(!0)},_cellsByRowLayout:function(a){var c=this,d=this.cellsByRow;a.each(function(){var a=b(this),e=d.index%d.cols,f=Math.floor(d.index/d.cols),g=(e+.5)*d.columnWidth-a.outerWidth(!0)/2,h=(f+.5)*d.rowHeight-a.outerHeight(!0)/2;c._pushPosition(a,g,h),d.index++})},_cellsByRowGetContainerSize:function(){return{height:Math.ceil(this.$filteredAtoms.length/this.cellsByRow.cols)*this.cellsByRow.rowHeight+this.offset.top}},_cellsByRowResizeChanged:function(){return this._checkIfSegmentsChanged()},_straightDownReset:function(){this.straightDown={y:0}},_straightDownLayout:function(a){var c=this;a.each(function(a){var d=b(this);c._pushPosition(d,0,c.straightDown.y),c.straightDown.y+=d.outerHeight(!0)})},_straightDownGetContainerSize:function(){return{height:this.straightDown.y}},_straightDownResizeChanged:function(){return!0},_masonryHorizontalReset:function(){this.masonryHorizontal={},this._getSegments(!0);var a=this.masonryHorizontal.rows;this.masonryHorizontal.rowXs=[];while(a--)this.masonryHorizontal.rowXs.push(0)},_masonryHorizontalLayout:function(a){var c=this,d=c.masonryHorizontal;a.each(function(){var a=b(this),e=Math.ceil(a.outerHeight(!0)/d.rowHeight);e=Math.min(e,d.rows);if(e===1)c._masonryHorizontalPlaceBrick(a,d.rowXs);else{var f=d.rows+1-e,g=[],h,i;for(i=0;i<f;i++)h=d.rowXs.slice(i,i+e),g[i]=Math.max.apply(Math,h);c._masonryHorizontalPlaceBrick(a,g)}})},_masonryHorizontalPlaceBrick:function(a,b){var c=Math.min.apply(Math,b),d=0;for(var e=0,f=b.length;e<f;e++)if(b[e]===c){d=e;break}var g=c,h=this.masonryHorizontal.rowHeight*d;this._pushPosition(a,g,h);var i=c+a.outerWidth(!0),j=this.masonryHorizontal.rows+1-f;for(e=0;e<j;e++)this.masonryHorizontal.rowXs[d+e]=i},_masonryHorizontalGetContainerSize:function(){var a=Math.max.apply(Math,this.masonryHorizontal.rowXs);return{width:a}},_masonryHorizontalResizeChanged:function(){return this._checkIfSegmentsChanged(!0)},_fitColumnsReset:function(){this.fitColumns={x:0,y:0,width:0}},_fitColumnsLayout:function(a){var c=this,d=this.element.height(),e=this.fitColumns;a.each(function(){var a=b(this),f=a.outerWidth(!0),g=a.outerHeight(!0);e.y!==0&&g+e.y>d&&(e.x=e.width,e.y=0),c._pushPosition(a,e.x,e.y),e.width=Math.max(e.x+f,e.width),e.y+=g})},_fitColumnsGetContainerSize:function(){return{width:this.fitColumns.width}},_fitColumnsResizeChanged:function(){return!0},_cellsByColumnReset:function(){this.cellsByColumn={index:0},this._getSegments(),this._getSegments(!0)},_cellsByColumnLayout:function(a){var c=this,d=this.cellsByColumn;a.each(function(){var a=b(this),e=Math.floor(d.index/d.rows),f=d.index%d.rows,g=(e+.5)*d.columnWidth-a.outerWidth(!0)/2,h=(f+.5)*d.rowHeight-a.outerHeight(!0)/2;c._pushPosition(a,g,h),d.index++})},_cellsByColumnGetContainerSize:function(){return{width:Math.ceil(this.$filteredAtoms.length/this.cellsByColumn.rows)*this.cellsByColumn.columnWidth}},_cellsByColumnResizeChanged:function(){return this._checkIfSegmentsChanged(!0)},_straightAcrossReset:function(){this.straightAcross={x:0}},_straightAcrossLayout:function(a){var c=this;a.each(function(a){var d=b(this);c._pushPosition(d,c.straightAcross.x,0),c.straightAcross.x+=d.outerWidth(!0)})},_straightAcrossGetContainerSize:function(){return{width:this.straightAcross.x}},_straightAcrossResizeChanged:function(){return!0}},b.fn.imagesLoaded=function(a){function h(){a.call(c,d)}function i(a){var c=a.target;c.src!==f&&b.inArray(c,g)===-1&&(g.push(c),--e<=0&&(setTimeout(h),d.unbind(".imagesLoaded",i)))}var c=this,d=c.find("img").add(c.filter("img")),e=d.length,f="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",g=[];return e||h(),d.bind("load.imagesLoaded error.imagesLoaded",i).each(function(){var a=this.src;this.src=f,this.src=a}),c};var x=function(b){a.console&&a.console.error(b)};b.fn.isotope=function(a,c){if(typeof a=="string"){var d=Array.prototype.slice.call(arguments,1);this.each(function(){var c=b.data(this,"isotope");if(!c){x("cannot call methods on isotope prior to initialization; attempted to call method '"+a+"'");return}if(!b.isFunction(c[a])||a.charAt(0)==="_"){x("no such method '"+a+"' for isotope instance");return}c[a].apply(c,d)})}else this.each(function(){var d=b.data(this,"isotope");d?(d.option(a),d._init(c)):b.data(this,"isotope",new b.Isotope(a,this,c))});return this}})(window,jQuery);
/* ------------------------------------------------------------------------
	Class: prettyPhoto
	Use: Lightbox clone for jQuery
	Author: Stephane Caron (http://www.no-margin-for-errors.com)
	Version: 3.1.5
------------------------------------------------------------------------- */
(function ($) {
    $.prettyPhoto = {
        version: '3.1.5'
    };

    $.fn.prettyPhoto = function (pp_settings) {
        pp_settings = jQuery.extend({
            hook: 'rel',
            /* the attribute tag to use for prettyPhoto hooks. default: 'rel'. For HTML5, use "data-rel" or similar. */
            animation_speed: 'fast',
            /* fast/slow/normal */
            ajaxcallback: function () {},
            slideshow: 5000,
            /* false OR interval time in ms */
            autoplay_slideshow: false,
            /* true/false */
            opacity: 0.80,
            /* Value between 0 and 1 */
            show_title: true,
            /* true/false */
            allow_resize: true,
            /* Resize the photos bigger than viewport. true/false */
            allow_expand: true,
            /* Allow the user to expand a resized image. true/false */
            default_width: 500,
            default_height: 344,
            counter_separator_label: '/',
            /* The separator for the gallery counter 1 "of" 2 */
            theme: 'pp_default',
            /* light_rounded / dark_rounded / light_square / dark_square / facebook */
            horizontal_padding: 20,
            /* The padding on each side of the picture */
            hideflash: false,
            /* Hides all the flash object on a page, set to TRUE if flash appears over prettyPhoto */
            wmode: 'opaque',
            /* Set the flash wmode attribute */
            autoplay: true,
            /* Automatically start videos: True/False */
            modal: false,
            /* If set to true, only the close button will close the window */
            deeplinking: false,
            /* Allow prettyPhoto to update the url to enable deeplinking. */
            overlay_gallery: true,
            /* If set to true, a gallery will overlay the fullscreen image on mouse over */
            overlay_gallery_max: 30,
            /* Maximum number of pictures in the overlay gallery */
            keyboard_shortcuts: true,
            /* Set to false if you open forms inside prettyPhoto */
            changepicturecallback: function () {},
            /* Called everytime an item is shown/changed */
            callback: function () {},
            /* Called when prettyPhoto is closed */
            ie6_fallback: true,
            markup: '<div class="pp_pic_holder"> \
						<div class="ppt">&nbsp;</div> \
						<div class="pp_top"> \
							<div class="pp_left"></div> \
							<div class="pp_middle"></div> \
							<div class="pp_right"></div> \
						</div> \
						<div class="pp_content_container"> \
							<div class="pp_left"> \
							<div class="pp_right"> \
								<div class="pp_content"> \
									<div class="pp_loaderIcon"></div> \
									<div class="pp_fade"> \
										<a href="#" class="pp_expand" title="Expand the image">Expand</a> \
										<div class="pp_hoverContainer"> \
											<a class="pp_next" href="#">next</a> \
											<a class="pp_previous" href="#">previous</a> \
										</div> \
										<div id="pp_full_res"></div> \
										<div class="pp_details"> \
											<div class="pp_nav"> \
												<a href="#" class="pp_arrow_previous">Previous</a> \
												<p class="currentTextHolder">0/0</p> \
												<a href="#" class="pp_arrow_next">Next</a> \
											</div> \
											<p class="pp_description"></p> \
											<div class="pp_social">{pp_social}</div> \
											<a class="pp_close" href="#">Close</a> \
										</div> \
									</div> \
								</div> \
							</div> \
							</div> \
						</div> \
						<div class="pp_bottom"> \
							<div class="pp_left"></div> \
							<div class="pp_middle"></div> \
							<div class="pp_right"></div> \
						</div> \
					</div> \
					<div class="pp_overlay"></div>',
            gallery_markup: '<div class="pp_gallery"> \
								<a href="#" class="pp_arrow_previous">Previous</a> \
								<div> \
									<ul> \
										{gallery} \
									</ul> \
								</div> \
								<a href="#" class="pp_arrow_next">Next</a> \
							</div>',
            image_markup: '<img id="fullResImage" src="{path}" />',
            flash_markup: '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="{width}" height="{height}"><param name="wmode" value="{wmode}" /><param name="allowfullscreen" value="true" /><param name="allowscriptaccess" value="always" /><param name="movie" value="{path}" /><embed src="{path}" type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="{width}" height="{height}" wmode="{wmode}"></embed></object>',
            quicktime_markup: '<object classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" codebase="http://www.apple.com/qtactivex/qtplugin.cab" height="{height}" width="{width}"><param name="src" value="{path}"><param name="autoplay" value="{autoplay}"><param name="type" value="video/quicktime"><embed src="{path}" height="{height}" width="{width}" autoplay="{autoplay}" type="video/quicktime" pluginspage="http://www.apple.com/quicktime/download/"></embed></object>',
            iframe_markup: '<iframe src ="{path}" width="{width}" height="{height}" frameborder="no"></iframe>',
            inline_markup: '<div class="pp_inline">{content}</div>',
            custom_markup: '',
            //social_tools: '<div class="twitter"><a href="http://twitter.com/share" class="twitter-share-button" data-count="none">Tweet</a><script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script></div><div class="facebook"><iframe src="//www.facebook.com/plugins/like.php?locale=en_US&href={location_href}&amp;layout=button_count&amp;show_faces=true&amp;width=500&amp;action=like&amp;font&amp;colorscheme=light&amp;height=23" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:500px; height:23px;" allowTransparency="true"></iframe></div>' /* html or false to disable */
        }, pp_settings);

        // Global variables accessible only by prettyPhoto
        var matchedObjects = this,
            percentBased = false,
            pp_dimensions, pp_open,

            // prettyPhoto container specific
            pp_contentHeight, pp_contentWidth, pp_containerHeight, pp_containerWidth,

            // Window size
            windowHeight = $(window).height(),
            windowWidth = $(window).width(),

            // Global elements
            pp_slideshow;

        doresize = true, scroll_pos = _get_scroll();

        // Window/Keyboard events
        $(window).unbind('resize.prettyphoto').bind('resize.prettyphoto', function () {
            _center_overlay();
            _resize_overlay();
        });

        if (pp_settings.keyboard_shortcuts) {
            $(document).unbind('keydown.prettyphoto').bind('keydown.prettyphoto', function (e) {
                if (typeof $pp_pic_holder != 'undefined') {
                    if ($pp_pic_holder.is(':visible')) {
                        switch (e.keyCode) {
                            case 37:
                                $.prettyPhoto.changePage('previous');
                                e.preventDefault();
                                break;
                            case 39:
                                $.prettyPhoto.changePage('next');
                                e.preventDefault();
                                break;
                            case 27:
                                if (!settings.modal) $.prettyPhoto.close();
                                e.preventDefault();
                                break;
                        };
                        // return false;
                    };
                };
            });
        };

        /**
         * Initialize prettyPhoto.
         */
        $.prettyPhoto.initialize = function () {

            settings = pp_settings;

            if (settings.theme == 'pp_default') settings.horizontal_padding = 16;

            // Find out if the picture is part of a set
            theRel = $(this).attr(settings.hook);
            galleryRegExp = /\[(?:.*)\]/;
            isSet = (galleryRegExp.exec(theRel)) ? true : false;

            // Put the SRCs, TITLEs, ALTs into an array.
            pp_images = (isSet) ? jQuery.map(matchedObjects, function (n, i) {
                if ($(n).attr(settings.hook).indexOf(theRel) != -1) return $(n).attr('href');
            }) : $.makeArray($(this).attr('href'));
            pp_titles = (isSet) ? jQuery.map(matchedObjects, function (n, i) {
                if ($(n).attr(settings.hook).indexOf(theRel) != -1) return ($(n).find('img').attr('alt')) ? $(n).find('img').attr('alt') : "";
            }) : $.makeArray($(this).find('img').attr('alt'));
            pp_descriptions = (isSet) ? jQuery.map(matchedObjects, function (n, i) {
                if ($(n).attr(settings.hook).indexOf(theRel) != -1) return ($(n).attr('title')) ? $(n).attr('title') : "";
            }) : $.makeArray($(this).attr('title'));

            if (pp_images.length > settings.overlay_gallery_max) settings.overlay_gallery = false;

            set_position = jQuery.inArray($(this).attr('href'), pp_images); // Define where in the array the clicked item is positionned
            rel_index = (isSet) ? set_position : $("a[" + settings.hook + "^='" + theRel + "']").index($(this));

            _build_overlay(this); // Build the overlay {this} being the caller

            if (settings.allow_resize) $(window).bind('scroll.prettyphoto', function () {
                _center_overlay();
            });


            $.prettyPhoto.open();

            return false;
        }


        /**
         * Opens the prettyPhoto modal box.
         * @param image {String,Array} Full path to the image to be open, can also be an array containing full images paths.
         * @param title {String,Array} The title to be displayed with the picture, can also be an array containing all the titles.
         * @param description {String,Array} The description to be displayed with the picture, can also be an array containing all the descriptions.
         */
        $.prettyPhoto.open = function (event) {
            if (typeof settings == "undefined") { // Means it's an API call, need to manually get the settings and set the variables
                settings = pp_settings;
                pp_images = $.makeArray(arguments[0]);
                pp_titles = (arguments[1]) ? $.makeArray(arguments[1]) : $.makeArray("");
                pp_descriptions = (arguments[2]) ? $.makeArray(arguments[2]) : $.makeArray("");
                isSet = (pp_images.length > 1) ? true : false;
                set_position = (arguments[3]) ? arguments[3] : 0;
                _build_overlay(event.target); // Build the overlay {this} being the caller
            }

            if (settings.hideflash) $('object,embed,iframe[src*=youtube],iframe[src*=vimeo]').css('visibility', 'hidden'); // Hide the flash

            _checkPosition($(pp_images).size()); // Hide the next/previous links if on first or last images.

            $('.pp_loaderIcon').show();

            if (settings.deeplinking) setHashtag();

            // Rebuild Facebook Like Button with updated href
            if (settings.social_tools) {
                facebook_like_link = settings.social_tools.replace('{location_href}', encodeURIComponent(location.href));
                $pp_pic_holder.find('.pp_social').html(facebook_like_link);
            }

            // Fade the content in
            if ($ppt.is(':hidden')) $ppt.css('opacity', 0).show();
            $pp_overlay.show().fadeTo(settings.animation_speed, settings.opacity);

            // Display the current position
            $pp_pic_holder.find('.currentTextHolder').text((set_position + 1) + settings.counter_separator_label + $(pp_images).size());

            // Set the description
            if (typeof pp_descriptions[set_position] != 'undefined' && pp_descriptions[set_position] != "") {
                $pp_pic_holder.find('.pp_description').show().html(unescape(pp_descriptions[set_position]));
            } else {
                $pp_pic_holder.find('.pp_description').hide();
            }

            // Get the dimensions
            movie_width = (parseFloat(getParam('width', pp_images[set_position]))) ? getParam('width', pp_images[set_position]) : settings.default_width.toString();
            movie_height = (parseFloat(getParam('height', pp_images[set_position]))) ? getParam('height', pp_images[set_position]) : settings.default_height.toString();

            // If the size is % based, calculate according to window dimensions
            percentBased = false;
            if (movie_height.indexOf('%') != -1) {
                movie_height = parseFloat(($(window).height() * parseFloat(movie_height) / 100) - 150);
                percentBased = true;
            }
            if (movie_width.indexOf('%') != -1) {
                movie_width = parseFloat(($(window).width() * parseFloat(movie_width) / 100) - 150);
                percentBased = true;
            }

            // Fade the holder
            $pp_pic_holder.fadeIn(function () {
                // Set the title
                (settings.show_title && pp_titles[set_position] != "" && typeof pp_titles[set_position] != "undefined") ? $ppt.html(unescape(pp_titles[set_position])) : $ppt.html('&nbsp;');

                imgPreloader = "";
                skipInjection = false;

                // Inject the proper content
                switch (_getFileType(pp_images[set_position])) {
                    case 'image':
                        imgPreloader = new Image();

                        // Preload the neighbour images
                        nextImage = new Image();
                        if (isSet && set_position < $(pp_images).size() - 1) nextImage.src = pp_images[set_position + 1];
                        prevImage = new Image();
                        if (isSet && pp_images[set_position - 1]) prevImage.src = pp_images[set_position - 1];

                        $pp_pic_holder.find('#pp_full_res')[0].innerHTML = settings.image_markup.replace(/{path}/g, pp_images[set_position]);

                        imgPreloader.onload = function () {
                            // Fit item to viewport
                            pp_dimensions = _fitToViewport(imgPreloader.width, imgPreloader.height);

                            _showContent();
                        };

                        imgPreloader.onerror = function () {
                            alert('Image cannot be loaded. Make sure the path is correct and image exist.');
                            $.prettyPhoto.close();
                        };

                        imgPreloader.src = pp_images[set_position];
                        break;

                    case 'youtube':
                        pp_dimensions = _fitToViewport(movie_width, movie_height); // Fit item to viewport

                        // Regular youtube link
                        movie_id = getParam('v', pp_images[set_position]);

                        // youtu.be link
                        if (movie_id == "") {
                            movie_id = pp_images[set_position].split('youtu.be/');
                            movie_id = movie_id[1];
                            if (movie_id.indexOf('?') > 0) movie_id = movie_id.substr(0, movie_id.indexOf('?')); // Strip anything after the ?

                            if (movie_id.indexOf('&') > 0) movie_id = movie_id.substr(0, movie_id.indexOf('&')); // Strip anything after the &
                        }

                        movie = 'http://www.youtube.com/embed/' + movie_id;
                        (getParam('rel', pp_images[set_position])) ? movie += "?rel=" + getParam('rel', pp_images[set_position]) : movie += "?rel=1";

                        if (settings.autoplay) movie += "&autoplay=1";

                        toInject = settings.iframe_markup.replace(/{width}/g, pp_dimensions['width']).replace(/{height}/g, pp_dimensions['height']).replace(/{wmode}/g, settings.wmode).replace(/{path}/g, movie);
                        break;

                    case 'vimeo':
                        pp_dimensions = _fitToViewport(movie_width, movie_height); // Fit item to viewport

                        movie_id = pp_images[set_position];
                        var regExp = /http(s?):\/\/(www\.)?vimeo.com\/(\d+)/;
                        var match = movie_id.match(regExp);

                        movie = 'http://player.vimeo.com/video/' + match[3] + '?title=0&amp;byline=0&amp;portrait=0';
                        if (settings.autoplay) movie += "&autoplay=1;";

                        vimeo_width = pp_dimensions['width'] + '/embed/?moog_width=' + pp_dimensions['width'];

                        toInject = settings.iframe_markup.replace(/{width}/g, vimeo_width).replace(/{height}/g, pp_dimensions['height']).replace(/{path}/g, movie);
                        break;

                    case 'quicktime':
                        pp_dimensions = _fitToViewport(movie_width, movie_height); // Fit item to viewport
                        pp_dimensions['height'] += 15;
                        pp_dimensions['contentHeight'] += 15;
                        pp_dimensions['containerHeight'] += 15; // Add space for the control bar

                        toInject = settings.quicktime_markup.replace(/{width}/g, pp_dimensions['width']).replace(/{height}/g, pp_dimensions['height']).replace(/{wmode}/g, settings.wmode).replace(/{path}/g, pp_images[set_position]).replace(/{autoplay}/g, settings.autoplay);
                        break;

                    case 'flash':
                        pp_dimensions = _fitToViewport(movie_width, movie_height); // Fit item to viewport

                        flash_vars = pp_images[set_position];
                        flash_vars = flash_vars.substring(pp_images[set_position].indexOf('flashvars') + 10, pp_images[set_position].length);

                        filename = pp_images[set_position];
                        filename = filename.substring(0, filename.indexOf('?'));

                        toInject = settings.flash_markup.replace(/{width}/g, pp_dimensions['width']).replace(/{height}/g, pp_dimensions['height']).replace(/{wmode}/g, settings.wmode).replace(/{path}/g, filename + '?' + flash_vars);
                        break;

                    case 'iframe':
                        pp_dimensions = _fitToViewport(movie_width, movie_height); // Fit item to viewport

                        frame_url = pp_images[set_position];
                        frame_url = frame_url.substr(0, frame_url.indexOf('iframe') - 1);

                        toInject = settings.iframe_markup.replace(/{width}/g, pp_dimensions['width']).replace(/{height}/g, pp_dimensions['height']).replace(/{path}/g, frame_url);
                        break;

                    case 'ajax':
                        doresize = false; // Make sure the dimensions are not resized.
                        pp_dimensions = _fitToViewport(movie_width, movie_height);
                        doresize = true; // Reset the dimensions

                        skipInjection = true;
                        $.get(pp_images[set_position], function (responseHTML) {
                            toInject = settings.inline_markup.replace(/{content}/g, responseHTML);
                            $pp_pic_holder.find('#pp_full_res')[0].innerHTML = toInject;
                            _showContent();
                        });

                        break;

                    case 'custom':
                        pp_dimensions = _fitToViewport(movie_width, movie_height); // Fit item to viewport

                        toInject = settings.custom_markup;
                        break;

                    case 'inline':
                        // to get the item height clone it, apply default width, wrap it in the prettyPhoto containers , then delete
                        myClone = $(pp_images[set_position]).clone().append('<br clear="all" />').css({
                            'width': settings.default_width
                        }).wrapInner('<div id="pp_full_res"><div class="pp_inline"></div></div>').appendTo($('body')).show();
                        doresize = false; // Make sure the dimensions are not resized.
                        pp_dimensions = _fitToViewport($(myClone).width(), $(myClone).height());
                        doresize = true; // Reset the dimensions
                        $(myClone).remove();
                        toInject = settings.inline_markup.replace(/{content}/g, $(pp_images[set_position]).html());
                        break;
                };

                if (!imgPreloader && !skipInjection) {
                    $pp_pic_holder.find('#pp_full_res')[0].innerHTML = toInject;

                    // Show content
                    _showContent();
                };
            });

            return false;
        };


        /**
         * Change page in the prettyPhoto modal box
         * @param direction {String} Direction of the paging, previous or next.
         */
        $.prettyPhoto.changePage = function (direction) {
            currentGalleryPage = 0;

            if (direction == 'previous') {
                set_position--;
                if (set_position < 0) set_position = $(pp_images).size() - 1;
            } else if (direction == 'next') {
                set_position++;
                if (set_position > $(pp_images).size() - 1) set_position = 0;
            } else {
                set_position = direction;
            };

            rel_index = set_position;

            if (!doresize) doresize = true; // Allow the resizing of the images
            if (settings.allow_expand) {
                $('.pp_contract').removeClass('pp_contract').addClass('pp_expand');
            }

            _hideContent(function () {
                $.prettyPhoto.open();
            });
        };


        /**
         * Change gallery page in the prettyPhoto modal box
         * @param direction {String} Direction of the paging, previous or next.
         */
        $.prettyPhoto.changeGalleryPage = function (direction) {
            if (direction == 'next') {
                currentGalleryPage++;

                if (currentGalleryPage > totalPage) currentGalleryPage = 0;
            } else if (direction == 'previous') {
                currentGalleryPage--;

                if (currentGalleryPage < 0) currentGalleryPage = totalPage;
            } else {
                currentGalleryPage = direction;
            };

            slide_speed = (direction == 'next' || direction == 'previous') ? settings.animation_speed : 0;

            slide_to = currentGalleryPage * (itemsPerPage * itemWidth);

            $pp_gallery.find('ul').animate({
                left: -slide_to
            }, slide_speed);
        };


        /**
         * Start the slideshow...
         */
        $.prettyPhoto.startSlideshow = function () {
            if (typeof pp_slideshow == 'undefined') {
                $pp_pic_holder.find('.pp_play').unbind('click').removeClass('pp_play').addClass('pp_pause').click(function () {
                    $.prettyPhoto.stopSlideshow();
                    return false;
                });
                pp_slideshow = setInterval($.prettyPhoto.startSlideshow, settings.slideshow);
            } else {
                $.prettyPhoto.changePage('next');
            };
        }


        /**
         * Stop the slideshow...
         */
        $.prettyPhoto.stopSlideshow = function () {
            $pp_pic_holder.find('.pp_pause').unbind('click').removeClass('pp_pause').addClass('pp_play').click(function () {
                $.prettyPhoto.startSlideshow();
                return false;
            });
            clearInterval(pp_slideshow);
            pp_slideshow = undefined;
        }


        /**
         * Closes prettyPhoto.
         */
        $.prettyPhoto.close = function () {
            if ($pp_overlay.is(":animated")) return;

            $.prettyPhoto.stopSlideshow();

            $pp_pic_holder.stop().find('object,embed').css('visibility', 'hidden');

            $('div.pp_pic_holder,div.ppt,.pp_fade').fadeOut(settings.animation_speed, function () {
                $(this).remove();
            });

            $pp_overlay.fadeOut(settings.animation_speed, function () {

                if (settings.hideflash) $('object,embed,iframe[src*=youtube],iframe[src*=vimeo]').css('visibility', 'visible'); // Show the flash

                $(this).remove(); // No more need for the prettyPhoto markup

                $(window).unbind('scroll.prettyphoto');

                clearHashtag();

                settings.callback();

                doresize = true;

                pp_open = false;

                delete settings;
            });
        };

        /**
         * Set the proper sizes on the containers and animate the content in.
         */
        function _showContent() {
            $('.pp_loaderIcon').hide();

            // Calculate the opened top position of the pic holder
            projectedTop = scroll_pos['scrollTop'] + ((windowHeight / 2) - (pp_dimensions['containerHeight'] / 2));
            if (projectedTop < 0) projectedTop = 0;

            $ppt.fadeTo(settings.animation_speed, 1);

            // Resize the content holder
            $pp_pic_holder.find('.pp_content')
                .animate({
                height: pp_dimensions['contentHeight'],
                width: pp_dimensions['contentWidth']
            }, settings.animation_speed);

            // Resize picture the holder
            $pp_pic_holder.animate({
                'top': projectedTop,
                'left': ((windowWidth / 2) - (pp_dimensions['containerWidth'] / 2) < 0) ? 0 : (windowWidth / 2) - (pp_dimensions['containerWidth'] / 2),
                width: pp_dimensions['containerWidth']
            }, settings.animation_speed, function () {
                $pp_pic_holder.find('.pp_hoverContainer,#fullResImage').height(pp_dimensions['height']).width(pp_dimensions['width']);

                $pp_pic_holder.find('.pp_fade').fadeIn(settings.animation_speed); // Fade the new content

                // Show the nav
                if (isSet && _getFileType(pp_images[set_position]) == "image") {
                    $pp_pic_holder.find('.pp_hoverContainer').show();
                } else {
                    $pp_pic_holder.find('.pp_hoverContainer').hide();
                }

                if (settings.allow_expand) {
                    if (pp_dimensions['resized']) { // Fade the resizing link if the image is resized
                        $('a.pp_expand,a.pp_contract').show();
                    } else {
                        $('a.pp_expand').hide();
                    }
                }

                if (settings.autoplay_slideshow && !pp_slideshow && !pp_open) $.prettyPhoto.startSlideshow();

                settings.changepicturecallback(); // Callback!

                pp_open = true;
            });

            _insert_gallery();
            pp_settings.ajaxcallback();
        };

        /**
         * Hide the content...DUH!
         */
        function _hideContent(callback) {
            // Fade out the current picture
            $pp_pic_holder.find('#pp_full_res object,#pp_full_res embed').css('visibility', 'hidden');
            $pp_pic_holder.find('.pp_fade').fadeOut(settings.animation_speed, function () {
                $('.pp_loaderIcon').show();

                callback();
            });
        };

        /**
         * Check the item position in the gallery array, hide or show the navigation links
         * @param setCount {integer} The total number of items in the set
         */
        function _checkPosition(setCount) {
            (setCount > 1) ? $('.pp_nav').show() : $('.pp_nav').hide(); // Hide the bottom nav if it's not a set.
        };

        /**
         * Resize the item dimensions if it's bigger than the viewport
         * @param width {integer} Width of the item to be opened
         * @param height {integer} Height of the item to be opened
         * @return An array containin the "fitted" dimensions
         */
        function _fitToViewport(width, height) {
            resized = false;

            _getDimensions(width, height);

            // Define them in case there's no resize needed
            imageWidth = width, imageHeight = height;

            if (((pp_containerWidth > windowWidth) || (pp_containerHeight > windowHeight)) && doresize && settings.allow_resize && !percentBased) {
                resized = true, fitting = false;

                while (!fitting) {
                    if ((pp_containerWidth > windowWidth)) {
                        imageWidth = (windowWidth - 200);
                        imageHeight = (height / width) * imageWidth;
                    } else if ((pp_containerHeight > windowHeight)) {
                        imageHeight = (windowHeight - 200);
                        imageWidth = (width / height) * imageHeight;
                    } else {
                        fitting = true;
                    };

                    pp_containerHeight = imageHeight, pp_containerWidth = imageWidth;
                };



                if ((pp_containerWidth > windowWidth) || (pp_containerHeight > windowHeight)) {
                    _fitToViewport(pp_containerWidth, pp_containerHeight)
                };

                _getDimensions(imageWidth, imageHeight);
            };

            return {
                width: Math.floor(imageWidth),
                height: Math.floor(imageHeight),
                containerHeight: Math.floor(pp_containerHeight),
                containerWidth: Math.floor(pp_containerWidth) + (settings.horizontal_padding * 2),
                contentHeight: Math.floor(pp_contentHeight),
                contentWidth: Math.floor(pp_contentWidth),
                resized: resized
            };
        };

        /**
         * Get the containers dimensions according to the item size
         * @param width {integer} Width of the item to be opened
         * @param height {integer} Height of the item to be opened
         */
        function _getDimensions(width, height) {
            width = parseFloat(width);
            height = parseFloat(height);

            // Get the details height, to do so, I need to clone it since it's invisible
            $pp_details = $pp_pic_holder.find('.pp_details');
            $pp_details.width(width);
            detailsHeight = parseFloat($pp_details.css('marginTop')) + parseFloat($pp_details.css('marginBottom'));

            $pp_details = $pp_details.clone().addClass(settings.theme).width(width).appendTo($('body')).css({
                'position': 'absolute',
                'top': -10000
            });
            detailsHeight += $pp_details.height();
            detailsHeight = (detailsHeight <= 34) ? 36 : detailsHeight; // Min-height for the details
            $pp_details.remove();

            // Get the titles height, to do so, I need to clone it since it's invisible
            $pp_title = $pp_pic_holder.find('.ppt');
            $pp_title.width(width);
            titleHeight = parseFloat($pp_title.css('marginTop')) + parseFloat($pp_title.css('marginBottom'));
            $pp_title = $pp_title.clone().appendTo($('body')).css({
                'position': 'absolute',
                'top': -10000
            });
            titleHeight += $pp_title.height();
            $pp_title.remove();

            // Get the container size, to resize the holder to the right dimensions
            pp_contentHeight = height + detailsHeight;
            pp_contentWidth = width;
            pp_containerHeight = pp_contentHeight + titleHeight + $pp_pic_holder.find('.pp_top').height() + $pp_pic_holder.find('.pp_bottom').height();
            pp_containerWidth = width;
        }

        function _getFileType(itemSrc) {
            if (itemSrc.match(/youtube\.com\/watch/i) || itemSrc.match(/youtu\.be/i)) {
                return 'youtube';
            } else if (itemSrc.match(/vimeo\.com/i)) {
                return 'vimeo';
            } else if (itemSrc.match(/\b.mov\b/i)) {
                return 'quicktime';
            } else if (itemSrc.match(/\b.swf\b/i)) {
                return 'flash';
            } else if (itemSrc.match(/\biframe=true\b/i)) {
                return 'iframe';
            } else if (itemSrc.match(/\bajax=true\b/i)) {
                return 'ajax';
            } else if (itemSrc.match(/\bcustom=true\b/i)) {
                return 'custom';
            } else if (itemSrc.substr(0, 1) == '#') {
                return 'inline';
            } else {
                return 'image';
            };
        };

        function _center_overlay() {
            if (doresize && typeof $pp_pic_holder != 'undefined') {
                scroll_pos = _get_scroll();
                contentHeight = $pp_pic_holder.height(), contentwidth = $pp_pic_holder.width();

                projectedTop = (windowHeight / 2) + scroll_pos['scrollTop'] - (contentHeight / 2);
                if (projectedTop < 0) projectedTop = 0;

                if (contentHeight > windowHeight) return;

                $pp_pic_holder.css({
                    'top': projectedTop,
                    'left': (windowWidth / 2) + scroll_pos['scrollLeft'] - (contentwidth / 2)
                });
            };
        };

        function _get_scroll() {
            if (self.pageYOffset) {
                return {
                    scrollTop: self.pageYOffset,
                    scrollLeft: self.pageXOffset
                };
            } else if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
                return {
                    scrollTop: document.documentElement.scrollTop,
                    scrollLeft: document.documentElement.scrollLeft
                };
            } else if (document.body) { // all other Explorers
                return {
                    scrollTop: document.body.scrollTop,
                    scrollLeft: document.body.scrollLeft
                };
            };
        };

        function _resize_overlay() {
            windowHeight = $(window).height(), windowWidth = $(window).width();

            if (typeof $pp_overlay != "undefined") $pp_overlay.height($(document).height()).width(windowWidth);
        };

        function _insert_gallery() {
            if (isSet && settings.overlay_gallery && _getFileType(pp_images[set_position]) == "image") {
                itemWidth = 52 + 5; // 52 beign the thumb width, 5 being the right margin.
                navWidth = (settings.theme == "facebook" || settings.theme == "pp_default") ? 50 : 30; // Define the arrow width depending on the theme

                itemsPerPage = Math.floor((pp_dimensions['containerWidth'] - 100 - navWidth) / itemWidth);
                itemsPerPage = (itemsPerPage < pp_images.length) ? itemsPerPage : pp_images.length;
                totalPage = Math.ceil(pp_images.length / itemsPerPage) - 1;

                // Hide the nav in the case there's no need for links
                if (totalPage == 0) {
                    navWidth = 0; // No nav means no width!
                    $pp_gallery.find('.pp_arrow_next,.pp_arrow_previous').hide();
                } else {
                    $pp_gallery.find('.pp_arrow_next,.pp_arrow_previous').show();
                };

                galleryWidth = itemsPerPage * itemWidth;
                fullGalleryWidth = pp_images.length * itemWidth;

                // Set the proper width to the gallery items
                $pp_gallery.css('margin-left', -((galleryWidth / 2) + (navWidth / 2)))
                    .find('div:first').width(galleryWidth + 5)
                    .find('ul').width(fullGalleryWidth)
                    .find('li.selected').removeClass('selected');

                goToPage = (Math.floor(set_position / itemsPerPage) < totalPage) ? Math.floor(set_position / itemsPerPage) : totalPage;

                $.prettyPhoto.changeGalleryPage(goToPage);

                $pp_gallery_li.filter(':eq(' + set_position + ')').addClass('selected');
            } else {
                $pp_pic_holder.find('.pp_content').unbind('mouseenter mouseleave');
                // $pp_gallery.hide();
            }
        }

        function _build_overlay(caller) {
            // Inject Social Tool markup into General markup
            if (settings.social_tools) facebook_like_link = settings.social_tools.replace('{location_href}', encodeURIComponent(location.href));

            settings.markup = settings.markup.replace('{pp_social}', '');

            $('body').append(settings.markup); // Inject the markup

            $pp_pic_holder = $('.pp_pic_holder'), $ppt = $('.ppt'), $pp_overlay = $('div.pp_overlay'); // Set my global selectors

            // Inject the inline gallery!
            if (isSet && settings.overlay_gallery) {
                currentGalleryPage = 0;
                toInject = "";
                for (var i = 0; i < pp_images.length; i++) {
                    if (!pp_images[i].match(/\b(jpg|jpeg|png|gif)\b/gi)) {
                        classname = 'default';
                        img_src = '';
                    } else {
                        classname = '';
                        img_src = pp_images[i];
                    }
                    toInject += "<li class='" + classname + "'><a href='#'><img src='" + img_src + "' width='50' alt='' /></a></li>";
                };

                toInject = settings.gallery_markup.replace(/{gallery}/g, toInject);

                $pp_pic_holder.find('#pp_full_res').after(toInject);

                $pp_gallery = $('.pp_pic_holder .pp_gallery'), $pp_gallery_li = $pp_gallery.find('li'); // Set the gallery selectors

                $pp_gallery.find('.pp_arrow_next').click(function () {
                    $.prettyPhoto.changeGalleryPage('next');
                    $.prettyPhoto.stopSlideshow();
                    return false;
                });

                $pp_gallery.find('.pp_arrow_previous').click(function () {
                    $.prettyPhoto.changeGalleryPage('previous');
                    $.prettyPhoto.stopSlideshow();
                    return false;
                });

                $pp_pic_holder.find('.pp_content').hover(

                function () {
                    $pp_pic_holder.find('.pp_gallery:not(.disabled)').fadeIn();
                },

                function () {
                    $pp_pic_holder.find('.pp_gallery:not(.disabled)').fadeOut();
                });

                itemWidth = 52 + 5; // 52 beign the thumb width, 5 being the right margin.
                $pp_gallery_li.each(function (i) {
                    $(this)
                        .find('a')
                        .click(function () {
                        $.prettyPhoto.changePage(i);
                        $.prettyPhoto.stopSlideshow();
                        return false;
                    });
                });
            };


            // Inject the play/pause if it's a slideshow
            if (settings.slideshow) {
                $pp_pic_holder.find('.pp_nav').prepend('<a href="#" class="pp_play">Play</a>')
                $pp_pic_holder.find('.pp_nav .pp_play').click(function () {
                    $.prettyPhoto.startSlideshow();
                    return false;
                });
            }

            $pp_pic_holder.attr('class', 'pp_pic_holder ' + settings.theme); // Set the proper theme

            $pp_overlay.css({
                'opacity': 0,
                'height': $(document).height(),
                'width': $(window).width()
            })
                .bind('click', function () {
                if (!settings.modal) $.prettyPhoto.close();
            });

            $('a.pp_close').bind('click', function () {
                $.prettyPhoto.close();
                return false;
            });


            if (settings.allow_expand) {
                $('a.pp_expand').bind('click', function (e) {
                    // Expand the image
                    if ($(this).hasClass('pp_expand')) {
                        $(this).removeClass('pp_expand').addClass('pp_contract');
                        doresize = false;
                    } else {
                        $(this).removeClass('pp_contract').addClass('pp_expand');
                        doresize = true;
                    };

                    _hideContent(function () {
                        $.prettyPhoto.open();
                    });

                    return false;
                });
            }

            $pp_pic_holder.find('.pp_previous, .pp_nav .pp_arrow_previous').bind('click', function () {
                $.prettyPhoto.changePage('previous');
                $.prettyPhoto.stopSlideshow();
                return false;
            });

            $pp_pic_holder.find('.pp_next, .pp_nav .pp_arrow_next').bind('click', function () {
                $.prettyPhoto.changePage('next');
                $.prettyPhoto.stopSlideshow();
                return false;
            });

            _center_overlay(); // Center it
        };

        if (!pp_alreadyInitialized && getHashtag()) {
            pp_alreadyInitialized = true;

            // Grab the rel index to trigger the click on the correct element
            hashIndex = getHashtag();
            hashRel = hashIndex;
            hashIndex = hashIndex.substring(hashIndex.indexOf('/') + 1, hashIndex.length - 1);
            hashRel = hashRel.substring(0, hashRel.indexOf('/'));

            // Little timeout to make sure all the prettyPhoto initialize scripts has been run.
            // Useful in the event the page contain several init scripts.
            setTimeout(function () {
                $("a[" + pp_settings.hook + "^='" + hashRel + "']:eq(" + hashIndex + ")").trigger('click');
            }, 50);
        }

        return this.unbind('click.prettyphoto').bind('click.prettyphoto', $.prettyPhoto.initialize); // Return the jQuery object for chaining. The unbind method is used to avoid click conflict when the plugin is called more than once
    };

    function getHashtag() {
        var url = location.href;
        hashtag = (url.indexOf('#prettyPhoto') !== -1) ? decodeURI(url.substring(url.indexOf('#prettyPhoto') + 1, url.length)) : false;

        return hashtag;
    };

    function setHashtag() {
        if (typeof theRel == 'undefined') return; // theRel is set on normal calls, it's impossible to deeplink using the API
        location.hash = theRel + '/' + rel_index + '/';
    };

    function clearHashtag() {
        if (location.href.indexOf('#prettyPhoto') !== -1) location.hash = "prettyPhoto";
    }

    function getParam(name, url) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(url);
        return (results == null) ? "" : results[1];
    }

})(jQuery);

var pp_alreadyInitialized = false; // Used for the deep linking to make sure not to call the same function several times.
/**
 * jQuery Validation Plugin @VERSION
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-validation/
 * http://docs.jquery.com/Plugins/Validation
 *
 * Copyright (c) 2012 JÃ¶rn Zaefferer
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

(function($) {

$.extend($.fn, {
	// http://docs.jquery.com/Plugins/Validation/validate
	validate: function( options ) {

		// if nothing is selected, return nothing; can't chain anyway
		if (!this.length) {
			if (options && options.debug && window.console) {
				console.warn( "nothing selected, can't validate, returning nothing" );
			}
			return;
		}

		// check if a validator for this form was already created
		var validator = $.data(this[0], 'validator');
		if ( validator ) {
			return validator;
		}

		// Add novalidate tag if HTML5.
		this.attr('novalidate', 'novalidate');

		validator = new $.validator( options, this[0] );
		$.data(this[0], 'validator', validator);

		if ( validator.settings.onsubmit ) {

			this.validateDelegate( ":submit", "click", function(ev) {
				if ( validator.settings.submitHandler ) {
					validator.submitButton = ev.target;
				}
				// allow suppressing validation by adding a cancel class to the submit button
				if ( $(ev.target).hasClass('cancel') ) {
					validator.cancelSubmit = true;
				}
			});

			// validate the form on submit
			this.submit( function( event ) {
				if ( validator.settings.debug ) {
					// prevent form submit to be able to see console output
					event.preventDefault();
				}
				function handle() {
					var hidden;
					if ( validator.settings.submitHandler ) {
						if (validator.submitButton) {
							// insert a hidden input as a replacement for the missing submit button
							hidden = $("<input type='hidden'/>").attr("name", validator.submitButton.name).val(validator.submitButton.value).appendTo(validator.currentForm);
						}
						validator.settings.submitHandler.call( validator, validator.currentForm, event );
						if (validator.submitButton) {
							// and clean up afterwards; thanks to no-block-scope, hidden can be referenced
							hidden.remove();
						}
						return false;
					}
					return true;
				}

				// prevent submit for invalid forms or custom submit handlers
				if ( validator.cancelSubmit ) {
					validator.cancelSubmit = false;
					return handle();
				}
				if ( validator.form() ) {
					if ( validator.pendingRequest ) {
						validator.formSubmitted = true;
						return false;
					}
					return handle();
				} else {
					validator.focusInvalid();
					return false;
				}
			});
		}

		return validator;
	},
	// http://docs.jquery.com/Plugins/Validation/valid
	valid: function() {
		if ( $(this[0]).is('form')) {
			return this.validate().form();
		} else {
			var valid = true;
			var validator = $(this[0].form).validate();
			this.each(function() {
				valid &= validator.element(this);
			});
			return valid;
		}
	},
	// attributes: space seperated list of attributes to retrieve and remove
	removeAttrs: function(attributes) {
		var result = {},
			$element = this;
		$.each(attributes.split(/\s/), function(index, value) {
			result[value] = $element.attr(value);
			$element.removeAttr(value);
		});
		return result;
	},
	// http://docs.jquery.com/Plugins/Validation/rules
	rules: function(command, argument) {
		var element = this[0];

		if (command) {
			var settings = $.data(element.form, 'validator').settings;
			var staticRules = settings.rules;
			var existingRules = $.validator.staticRules(element);
			switch(command) {
			case "add":
				$.extend(existingRules, $.validator.normalizeRule(argument));
				staticRules[element.name] = existingRules;
				if (argument.messages) {
					settings.messages[element.name] = $.extend( settings.messages[element.name], argument.messages );
				}
				break;
			case "remove":
				if (!argument) {
					delete staticRules[element.name];
					return existingRules;
				}
				var filtered = {};
				$.each(argument.split(/\s/), function(index, method) {
					filtered[method] = existingRules[method];
					delete existingRules[method];
				});
				return filtered;
			}
		}

		var data = $.validator.normalizeRules(
		$.extend(
			{},
			$.validator.metadataRules(element),
			$.validator.classRules(element),
			$.validator.attributeRules(element),
			$.validator.staticRules(element)
		), element);

		// make sure required is at front
		if (data.required) {
			var param = data.required;
			delete data.required;
			data = $.extend({required: param}, data);
		}

		return data;
	}
});

// Custom selectors
$.extend($.expr[":"], {
	// http://docs.jquery.com/Plugins/Validation/blank
	blank: function(a) {return !$.trim("" + a.value);},
	// http://docs.jquery.com/Plugins/Validation/filled
	filled: function(a) {return !!$.trim("" + a.value);},
	// http://docs.jquery.com/Plugins/Validation/unchecked
	unchecked: function(a) {return !a.checked;}
});

// constructor for validator
$.validator = function( options, form ) {
	this.settings = $.extend( true, {}, $.validator.defaults, options );
	this.currentForm = form;
	this.init();
};

$.validator.format = function(source, params) {
	if ( arguments.length === 1 ) {
		return function() {
			var args = $.makeArray(arguments);
			args.unshift(source);
			return $.validator.format.apply( this, args );
		};
	}
	if ( arguments.length > 2 && params.constructor !== Array  ) {
		params = $.makeArray(arguments).slice(1);
	}
	if ( params.constructor !== Array ) {
		params = [ params ];
	}
	$.each(params, function(i, n) {
		source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
	});
	return source;
};

$.extend($.validator, {

	defaults: {
		messages: {},
		groups: {},
		rules: {},
		errorClass: "error",
		validClass: "valid",
		errorElement: "label",
		focusInvalid: true,
		errorContainer: $( [] ),
		errorLabelContainer: $( [] ),
		onsubmit: true,
		ignore: ":hidden",
		ignoreTitle: false,
		onfocusin: function(element, event) {
			this.lastActive = element;

			// hide error label and remove error class on focus if enabled
			if ( this.settings.focusCleanup && !this.blockFocusCleanup ) {
				if ( this.settings.unhighlight ) {
					this.settings.unhighlight.call( this, element, this.settings.errorClass, this.settings.validClass );
				}
				this.addWrapper(this.errorsFor(element)).hide();
			}
		},
		onfocusout: function(element, event) {
			if ( !this.checkable(element) && (element.name in this.submitted || !this.optional(element)) ) {
				this.element(element);
			}
		},
		onkeyup: function(element, event) {
			if ( element.name in this.submitted || element === this.lastElement ) {
				this.element(element);
			}
		},
		onclick: function(element, event) {
			// click on selects, radiobuttons and checkboxes
			if ( element.name in this.submitted ) {
				this.element(element);
			}
			// or option elements, check parent select in that case
			else if (element.parentNode.name in this.submitted) {
				this.element(element.parentNode);
			}
		},
		highlight: function(element, errorClass, validClass) {
			if (element.type === 'radio') {
				this.findByName(element.name).addClass(errorClass).removeClass(validClass);
			} else {
				$(element).addClass(errorClass).removeClass(validClass);
			}
		},
		unhighlight: function(element, errorClass, validClass) {
			if (element.type === 'radio') {
				this.findByName(element.name).removeClass(errorClass).addClass(validClass);
			} else {
				$(element).removeClass(errorClass).addClass(validClass);
			}
		}
	},

	// http://docs.jquery.com/Plugins/Validation/Validator/setDefaults
	setDefaults: function(settings) {
		$.extend( $.validator.defaults, settings );
	},

	messages: {
		required: "This field is required.",
		remote: "Please fix this field.",
		email: "Please enter a valid email address.",
		url: "Please enter a valid URL.",
		date: "Please enter a valid date.",
		dateISO: "Please enter a valid date (ISO).",
		number: "Please enter a valid number.",
		digits: "Please enter only digits.",
		creditcard: "Please enter a valid credit card number.",
		equalTo: "Please enter the same value again.",
		accept: "Please enter a value with a valid extension.",
		maxlength: $.validator.format("Please enter no more than {0} characters."),
		minlength: $.validator.format("Please enter at least {0} characters."),
		rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
		range: $.validator.format("Please enter a value between {0} and {1}."),
		max: $.validator.format("Please enter a value less than or equal to {0}."),
		min: $.validator.format("Please enter a value greater than or equal to {0}.")
	},

	autoCreateRanges: false,

	prototype: {

		init: function() {
			this.labelContainer = $(this.settings.errorLabelContainer);
			this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
			this.containers = $(this.settings.errorContainer).add( this.settings.errorLabelContainer );
			this.submitted = {};
			this.valueCache = {};
			this.pendingRequest = 0;
			this.pending = {};
			this.invalid = {};
			this.reset();

			var groups = (this.groups = {});
			$.each(this.settings.groups, function(key, value) {
				$.each(value.split(/\s/), function(index, name) {
					groups[name] = key;
				});
			});
			var rules = this.settings.rules;
			$.each(rules, function(key, value) {
				rules[key] = $.validator.normalizeRule(value);
			});

			function delegate(event) {
				var validator = $.data(this[0].form, "validator"),
					eventType = "on" + event.type.replace(/^validate/, "");
				if (validator.settings[eventType]) {
					validator.settings[eventType].call(validator, this[0], event);
				}
			}
			$(this.currentForm)
				.validateDelegate("[type='text'], [type='password'], [type='file'], select, textarea, " +
					"[type='number'], [type='search'] ,[type='tel'], [type='url'], " +
					"[type='email'], [type='datetime'], [type='date'], [type='month'], " +
					"[type='week'], [type='time'], [type='datetime-local'], " +
					"[type='range'], [type='color'] ",
					"focusin focusout keyup", delegate)
				.validateDelegate("[type='radio'], [type='checkbox'], select, option", "click", delegate);

			if (this.settings.invalidHandler) {
				$(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
			}
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/form
		form: function() {
			this.checkForm();
			$.extend(this.submitted, this.errorMap);
			this.invalid = $.extend({}, this.errorMap);
			if (!this.valid()) {
				$(this.currentForm).triggerHandler("invalid-form", [this]);
			}
			this.showErrors();
			return this.valid();
		},

		checkForm: function() {
			this.prepareForm();
			for ( var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++ ) {
				this.check( elements[i] );
			}
			return this.valid();
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/element
		element: function( element ) {
			element = this.validationTargetFor( this.clean( element ) );
			this.lastElement = element;
			this.prepareElement( element );
			this.currentElements = $(element);
			var result = this.check( element ) !== false;
			if (result) {
				delete this.invalid[element.name];
			} else {
				this.invalid[element.name] = true;
			}
			if ( !this.numberOfInvalids() ) {
				// Hide error containers on last error
				this.toHide = this.toHide.add( this.containers );
			}
			this.showErrors();
			return result;
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/showErrors
		showErrors: function(errors) {
			if(errors) {
				// add items to error list and map
				$.extend( this.errorMap, errors );
				this.errorList = [];
				for ( var name in errors ) {
					this.errorList.push({
						message: errors[name],
						element: this.findByName(name)[0]
					});
				}
				// remove items from success list
				this.successList = $.grep( this.successList, function(element) {
					return !(element.name in errors);
				});
			}
			if (this.settings.showErrors) {
				this.settings.showErrors.call( this, this.errorMap, this.errorList );
			} else {
				this.defaultShowErrors();
			}
		},

		// http://docs.jquery.com/Plugins/Validation/Validator/resetForm
		resetForm: function() {
			if ( $.fn.resetForm ) {
				$( this.currentForm ).resetForm();
			}
			this.submitted = {};
			this.lastElement = null;
			this.prepareForm();
			this.hideErrors();
			this.elements().removeClass( this.settings.errorClass );
		},

		numberOfInvalids: function() {
			return this.objectLength(this.invalid);
		},

		objectLength: function( obj ) {
			var count = 0;
			for ( var i in obj ) {
				count++;
			}
			return count;
		},

		hideErrors: function() {
			this.addWrapper( this.toHide ).hide();
		},

		valid: function() {
			return this.size() === 0;
		},

		size: function() {
			return this.errorList.length;
		},

		focusInvalid: function() {
			if( this.settings.focusInvalid ) {
				try {
					$(this.findLastActive() || this.errorList.length && this.errorList[0].element || [])
					.filter(":visible")
					.focus()
					// manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
					.trigger("focusin");
				} catch(e) {
					// ignore IE throwing errors when focusing hidden elements
				}
			}
		},

		findLastActive: function() {
			var lastActive = this.lastActive;
			return lastActive && $.grep(this.errorList, function(n) {
				return n.element.name === lastActive.name;
			}).length === 1 && lastActive;
		},

		elements: function() {
			var validator = this,
				rulesCache = {};

			// select all valid inputs inside the form (no submit or reset buttons)
			return $(this.currentForm)
			.find("input, select, textarea")
			.not(":submit, :reset, :image, [disabled]")
			.not( this.settings.ignore )
			.filter(function() {
				if ( !this.name && validator.settings.debug && window.console ) {
					console.error( "%o has no name assigned", this);
				}

				// select only the first element for each name, and only those with rules specified
				if ( this.name in rulesCache || !validator.objectLength($(this).rules()) ) {
					return false;
				}

				rulesCache[this.name] = true;
				return true;
			});
		},

		clean: function( selector ) {
			return $( selector )[0];
		},

		errors: function() {
			var errorClass = this.settings.errorClass.replace(' ', '.');
			return $( this.settings.errorElement + "." + errorClass, this.errorContext );
		},

		reset: function() {
			this.successList = [];
			this.errorList = [];
			this.errorMap = {};
			this.toShow = $([]);
			this.toHide = $([]);
			this.currentElements = $([]);
		},

		prepareForm: function() {
			this.reset();
			this.toHide = this.errors().add( this.containers );
		},

		prepareElement: function( element ) {
			this.reset();
			this.toHide = this.errorsFor(element);
		},

		elementValue: function( element ) {
			var val = $(element).val();
			if( typeof val === 'string' ) {
				return val.replace(/\r/g, "");
			}
			return val;
		},

		check: function( element ) {
			element = this.validationTargetFor( this.clean( element ) );

			var rules = $(element).rules();
			var dependencyMismatch = false;
			var val = this.elementValue(element);
			var result;

			for (var method in rules ) {
				var rule = { method: method, parameters: rules[method] };
				try {

					result = $.validator.methods[method].call( this, val, element, rule.parameters );

					// if a method indicates that the field is optional and therefore valid,
					// don't mark it as valid when there are no other rules
					if ( result === "dependency-mismatch" ) {
						dependencyMismatch = true;
						continue;
					}
					dependencyMismatch = false;

					if ( result === "pending" ) {
						this.toHide = this.toHide.not( this.errorsFor(element) );
						return;
					}

					if( !result ) {
						this.formatAndAdd( element, rule );
						return false;
					}
				} catch(e) {
					if ( this.settings.debug && window.console ) {
						console.log("exception occured when checking element " + element.id + ", check the '" + rule.method + "' method", e);
					}
					throw e;
				}
			}
			if (dependencyMismatch) {
				return;
			}
			if ( this.objectLength(rules) ) {
				this.successList.push(element);
			}
			return true;
		},

		// return the custom message for the given element and validation method
		// specified in the element's "messages" metadata
		customMetaMessage: function(element, method) {
			if (!$.metadata) {
				return;
			}
			var meta = this.settings.meta ? $(element).metadata()[this.settings.meta] : $(element).metadata();
			return meta && meta.messages && meta.messages[method];
		},

		// return the custom message for the given element name and validation method
		customMessage: function( name, method ) {
			var m = this.settings.messages[name];
			return m && (m.constructor === String ? m : m[method]);
		},

		// return the first defined argument, allowing empty strings
		findDefined: function() {
			for(var i = 0; i < arguments.length; i++) {
				if (arguments[i] !== undefined) {
					return arguments[i];
				}
			}
			return undefined;
		},

		defaultMessage: function( element, method) {
			return this.findDefined(
				this.customMessage( element.name, method ),
				this.customMetaMessage( element, method ),
				// title is never undefined, so handle empty string as undefined
				!this.settings.ignoreTitle && element.title || undefined,
				$.validator.messages[method],
				"<strong>Warning: No message defined for " + element.name + "</strong>"
			);
		},

		formatAndAdd: function( element, rule ) {
			var message = this.defaultMessage( element, rule.method ),
				theregex = /\$?\{(\d+)\}/g;
			if ( typeof message === "function" ) {
				message = message.call(this, rule.parameters, element);
			} else if (theregex.test(message)) {
				message = $.validator.format(message.replace(theregex, '{$1}'), rule.parameters);
			}
			this.errorList.push({
				message: message,
				element: element
			});

			this.errorMap[element.name] = message;
			this.submitted[element.name] = message;
		},

		addWrapper: function(toToggle) {
			if ( this.settings.wrapper ) {
				toToggle = toToggle.add( toToggle.parent( this.settings.wrapper ) );
			}
			return toToggle;
		},

		defaultShowErrors: function() {
			var i, elements;
			for ( i = 0; this.errorList[i]; i++ ) {
				var error = this.errorList[i];
				if ( this.settings.highlight ) {
					this.settings.highlight.call( this, error.element, this.settings.errorClass, this.settings.validClass );
				}
				this.showLabel( error.element, error.message );
			}
			if( this.errorList.length ) {
				this.toShow = this.toShow.add( this.containers );
			}
			if (this.settings.success) {
				for ( i = 0; this.successList[i]; i++ ) {
					this.showLabel( this.successList[i] );
				}
			}
			if (this.settings.unhighlight) {
				for ( i = 0, elements = this.validElements(); elements[i]; i++ ) {
					this.settings.unhighlight.call( this, elements[i], this.settings.errorClass, this.settings.validClass );
				}
			}
			this.toHide = this.toHide.not( this.toShow );
			this.hideErrors();
			this.addWrapper( this.toShow ).show();
		},

		validElements: function() {
			return this.currentElements.not(this.invalidElements());
		},

		invalidElements: function() {
			return $(this.errorList).map(function() {
				return this.element;
			});
		},

		showLabel: function(element, message) {
			var label = this.errorsFor( element );
			if ( label.length ) {
				// refresh error/success class
				label.removeClass( this.settings.validClass ).addClass( this.settings.errorClass );

				// check if we have a generated label, replace the message then
				if ( label.attr("generated") ) {
					label.html(message);
				}
			} else {
				// create label
				label = $("<" + this.settings.errorElement + "/>")
					.attr({"for":  this.idOrName(element), generated: true})
					.addClass(this.settings.errorClass)
					.html(message || "");
				if ( this.settings.wrapper ) {
					// make sure the element is visible, even in IE
					// actually showing the wrapped element is handled elsewhere
					label = label.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
				}
				if ( !this.labelContainer.append(label).length ) {
					if ( this.settings.errorPlacement ) {
						this.settings.errorPlacement(label, $(element) );
					} else {
					label.insertAfter(element);
					}
				}
			}
			if ( !message && this.settings.success ) {
				label.text("");
				if ( typeof this.settings.success === "string" ) {
					label.addClass( this.settings.success );
				} else {
					this.settings.success( label );
				}
			}
			this.toShow = this.toShow.add(label);
		},

		errorsFor: function(element) {
			var name = this.idOrName(element);
			return this.errors().filter(function() {
				return $(this).attr('for') === name;
			});
		},

		idOrName: function(element) {
			return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
		},

		validationTargetFor: function(element) {
			// if radio/checkbox, validate first element in group instead
			if (this.checkable(element)) {
				element = this.findByName( element.name ).not(this.settings.ignore)[0];
			}
			return element;
		},

		checkable: function( element ) {
			return (/radio|checkbox/i).test(element.type);
		},

		findByName: function( name ) {
			// select by name and filter by form for performance over form.find("[name=...]")
			var form = this.currentForm;
			return $(document.getElementsByName(name)).map(function(index, element) {
				return element.form === form && element.name === name && element  || null;
			});
		},

		getLength: function(value, element) {
			switch( element.nodeName.toLowerCase() ) {
			case 'select':
				return $("option:selected", element).length;
			case 'input':
				if( this.checkable( element) ) {
					return this.findByName(element.name).filter(':checked').length;
				}
			}
			return value.length;
		},

		depend: function(param, element) {
			return this.dependTypes[typeof param] ? this.dependTypes[typeof param](param, element) : true;
		},

		dependTypes: {
			"boolean": function(param, element) {
				return param;
			},
			"string": function(param, element) {
				return !!$(param, element.form).length;
			},
			"function": function(param, element) {
				return param(element);
			}
		},

		optional: function(element) {
			var val = this.elementValue(element);
			return !$.validator.methods.required.call(this, val, element) && "dependency-mismatch";
		},

		startRequest: function(element) {
			if (!this.pending[element.name]) {
				this.pendingRequest++;
				this.pending[element.name] = true;
			}
		},

		stopRequest: function(element, valid) {
			this.pendingRequest--;
			// sometimes synchronization fails, make sure pendingRequest is never < 0
			if (this.pendingRequest < 0) {
				this.pendingRequest = 0;
			}
			delete this.pending[element.name];
			if ( valid && this.pendingRequest === 0 && this.formSubmitted && this.form() ) {
				$(this.currentForm).submit();
				this.formSubmitted = false;
			} else if (!valid && this.pendingRequest === 0 && this.formSubmitted) {
				$(this.currentForm).triggerHandler("invalid-form", [this]);
				this.formSubmitted = false;
			}
		},

		previousValue: function(element) {
			return $.data(element, "previousValue") || $.data(element, "previousValue", {
				old: null,
				valid: true,
				message: this.defaultMessage( element, "remote" )
			});
		}

	},

	classRuleSettings: {
		required: {required: true},
		email: {email: true},
		url: {url: true},
		date: {date: true},
		dateISO: {dateISO: true},
		number: {number: true},
		digits: {digits: true},
		creditcard: {creditcard: true}
	},

	addClassRules: function(className, rules) {
		if ( className.constructor === String ) {
			this.classRuleSettings[className] = rules;
		} else {
			$.extend(this.classRuleSettings, className);
		}
	},

	classRules: function(element) {
		var rules = {};
		var classes = $(element).attr('class');
		if ( classes ) {
			$.each(classes.split(' '), function() {
				if (this in $.validator.classRuleSettings) {
					$.extend(rules, $.validator.classRuleSettings[this]);
				}
			});
		}
		return rules;
	},

	attributeRules: function(element) {
		var rules = {};
		var $element = $(element);

		for (var method in $.validator.methods) {
			var value;

			// support for <input required> in both html5 and older browsers
			if (method === 'required') {
				value = $element.get(0).getAttribute(method);
				// Some browsers return an empty string for the required attribute
				// and non-HTML5 browsers might have required="" markup
				if (value === "") {
					value = true;
				} else if (value === "false") {
					value = false;
				}
				// force non-HTML5 browsers to return bool
				value = !!value;
			} else {
				value = $element.attr(method);
			}

			if (value) {
				rules[method] = value;
			} else if ($element[0].getAttribute("type") === method) {
				rules[method] = true;
			}
		}

		// maxlength may be returned as -1, 2147483647 (IE) and 524288 (safari) for text inputs
		if (rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength)) {
			delete rules.maxlength;
		}

		return rules;
	},

	metadataRules: function(element) {
		if (!$.metadata) {
			return {};
		}

		var meta = $.data(element.form, 'validator').settings.meta;
		return meta ?
			$(element).metadata()[meta] :
			$(element).metadata();
	},

	staticRules: function(element) {
		var rules = {};
		var validator = $.data(element.form, 'validator');
		if (validator.settings.rules) {
			rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
		}
		return rules;
	},

	normalizeRules: function(rules, element) {
		// handle dependency check
		$.each(rules, function(prop, val) {
			// ignore rule when param is explicitly false, eg. required:false
			if (val === false) {
				delete rules[prop];
				return;
			}
			if (val.param || val.depends) {
				var keepRule = true;
				switch (typeof val.depends) {
					case "string":
						keepRule = !!$(val.depends, element.form).length;
						break;
					case "function":
						keepRule = val.depends.call(element, element);
						break;
				}
				if (keepRule) {
					rules[prop] = val.param !== undefined ? val.param : true;
				} else {
					delete rules[prop];
				}
			}
		});

		// evaluate parameters
		$.each(rules, function(rule, parameter) {
			rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter;
		});

		// clean number parameters
		$.each(['minlength', 'maxlength', 'min', 'max'], function() {
			if (rules[this]) {
				rules[this] = Number(rules[this]);
			}
		});
		$.each(['rangelength', 'range'], function() {
			if (rules[this]) {
				rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
			}
		});

		if ($.validator.autoCreateRanges) {
			// auto-create ranges
			if (rules.min && rules.max) {
				rules.range = [rules.min, rules.max];
				delete rules.min;
				delete rules.max;
			}
			if (rules.minlength && rules.maxlength) {
				rules.rangelength = [rules.minlength, rules.maxlength];
				delete rules.minlength;
				delete rules.maxlength;
			}
		}

		// To support custom messages in metadata ignore rule methods titled "messages"
		if (rules.messages) {
			delete rules.messages;
		}

		return rules;
	},

	// Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
	normalizeRule: function(data) {
		if( typeof data === "string" ) {
			var transformed = {};
			$.each(data.split(/\s/), function() {
				transformed[this] = true;
			});
			data = transformed;
		}
		return data;
	},

	// http://docs.jquery.com/Plugins/Validation/Validator/addMethod
	addMethod: function(name, method, message) {
		$.validator.methods[name] = method;
		$.validator.messages[name] = message !== undefined ? message : $.validator.messages[name];
		if (method.length < 3) {
			$.validator.addClassRules(name, $.validator.normalizeRule(name));
		}
	},

	methods: {

		// http://docs.jquery.com/Plugins/Validation/Methods/required
		required: function(value, element, param) {
			// check if dependency is met
			if ( !this.depend(param, element) ) {
				return "dependency-mismatch";
			}
			if ( element.nodeName.toLowerCase() === "select" ) {
				// could be an array for select-multiple or a string, both are fine this way
				var val = $(element).val();
				return val && val.length > 0;
			}
			if ( this.checkable(element) ) {
				return this.getLength(value, element) > 0;
			}
			return $.trim(value).length > 0;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/remote
		remote: function(value, element, param) {
			if ( this.optional(element) ) {
				return "dependency-mismatch";
			}

			var previous = this.previousValue(element);
			if (!this.settings.messages[element.name] ) {
				this.settings.messages[element.name] = {};
			}
			previous.originalMessage = this.settings.messages[element.name].remote;
			this.settings.messages[element.name].remote = previous.message;

			param = typeof param === "string" && {url:param} || param;

			if ( this.pending[element.name] ) {
				return "pending";
			}
			if ( previous.old === value ) {
				return previous.valid;
			}

			previous.old = value;
			var validator = this;
			this.startRequest(element);
			var data = {};
			data[element.name] = value;
			$.ajax($.extend(true, {
				url: param,
				mode: "abort",
				port: "validate" + element.name,
				dataType: "json",
				data: data,
				success: function(response) {
					validator.settings.messages[element.name].remote = previous.originalMessage;
					var valid = response === true;
					if ( valid ) {
						var submitted = validator.formSubmitted;
						validator.prepareElement(element);
						validator.formSubmitted = submitted;
						validator.successList.push(element);
						validator.showErrors();
					} else {
						var errors = {};
						var message = response || validator.defaultMessage( element, "remote" );
						errors[element.name] = previous.message = $.isFunction(message) ? message(value) : message;
						validator.showErrors(errors);
					}
					previous.valid = valid;
					validator.stopRequest(element, valid);
				}
			}, param));
			return "pending";
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/minlength
		minlength: function(value, element, param) {
			var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
			return this.optional(element) || length >= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/maxlength
		maxlength: function(value, element, param) {
			var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
			return this.optional(element) || length <= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/rangelength
		rangelength: function(value, element, param) {
			var length = $.isArray( value ) ? value.length : this.getLength($.trim(value), element);
			return this.optional(element) || ( length >= param[0] && length <= param[1] );
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/min
		min: function( value, element, param ) {
			return this.optional(element) || value >= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/max
		max: function( value, element, param ) {
			return this.optional(element) || value <= param;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/range
		range: function( value, element, param ) {
			return this.optional(element) || ( value >= param[0] && value <= param[1] );
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/email
		email: function(value, element) {
			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
			return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/url
		url: function(value, element) {
			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
			return this.optional(element) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/date
		date: function(value, element) {
			return this.optional(element) || !/Invalid|NaN/.test(new Date(value));
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/dateISO
		dateISO: function(value, element) {
			return this.optional(element) || /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/number
		number: function(value, element) {
			return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/digits
		digits: function(value, element) {
			return this.optional(element) || /^\d+$/.test(value);
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/creditcard
		// based on http://en.wikipedia.org/wiki/Luhn
		creditcard: function(value, element) {
			if ( this.optional(element) ) {
				return "dependency-mismatch";
			}
			// accept only spaces, digits and dashes
			if (/[^0-9 \-]+/.test(value)) {
				return false;
			}
			var nCheck = 0,
				nDigit = 0,
				bEven = false;

			value = value.replace(/\D/g, "");

			for (var n = value.length - 1; n >= 0; n--) {
				var cDigit = value.charAt(n);
				nDigit = parseInt(cDigit, 10);
				if (bEven) {
					if ((nDigit *= 2) > 9) {
						nDigit -= 9;
					}
				}
				nCheck += nDigit;
				bEven = !bEven;
			}

			return (nCheck % 10) === 0;
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/accept
		accept: function(value, element, param) {
			param = typeof param === "string" ? param.replace(/,/g, '|') : "png|jpe?g|gif";
			return this.optional(element) || value.match(new RegExp(".(" + param + ")$", "i"));
		},

		// http://docs.jquery.com/Plugins/Validation/Methods/equalTo
		equalTo: function(value, element, param) {
			// bind to the blur event of the target in order to revalidate whenever the target field is updated
			// TODO find a way to bind the event just once, avoiding the unbind-rebind overhead
			var target = $(param).unbind(".validate-equalTo").bind("blur.validate-equalTo", function() {
				$(element).valid();
			});
			return value === target.val();
		}

	}

});

// deprecated, use $.validator.format instead
$.format = $.validator.format;

}(jQuery));

// ajax mode: abort
// usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
// if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()
(function($) {
	var pendingRequests = {};
	// Use a prefilter if available (1.5+)
	if ( $.ajaxPrefilter ) {
		$.ajaxPrefilter(function(settings, _, xhr) {
			var port = settings.port;
			if (settings.mode === "abort") {
				if ( pendingRequests[port] ) {
					pendingRequests[port].abort();
				}
				pendingRequests[port] = xhr;
			}
		});
	} else {
		// Proxy ajax
		var ajax = $.ajax;
		$.ajax = function(settings) {
			var mode = ( "mode" in settings ? settings : $.ajaxSettings ).mode,
				port = ( "port" in settings ? settings : $.ajaxSettings ).port;
			if (mode === "abort") {
				if ( pendingRequests[port] ) {
					pendingRequests[port].abort();
				}
				return (pendingRequests[port] = ajax.apply(this, arguments));
			}
			return ajax.apply(this, arguments);
		};
	}
}(jQuery));

// provides cross-browser focusin and focusout events
// IE has native support, in other browsers, use event caputuring (neither bubbles)

// provides delegate(type: String, delegate: Selector, handler: Callback) plugin for easier event delegation
// handler is only called when $(event.target).is(delegate), in the scope of the jquery-object for event.target
(function($) {
	// only implement if not provided by jQuery core (since 1.4)
	// TODO verify if jQuery 1.4's implementation is compatible with older jQuery special-event APIs
	if (!jQuery.event.special.focusin && !jQuery.event.special.focusout && document.addEventListener) {
		$.each({
			focus: 'focusin',
			blur: 'focusout'
		}, function( original, fix ){
			$.event.special[fix] = {
				setup:function() {
					this.addEventListener( original, handler, true );
				},
				teardown:function() {
					this.removeEventListener( original, handler, true );
				},
				handler: function(e) {
					var args = arguments;
					args[0] = $.event.fix(e);
					args[0].type = fix;
					return $.event.handle.apply(this, args);
				}
			};
			function handler(e) {
				e = $.event.fix(e);
				e.type = fix;
				return $.event.handle.call(this, e);
			}
		});
	}
	$.extend($.fn, {
		validateDelegate: function(delegate, type, handler) {
			return this.bind(type, function(event) {
				var target = $(event.target);
				if (target.is(delegate)) {
					return handler.apply(target, arguments);
				}
			});
		}
	});
}(jQuery));

/**
 * Parallax Scrolling Tutorial
 * For NetTuts+
 *  
 * Author: Mohiuddin Parekh
 *	http://www.mohi.me
 * 	@mohiuddinparekh   
 */


$(document).ready(function(){
	// Cache the Window object
	$window = $(window);
                
   $('div[data-type="background"]').each(function(){
     var $bgobj = $(this); // assigning the object
                    
		$(window).scroll(function() {
						
			// Scroll the background at var speed
			// the yPos is a negative value because we're scrolling it UP!								
			var yPos = -($window.scrollTop() / $bgobj.data('speed')); 
			
			// Put together our final background position
			var coords = '50% '+ yPos + 'px';

			// Move the background
			$bgobj.css({ backgroundPosition: coords });
			
		}); // window scroll Ends

	});	

}); 
/* 
 * Create HTML5 elements for IE's sake
 */

document.createElement("article");
document.createElement("section");
jQuery(function($){$(document).ready(function(){var contentButton = [];var contentTop = [];var content = [];var lastScrollTop = 0;var scrollDir = '';var itemClass = '';var itemHover = '';var menuSize = null;var stickyHeight = 0;var stickyMarginB = 0;var currentMarginT = 0;var topMargin = 0;$(window).scroll(function(event){var st = $(this).scrollTop();if (st > lastScrollTop){scrollDir = 'down';} else {scrollDir = 'up';}lastScrollTop = st;});$.fn.stickUp = function( options ) {$(this).addClass('stuckMenu');var objn = 0;if(options != null) {for(var o in options.parts) {if (options.parts.hasOwnProperty(o)){content[objn] = options.parts[objn];objn++;}}if(objn == 0) {console.log('error:needs arguments');}itemClass = options.itemClass;itemHover = options.itemHover;if(options.topMargin != null) {if(options.topMargin == 'auto') {topMargin = parseInt($('.stuckMenu').css('margin-top'));} else {if(isNaN(options.topMargin) && options.topMargin.search("px") > 0){topMargin = parseInt(options.topMargin.replace("px",""));} else if(!isNaN(parseInt(options.topMargin))) {topMargin = parseInt(options.topMargin);} else {console.log("incorrect argument, ignored.");topMargin = 0;}	}} else {topMargin = 0;}menuSize = $('.'+itemClass).size();}stickyHeight = parseInt($(this).height());stickyMarginB = parseInt($(this).css('margin-bottom'));currentMarginT = parseInt($(this).next().closest('div').css('margin-top'));vartop = parseInt($(this).offset().top);};$(document).on('scroll', function() {varscroll = parseInt($(document).scrollTop());if(menuSize != null){for(var i=0;i < menuSize;i++){contentTop[i] = $('#'+content[i]+'').offset().top;function bottomView(i) {contentView = $('#'+content[i]+'').height()*.4;testView = contentTop[i] - contentView;if(varscroll > testView){$('.'+itemClass).removeClass(itemHover);$('.'+itemClass+':eq('+i+')').addClass(itemHover);} else if(varscroll < 50){$('.'+itemClass).removeClass(itemHover);$('.'+itemClass+':eq(0)').addClass(itemHover);}}if(scrollDir == 'down' && varscroll > contentTop[i]-50 && varscroll < contentTop[i]+50) {$('.'+itemClass).removeClass(itemHover);$('.'+itemClass+':eq('+i+')').addClass(itemHover);}if(scrollDir == 'up') {bottomView(i);}}}if(vartop < varscroll + topMargin){$('.stuckMenu').addClass('isStuck');$('.stuckMenu').next().closest('div').css({'margin-top': stickyHeight + stickyMarginB + currentMarginT + 'px'}, 10);$('.stuckMenu').css("position","fixed");$('.isStuck').css({top: '0px'}, 10, function(){});};if(varscroll + topMargin < vartop){$('.stuckMenu').removeClass('isStuck');$('.stuckMenu').next().closest('div').css({'margin-top': currentMarginT + 'px'}, 10);$('.stuckMenu').css("position","relative");};});});});
/**
 * Basic structure: TC_Class is the public class that is returned upon being called
 * 
 * So, if you do
 *      var tc = $(".timer").time-circles.js();
 *      
 * tc will contain an instance of the public time-circles.js class. It is important to
 * note that time-circles.js is not chained in the conventional way, check the
 * documentation for more info on how time-circles.js can be chained.
 * 
 * After being called/created, the public TimerCircles class will then- for each element
 * within it's collection, either fetch or create an instance of the private class.
 * Each function called upon the public class will be forwarded to each instance
 * of the private classes within the relevant element collection
 **/
(function($) {
    
    // Used to disable drawing on IE8, which can't use canvas
    var cant_draw = false;
    var tick_duration = 200; // in ms
    
    var debug = (location.hash === "#debug");
    function debug_log(msg) {
        if(debug) {
            console.log(msg);
        }
    }
    
    var allUnits = ["Days", "Hours", "Minutes", "Seconds"];
    var nextUnits = {
        Seconds: "Minutes",
        Minutes: "Hours",
        Hours: "Days",
        Days: "Years"
    };
    var secondsIn = {
        Seconds: 1,
        Minutes: 60,
        Hours: 3600,
        Days: 86400,
        Months: 2678400,
        Years: 31536000
    };
    
    /**
     * Converts hex color code into object containing integer values for the r,g,b use
     * This function (hexToRgb) originates from:
     * http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
     * @param {string} hex color code
     */
    function hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    /**
     * Function s4() and guid() originate from:
     * http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
     */
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    /**
     * Creates a unique id
     * @returns {String}
     */
    function guid() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
    
    function parse_date(str) {
        var match = str.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{1,2}:[0-9]{2}:[0-9]{2}$/);
        if (match !== null && match.length > 0) {
            var parts = str.split(" ");
            var date = parts[0].split("-");
            var time = parts[1].split(":");
            return new Date(date[0], date[1] - 1, date[2], time[0], time[1], time[2]);
        }
        // Fallback for different date formats
        var d = Date.parse(str);
        if(!isNaN(d)) return d;
        d = Date.parse(str.replace(/-/g, '/').replace('T', ' '));
        if(!isNaN(d)) return d;
        // Cant find anything
        return new Date();
    }
    
    function parse_times(diff, old_diff, total_duration, units, floor) {
        var raw_time = {};
        var raw_old_time = {};
        var time = {};
        var pct = {};
        var old_pct = {};
        var old_time = {};
        
        var greater_unit = null;
        for(var i in units) {
            var unit = units[i];
            var maxUnits;
            
            if(greater_unit === null) {
                maxUnits = total_duration / secondsIn[unit];
            }
            else {
                maxUnits = secondsIn[greater_unit] / secondsIn[unit];
            }
            
            var curUnits = (diff / secondsIn[unit]);
            var oldUnits = (old_diff / secondsIn[unit]);
            if(floor) curUnits = Math.floor(curUnits);
            if(floor) oldUnits = Math.floor(oldUnits);
            
            if(unit !== "Days"){
                curUnits = curUnits % maxUnits;
                oldUnits = oldUnits % maxUnits;
            }
            
            raw_time[unit] = curUnits;
            time[unit] = Math.abs(curUnits);
            raw_old_time[unit] = oldUnits;
            old_time[unit] = Math.abs(oldUnits);
            pct[unit] = Math.abs(curUnits) / maxUnits;
            old_pct[unit] = Math.abs(oldUnits) / maxUnits;
            
            greater_unit = unit;
        }
        
        return {
            raw_time: raw_time,
            raw_old_time: raw_old_time,
            time: time,
            old_time: old_time,
            pct: pct,
            old_pct: old_pct
        };
    }
    
    var TC_Instance_List = {};
    // Try fetch/share instance
    if(window !== window.top && typeof window.top.TC_Instance_List !== "undefined") {
        TC_Instance_List = window.top.TC_Instance_List;
    }
    else {
        window.top.TC_Instance_List = TC_Instance_List;
    }
    
    (function(){
        var vendors = ['webkit', 'moz'];
        for(var x = 0; x < vendors.length && !window.top.requestAnimationFrame; ++x) {
            window.top.requestAnimationFrame = window.top[vendors[x]+'RequestAnimationFrame'];
        }        
        if (!window.top.requestAnimationFrame) {
            window.top.requestAnimationFrame = function(callback, element, instance) {
                if(typeof instance === "undefined") instance = { data: { last_frame: 0 } };
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - instance.data.last_frame));
                var id = window.top.setTimeout(function() {
                    callback(currTime + timeToCall);
                }, timeToCall);
                instance.data.last_frame = currTime + timeToCall;
                return id;
            };
            window.top.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            }
        }
    })();
    

    var TC_Instance = function(element, options) {
        this.element = element;
        this.container;
        this.listeners = null;
        this.data = {
            paused: false,
            last_frame: 0,
            animation_frame: null,
            timer: false,
            total_duration: null,
            prev_time: null,
            drawn_units: [],
            text_elements: {
                Days: null,
                Hours: null,
                Minutes: null,
                Seconds: null
            },
            attributes: {
                canvas: null,
                context: null,
                item_size: null,
                line_width: null,
                radius: null,
                outer_radius: null
            },
            state: {
                fading: {
                    Days: false,
                    Hours: false,
                    Minutes: false,
                    Seconds: false
                }
            }
        };
        
        this.config = null;
        this.setOptions(options);
        this.initialize();
    };
    
    TC_Instance.prototype.initialize = function(clear_listeners) {
        // Initialize drawn units
        this.data.drawn_units = [];
        for(var unit in this.config.time) {
            if(this.config.time[unit].show){
                this.data.drawn_units.push(unit);
            }
        }
        
        // Avoid stacking
        $(this.element).children('div.time_circles').remove();
        
        if(typeof clear_listeners === "undefined") clear_listeners = true;
        if(clear_listeners || this.listeners === null) {
            this.listeners = { all: [], visible: [] };
        }
        this.container = $("<div>");
        this.container.addClass('time_circles');
        this.container.appendTo(this.element);

        this.data.attributes.canvas = $("<canvas>");
        try {
            this.data.attributes.context = this.data.attributes.canvas[0].getContext('2d');
        }
        catch(e) {
            cant_draw = true;
        }
        
        var height = this.element.offsetHeight;
        var width = this.element.offsetWidth;
        if(height === 0) height = $(this.element).height();
        if(width === 0) width = $(this.element).width();
        
        if(height === 0 && width > 0) height = width / this.data.drawn_units.length;
        else if(width === 0 && height > 0) width = height * this.data.drawn_units.length;
        
        this.data.attributes.canvas[0].height = height;
        this.data.attributes.canvas[0].width = width;
        this.data.attributes.canvas.appendTo(this.container);

        this.data.attributes.item_size = Math.min(this.data.attributes.canvas[0].width / this.data.drawn_units.length, this.data.attributes.canvas[0].height);
        this.data.attributes.line_width = this.data.attributes.item_size * this.config.fg_width;
        this.data.attributes.radius = ((this.data.attributes.item_size * 0.8) - this.data.attributes.line_width) / 2;
        this.data.attributes.outer_radius = this.data.attributes.radius + 0.5 * Math.max(this.data.attributes.line_width, this.data.attributes.line_width * this.config.bg_width);

        // Prepare Time Elements
        var i = 0;
        for (var key in this.data.text_elements) {
            if(!this.config.time[key].show) continue;
            
            var textElement = $("<div>");
            textElement.addClass('textDiv_' + key);
            textElement.css("top", Math.round(0.35 * this.data.attributes.item_size));
            textElement.css("left", Math.round(i++ * this.data.attributes.item_size));
            textElement.css("width", this.data.attributes.item_size);
            textElement.appendTo(this.container);
            
            var headerElement = $("<h4>");
            headerElement.text(this.config.time[key].text); // Options
            headerElement.css("font-size", Math.round(0.07 * this.data.attributes.item_size));
            headerElement.css("line-height", Math.round(0.07 * this.data.attributes.item_size) + "px");
            headerElement.appendTo(textElement);
            
            var numberElement = $("<span>");
            numberElement.css("font-size", Math.round(0.21 * this.data.attributes.item_size));
            numberElement.css("line-height", Math.round(0.07 * this.data.attributes.item_size) + "px");
            numberElement.appendTo(textElement);
            
            this.data.text_elements[key] = numberElement;
        }
        
        if (this.config.start && this.data.paused === false)
            this.start();
    };
    
    TC_Instance.prototype.update = function() {
        var diff, old_diff;

        var prevDate = this.data.prev_time;
        var curDate = new Date();
        this.data.prev_time = curDate;
        
        if(prevDate === null) prevDate = curDate;
        
        // If not counting past zero, and time < 0, then simply draw the zero point once, and call stop
        if (!this.config.count_past_zero) {
            if(curDate > this.data.attributes.ref_date) {
                for (var i in this.data.drawn_units) {
                    // TODO: listeners!
                    var key = this.data.drawn_units[i];

                    // Set the text value
                    this.data.text_elements[key].text("0");
                    var x = (i * this.data.attributes.item_size) + (this.data.attributes.item_size / 2);
                    var y = this.data.attributes.item_size / 2;
                    var color = this.config.time[key].color;
                    this.drawArc(x, y, color, 0);
                }
                this.stop();
                return;
            }
        }
        
        // Compare current time with reference
        diff = (this.data.attributes.ref_date - curDate) / 1000;
        old_diff = (this.data.attributes.ref_date - prevDate) / 1000;
        
        var floor = this.config.animation !== "smooth";
        
        var visible_times = parse_times(diff, old_diff, this.data.total_duration, this.data.drawn_units, floor);
        var all_times = parse_times(diff, old_diff, secondsIn["Years"], allUnits, floor);
        
        var i = 0;
        var j = 0;
        var lastKey = null;
        
        var cur_shown = this.data.drawn_units.slice();
        for (var i in allUnits) {
            var key = allUnits[i];
            
            // Notify (all) listeners
            if(Math.floor(all_times.raw_time[key]) !== Math.floor(all_times.raw_old_time[key])) {
                this.notifyListeners(key, Math.floor(all_times.time[key]), Math.floor(diff), "all");
            }
            
            if(cur_shown.indexOf(key) < 0) continue;
            
            // Notify (visible) listeners
            if(Math.floor(visible_times.raw_time[key]) !== Math.floor(visible_times.raw_old_time[key])) {
                this.notifyListeners(key, Math.floor(visible_times.time[key]), Math.floor(diff), "visible");
            }
            
            // Set the text value
            this.data.text_elements[key].text(Math.floor(Math.abs(visible_times.time[key])));

            var x = (j * this.data.attributes.item_size) + (this.data.attributes.item_size / 2);
            var y = this.data.attributes.item_size / 2;
            var color = this.config.time[key].color;
            
            if(this.config.animation === "smooth") {
                if (lastKey !== null) {
                    if (Math.floor(visible_times.time[lastKey]) > Math.floor(visible_times.old_time[lastKey])) {
                        this.radialFade(x, y, color, 1, key);
                        this.data.state.fading[key] = true;
                    }
                    else if (Math.floor(visible_times.time[lastKey]) < Math.floor(visible_times.old_time[lastKey])) {
                        this.radialFade(x, y, color, 0, key);
                        this.data.state.fading[key] = true;
                    }
                }
                if (!this.data.state.fading[key]) {
                    this.drawArc(x, y, color, visible_times.pct[key]);
                }
            }
            else {
                this.animateArc(x, y, color, visible_times.pct[key], visible_times.old_pct[key], (new Date()).getTime() + tick_duration);
            }
            lastKey = key;
            j++;
        }
        
        // We need this for our next frame either way
        var _this = this;
        var update = function() {
            _this.update.call(_this);
        };
        
        // Either call next update immediately, or in a second
        if(this.config.animation === "smooth") {
            // Smooth animation, Queue up the next frame
            this.data.animation_frame = window.top.requestAnimationFrame(update, _this.element, _this);
        }
        else {
            // Tick animation, Don't queue until very slightly after the next second happens
            var delay = (diff % 1) * 1000;
            if(delay < 0) delay = 1000 + delay;
            delay += 50;
            
            _this.data.animation_frame = window.top.setTimeout(function(){
                _this.data.animation_frame = window.top.requestAnimationFrame(update, _this.element, _this);
            }, delay);
        }
    };
    
    TC_Instance.prototype.animateArc = function(x, y, color, target_pct, cur_pct, animation_end) {
        if(cant_draw) return;
        
        var diff = cur_pct - target_pct;
        if(Math.abs(diff) > 0.5) {
            if(target_pct === 0) {
                this.radialFade(x, y, color, 1);
            }
            else {
                this.radialFade(x, y, color, 0);
            }
        }
        else {
            var progress = (tick_duration - (animation_end - (new Date()).getTime())) / tick_duration;
            if(progress > 1) progress = 1;
            
            var pct = (cur_pct * (1 - progress)) + (target_pct * progress);
            this.drawArc(x, y, color, pct);
            
            //var show_pct =
            if(progress >= 1) return;
            var _this = this;
            window.top.requestAnimationFrame(function(){
                _this.animateArc(x, y, color, target_pct, cur_pct, animation_end);
            }, this.element, null);
        }
    };
    
    TC_Instance.prototype.drawArc = function(x, y, color, pct) {
        if(cant_draw) return;
        
        var clear_radius = Math.max(this.data.attributes.outer_radius, this.data.attributes.item_size / 2);
        this.data.attributes.context.clearRect(
            x - clear_radius,
            y - clear_radius,
            clear_radius * 2,
            clear_radius * 2
            );

        if (this.config.use_background) {
            this.data.attributes.context.beginPath();
            this.data.attributes.context.arc(x, y, this.data.attributes.radius, 0, 2 * Math.PI, false);
            this.data.attributes.context.lineWidth = this.data.attributes.line_width * this.config.bg_width;

            // line color
            this.data.attributes.context.strokeStyle = this.config.circle_bg_color;
            this.data.attributes.context.stroke();
        }
        
        // Direction
        var startAngle, endAngle, counterClockwise;
        var defaultOffset = (-0.5 * Math.PI);
        var fullCircle = 2 * Math.PI;
        startAngle = defaultOffset + (this.config.start_angle / 360 * fullCircle);
        var offset = (2 * pct * Math.PI);
        
        if(this.config.direction === "Both") {
            counterClockwise = false;
            startAngle -= (offset / 2);
            endAngle = startAngle + offset;
        }
        else {
            if(this.config.direction === "Clockwise") {
                counterClockwise = false;
                endAngle = startAngle + offset;
            }
            else {
                counterClockwise = true;
                endAngle = startAngle - offset;
            }
        }

        this.data.attributes.context.beginPath();
        this.data.attributes.context.arc(x, y, this.data.attributes.radius, startAngle, endAngle, counterClockwise);
        this.data.attributes.context.lineWidth = this.data.attributes.line_width;

        // line color
        this.data.attributes.context.strokeStyle = color;
        this.data.attributes.context.stroke();
    };

    TC_Instance.prototype.radialFade = function(x, y, color, from, key) {
        // TODO: Make fade_time option
        var rgb = hexToRgb(color);
        var _this = this; // We have a few inner scopes here that will need access to our instance

        var step = 0.2 * ((from === 1) ? -1 : 1);
        var i;
        for (i = 0; from <= 1 && from >= 0; i++) {
            // Create inner scope so our variables are not changed by the time the Timeout triggers
            (function() {
                var delay = 50 * i;
                var rgba = "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + (Math.round(from * 10) / 10) + ")";
                window.top.setTimeout(function() {
                    _this.drawArc(x, y, rgba, 1);
                }, delay);
            }());
            from += step;
        }
        if(typeof key !== undefined) {
            window.top.setTimeout(function() {
                _this.data.state.fading[key] = false;
            }, 50 * i);
        }
    };

    TC_Instance.prototype.timeLeft = function() {
        var now = new Date();
        return ((this.data.attributes.ref_date - now) / 1000);
    };
    
    TC_Instance.prototype.start = function() {
        window.top.cancelAnimationFrame(this.data.animation_frame);
        window.top.clearTimeout(this.data.animation_frame)
        
        // Check if a date was passed in html attribute or jquery data
        var attr_data_date = $(this.element).data('date');
        if (typeof attr_data_date === "undefined") {
            attr_data_date = $(this.element).attr('data-date');
        }
        if (typeof attr_data_date === "string") {
            this.data.attributes.ref_date = parse_date(attr_data_date);
        }
        // Check if this is an unpause of a timer
        else if (typeof this.data.timer === "number") {
            if(this.data.paused) {
                this.data.attributes.ref_date = (new Date()).getTime() + (this.data.timer * 1000);
            }
        }
        else {
            // Try to get data-timer
            var attr_data_timer = $(this.element).data('timer');
            if (typeof attr_data_timer === "undefined") {
                attr_data_timer = $(this.element).attr('data-timer');
            }
            if (typeof attr_data_timer === "string") {
                attr_data_timer = parseFloat(attr_data_timer);
            }
            if(typeof attr_data_timer === "number") {
                this.data.timer = attr_data_timer;
                this.data.attributes.ref_date = (new Date()).getTime() + (attr_data_timer * 1000);
            }
            else {
                // data-timer and data-date were both not set
                // use config date
                this.data.attributes.ref_date = this.config.ref_date;
            }
        }

        // Start running
        this.data.paused = false;
        this.update();
    };

    TC_Instance.prototype.restart = function() {
        this.data.timer = false;
        this.start();
    };

    TC_Instance.prototype.stop = function() {
        if (typeof this.data.timer === "number") {
            this.data.timer = this.timeLeft(this);
        }
        // Stop running
        this.data.paused = true;
        window.top.cancelAnimationFrame(this.data.animation_frame);
    };

    TC_Instance.prototype.destroy = function() {
        this.stop();
        this.container.remove();
        $(this.element).removeAttr('data-tc-id');
        $(this.element).removeData('tc-id');
    };
    
    TC_Instance.prototype.setOptions = function(options) {
        if(this.config === null) {
            this.default_options.ref_date = new Date();
            this.config = $.extend(true, {}, this.default_options);
        }
        $.extend(true, this.config, options);
        
        this.data.total_duration = this.config.total_duration;
        if(typeof this.data.total_duration === "string") {
            if(typeof secondsIn[this.data.total_duration] !== "undefined") {
                // If set to Years, Months, Days, Hours or Minutes, fetch the secondsIn value for that
                this.data.total_duration = secondsIn[this.data.total_duration];
            }
            else if (this.data.total_duration === "Auto") {
                // If set to auto, total_duration is the size of 1 unit, of the unit type bigger than the largest shown
                for(var unit in this.config.time) {
                    if(this.config.time[unit].show) {
                        this.data.total_duration = secondsIn[nextUnits[unit]];
                        break;
                    }
                }
            }
            else {
                // If it's a string, but neither of the above, user screwed up.
                this.data.total_duration = secondsIn["Years"];
                console.error("Valid values for time-circles.js config.total_duration are either numeric, or (string) Years, Months, Days, Hours, Minutes, Auto");
            }
        }
    };
    
    TC_Instance.prototype.addListener = function(f, context, type) {
        if(typeof f !== "function") return;
        if(typeof type === "undefined") type = "visible";
        this.listeners[type].push({func: f, scope: context});
    };
    
    TC_Instance.prototype.notifyListeners = function(unit, value, total, type) {
        for(var i = 0; i < this.listeners[type].length; i++) {
            var listener = this.listeners[type][i];
            listener.func.apply(listener.scope, [unit, value, total]);
        }
    };
    
    TC_Instance.prototype.default_options = {
        ref_date: new Date(),
        start: true,
        animation: "smooth",
        count_past_zero: true,
        circle_bg_color: "#000",
        use_background: true,
        fg_width: 0.1,
        bg_width: 1.2,
        total_duration: "Auto",
        direction: "Clockwise",
        start_angle: 0,
        time: {
            Days: {
                show: true,
                text: "Days",
                color: "#E14E3D"
            },
            Hours: {
                show: true,
                text: "Hours",
                color: "#E14E3D"
            },
            Minutes: {
                show: true,
                text: "Minutes",
                color: "#E14E3D"
            },
            Seconds: {
                show: true,
                text: "Seconds",
                color: "#E14E3D"
            }
        }
    };

    // Time circle class
    var TC_Class = function(elements, options) {
        this.elements = elements;
        this.options = options;
        this.foreach();
    };
    
    TC_Class.prototype.getInstance = function(element) {
        var instance;
        
        var cur_id = $(element).data("tc-id");
        if (typeof cur_id === "undefined") {
            cur_id = guid();
            $(element).attr("data-tc-id", cur_id);
        }
        if (typeof TC_Instance_List[cur_id] === "undefined") {
            var options = this.options;
            var element_options = $(element).data('options');
            if(typeof element_options === "string") {
                element_options = JSON.parse(element_options);
            }
            if(typeof element_options === "object") {
                options = $.extend(true, {}, this.options, element_options);
            }
            instance = new TC_Instance(element, options);
            TC_Instance_List[cur_id] = instance;
        }
        else {
            instance = TC_Instance_List[cur_id];
            if (typeof this.options !== "undefined") {
                instance.setOptions(this.options);
            }
        }
        return instance;
    };

    TC_Class.prototype.foreach = function(callback) {
        var _this = this;
        this.elements.each(function() {
            var instance = _this.getInstance(this);
            if (typeof callback === "function") {
                callback(instance);
            }
        });
        return this;
    };
    
    TC_Class.prototype.start = function() {
        this.foreach(function(instance) {
            instance.start();
        });
        return this;
    };

    TC_Class.prototype.stop = function() {
        this.foreach(function(instance) {
            instance.stop();
        });
        return this;
    };
    
    TC_Class.prototype.restart = function() {
        this.foreach(function(instance) {
            instance.restart();
        });
        return this;
    };
    
    TC_Class.prototype.rebuild = function() {
        this.foreach(function(instance) {
            instance.initialize(false);
        });
        return this;
    };
    
    TC_Class.prototype.getTime = function() {
        return this.getInstance(this.elements[0]).timeLeft();
    };
    
    TC_Class.prototype.addListener = function(f, type) {
        if(typeof type === "undefined") type = "visible";
        var _this = this;
        this.foreach(function(instance) {
            instance.addListener(f, _this.elements, type);
        });
        return this;
    };
    
    TC_Class.prototype.destroy = function() {
        this.foreach(function(instance) {
            instance.destroy();
        });
        return this;
    };

    TC_Class.prototype.end = function() {
        return this.elements;
    };

    $.fn.time_circles = function(options) {
        return new TC_Class(this, options);
    };
}(jQuery));