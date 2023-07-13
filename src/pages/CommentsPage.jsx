import { useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CommentsMidBody from "../components/CommentsMidBody";
import ProfileSideBar from "../components/ProfileSideBar";
import { auth } from "../firebase";

export default function CommentsPage() {
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) navigate("/login");
  }, [currentUser, navigate]);

  const handleLogout = () => auth.signOut();
  return (
    <>
      <Container>
        <Row>
          <ProfileSideBar handleLogout={handleLogout} />
          <CommentsMidBody />
        </Row>
      </Container>
    </>
  );
}
