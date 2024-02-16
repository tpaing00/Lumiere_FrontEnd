import React from 'react';

const Subtitle = props => {
    let underlineStyle = {
        //text-decoratiom: underline
        textDecoration: "underline"
    }
      
    return(
        <>
            <div className="subtitle" style={props.underline ? underlineStyle : {}}>{props.subtitle}</div>
        </>
    );
}

export default Subtitle;