// import node module libraries
import { Col, Row, Card } from "react-bootstrap";

const Version_01_00_00 = () => {
  return (
    <Row>
      <Col lg={7} md={12} sm={12}>
        <Card>
          <Card.Body>
            <Row className="g-0">
              <Col lg={3} md={4} sm={12}>
                <div id="initial">
                  <h5 className="mb-3 fwsemi--bold">
                    <code>v1.0.0</code> - April 20, 2023
                  </h5>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Version_01_00_00;
