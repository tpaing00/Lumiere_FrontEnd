import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DynamicTable = () => {
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        // Replace the URL with your own API endpoint
        axios.get('https://example.com/api/data')
            .then(response => {
                setTableData(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const renderTableHeader = () => {
        // Assuming the first object has all the keys
        let header = Object.keys(tableData[0]);
        return header.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        });
    };

    const renderTableData = () => {
        return tableData.map((row, index) => {
            let col = Object.keys(row);
            return (
                <tr key={index}>
                    {col.map((val, index) => {
                        return <td key={index}>{row[col[index]]}</td>
                    })}
                </tr>
            );
        });
    };

    return (
        <div>
            <h1>Dynamic Table</h1>
            <table>
                <thead>
                    <tr>{renderTableHeader()}</tr>
                </thead>
                <tbody>
                    {renderTableData()}
                </tbody>
            </table>
        </div>
    );
};

export default DynamicTable;