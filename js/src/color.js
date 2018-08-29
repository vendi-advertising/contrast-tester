/*jslint esversion: 6, maxparams: 4, maxdepth: 4, maxstatements: 20, maxcomplexity: 8 */

import {hex_to_dec} from './utils';

export function luminanace_from_dec(r, g, b)
{
    const
        a = [r, g, b]
                .map(
                    (v) => {
                        v /= 255;
                        if(v <= 0.03928){
                            return v / 12.92;
                        }else{
                            return Math.pow( (v + 0.055) / 1.055, 2.4 );
                        }
                    }
                )
    ;
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function contrast_from_hex(hex1, hex2)
{
    const
        rgb1 = hex_to_dec(hex1),
        rgb2 = hex_to_dec(hex2),
        l1 = luminanace_from_dec(rgb1.r, rgb1.g, rgb1.b) + 0.05,
        l2 = luminanace_from_dec(rgb2.r, rgb2.g, rgb2.b) + 0.05,
        la = l1 > l2 ? l1 : l2,
        lb = l1 > l2 ? l2 : l1
    ;
    return la / lb;
}
