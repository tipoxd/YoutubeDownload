import React from 'react';

const Imagen = (props) => {
     
    const { Src, Alt, ClassName } = props;
    return (
        <img src={Src} alt={Alt} className={ClassName} />
    );
}

export default Imagen;
