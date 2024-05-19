import React, {Component} from 'react';

export default class Loader extends Component{

    render(){
        return(
            <div style={{'position': 'fixed', 'backgroundColor': 'rgba(210, 210, 210, 0.62)',
            'height': '100%',
            'top': '0px',
            'width': '100%',
            'zIndex': '10000000',
            'color': '#3262a2e',
            'left': '0px',
            'bottom': '0px',
            'right': '0px',
            'margin': '0px auto'}}>
            <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>
        );
    }
}