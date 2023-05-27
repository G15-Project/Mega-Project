import { useState } from "react";
import { Button, Col, Container, Form, Row, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from 'axios';

function Add() {
    const [file, setFile] = useState(null);
    var handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        var fr=new FileReader();
        fr.onload = function() {
            axios.post("http://localhost:8000/add/", { title: formData.get("title"), content: fr.result });
            window.location.assign("/");
        }
        fr.readAsText(file);
    }
    return (
        <>
            <Navbar variant="dark">
                <Container fluid="md">
                    <Navbar.Brand href="/" as="div">
                        <Row id="title" className="justify-content-md-center" style={{ margin: "20px" }}></Row>
                    </Navbar.Brand>
                    <Navbar.Text className="justify-content-end">
                        <Col style={{ margin: "20px" }}><Link to="/" style={{ textDecoration: "none" }}><Button>Back</Button></Link></Col>
                    </Navbar.Text>
                </Container>
            </Navbar>
            <Container fluid="md">
                <Row style={{ margin: "20px" }} className="justify-content-md-center">
                    <Form onSubmit={handleSubmit}>
                        <Col>
                            <Form.Group>
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" name="title" placeholder="Enter title" />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label>Upload Content</Form.Label>
                                <Form.Control
                                    type="file"
                                    placeholder="Enter Content"
                                    name="content"
                                    onChange={e => setFile(e.target.files[0])}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Button type="submit" style={{ marginTop: "10px" }}>Add</Button>
                        </Col>
                    </Form>
                </Row>
            </Container>
        </>
    );
}

export default Add;