import { Commit, createStore } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
import { arrToObj, objToArr } from '../hooks/helper'

// 响应数据类型
export interface ResponseType<P = unknown> {
  code: number;
  msg: string;
  data: P;
}

// 用户信息类型
export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
}

// 图片信息类型
export interface ImageProps {
  _id?: string;
  url?: string;
}

// 专栏信息类型
export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}

// 错误信息类型
export interface ErrorProps {
  status: boolean;
  message?: string;
}

// 文章信息类型
export interface PostProps {
  _id?: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps;
  createdAt?: string;
  column: string;
  author?: string | UserProps;
  isHTML?: boolean;
}

// 列表信息类型
interface ListProps<P> {
  [id: string]: P;
}

// 专栏列表类型
interface GlobalColumns {
  data: ListProps<ColumnProps>;
  currentPage: number;
  total: number;
}

// 文章列表类型
interface GlobalPosts {
  data: ListProps<PostProps>;
  currentPage: number;
  total: number;
  // loadedColumns: ListProps<{ columnId?: string; currentPage?: number; total?: number }>;

}

// 全局类型
export interface GlabalUserProps {
  error: ErrorProps;
  token: string;
  loading: boolean;
  columns: GlobalColumns;
  posts: GlobalPosts;
  user: UserProps;
}

const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
  const { data } = await axios.get(url)
  commit(mutationName, data)
  return data
}
const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload: any) => {
  const { data } = await axios.post(url, payload)
  commit(mutationName, data)
  return data
}
const asyncAndCommit = async (
  url: string,
  mutationName: string,
  commit: Commit,
  config: AxiosRequestConfig = { method: 'get' },
  extraData?: any
) => {
  const { data } = await axios(url, config)
  if (extraData) {
    commit(mutationName, { data, extraData })
  } else {
    commit(mutationName, data)
  }
  return data
}
const store = createStore<GlabalUserProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: { data: {}, currentPage: 0, total: 0 },
    posts: { data: {}, currentPage: 0, total: 0 },
    user: { isLogin: false }
  },
  mutations: {
    // 首页专栏列表
    fetchColumns (state, rowData) {
      const { data } = state.columns
      const { list, count, currentPage } = rowData.data
      state.columns = {
        data: { ...data, ...arrToObj(list) },
        total: count,
        currentPage: currentPage * 1
      }
    },
    // 专栏详情信息
    fetchColumnsDetail (state, rowData) {
      state.columns.data[rowData.data._id] = rowData.data
    },
    // 专栏文章列表
    fetchPosts (state, { data: rowData, extraData: columnId }) {
      const { list, count, currentPage } = rowData.data
      const { data } = state.posts
      state.posts = {
        data: { ...data, ...arrToObj(list) },
        total: count,
        currentPage: currentPage * 1
      }
    },
    // 登录
    login (state, rowData) {
      const { token } = rowData.data
      localStorage.setItem('token', token)
      state.token = token
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    // 退出
    logout (state) {
      state.token = ''
      state.user = { isLogin: false }
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
    },
    // 当前用户信息
    fetchCurrentUser (state, rowData) {
      state.user = { isLogin: true, ...rowData.data }
    },
    // 创建文章
    createPosts (state, rowData) {
      state.posts.data[rowData._id] = rowData
    },
    // 文章详情
    fetchPostDetail (state, rowData) {
      state.posts.data[rowData.data._id] = rowData.data
    },
    // 更新文章
    updatePosts (state, { data }) {
      state.posts.data[data._id] = data
    },
    // 删除文章
    deletePosts (state, { data }) {
      delete state.posts.data[data._id]
    },
    // loading状态切换
    setLoading (state, status) {
      state.loading = status
    },
    // 错误信息
    setError (state, e: ErrorProps) {
      state.error = e
    }
  },
  actions: {
    // 获取首页专栏列表
    fetchColumns: ({ state, commit }, params = {}) => {
      const { currentPage = 1, pageSize = 3 } = params
      if (state.columns.currentPage < currentPage) {
        return asyncAndCommit(`/columns?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchColumns', commit)
      }
    },
    // 获取专栏详情信息
    fetchColumnsDetail: ({ state, commit }, cid) => {
      if (!state.columns.data[cid]) {
        return getAndCommit(`/columns/${cid}`, 'fetchColumnsDetail', commit)
      }
    },
    // 获取专栏文章列表
    fetchPosts: ({ state, commit }, { cid, params = { currentPage: 1, pageSize: 3 } }) => {
      // if (!state.posts.loadedColumns.includes(cid)) {
      //   return asyncAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit, { method: 'get' }, cid)
      // }
      const { currentPage, pageSize } = params
      return asyncAndCommit(`/columns/${cid}/posts?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchPosts', commit, { method: 'get' }, cid)
    },
    // 登录
    login: ({ commit }, payload) => {
      return postAndCommit('/user/login', 'login', commit, payload)
    },
    // 获取当前用户信息
    fetchCurrentUser: ({ commit }) => {
      return getAndCommit('/user/current', 'fetchCurrentUser', commit)
    },
    // 登录->获取用户信息
    fetchAndLogin: ({ dispatch }, loginData) => {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    },
    // 创建文章
    createPosts: ({ commit }, payload) => {
      return postAndCommit('/posts', 'createPosts', commit, payload)
    },
    // 获取文章详情
    fetchPostDetail: ({ state, commit }, cid) => {
      const currentPost = state.posts.data[cid]
      if (!currentPost || !currentPost.content) {
        return asyncAndCommit(`/posts/${cid}`, 'fetchPostDetail', commit)
      } else {
        return Promise.resolve({ data: currentPost })
      }
    },
    // 更新文章
    updatePosts: ({ commit }, { id, payload }) => {
      return asyncAndCommit(`/posts/${id}`, 'updatePosts', commit, { method: 'patch', data: payload })
    },
    // 删除文章
    deletePosts: ({ commit }, cid) => {
      return asyncAndCommit(`/posts/${cid}`, 'deletePosts', commit, { method: 'delete' })
    }
  },
  getters: {
    // 根据id专栏详情信息
    getColumnsById: (state) => (id: string) => {
      return state.columns.data[id]
    },
    // 根据columnId获取文章列表
    getPostsByCid: (state) => (cid: string) => {
      return objToArr(state.posts.data).filter(item => item.column === cid)
    },
    // 根据columnId获取文章详情
    getPostsDetail: (state) => (cid: string) => {
      return state.posts.data[cid]
    },
    // 获取专栏列表
    getColumns: (state) => {
      return objToArr(state.columns.data)
    }
  }
})
export default store
