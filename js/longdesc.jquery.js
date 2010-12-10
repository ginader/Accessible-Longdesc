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
    var debugMode = true;
    $.fn.extend({
        accessibleLongdescShow: function(){
            var url = $(this).attr('longdesc')+'2';
            $(this).parent().
            append('<div class="desc"/>')
            .find('.desc').load(url,function(){
                $(this).css('backgroundImage','none')
                .prepend('<button><span></span></button>');
            });
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
                .append('<button><span class="text">'+o.options.infoText+'</span><span class="icon">'+o.options.infoIcon+'</span></button>')
                .find('button')
                .bind('mouseenter mouseleave focusin focusout',function(){
                    $(this).toggleClass('hover');
                })
                .click(function(){
                    el.accessibleLongdescShow();
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
