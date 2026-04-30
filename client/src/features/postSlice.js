import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as postApi from '../api/postApi';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (_, thunkAPI) => {
    try {
        const response = await postApi.getPostsApi();
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to load posts');
    }
});

export const createPost = createAsyncThunk('posts/createPost', async (postData, thunkAPI) => {
    try {
        const response = await postApi.createPostApi(postData);
        // Sau khi create post, chúng ta có thể cần fetch lại posts để có populate author
        thunkAPI.dispatch(fetchPosts());
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to create post');
    }
});

const postSlice = createSlice({
    name: 'posts',
    initialState: {
        posts: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createPost.pending, (state) => { state.loading = true; })
            .addCase(createPost.fulfilled, (state) => { state.loading = false; })
            .addCase(createPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default postSlice.reducer;
