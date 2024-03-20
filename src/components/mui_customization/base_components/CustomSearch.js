import React from 'react';
import { IconButton, InputAdornment, InputLabel, SvgIcon, TextField, useTheme } from '@mui/material';
import IconSearch from '../../icons/Search';

export default function CustomSearch({ id, name, labelText, value, placeholder, onClick, onChange }) {
    const theme = useTheme();

    return (
        <>
            <TextField
                aria-label={labelText}
                id={id}
                name={name}
                value={value}
                fullWidth
                placeholder={placeholder}
                onChange={onChange}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={onClick}
                            >
                                <IconSearch />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

        </>
    )
}

