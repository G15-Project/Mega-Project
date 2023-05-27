import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Col, Container, Form, Row, Image, Navbar } from "react-bootstrap";

function Query(props) {
  const [query, setQuery] = useState("");
  const handleDownload = (e) => {
    const link = document.createElement("a");
    const file = new Blob([props.sentences], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = `${query}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
  return (
    <>
      <Navbar variant="dark">
        <Container fluid="md">
          <Navbar.Brand href="/" as="div">
            <Row id="title" className="justify-content-md-center" style={{ margin: "20px" }}></Row>
          </Navbar.Brand>
          <Navbar.Text className="justify-content-end">
            <Col style={{margin: "20px"}}><Link to="/" style={{textDecoration: "none"}}><Button>Back</Button></Link></Col>
          </Navbar.Text>
        </Container>
      </Navbar>
      <Container fluid="md">
        <Row>
          <Form onSubmit={e => e.preventDefault()} id="form">
            <Col style={{margin: "20px"}}>
              <Form.Group>
                <Form.Label>Query</Form.Label>
                <Form.Control type="text" name="text" onChange={e => setQuery(e.target.value)} />
              </Form.Group>
            </Col>
            <Col style={{margin: "20px"}}>
              <Form.Group>
                <Button variant="outline-primary" onClick={e => {props.calculate(query); document.getElementById("graph").hidden=false;}}>Calculate</Button>
              </Form.Group>
            </Col>
          </Form>
        </Row>
        <Row>
          <Col style={{margin: "20px"}}><Form.Control as="textarea" name="text" value={props.sentences} disabled/></Col>
        </Row>
        <Row>
          <Col style={{margin: "20px"}}><Button variant="outline-primary" onClick={e => handleDownload(e)}>Download</Button></Col>
        </Row>
        <Row>
          <Col style={{margin: "20px"}}><Form.Control as="textarea" rows={6} name="text" value={props.calculated} disabled/></Col>
        </Row>
        <Row>
          <Col style={{margin: "20px"}}><Image src={`data:image/jpg;base64,${props.graph}`} id="graph" alt="Graph" hidden /></Col>
        </Row>
      </Container>
    </>
  );
}

export default Query;
