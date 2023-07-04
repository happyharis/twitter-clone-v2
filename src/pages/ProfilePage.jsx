import { Button, Container, Navbar } from "react-bootstrap";

export default function ProfilePage() {
  const handleLogout = () => {};
  return (
    <>
      <Navbar bg="light">
        <Container>
          <Navbar.Brand href="/">
            <i
              className="bi bi-twitter"
              style={{ fontSize: 30, color: "dodgerblue" }}
            ></i>
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Button onClick={handleLogout}>Logout</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mt-3">
        <h2> Your profile </h2>
      </Container>
    </>
  );
}