/*jslint white: true, browser: true, plusplus: true, esversion: 6*/

import {format_decimal, merge_and_dedupe_arrays} from './utils';
import {contrast_from_hex} from './color';

import '../../css/src/000-vars.css';
import '../../css/src/100-main.css';
import '../../css/src/400-color-row-buttons.css';
import '../../css/src/500-grid.css';

(function(window, document)
{

    'use strict';

    let
        color_idx = 0
    ;

    const

        are_two_colors_too_close_to_tell = function (color1, color2) {
            return contrast_from_hex(color1, color2) < 1.1;
        },

        draw_grid = function(event_details)
        {
            const
                tbody = event_details.detail.cont
            ;

            let
                grid = document.querySelector('[data-role=color-contrast-grid]')
            ;

            if(grid){
                grid.remove();
            }

            grid = document.createElement('div');
            grid.setAttribute('data-role', 'color-contrast-grid');

            const
                colors = tbody.querySelectorAll('input[type=color]'),

                //Convert to array and grab hex codes only
                actual_colors_base = [...colors]
                    .map(
                        (c) => {
                            return c.value.toLowerCase();
                        }
                ),

                always_colors = [
                    '#ffffff',
                    '#000000',
                ],

                actual_colors = merge_and_dedupe_arrays( [ actual_colors_base, always_colors ] ),

                color_top_row = document.createElement('div')
            ;

            color_top_row.classList.add('top-row');

            color_top_row.appendChild(create_single_cell_with_text());

            actual_colors
                .forEach(
                    (color) => {
                        const
                            td_for_color = create_single_cell_with_text(color.toUpperCase())
                        ;

                        color_top_row.appendChild(td_for_color);
                    }
                )
            ;

            grid.appendChild(color_top_row);

            actual_colors
                .forEach(
                    (color1) => {
                        const
                            row = create_single_row(),
                            td_for_color = create_single_cell_with_text(),
                            td_for_text = create_single_cell_with_text(color1.toUpperCase())
                        ;

                        td_for_color.style.backgroundColor = color1;
                        row.appendChild(td_for_color);
                        row.appendChild(td_for_text);

                        actual_colors
                            .forEach(
                                (color2) => {
                                    const

                                        outer_td = create_single_cell_with_text(),
                                        value = format_decimal(contrast_from_hex(color1, color2)),
                                        td_c = create_single_cell_with_text('Text')
                                    ;

                                    if (value >= 4.5) {
                                        // td_c.innerHTML =
                                    }

                                    if(value >= 4.5){
                                        td_c.classList.add('aa-pass');
                                    }else if(value >= 3){
                                        td_c.classList.add('aa-warn');
                                    }else{
                                        td_c.classList.add('aa-fail');
                                    }

                                    if(value >= 7){
                                        td_c.classList.add('aaa-pass');
                                    }else if(value >= 4.5){
                                        td_c.classList.add('aaa-warn');
                                    }else{
                                        td_c.classList.add('aaa-fail');
                                    }

                                    outer_td.appendChild(td_c);

                                    row.appendChild(outer_td);
                                }
                            )
                        ;

                        grid.appendChild(row);
                    }
                )
            ;

            document.body.appendChild(grid);

        },

        create_single_row = function() {
            const
                row = document.createElement('div')
            ;

            row.classList.add('row');
            return row;
        },

        create_single_cell_with_text = function(text)
        {
            const
                cell = document.createElement('div')
            ;

            cell.appendChild(document.createTextNode(text || ''));

            return cell;
        },

        init = function()
        {
            window
                .addEventListener(
                    'DRAW_GRID',
                    (options) => {
                        draw_grid(options);
                    }
                )
            ;
        }

    ;

    init();
}
(window, document));
