"use strict";

var hex_radius = 16.5;
var hex_y_offset = 90.0; // of hexes E1, F1, G1, H1, I1
var hex_x_offset = 30.0; // of hex A5
var hex_x_incr = 30.0;
var hex_y_incr = Math.sqrt(3.0) / 2.0 * hex_x_incr;

// littlegolem colors
var fill_empty = "#E5E5E5";
var fill_black = "#3685AA";
var fill_white = "#FFBE5C";
var fill_black_highlight = "#0055AA";
var fill_white_highlight = "#FF9900";

var S = 5;
var B = 2*S + 1;
var c_r = S, c_c = S;
var board_mask;
var board_hex;

function init_board()
{
    // board
    board_mask = [];
    board_hex = [];
    for (var r = 0; r < B; ++r) {
        board_mask[r] = [];
        board_hex[r] = [];
        for (var c = 0; c < B; ++c) {
            board_mask[r][c] = (
                c_r - r < S &&
                r - c_r < S &&
                c_c - c < S &&
                c - c_c < S &&
                (c_r - r) + (c_c - c) < S &&
                (r - c_r) + (c - c_c) < S);

            if (board_mask[r][c]) {
                // http://stackoverflow.com/a/3642265
                var hex = $( document.createElementNS('http://www.w3.org/2000/svg', 'polygon') );

                var points = '';
                for (var i = 0; i < 6; ++i) {
                    var theta = i * Math.PI / 3;
                    var x = hex_x_offset + hex_x_incr * (c - 1) + 0.5 * hex_x_incr * (r - 5);
                    var y = hex_y_offset + hex_y_incr * (r - 1);
                    x += hex_radius * Math.sin(theta);
                    y -= hex_radius * Math.cos(theta);

                    points += x.toFixed(2) + ',' + y.toFixed(2) + ' ';
                }
                hex.attr('points', points);
                hex.attr('fill', fill_empty);

                $('#board').append(hex);
                board_hex[r][c] = hex;

                hex.attr('class', 'hex'); // addClass doesn't seem to work within SVG
                hex.data('r', r);
                hex.data('c', c);
            }
        }
    }

    $('#board').on('click', '.hex', on_click_hex);
    
    // settings
    $('#settings').on('change', on_settings_change);
    on_settings_change();
}

function display_score(score)
{
    var names = ["Blue", "Orange"];
    console.assert(score.length == 2);
    var $score = $('.score');
    console.assert($score.length == 2);
    for (var p = 0; p < 2; ++p) {
        var score_str = score[p].join('-');
        var score_text = names[p] + ': ' + score_str;
        if (score[p].length == 0) score_text = '';
        $score.eq(p).text(score_text);
    }
}

function display_moves(moves)
{
    $('#moves').text(moves);
}

function current_fill()
{
    var ret;
    if (active_player == BLACK) {
        ret = highlight ? fill_black_highlight : fill_black;
    } else if (active_player == WHITE) {
        ret = highlight ? fill_white_highlight : fill_white;
    } else {
        console.assert(active_player == EMPTY);
        ret = fill_empty;
    }
    return ret;
}

function refresh_hex(hex)
{
    if (hex.attr('fill') == current_fill()) {
        hex.css('cursor', '');
    } else {
        hex.css('cursor', 'pointer');
    }
}

function on_click_hex(e)
{
    var hex = $(this);
    var r = hex.data('r'), c = hex.data('c');

    var hex = board_hex[r][c];
    hex.attr('fill', current_fill());
    refresh_hex(hex);
}

var BLACK = 0, WHITE = 1, EMPTY = 2;
var active_player = BLACK;
var parse_player = {
    'black': BLACK,
    'white': WHITE,
    'empty': EMPTY,
};
var highlight = false;
function on_settings_change()
{
    active_player = parse_player[ $('#settings').find('[name="player"]:checked').val() ];
    highlight = $('#settings').find('[name="highlight"]:checked').length == 1;

    var ckbox = $('#settings').find('[name="highlight"]');
    var disable_ckbox = active_player == EMPTY;
    ckbox.prop('disabled', disable_ckbox);

    // update cursors
    for (var r = 0; r < B; ++r) {
        for (var c = 0; c < B; ++c) {
            if (board_mask[r][c]) {
                var hex = board_hex[r][c];
                refresh_hex(hex);
            }
        }
    }
}

init_board();

// TODO: Calculate score.
//display_score([ [8, 6, 1, 1, 1, 1, 1, 1, 1], [9, 5, 2, 1, 1, 1, 1] ]);
display_score([ [], [] ]);

// TODO: Show appropriate move count.
//display_moves(2);
display_moves('');
