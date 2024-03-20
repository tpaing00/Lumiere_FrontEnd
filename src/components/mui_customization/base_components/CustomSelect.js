import React from 'react';
import { InputLabel, MenuItem, Select, useTheme } from '@mui/material';

export default function CustomSelect({ id, name, labelText, value, array }) {
    const theme = useTheme();

    return (
        <>
            <InputLabel variant="standard" id={`${id}-label`} >
                {labelText}
            </InputLabel>
            <Select
                aria-label={labelText}
                className="dropdown"
                id={id}
                name={name}
                value={value}
                fullWidth
            >
                {array.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                        {type.label}
                    </MenuItem>
                ))}
            </Select>

        </>
    )
}

