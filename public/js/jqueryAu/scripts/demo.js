/*jslint  browser: true, white: true, plusplus: true */
/*global $: true */

$(function () {
    'use strict';
    // Load countries then initialize plugin:
    $.ajax({
        url: '../../js/jqueryAu/content/countries.txt',
        dataType: 'json'	
    })
    .done(function (source) {
        var countriesArray = $.map(source, function (value, key) { return { value: value, data: key }; }),
            countries = $.map(source, function (value) { return value; });
        
        // Setup jQuery ajax mock:
        $.mockjax({
            url: '*',
            responseTime: 2000,
            response: function (settings) {
        	   if(settings.url =='/js/jqueryAu/content/countries.txt'){
                var query = settings.data.query,
                    queryLowerCase = query.toLowerCase(),
                    re = new RegExp('\\b' + queryLowerCase, 'gi'),
                    suggestions = $.grep(countriesArray, function (country) {
                         // return country.value.toLowerCase().indexOf(queryLowerCase) === 0;
                    	//alert(country.value);
                        return re.test(country.value);
                    }),
                    response = {
                        query: query,
                        suggestions: suggestions
                    };
                this.responseText = JSON.stringify(response);
            }else
            {
            }
        }
        });
        // Initialize ajax autocomplete:
        $('#autocomplete-ajax').autocomplete({
            // serviceUrl: '/autosuggest/service/url',
            lookup: countriesArray,
            lookupFilter: function(suggestion, originalQuery, queryLowerCase) {
                var re = new RegExp('\\b' + queryLowerCase, 'gi');
                return re.test(suggestion.value);
            },
            onSelect: function(suggestion) {
                $('#selction-ajax').html('You selected: ' + suggestion.value + ', ' + suggestion.data);
            },
            onHint: function (hint) {
                $('#autocomplete-ajax-x').val(hint);
            }
        });

        // Initialize autocomplete with local lookup:
        $('#autocomplete').autocomplete({
            lookup: countriesArray,
            onSelect: function (suggestion) {
                $('#selection').html('You selected: ' + suggestion.value + ', ' + suggestion.data);
            }
        });
        
        // Initialize autocomplete with custom appendTo:
        $('#autocomplete-custom-append').autocomplete({
            lookup: countriesArray,
            appendTo: '#suggestions-container'
        });

        // Initialize autocomplete with custom appendTo:
        $('#autocomplete-dynamic').autocomplete({
            lookup: countriesArray
        });
        
    });

});