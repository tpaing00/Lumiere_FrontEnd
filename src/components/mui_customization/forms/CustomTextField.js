import React from 'react';
import { InputLabel, TextField, useTheme } from '@mui/material';

export default function CustomTextField({ id, name, labelText, placeholder, value, onChangeFunction }) {
    const theme = useTheme();

    return (
        <>
            <InputLabel variant="standard" id={`${id}-label`} sx={{mt: '16px'}} >
                {labelText}
            </InputLabel>
            <TextField
                className='TextField'
                id={id}
                name={name}
                placeholder={onChangeFunction}
                value={value}
                onChange={onChange}
                fullWidth
            />

        </>
    )
}

