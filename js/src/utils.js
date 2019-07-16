/*jslint esversion: 6, maxparams: 4, maxdepth: 4, maxstatements: 20, maxcomplexity: 8 */

export function create_dom_element_with_class(tag, classes = [])
{
    const
        ele = document.createElement(tag),
        all_classes = Array.isArray(classes) ? classes : [classes]
    ;

    ele.classList.add(...all_classes);

    return ele;
}

export function merge_and_dedupe_arrays(arr)
{
    //https://stackoverflow.com/a/27664971/231316
    return [...new Set([].concat(...arr))];
}

export function format_decimal(num, places = 2)
{
    const
        p = Math.pow(10, places)
    ;
    return parseFloat(Math.round(num * p) / p).toFixed(places);
}

export function componentToHex(c)
{
    const
        hex = c.toString(16)
    ;

    return hex.length == 1 ? "0" + hex : hex;
}

export function dec_to_hex(r, g, b)
{
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function hex_to_dec(hex)
{
    const
        result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    ;

    if(!result){
        return null;
    }

    return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    };
}

export function trimCharLeft(string, charToRemove)
{
    if(!string || typeof string !== 'string'){
        return '';
    }

    while(string.charAt(0)==charToRemove) {
        string = string.substring(1);
    }

    return string;
}

export function querySelectorParent(el, selector, stopSelector)
{
    let
        retval = null
    ;

    while (el) {
        if (el.matches(selector)) {
            retval = el;
            break;
        } else if (stopSelector && el.matches(stopSelector)) {
            break;
        }

        el = el.parentElement;
    }

    return retval;
}
