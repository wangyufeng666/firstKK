/**
 * Ajax Autocomplete for jQuery, version 1.2.7
 * (c) 2013 Tomas Kirda
 * Ajax Autocomplete for jQuery is freely distributable under the terms of an MIT-style license.
 * For details, see the web site:http://www.devbridge.com/projects/autocomplete/jquery/
 */
(function(factory){
    'use strict';
    if(typeof define === 'function' && define.amd){
        define(['jquery'], factory);
    } else{
        factory(jQuery);
    }
}(function($){
	'use strict';
	var utils =(function(){
            return{
                extend:function(target, source){return $.extend(target, source);}
            	,createNode:function(html){
                    var div = document.createElement('div');
                    div.innerHTML = html;
                    return div.firstChild;
                }
            };
        }())
        ,keys ={ESC:27, TAB:9, RETURN:13, UP:38, DOWN:40};

    function Autocomplete(el, options){
        var noop = function(){}, that = this,
            defaults ={
                autoSelectFirst:false,
                appendTo:'search_result',
                serviceUrl:null,
                thisId:'',
                lookup:null,
                onSelect:null,
                width:'100%',
                maxHeight:'8rem',
                minChars:1,
                deferRequestBy:0,
                params:{},
                formatResult:Autocomplete.formatResult,
                delimiter:null,
                zIndex:9990,
                type:'GET',
                noCache:false,
                onSearchStart:noop,
                onSearchComplete:noop,
                containerClass:'suggestions',
                tabDisabled:false,
                dataType: 'text',
                lookupFilter:function(suggestion, originalQuery, queryLowerCase){
                    return suggestion.value.toLowerCase().indexOf(queryLowerCase) !== -1;
                },
                //paramName:'query',
                transformResult:function(response){
                    return typeof response === 'string' ? $.parseJSON(response) :response;
                }
            };

        // Shared variables:
        that.element = el;
        that.el = $(el);
        that.suggestions = [];
        that.badQueries = [];
        that.selectedIndex = -1;
        that.currentValue = that.element.value;
        that.intervalId = 0;
        that.cachedResponse = [];
        that.onChangeInterval = null;
        that.onChange = null;
        that.isLocal = false;
        that.suggestionsContainer = null;
        that.options = $.extend({}, defaults, options);
        that.classes ={
            selected:'autocomplete-selected',
            suggestion:'autocomplete-suggestion'
        };
        // Initialize and set options:
        that.initialize();
        that.setOptions(options);
    }

    Autocomplete.utils = utils;
    $.Autocomplete = Autocomplete;

    Autocomplete.formatResult = function(suggestionValue, currentValue){
        var reEscape = new RegExp('(\\'+['/','.','*','+','?','|','(',')','[',']','{','}','\\'].join('|\\')+')', 'g'),
            pattern = '('+currentValue.replace(reEscape, '\\$1')+')';
        
        suggestionValue = suggestionValue.replace(new RegExp(pattern, 'gi'), '<≌>$1<\/≌>');
        suggestionValue = suggestionValue.replaceAll('<≌><≌>', '<≌>');
        suggestionValue = suggestionValue.replaceAll('<\/≌><\/≌>', '<\/≌>');
        return suggestionValue;
    };

    Autocomplete.prototype ={
        killerFn:null,
        initialize:function(){
            var that = this,
                suggestionSelector = '.'+that.classes.suggestion,
                selected = that.classes.selected,
                options = that.options, container;
            // Remove autocomplete attribute to prevent native suggestions:
            that.element.setAttribute('autocomplete', 'off');
            that.killerFn = function(e){
                if($(e.target).closest('.'+that.options.containerClass).length === 0){
                    that.killSuggestions();
                    that.disableKillerFn();
                }
            };
            that.suggestionsContainer = Autocomplete.utils.createNode('<div class="'+options.containerClass+'" style="position:absolute; display:none;"></div>');
            container = $(that.suggestionsContainer);
            $('#'+options.appendTo).html(container);
            // Only set width if it was provided:
            if(options.width !== 'auto'){
                container.width(options.width);
            }
            // Listen for mouse over event on suggestions list:
            container.on('mouseover.autocomplete', suggestionSelector, function(){
                that.activate($(this).data('index'));
            });
            // Deselect active element when mouse leaves suggestions container:
            container.on('mouseout.autocomplete', function(){
                that.selectedIndex = -1;
                container.children('.'+selected).removeClass(selected);
            });
            // Listen for click event on suggestions list:
            container.on('click.autocomplete', suggestionSelector, function(){
                that.select($(this).data('index'));
            });
            that.fixPosition();
            that.fixPositionCapture = function(){
                if(that.visible){
                    that.fixPosition();
                }
            };
            $(window).on('resize', that.fixPositionCapture);
            that.el.on('keydown.autocomplete', function(e){that.onKeyPress(e);});
            that.el.on('keyup.autocomplete', function(e){that.onKeyUp(e);});
            that.el.on('blur.autocomplete', function(){that.onBlur();});
            that.el.on('focus.autocomplete', function(){that.fixPosition();});
        },
        onBlur:function(){
            this.enableKillerFn();
        },
        setOptions:function(suppliedOptions){
            var that = this, options = that.options;

            utils.extend(options, suppliedOptions);
            that.isLocal = $.isArray(options.lookup);

            if(that.isLocal){
                options.lookup = that.verifySuggestionsFormat(options.lookup);
            }
            // Adjust height, width and z-index:
            $(that.suggestionsContainer).css({
                'max-height':options.maxHeight,
                'width':options.width,
                'z-index':options.zIndex
            });
        },
        clearCache:function(){
            this.cachedResponse = [];
            this.badQueries = [];
        },
        clear:function(){
            this.clearCache();
            this.currentValue = '';
            this.suggestions = [];
        },
        disable:function(){this.disabled = true;},
        enable:function(){this.disabled = false;},
        fixPosition:function(){
            var that = this, offset;

            // Don't adjsut position if custom container has been specified:
            if(that.options.appendTo !== 'body'){
                $(that.suggestionsContainer).css({top:'.9rem',left:'0'});
                return;
            }

            offset = that.el.offset();

            $(that.suggestionsContainer).css({
                top:'.88rem',
                left:offset.left+'px'
            });
        },
        enableKillerFn:function(){
            var that = this;
            $(document).on('click.autocomplete', that.killerFn);
        },
        disableKillerFn:function(){
            var that = this;
            $(document).off('click.autocomplete', that.killerFn);
        },
        killSuggestions:function(){
            var that = this;
            that.stopKillSuggestions();
            that.intervalId = window.setInterval(function(){
                that.hide();
                that.stopKillSuggestions();
            }, 300);
        },
        stopKillSuggestions:function(){
            window.clearInterval(this.intervalId);
        },
        onKeyPress:function(e){
            var that = this;
            // If suggestions are hidden and user presses arrow down, display suggestions:
            if(!that.disabled && !that.visible && e.keyCode === keys.DOWN && that.currentValue){
                that.suggest();
                return;
            }
            if(that.disabled || !that.visible){return;}
            
            switch(e.which){
                case keys.ESC:
                    that.el.val(that.currentValue);
                    that.hide();
                    break;
                case keys.TAB:
                case keys.RETURN:
                    if(that.selectedIndex === -1){
                        that.hide();
                        return;
                    }
                    that.select(that.selectedIndex);
                    if(e.keyCode === keys.TAB && this.options.tabDisabled === false){
                        return;
                    }
                    break;
                case keys.UP:
                    that.moveUp();
                    break;
                case keys.DOWN:
                    that.moveDown();
                    break;
                default:
                    return;
            }
            // Cancel event if function did not return:
            e.stopImmediatePropagation();
            e.preventDefault();
        },
        onKeyUp:function(e){
            var that = this;
            if(that.disabled){return;}

            switch(e.keyCode){
                case keys.UP:
                case keys.DOWN:
                    return;
            }
            that.findBestHint();
            clearInterval(that.onChangeInterval);
            if(that.currentValue !== that.el.val()){
                if(that.options.deferRequestBy > 0){
                    // Defer lookup in case when value changes very quickly:
                    that.onChangeInterval = setInterval(function(){
                        that.onValueChange();
                    }, that.options.deferRequestBy);
                } else{
                    that.onValueChange();
                }
            }
        },
        onValueChange:function(){
            var that = this, q;

            clearInterval(that.onChangeInterval);
            that.currentValue = that.el.val();

            q = that.getQuery(that.currentValue);
            that.selectedIndex = -1;

            if(q.length < that.options.minChars){
                that.hide();
            } else{
                that.getSuggestions(q);
            }
        },
        getQuery:function(value){
            var delimiter = this.options.delimiter, parts;
            if(!delimiter){return $.trim(value);}
            parts = value.split(delimiter);
            return $.trim(parts[parts.length - 1]);
        },
        getSuggestionsLocal:function(query){
            var that = this, queryLowerCase = query.toLowerCase(),
                filter = that.options.lookupFilter;

            var querys = queryLowerCase.split(" ");
            var ss = {
                suggestions:$.grep(that.options.lookup, function(suggestion){
                    return filter(suggestion, querys[0], querys[0]);
                })
            };
            for(var i = 1; i<querys.length; i++){
            	if(querys[i].trim() !=''){
            		ss = {suggestions:$.grep(ss.suggestions, function(option){return filter(option, querys[i], querys[i]);})};
            	}
            }
            return ss;
        },
        getSuggestions:function(q){
            var response, that = this, options = that.options, serviceUrl = options.serviceUrl;
            response = that.isLocal?that.getSuggestionsLocal(q):that.cachedResponse[q];
            options.params.keyword = q;
            $.ajax({
                url:options.serviceUrl,
                data:options.params,
                type:options.type,
                dataType:options.dataType
            }).done(function(data){
                that.processResponse(data, q);
                options.onSearchComplete.call(that.element, q);
            });
        },
        /*isBadQuery:function(q){
            var badQueries = this.badQueries, i = badQueries.length;
            while(i--){
                if(q.indexOf(badQueries[i]) === 0){
                    return true;
                }
            }
            return false;
        },*/
        hide:function(){
            var that = this;
            that.visible = false;
            that.selectedIndex = -1;
            $(that.suggestionsContainer).hide();
            that.signalHint(null);
        },
        suggest:function(){
            if(this.suggestions.length === 0){
                this.hide();
                return;
            }
            var that = this,
                formatResult = that.options.formatResult,
                value = that.getQuery(that.currentValue),
                className = that.classes.suggestion,
                classSelected = that.classes.selected,
                container = $(that.suggestionsContainer),
                html = '', width, index = 1;
            // Build suggestions inner HTML:
            $.each(that.suggestions, function(i, suggestion){
            	var formatValue = '';
            	var values = [];
            	if(value != ''){
            		values = value.split(' ');
            	}
            	suggestion.value = suggestion.PNAME+" "+suggestion.MERNAME;
            	formatValue = suggestion.value;
            	for(var n = 0; n < values.length; n++){
            		if(values[n].trim() !=''){
            			formatValue = formatResult(formatValue, values[n]);
            		}
            	}
            	formatValue = formatValue.replaceAll("≌", "strong");
                html += '<div class="'+className+'" data-index="'+i+'" title="'+suggestion.value+'">'+formatValue+'</div>';
                if(index >= 10){ return false;}
                index++;
            });

            // If width is auto, adjust width before displaying suggestions,
            // because if instance was created before input had width, it will be zero.
            // Also it adjusts if input width has changed.
            // -2px to account for suggestions border.
            if(that.options.width === 'auto'){
                width = that.el.outerWidth() - 2;
                container.width(width > 0 ? width : 300);
            }
            container.html(html).show();
            that.visible = true;
            // Select first value by default:
            if(that.options.autoSelectFirst){
                that.selectedIndex = 0;
                container.children().first().addClass(classSelected);
            }
            that.findBestHint();
        },
        findBestHint:function(){
            var that = this,
                value = that.el.val().toLowerCase(),
                bestMatch = null;

            $.each(that.suggestions, function(i, suggestion){
                var foundMatch = suggestion.value.toLowerCase().indexOf(value) === 0;
                if(foundMatch){
                    bestMatch = suggestion;
                }
                return !foundMatch;
            });
            that.signalHint(bestMatch);
        },
        signalHint:function(suggestion){
            var hintValue = '';
            if(suggestion){
                hintValue = this.currentValue+suggestion.value.substr(this.currentValue.length);
            }
          (this.options.onHint || $.noop)(hintValue);
        },
        verifySuggestionsFormat:function(suggestions){
            // If suggestions is string array, convert them to supported format:
            if(suggestions.length && typeof suggestions[0] === 'string'){
                return $.map(suggestions, function(value){
                    return {value:value, data:null};
                });
            }
            return suggestions;
        },
        processResponse:function(response, originalQuery){
            var that = this, options = that.options,
                result = options.transformResult(response, originalQuery);
            result.suggestions = that.verifySuggestionsFormat(result);
            // Display suggestions only if returned query matches current value:
            if(originalQuery === that.getQuery(that.currentValue)){
                that.suggestions = result.suggestions;
                that.suggest();
            }
        },
        activate:function(index){
            var that = this, activeItem,
                selected = that.classes.selected,
                container = $(that.suggestionsContainer),
                children = container.children();

            container.children('.'+selected).removeClass(selected);
            that.selectedIndex = index;

            if(that.selectedIndex !== -1 && children.length > that.selectedIndex){
                activeItem = children.get(that.selectedIndex);
                $(activeItem).addClass(selected);
                return activeItem;
            }
            return null;
        },
        select:function(i){
            var that = this;
            that.hide();
            that.onSelect(i);
        },
        moveUp:function(){
            var that = this;
            if(that.selectedIndex === -1){return;}
            if(that.selectedIndex === 0){
                $(that.suggestionsContainer).children().first().removeClass(that.classes.selected);
                that.selectedIndex = -1;
                that.el.val(that.currentValue);
                that.findBestHint();
                return;
            }
            that.adjustScroll(that.selectedIndex - 1);
        },
        moveDown:function(){
            var that = this;
            if(that.selectedIndex ===(that.suggestions.length - 1)){return;}
            that.adjustScroll(that.selectedIndex+1);
        },
        adjustScroll:function(index){
            var that = this,
                activeItem = that.activate(index),
                offsetTop,
                upperBound,
                lowerBound,
                heightDelta = 25;

            if(!activeItem){return;}

            offsetTop = activeItem.offsetTop;
            upperBound = $(that.suggestionsContainer).scrollTop();
            lowerBound = upperBound+that.options.maxHeight - heightDelta;

            if(offsetTop < upperBound){
                $(that.suggestionsContainer).scrollTop(offsetTop);
            } else if(offsetTop > lowerBound){
                $(that.suggestionsContainer).scrollTop(offsetTop - that.options.maxHeight+heightDelta);
            }
            that.el.val(that.getValue(that.suggestions[index].value));
            that.signalHint(null);
        },

        onSelect:function(index){
            var that = this,
                onSelectCallback = that.options.onSelect,
                suggestion = that.suggestions[index];
            that.signalHint(null);
            that.suggestions = [];
            var thisMerId = suggestion.MERID;
            var thisMerType = suggestion.MERTYPE;
            merInquiry(thisMerId, thisMerType);
            if($.isFunction(onSelectCallback)){
                onSelectCallback.call(that.element, suggestion);
            }
        },
        getValue:function(value){
            var that = this, currentValue, parts, delimiter = that.options.delimiter;
            if(!delimiter){ return value; }
            currentValue = that.currentValue;
            parts = currentValue.split(delimiter);
            if(parts.length === 1){ return value; }
            return currentValue.substr(0, currentValue.length - parts[parts.length - 1].length)+value;
        },
        dispose:function(){
            var that = this;
            that.el.off('.autocomplete').removeData('autocomplete');
            that.disableKillerFn();
            $(window).off('resize', that.fixPositionCapture);
            $(that.suggestionsContainer).remove();
        }
    };

    // Create chainable jQuery plugin:
    $.fn.autocomplete = function(options, args){
    	options.thisId = $(this).attr('id');
        var dataKey = 'autocomplete';
        // If function invoked without argument return
        // instance of the first matched element:
        if(arguments.length === 0){
            return this.first().data(dataKey);
        }
        return this.each(function(){
            var inputElement = $(this), instance = inputElement.data(dataKey);

            if(typeof options === 'string'){
                if(instance && typeof instance[options] === 'function'){
                    instance[options](args);
                }
            }else{
                // If instance already exists, destroy it:
                if(instance && instance.dispose){
                    instance.dispose();
                }
                instance = new Autocomplete(this, options);
                inputElement.data(dataKey, instance);
            }
        });
    };
}));
String.prototype.replaceAll = function(s1,s2){
	return this.replace(new RegExp(s1,"gm"),s2);
};
String.prototype.trim = function(){
	return this .replace(/^\s\s*/, '' ).replace(/\s\s*$/, '' );
};