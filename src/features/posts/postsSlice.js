import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../firebase";

export const fetchPostsByUser = createAsyncThunk(
  "posts/fetchByUser",
  async (userId) => {
    try {
      const postsRef = collection(db, `users/${userId}/posts`);

      const querySnapshot = await getDocs(postsRef);
      const docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

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
    // file = {name: "downloads/image.jpg"}
    try {
      let imageUrl = ''
      if (file !== null) {
        const imageRef = ref(storage, `posts/${file.name}`)
        const response = await uploadBytes(imageRef, file)
        imageUrl = await getDownloadURL(response.ref)
        // const imageUrl = `storage.google.com/image.jpg`
      }

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

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ userId, postId, newPostContent, newFile }) => {
    // newFile = {name: "downloads/image.jpg"}
    console.log({ userId, postId, newPostContent, newFile })
    try {
      let newImageUrl = ''
      if (newFile !== null) {
        const imageRef = ref(storage, `posts/${newFile.name}`)
        const response = await uploadBytes(imageRef, newFile)
        newImageUrl = await getDownloadURL(response.ref)
        // const newImageUrl = `storage.google.com/image.jpg`
      }

      const postRef = doc(db, `users/${userId}/posts/${postId}`);
      const postSnap = await getDoc(postRef)

      // if the post exists
      if (postSnap.exists()) {
        console.log('post.exist')
        const postData = postSnap.data() // existing data of our post
        // const postData = {content: 'hello', imageUrl: 'firebase.storage.com/photos/1', id: 1}

        const updatedData = {
          // if user don't want to update the text/content of the tweet, it will be empty string
          // and empty string is a false-y boolena value
          // and postData.content is 'hello'
          content: newPostContent || postData.content,
          // then it will become
          // content: 'hello',
          imageUrl: newImageUrl || postData.imageUrl,
          // this applies to the imageUrl as well
          ...postData
          // ...postData will also have the other key value pair, in this case
          // id: 1
        }
        await updateDoc(postRef, updatedData).catch(e => console.error(e))
        const updatedPost = { id: postId, ...updatedData }
        return updatedPost
      } else {
        throw new Error("post don't exisst")
      }

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

      if (docSnap.exists()) {
        const postData = docSnap.data();
        const likes = [...postData.likes, userId];

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
        const postData = docSnap.data();
        const likes = postData.likes.filter((id) => id !== userId);

        await setDoc(postRef, { ...postData, likes });
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

        if (postIndex !== -1) {
          state.posts[postIndex].likes.push(userId);
        }
      })
      .addCase(removeLikeFromPost.fulfilled, (state, action) => {
        const { userId, postId } = action.payload;

        const postIndex = state.posts.findIndex((post) => post.id === postId);

        if (postIndex !== -1) {
          state.posts[postIndex].likes = state.posts[postIndex].likes.filter(
            (id) => id !== userId
          );
        }
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        // action = {payload: {id: 1,  content: 'godoby', imageUrl: 'image.com/2'}}
        // state.posts = [
        //   {id: 1,  content: 'Hello', imageUrl: 'image.com/1'},
        //   {id: 2,  content: 'haris', imageUrl: 'image.com/567'},
        // ]

        const updatedPost = action.payload

        // return the index of the post that we want to update
        const postIndex = state.posts.findIndex(
          post => post.id === updatedPost.id
        )
        // since we want to update id 1 post, it will return us index 0
        // const postIndex = 0

        if (postIndex !== -1) {
          console.log(updatedPost)
          state.posts[postIndex] = updatedPost
        }
        // state.posts[0] = updatePost
        // state.posts[0] = {id: 1,  content: 'godoby', imageUrl: 'image.com/2'}

        // ANd now the new state posts is:
        // state.posts = [
        //   {id: 1,  content: 'godoby', imageUrl: 'image.com/2'},
        //   {id: 2,  content: 'haris', imageUrl: 'image.com/567'},
        // ]
      });
  },
});

export default postsSlice.reducer;
