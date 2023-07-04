import { Col, Image } from "react-bootstrap";

export default function ProfileMidBody() {
  const url =
    "https://pbs.twimg.com/profile_banners/83072625/1602845571/1500x500";
  return (
    <Col sm={6}>
      <Image src={url} fluid />
    </Col>
  );
}
