import React from 'react';
import { Modal, Typography, useTheme } from '@mui/material';

export default function CustomModal({ modalTitleId, title, children }) {
    const theme = useTheme();

    return (
        <>
            <Modal aria-labelledby={modalTitleId}
                sx={{
                    p: '24px',
                    borderRadius: '10px',
                    width: 360,
                }}
            >
                <Typography component="h2" variant="body" id={modalTitleId}>
                    {title}
                </Typography>
                {children}
            </Modal>
        </>
    )
}

