import { useState } from "react";
import { Button, Col, Form, Image, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function CommentsMidBody() {
  const pic =
    "https://pbs.twimg.com/profile_images/1587405892437221376/h167Jlb2_400x400.jpg";

  const [textValue, setTextValue] = useState("");

  const onTextChange = (event) => {
    setTextValue(event.target.value);
  };

  const navigate = useNavigate();

  return (
    <Col sm={6} className="bg-light" style={{ border: "1px solid lightgrey" }}>
      <div className="d-flex align-items-center mb-4">
        <Button variant="light" onClick={() => navigate("/profile")}>
          <i className="bi bi-arrow-left"></i>
        </Button>
        <p className="m-0 ms-3">Tweet</p>
      </div>

      <Row>
        <Col sm={1}>
          <Image src={pic} fluid roundedCircle />
        </Col>
        <Col>
          <p style={{ margin: 0 }}>Haris</p>
          <p>@TheHappyHaris</p>
        </Col>
      </Row>
      <p>
        How @Replit can be a good alternative for coding editor is to have
        extensions for code shortcuts
      </p>
      <p>6:28 PM · May 16, 2023 · 69 Views</p>

      <hr />

      <div className="d-flex justify-content-around">
        <Button variant="light">
          <i className="bi bi-chat"></i>
        </Button>
        <Button variant="light">
          <i className="bi bi-repeat"></i>
        </Button>

        <Button variant="light">
          <i className="bi bi-heart"></i>
        </Button>
        <Button variant="light">
          <i className="bi bi-bookmark"></i>
        </Button>
        <Button variant="light">
          <i className="bi bi-upload"></i>
        </Button>
      </div>

      <hr />
      <Row className="mb-3">
        <Col sm={1}>
          <Image src={pic} fluid roundedCircle />
        </Col>
        <Col>
          <Form.Control
            as="textarea"
            rows={3}
            value={textValue}
            onChange={onTextChange}
            className="bg-light"
            style={{ border: "none" }}
            placeholder="Tweet your reply!"
          />
          <div className="d-flex justify-content-end mt-3">
            <Button disabled={!textValue}>Reply</Button>
          </div>
        </Col>
      </Row>
    </Col>
  );
}
