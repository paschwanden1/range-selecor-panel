/**
 * Created by paschwanden on 1/6/16.
 */
$.fn.RangeSelectorPanel = function( parameters ) {

    var default_params = {
        selected: function(d) {
            console.dir(d);
        },
        initial: [{
            tag: '',
            weight: 50
        }],
        min: 0,
        max: 100
    };

    var params = $.extend({}, default_params, parameters );

    var row = function( tag, weight ) {
        return '<div class="range_panel_row">' +
            '<input type="text" class="tag" value="' + tag + '"/>' +
            '<input type="number" class="weight" value="' + weight + '"/>' +
            '<input type="range" min="' + params.min + '" max="' + params.max + '" value="' + weight + '"/>' +
            '<div class="add btn btn-success">+</div>' +
            '<div class="remove btn btn-success">X</div>' +
            '</div>';
    };

    var get_result = function(range_panel) {

        var result = [];

        $(range_panel).find('.range_panel_row').each( function( index, el ) {

            result[index] = {
                tag: $(el).find('.tag').val(),
                weight: $(el).find('input[type=range]').val()
            }
        });

        return result;
    };

    var selected = function(range_panel, that) {

        var val = that.val();

        that.parent().find('input.weight').val( val );

        params.selected( get_result(range_panel), range_panel.parent() );
    };

    var bind = function(range_panel) {

        $(range_panel).find('.add').off('click').on('click', function() {
            $(row('', 50)).insertAfter($(this).parent());
            bind(range_panel);
        });

        $(range_panel).find('.remove').off('click').on('click', function() {
            if( $(range_panel).find('.remove').length > 1 ) {
                $(this).parent().remove();
                params.deleted( get_result(range_panel), range_panel.parent() );
            }
        });

        $(range_panel).find('input[type=range]').off('mouseup').on('mouseup', function mouseup() {
            selected(range_panel, $(this));
        })
            .off('keyup').on('keyup', function() {
            selected(range_panel, $(this));
        });

        $(range_panel).find('.tag').off('blur').on('blur', function() {
            params.onblur( get_result(range_panel), range_panel.parent() );
        });

        $(range_panel).find('input.weight').off('input').on('input', function() {

            var val = $(this).val();
            if( val > params.max ) {
                val = params.max;
                $(this).val(val);
            }

            if( val < params.min ) {
                val = params.min;
                $(this).val(val);
            }

            $(this).parent().find('input[type=range]').val(val);
        });
    };

    return $(this).each( function() {

        var initial = params.initial;

        for( var x in initial ) {
            $(this).append(row(initial[x].tag, initial[x].weight));
            bind($(this));
        }
    });
};
