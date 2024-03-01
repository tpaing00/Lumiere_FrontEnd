import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {

    const [tableData, setTableData] = useState([]); // Change this line

    useEffect(() => {
        // Replace the URL with your own API endpoint
        axios.get('http://52.53.91.15:8080/api/v1/inventory')
            .then(response => {
                const data = response.data; // Change this line
                console.log(data);
                setTableData(data); // Change this line
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        console.log(tableData); // Add this line
    }, [tableData]); // Add this line

    console.log(tableData)

    // const renderTableHeader = () => {
    //     // Assuming the first object has all the keys
    //     let header = Object.keys(tableData[0]);
    //     return header.map((key, index) => {
    //         return <th key={index}>{key.toUpperCase()}</th>
    //     });
    // };

    // const renderTableData = () => {
    //     return tableData.map((row, index) => {
    //         let col = Object.keys(row);
    //         return (
    //             <tr key={index}>
    //                 {col.map((val, index) => {
    //                     return <td key={index}>{row[col[index]]}</td>
    //                 })}
    //             </tr>
    //         );
    //     });
    // };

    return (
        <div>
            <h1>Dynamic Table</h1>
            <table>
                <thead>
                    {/* <tr>{renderTableHeader()}</tr> */}
                </thead>
                <tbody>
                    {/* {renderTableData()} */}
                </tbody>
            </table>
        </div>
    );
};

export default ProductList;