/**
 * DebugLog - nicer Javascript console logging
 *
 * code: http://github.com/ginader/DebugLog
 * please report issues at: http://github.com/ginader/DebugLog/issues
 *
 * Copyright (c) 2010 Dirk Ginader (ginader.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Version: 1.2
 *
 * History:
 * * new features 'blacklist' and 'whitelist' used to hide logs of blacklisted or 
     show only logs of whitelisted classes and/or their specific methods for noise reduction
 * * 
 */

DebugLog = {
    on : true,
    usecookie : true,
    initialized : false,
    is : {},
    can : {},
    usewhitelist : false,
    whitelist : [],
    useblacklist : false,
    blacklist : [],
    conf : {},
    showNodeProperties : ['id','class','href','type','value'],
    
    init : function(){
        this.initialized = true;
        this.can.log = (window.console && window.console.log);
        if(!this.can.log){
            //alert('No console found. No logging possible. Sorry Dude');
            this.on = false;
            return;
        }
        this.is = {
            /* yeah I don't like browser sniffing either but 
               I have not found a way to detect consoles other 
               than Firebug and Opera Dragonfly - suggestions? */
            firebug     : !!(window.console.firebug),
            companionJS : !!(window.console.provider && window.console.provider == 'Companion.JS'),
            ie          : !!(navigator.appVersion.indexOf('MSIE ')!=-1),
            chrome      : !!(window.chrome),
            safari      : !!(navigator.vendor && navigator.vendor.indexOf('Apple')!=-1),
            opera       : !!(window.opera && window.opera.postError)
        };
        
        this.can.renderObjects = (this.is.firebug || this.is.chrome || this.is.safari);
        this.log(this.serialize(this.is));
    },
    
    log : function(o,objectname,methodname){
        if(!this.initialized){this.init();}
        if(!this.on){
            if(this.usecookie){
                this.conf = eval('(' + this.readConf() + ')');
                if(!!this.conf){
                    this.on = true; // we have a conf so it's on
                    this.applyConf(this.conf);
                    if(!this.on){ // 'on' might also have been overwritten in conf
                        return;
                    }
                }else{
                    return;
                }
            }else{
                return;
            }
        }
        if(this.usewhitelist){
            if(this.islisted('white',objectname)){
                //console.log('pass as "'+objectname+'" is in whitelist');
            }else if(this.usewhitelist && objectname && methodname){
                if(!this.islisted('white',objectname+':'+methodname)){
                    //console.log('block as "'+objectname+':'+methodname+'" is not in whitelist');
                    return;                    
                }
                //console.log('pass as "'+objectname+':'+methodname+'" is in whitelist');
            }else{
                //console.log('block as "'+objectname+'" is not in whitelist');
                return;
            }
        }
        else if(this.useblacklist){
            if( this.islisted('black',objectname) || this.islisted('black',objectname+':'+methodname) ){
                //console.log('block as "'+objectname+'" or "'+objectname+':'+methodname+'" is in blacklist');
                return;
            }
        }
        if(this.can.renderObjects){
            console.log(o);
        }
        else if(this.is.opera){
            opera.postError(this.serialize(o));
        }
        else{
            console.log(this.serialize(o));
        }
    },
    
    islisted : function(list,str){
        if (new RegExp('^(' + this[list+'list'].join('|') + ')$').test(str)){
            return true;
        }
        return false;
    },
    
    enable : function(conf,persistant){
        this.on = !!conf;
        this.conf = conf;
        this.applyConf(this.conf);
        if(persistant){
            this.saveConf(conf);
        }
    },
    
    applyConf : function(conf){
        for(var prop in conf){
            if(conf.hasOwnProperty(prop)){
                this[prop] = conf[prop];
            }
        }
    },
    
    getNodeMarkup : function(o){
        // only showing whitelisted properties. Extent "showNodeProperties" if you need more
        var output='domEl{<';
        output+=o.nodeName.toLowerCase();
        for(var i=0,l=this.showNodeProperties.length;i<l;i++){
            output+=this.getProperty(o,this.showNodeProperties[i]);
        }
        output+='>}';
        return output;
    },
    
    getProperty:function(o,prop){
        if(o[prop]){return ' '+prop+'="'+o[prop]+'"';}
        else{return ''; }
    },
    
    serialize : function(o){
        // alternative object rendering for consoles that cannot render complex objects
        // thanks to: http://blog.stchur.com/2007/04/06/serializing-objects-in-javascript/
       if(o && o.nodeName){
           return this.getNodeMarkup(o);
       }
       switch (typeof o){
          case 'number':
          case 'boolean':
          case 'function':
             return o;
          case 'string':
             return '\'' + o + '\'';
          case 'object':
             var str;
             if (o.constructor === Array || typeof o.callee !== 'undefined'){
                str = '[';
                var i, len = o.length;
                for (i = 0; i < len-1; i++) { str += this.serialize(o[i]) + ','; }
                str += this.serialize(o[i]) + ']';
             }
             else{
                str = '{';
                var key;
                for (key in o) {
                    if(o.hasOwnProperty(key)){
                        str += key + ':' + this.serialize(o[key]) + ',';
                    }
                }
                str = str.replace(/\,$/, '') + '}';
             }
             return str;
          default:
             return 'UNKNOWN';
       }
    },
    
    saveConf : function(conf) {
        document.cookie = "DebugLogConf="+this.serialize(conf)+"; path=/";
    },
    
    readConf : function() {
        var nameEQ = "DebugLogConf=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') {c = c.substring(1,c.length);}
            if (c.indexOf(nameEQ) === 0) {return c.substring(nameEQ.length,c.length);}
        }
        return null;
    },
    
    deleteConf : function(name) {
        this.saveConf();
    }
};