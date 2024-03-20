import React , { useEffect, useState } from "react";
import { Link  } from "react-router-dom";
import ProductWastage from './ProductWastage'

const Analytics = () => {
    const [activeComponent, setActiveComponent] = useState('ProductWastage');

    const handleClick = (component) => {
        setActiveComponent(component);
      };
    
  return (
    <>
      <nav>
        <ul>         
          <li>
            <Link to="#" onClick={() => handleClick('ProductWastage')}>Product Wastage</Link>
          </li>
        </ul>
      </nav>
      <div>
      { activeComponent === 'ProductWastage' && <ProductWastage />}
    </div>
    </>
  );
};

export default Analytics;
