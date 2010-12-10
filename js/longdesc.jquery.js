/**
 * Accessible Longdesc - jQuery plugin to make the longdesc attribut accessible to all users, not just those with assistive technology
 * @requires jQuery - tested with 1.4.2 but might as well work with older versions
 * * 
 * code: http://github.com/ginader/Accessible-Tabs
 * please report issues at: http://github.com/ginader/Accessible-Tabs/issues
 *
 * Copyright (c) 2010 Dirk Ginader (ginader.com)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Version: 1.0
 * 
 * History:
 * * 1.0 initial release
 */


(function($) {
    var debugMode = false;
    $.fn.extend({
        accessibleLongdescShow: function(){

        },
        accessibleLongdesc: function(config) {
            debug('init');
            var defaults = {
                infoText: 'click here for more infos about this image',
                infoIcon: 'ⓘ',
                wrapperClass: 'accessible-longdesc',
                iframeWidth: 640,
                iframeHeight: 480,
                closeText:'close this info'
            };
            this.options = $.extend(defaults, config);
            var o = this;
            return this.each(function(t) {
                var el = $(this);
                debug(el);
                el
                .wrap('<div class="'+o.options.wrapperClass+'"></div>')
                .parent()
                .append('<button><span class="icon">'+o.options.infoIcon+'</span><span class="text">'+o.options.infoText+'</span></button>')
                .find('button')
                .bind('mouseenter mouseleave focusin focusout',function(){
                    $(this).toggleClass('hover');
                })
                .click(function(){
                    debug('click open');
                    var url = el.attr('longdesc');
                    url = url.replace("#", " #");
                    el.parent().
                    append('<div class="desc" tabindex="-1"><div class="desc-content"></div></div>')
                    .find('.desc-content').load(url,function(){
                        var desc = $(this).parent();
                        desc
                        .css('backgroundImage','none')
                        .prepend('<button><span>'+o.options.closeText+'</span></button>')
                        .find('button')
                        .click(function(){
                            debug('click close');
                            var button = el.parent().children('button');
                            debug(button);
                            button.focus();
                            desc.remove();
                        })
                        .end()
                        .focus();
                    });
                });
            });
        }
    });
    // private Methods
    function debug(msg){
        if(debugMode){
            DebugLog.log(msg,'longdesc');
        }
    }
})(jQuery);
