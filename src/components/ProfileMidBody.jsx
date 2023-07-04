import { Button, Col, Image, Nav } from "react-bootstrap";
import ProfilePostCard from "./ProfilePostCard";

export default function ProfileMidBody() {
  const url =
    "https://pbs.twimg.com/profile_banners/83072625/1602845571/1500x500";
  const pic =
    "https://pbs.twimg.com/profile_images/1587405892437221376/h167Jlb2_400x400.jpg";
  return (
    <Col sm={6} className="bg-light" style={{ border: "1px solid lightgrey" }}>
      <Image src={url} fluid />
      <br />
      <Image
        src={pic}
        roundedCircle
        style={{
          width: 150,
          position: "absolute",
          top: "140px",
          border: "4px solid #F8F9FA",
          marginLeft: 15,
        }}
      />

      <Button className="rounded-pill" variant="outline-secondary">
        Edit Profile
      </Button>
      <p className="mt-5">Haris</p>
      <p>@haris.samingan</p>
      <p>
        I help people switch careers to be a software developer at
        sigmaschool.co
      </p>
      <p> Entrepreneur</p>
      <p> 271 Following 610 Followers</p>
      <Nav variant="underline" defaultActiveKey="/home">
        <Nav.Item>
          <Nav.Link eventKey="/home">Tweets</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-1">Replies</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-2">Highlights</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-2">Media</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-2">Likes</Nav.Link>
        </Nav.Item>
      </Nav>
      <ProfilePostCard />
    </Col>
  );
}
