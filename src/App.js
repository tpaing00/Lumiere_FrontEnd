import React from 'react';
import Subtitle from './Subtitle'

const App = props => {
    return(
        <>
            <h1>{props.title}</h1>
            <Subtitle subtitle={props.subtitle} underline={true}/>
        </>
    );
}

export default App;