import { useState } from "react";
import { Button, Col, Container, Form, Row, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

function Main(props) {
  const [textIndex, setTextIndex] = useState(0);
  return (
    <>
      <Navbar variant="dark">
        <Container fluid="md">
          <Navbar.Brand href="/" as="div">
            <Row id="title" className="justify-content-md-center" style={{ margin: "20px" }}></Row>
          </Navbar.Brand>
          <Navbar.Text className="justify-content-end">
            <Button variant="outline-primary" style={{margin: "20px"}} onClick={e => {window.location.assign("/add")}}>Add</Button>
          </Navbar.Text>
        </Container>
      </Navbar>
      <Container fluid="md">
        <Row>
          <Form id="form">
            <Col style={{margin: "20px"}}>
              <Form.Group>
                <Form.Label>Choose Dataset</Form.Label>
                <Form.Select aria-label="Choose Dataset" onChange={e => setTextIndex(e.target.value)}>
                  {props.titles.map((element, index) => {
                    return <option value={index}>{element}</option>
                  })}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col style={{margin: "20px"}}>
              <Form.Group>
                <Button variant="outline-primary" onClick={async e => {await props.getText(textIndex); props.setHasSelected(true);}}>Choose</Button>
              </Form.Group>
            </Col>
            <Col style={{margin: "20px"}}>
              <Form.Group>
                <Form.Label>Dataset</Form.Label>
                <Form.Control as="textarea" name="text" value={props.text} disabled />
              </Form.Group>
            </Col>
            <Col style={{margin: "20px"}}>
              <Form.Group>
                {props.hasSelected ? <Button variant="outline-primary" onClick={async e => {await props.preprocessing(); props.setHasClusteredDataset(true);}}>Preprocess</Button> : <Button variant="outline-primary" disabled>Cluster</Button>}
              </Form.Group>
            </Col>
          </Form>
        </Row>
        <Row>
          <Col style={{margin: "20px"}}><Form.Control as="textarea" name="text" value={props.clusteredText} disabled/></Col>
        </Row>
        <Row>
            <Col style={{margin: "20px"}}>{props.hasSelected && props.hasClusteredDataset ? <Link to="/query" style={{textDecoration: "none"}}><Button>Next</Button></Link> : <Button disabled>Next</Button>}</Col>
        </Row>
      </Container>
    </>
  );
}

export default Main;
