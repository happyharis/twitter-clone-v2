import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, Col, Form, Image, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase";
import ProfilePostCard from "./ProfilePostCard";

export default function CommentsMidBody() {
  const pic =
    "https://pbs.twimg.com/profile_images/1587405892437221376/h167Jlb2_400x400.jpg";

  const [comments, setComments] = useState([]);
  const [post, setPost] = useState({ content: "loading", imageUrl: "" });

  const [text, setText] = useState("");
  const uid = auth.currentUser.uid;

  const onTextChange = (event) => {
    setText(event.target.value);
  };

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    async function getComments() {
      try {
        const commentsQuery = query(
          collection(db, `users/${uid}/posts`),
          where("parentPostId", "==", id)
        );
        const commentsSnapshot = await getDocs(commentsQuery);
        const commentsList = commentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(commentsList);
        console.log(commentsList);
      } catch (error) {
        console.error(error);
      }
    }
    getComments();
  }, [uid, id]);

  useEffect(() => {
    async function getPost() {
      const postDocument = await getDoc(doc(db, `users/${uid}/posts/${id}`));
      const post = postDocument.data();
      setPost(post);
    }
    getPost();
  }, [uid, id]);

  async function addComment() {
    const postsRef = collection(db, `users/${uid}/posts`);
    await addDoc(postsRef, {
      content: text,
      parentPostId: id,
      imageUrl: "",
      likes: [],
      isComment: true,
    });
    setText("");
  }

  return (
    <Col sm={6} className="bg-light" style={{ border: "1px solid lightgrey" }}>
      <div
        className="d-flex align-items-center mb-4 bg-light"
        style={{ position: "sticky", top: "0" }}
      >
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
      <p>{post.content}</p>
      <Image src={post.imageUrl} fluid />
      <p className="mt-3">6:28 PM · May 16, 2023 · 69 Views</p>

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
            rows={1}
            value={text}
            onChange={onTextChange}
            className="bg-light"
            style={{ border: "none" }}
            placeholder="Tweet your reply!"
          />
          <div className="d-flex justify-content-end mt-3">
            <Button disabled={!text} onClick={addComment}>
              Reply
            </Button>
          </div>
        </Col>
      </Row>
      {comments.map((comment) => (
        <ProfilePostCard key={comment.id} post={comment} />
      ))}
    </Col>
  );
}
