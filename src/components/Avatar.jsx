import React from 'react';

const Avatar = (props) => {

    const { Src, Alt, Title } = props;
    return (
        <div className="avatar">
            <div className="w-24 rounded-full">
                <img src={'https://unavatar.io/youtube/' + Src} alt={Alt} title={Title} />
            </div>
        </div>
    );
}

export default Avatar;
