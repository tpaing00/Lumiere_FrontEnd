import React from 'react';
import { Select, MenuItem, useTheme } from '@mui/material';

export default function CustomSelect({ id, name, labelText, value, onChangeFunction, optionsArrayName }) {
    const theme = useTheme();

    return (
        <>
            <InputLabel variant="standard" id={`${id}-label`} >
                {labelText}
            </InputLabel>
            <Select
                className="dropdown"
                id={id}
                name={name}
                value={value}
                onChange={onChangeFunction}
                fullWidth
            >
                {optionsArrayName.map((type) => (
                    <MenuItem
                        key={type.value}
                        value={type.value}
                        fullWidth
                    >
                        {type.label}
                    </MenuItem>
                ))}
            </Select>

        </>
    )
}

