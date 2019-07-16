/*jslint white: true, browser: true, plusplus: true, esversion: 6*/

import {dec_to_hex, hex_to_dec, querySelectorParent, trimCharLeft, create_dom_element_with_class} from './utils';
import {triggerEvent} from  './event-handler';
import Picker from 'vanilla-picker';

import '../../css/src/000-vars.css';
import '../../css/src/100-main.css';
import '../../css/src/300-color-input-table.css';
import '../../css/src/400-color-row-buttons.css';
import '../../css/src/500-grid.css';

(function(window, document)
{

    'use strict';

    let
        color_idx = 0,
        idx_for_single_color_ids = 0
    ;

    const

        default_colors = [
            {
                name: 'Black',
                color_hex: '000000'
            },
            {
                name: 'White',
                color_hex: 'ffffff'
            }
        ],

        user_colors = [

        ],

        handle_add = function(button)
        {
            const
                cont = querySelectorParent(button, 'tbody'),
                new_row = create_color_row()
            ;

            cont.appendChild(new_row);

            triggerEvent('DRAW_GRID', { cont });
        },

        handle_delete = function(button)
        {
            const
                row = querySelectorParent(button, 'tr'),
                cont = querySelectorParent(button, 'tbody')
            ;

            row.remove();

            console.dir(cont.querySelectorAll('tr'));

            if(0 === cont.querySelectorAll('tr').length){
                cont.appendChild(create_color_row());
            }

            triggerEvent('DRAW_GRID', { cont });
        },

        set_row_color_by_hex = function(row, hex)
        {
            const
                dec = hex_to_dec(hex)
            ;

            row
                .querySelectorAll('input[data-type=color-as-color], input[data-type=color-as-hex]')
                .forEach(
                    (input) => {
                        input.value = '#' + trimCharLeft(hex, '#');
                    }
                )
            ;

            row
                .querySelectorAll('input[type=number][data-type=color-as-decimal]')
                .forEach(
                    (input) => {
                        switch(input.getAttribute('data-color-component')){
                            case 'r':
                            case 'g':
                            case 'b':
                                input.value = dec[input.getAttribute('data-color-component')];
                                return;
                        }

                        throw 'Unknown color component';
                    }
                )
            ;
        },

        handle_color_change = function(source)
        {
            const
                row = querySelectorParent(source, 'tr'),
                cont = querySelectorParent(row, 'tbody')
            ;

            if(!row){
                throw 'Could not find parent row!!!';
            }

            if(row.hasAttribute('data-color-change-event-already-handled')){
                console.log('Skipping event because it is non-primary');
                return;
            }

            row.setAttribute('data-color-change-event-already-handled', true);

            if(!source.hasAttribute('data-type')){
                throw 'Source does not have a data-type set';
            }

            switch(source.getAttribute('data-type')){
                case 'color-as-hex':
                case 'color-as-color':
                    set_row_color_by_hex(row, source.value);
                    break;

                case 'color-as-decimal':
                    const
                        inputs = row.querySelectorAll('input[type=number][data-type=color-as-decimal]'),
                        obj = {
                            r: 0,
                            g: 0,
                            b: 0,
                        }
                    ;

                    inputs
                        .forEach(
                            (input) => {
                                switch(input.getAttribute('data-color-component')){
                                    case 'r':
                                    case 'g':
                                    case 'b':
                                        obj[input.getAttribute('data-color-component')] = parseInt(input.value, 10) || 0;
                                        return;
                                }

                                throw 'Unknown color component on source';
                            }
                        )
                    ;
                    set_row_color_by_hex(row, dec_to_hex(obj.r, obj.g, obj.b));
                    break;

                default:
                    console.warn('Unhandled color type:' + source.getAttribute('data-type'));
                    console.dir(source);
            }


            row.removeAttribute('data-color-change-event-already-handled');
            triggerEvent('DRAW_GRID', { cont });
        },

        create_single_color_row_button_in_container = function(action, label, func)
        {
            const
                li = document.createElement('li'),
                button = document.createElement('button')
            ;

            button.appendChild(document.createTextNode(label));
            button.setAttribute('data-action', action);
            button
                .addEventListener(
                    'click',
                    (event) => {
                        event.preventDefault();

                        func(button);
                    }
                )
            ;

            li.appendChild(button);

            return li;
        },

        create_color_row_buttons = function()
        {
            const
                cont = document.createElement('ul')
            ;

            cont.classList.add('color-row-buttons');

            cont
                .appendChild(
                    create_single_color_row_button_in_container(
                        'delete',
                        'Delete',
                        handle_delete
                    )
                );

            cont
                .appendChild(
                    create_single_color_row_button_in_container(
                        'add',
                        'Add',
                        handle_add
                    )
                );

            return cont;
        },

        create_label_cell = function(row_idx)
        {
            const
                cell = document.createElement('td'),
                lbl = document.createElement('label')
            ;

            lbl.appendChild(document.createTextNode('Color #' + row_idx));
            lbl.setAttribute('for', 'txt-idx-' + row_idx);
            cell.appendChild(lbl);

            return cell;
        },

        create_color_widget_cell = function(row_idx)
        {
            const
                cell = document.createElement('td'),
                clr = document.createElement('input')
            ;

            clr.setAttribute('name', 'color-idx-' + row_idx);
            clr.setAttribute('id',   'color-idx-' + row_idx);
            // clr.setAttribute('type', 'color');
            clr.setAttribute('data-type', 'color-as-color');
            clr.addEventListener('click', () => {
                var picker = new Picker({
                    parent: cell, alpha: false,
});
                picker.onChange = (color) => {
                    clr.value = color.printHex();
                }
                picker.show();
            })
            clr.addEventListener('change', ()=>{handle_color_change(clr);});
            cell.appendChild(clr);

            return cell;
        },

        create_hex_cell = function(row_idx)
        {
            const
                cell = document.createElement('td'),
                txt = document.createElement('input')
            ;

            txt.setAttribute('name', 'txt-idx-' + row_idx);
            txt.setAttribute('id',   'txt-idx-' + row_idx);
            txt.setAttribute('type', 'text');
            txt.setAttribute('data-type', 'color-as-hex');
            txt.addEventListener('change', ()=>{handle_color_change(txt);});
            cell.appendChild(txt);

            return cell;
        },

        create_decimal_cell = function(row_idx)
        {
            const
                cell = document.createElement('td'),
                types = ['R', 'G', 'B']
            ;

            types
                .forEach(
                    (t) => {
                        const
                            txt = document.createElement('input'),
                            lbl = document.createElement('label')
                        ;

                        lbl.appendChild(document.createTextNode(t));

                        txt.setAttribute('name', 'txt-row-' + row_idx + '-dec-' + t.toLowerCase());
                        txt.setAttribute('data-type', 'color-as-decimal');
                        txt.setAttribute('data-color-component', t.toLowerCase());
                        txt.setAttribute('type', 'number');
                        txt.setAttribute('min', '0');
                        txt.setAttribute('max', '255');
                        txt.setAttribute('step', '1');
                        txt.addEventListener('change', ()=>{handle_color_change(txt);});
                        lbl.appendChild(txt);
                        cell.appendChild(lbl);
                    }
                )
            ;

            return cell;
        },

        create_button_cell = function(row_idx)
        {
            const
                cell = document.createElement('td')
            ;

            cell.appendChild(create_color_row_buttons());

            return cell;
        },

        create_color_row = function()
        {
            const
                row_idx = ++color_idx,
                row = document.createElement('tr')
            ;

            row.setAttribute('data-row-idx', row_idx);

            row.appendChild(create_label_cell(row_idx));
            row.appendChild(create_color_widget_cell(row_idx));
            row.appendChild(create_hex_cell(row_idx));
            row.appendChild(create_decimal_cell(row_idx));
            row.appendChild(create_button_cell(row_idx));

            set_row_color_by_hex(row, '#000000');

            return row;
        },

        create_simple_td_with_text = function(text)
        {
            const
                td = document.createElement('td')
            ;

            td.appendChild(document.createTextNode(text || ''));

            return td;
        },

        create_single_label_block = (color_info) => {
            const
                block = create_dom_element_with_class('div', 'swatch-holder'),
                input = document.createElement('input'),
                label = document.createElement('label'),
                idx = ++idx_for_single_color_ids,
                id = `color-label-${idx}`
            ;

            input.type = 'text';
            input.id = id;
            input.value = color_info.name;

            label.setAttribute('for', id);
            label.appendChild(document.createTextNode('Color descriptive name'));

            block.appendChild(input);
            block.appendChild(label);

            return block;
        },

        create_color_block = function(color_info)
        {
            const
                single_color_block = create_dom_element_with_class('div', 'single-color-block'),
                swatch = create_dom_element_with_class('div', 'swatch-holder'),
                label = create_single_label_block(color_info),
                color = create_dom_element_with_class('div', 'color-holder')
            ;

            single_color_block.classList.add('single-color-block');
            single_color_block.appendChild(swatch);
            single_color_block.appendChild(label);
            single_color_block.appendChild(color);

            return single_color_block;
        },

        create_color_maker = function()
        {
            const
                cont = create_dom_element_with_class('div', 'color-input-table')
            ;
            default_colors
                .forEach( color_info => cont.appendChild(create_color_block(color_info)) )
            ;
            cont.setAttribute('data-color-count', default_colors.length);
            return cont;
        },

        load = function()
        {
            document.body.appendChild(create_color_maker());
        },

        init = function()
        {
            window
                .addEventListener(
                    'DOMContentLoaded',
                    () => {
                        load();
                    }
                )
            ;
        }

    ;

    init();
}
(window, document));
