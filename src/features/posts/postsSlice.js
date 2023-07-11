import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const fetchPostsByUser = createAsyncThunk(
  "posts/fetchByUser",
  async (userId) => {
    try {
      const postsRef = collection(db, `users/${userId}/posts`);
      const querySnapshot = await getDocs(postsRef);
      const docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // content: "hello from frirebase"
      }));
      // const docs = [{id: 1, content: "hello from frirebase"}]
      return docs;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const savePost = createAsyncThunk(
  "posts/savePost",
  async ({ userId, postContent, file }) => {
    try {
      const imageRef = ref(storage, `posts/${file.name}`);
      const response = await uploadBytes(imageRef, file);
      const imageUrl = await getDownloadURL(response.ref);
      const postsRef = collection(db, `users/${userId}/posts`);
      const newPostRef = doc(postsRef);
      await setDoc(newPostRef, { content: postContent, likes: [], imageUrl });
      const newPost = await getDoc(newPostRef);
      const post = {
        id: newPost.id,
        ...newPost.data(),
      };
      return post;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const likePost = createAsyncThunk(
  "posts/likePost",
  async ({ userId, postId }) => {
    try {
      const postRef = doc(db, `users/${userId}/posts/${postId}`);
      const docSnap = await getDoc(postRef);
      console.log(docSnap.exists());

      if (docSnap.exists()) {
        const postData = docSnap.data();
        const likes = [...postData.likes, userId];
        console.log(likes);
        await setDoc(postRef, { ...postData, likes });
      }

      return { userId, postId };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const removeLikeFromPost = createAsyncThunk(
  "posts/removeLikeFromPost",
  async ({ userId, postId }) => {
    try {
      const postRef = doc(db, `users/${userId}/posts/${postId}`);
      const docSnap = await getDoc(postRef);

      if (docSnap.exists()) {
        const postData = docSnap.data(); // old data
        // const postData = {id: 1, content: 'hello', likes: ['a']}
        const likes = postData.likes.filter((id) => id !== userId);
        // const likes = [];
        await setDoc(postRef, { ...postData, likes });
        // await setDoc(postsRef, { id: 1, content: 'hello', likes: ['a'], likes });
        // await setDoc(postsRef, { id: 1, content: 'hello', likes: []});
      }

      return { userId, postId };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: { posts: [], loading: true },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostsByUser.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.loading = false;
      })
      .addCase(savePost.fulfilled, (state, action) => {
        state.posts = [action.payload, ...state.posts];
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const { userId, postId } = action.payload;
        const postIndex = state.posts.findIndex((post) => post.id === postId);
        // postIndex = 0
        if (postIndex !== -1) {
          // userId = 'C'
          // state.posts = [{id: 1, likes: ['A', 'B']}, {id: 2, likes: ['A']}]
          // state.posts[0] = {id: 1, likes: ['A', 'B']}
          state.posts[postIndex].likes.push(userId);
          // state.posts = [{id: 1, likes: ['A', 'B', 'C']}]
        }
      })
      .addCase(removeLikeFromPost.fulfilled, (state, action) => {
        const { userId, postId } = action.payload;
        const postIndex = state.posts.findIndex((post) => post.id === postId);
        // postIndex = 0
        if (postIndex !== -1) {
          // userId = 'C'
          // postIndex = 0
          // state.posts = [{id: 1, likes: ['A', 'B', 'C']}, {id: 2, likes: ['A']}]
          // state.posts[0] = {id: 1, likes: ['A', 'B', 'C']}
          state.posts[postIndex].likes = state.posts[postIndex].likes.filter(
            (id) => id !== userId
          );
          // state.posts = [{id: 1, likes: ['A', 'B']}]
        }
      });
  },
});

export default postsSlice.reducer;
