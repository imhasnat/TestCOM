import React from "react";
import Card from "react-bootstrap/Card";
import "./info-card.css";

const InfoComponent = () => {
  return (
    <Card className="info-card bg-info p-3 rounded-0">
      <h5 className="info-title mb-3 text-white">Form Instructions</h5>
      <ul className="info-list text-white">
        <li>Please select the appropriate store and brand.</li>
        <li>Ensure all fields are filled out accurately.</li>
        <li>Use the “Next” button to proceed to additional steps.</li>
      </ul>
    </Card>
  );
};

export default InfoComponent;
