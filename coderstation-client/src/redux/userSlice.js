import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { editUser, getUserByPointsRank } from "../api/user";

/**
 * 异步 thunk，外部在进行 dispatch 的时候，直接 dispatch 这个函数
 */
export const updateUserInfo = createAsyncThunk(
  "user/updateUserInfo",
  async (payload, action) => {
    // 发送 ajax 请求更新服务器数据
    await editUser(payload.userId, payload.newInfo);
    // 直接在这里派发 action，更新仓库数据
    // 注意下面需要到处对应的 action
    action.dispatch(updateStoreUserInfo(payload.newInfo));
  }
);

export const updateScoreRankAsync = createAsyncThunk(
  "user/updateScoreRankAsync",
  async (_, action) => {
    const result = await getUserByPointsRank();
    action.dispatch(updateScoreRankInfo(result.data));
  }
);

/**
 * 创建切片
 */
export const userSlice = createSlice({
  name: "user",
  initialState: {
    isLogin: false,
    userInfo: [],
    scoreRankInfo: [],
  },
  reducers: {
    changeLoginStatus: (state, { payload }) => {
      state.isLogin = payload;
    },
    initUserInfo: (state, { payload }) => {
      state.userInfo = payload;
    },
    updateStoreUserInfo: (state, { payload }) => {
      for (let key in payload) {
        state.userInfo[key] = payload[key];
      }
    },
    clearUserInfo: (state, { _ }) => {
      state.userInfo = [];
    },
    updateScoreRankInfo: (state, { payload }) => {
      state.scoreRankInfo = payload;
    },
  },
});

export const {
  changeLoginStatus,
  initUserInfo,
  updateStoreUserInfo,
  clearUserInfo,
  updateScoreRankInfo,
} = userSlice.actions;
export default userSlice.reducer;
