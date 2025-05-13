import React from 'react';

const CityInput = ({ city, setCity }) => (
  <div className="input">
    <label htmlFor="city">Enter City:</label>
    <input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} />
  </div>
);

export default CityInput;