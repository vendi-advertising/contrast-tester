/*jslint esversion: 6, maxparams: 5, maxdepth: 4, maxstatements: 20, maxcomplexity: 8 */

function _createEvent( name, details )
{
    details = details || {};

    return new window.CustomEvent( name, { detail: details } );
}

export function triggerEvent( name, details )
{
    const
        event = _createEvent( name, details )
    ;

    if( ! event ) {
        return;
    }

    window.dispatchEvent( event );
}
