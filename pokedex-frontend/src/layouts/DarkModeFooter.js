import React from 'react';
import PropTypes from 'prop-types';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import '../styles.css';
function DarkModeFooter({toggleOptions,
                         displayMode,
                         handleDisplayModeChange}){
    return (
        <div className='display-mode-footer'>
            <Typography className='toggle-option'>{toggleOptions[1]}</Typography>
            <Switch
                edge="end"
                size="small"
                color="primary"
                checked={displayMode === toggleOptions[0]}
                onChange={handleDisplayModeChange}
                className="toggle-button"
                inputProps={{ 'aria-label': 'darkModeFooter' }}
            />
            <Typography className='toggle-option'>{toggleOptions[0]}</Typography>
        </div>
    );
}

DarkModeFooter.propTypes = {
    toggleOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
    handleDisplayModeChange: PropTypes.func.isRequired,
    displayMode: PropTypes.string.isRequired,
    theme: PropTypes.object,
};

export default DarkModeFooter;