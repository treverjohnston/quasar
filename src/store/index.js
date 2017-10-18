import axios from 'axios'
import vue from 'vue'
import vuex from 'vuex'
import router from '../router'


var production = !window.location.host.includes('localhost');
var baseUrl = production ? '//keepur.herokuapp.com/' : '//localhost:3000/';

let api = axios.create({
    // baseURL: '//keepur.herokuapp.com/api/',
    baseURL: baseUrl + 'api/',
    timeout: 4000,
    withCredentials: true
})
let auth = axios.create({
    // baseURL: '//keepur.herokuapp.com/',
    baseURL: baseUrl,
    timeout: 4000,
    withCredentials: true
})


vue.use(vuex)

var store = new vuex.Store({
  state: {
    boards: [
        {title: 'name', description: 'description', id: '2'},
        {title: 'name', description: 'description', id: '29'},
        {title: 'name', description: 'description', id: '239'},
        {title: 'name', description: 'description', id: '2039'},
    ],
    activeBoard: {},
    activeLists: {},
    activeTasks: {},
    comments: {},
    error: {},
    loggedIn: false,
    registering: false,
    logging: false
  },
  mutations: {
    setBoards(state, data) {
      state.boards = data
    },
    handleError(state, err) {
      state.error = err
    },
    changeLog(state) {
      state.loggedIn = !state.loggedIn
    },
    reg(state) {
      state.registering = true
      state.logging = false
    },
    log(state) {

      state.registering = false
      state.logging = true
    },
    setActiveBoard(state, payload) {
      state.activeBoard = payload
    },
    setLists(state, payload) {
      state.activeLists = payload
    },
    setTasks(state, { boardId, listId, tasks }) {
 
      vue.set(state.activeTasks, listId, tasks)

      // console.log('active tasks: ', state.activeTasks)
    },
    clearTasks(state) {
      state.activeTasks = []
    },
    setComments(state, { taskId, comments }) {
      vue.set(state.comments, taskId, comments)
      // console.log('state comments',state.comments)
    },
    getAuth(state, user){
      state.user = user
      
    }
  },

actions: {
  //when writing your auth routes (login, logout, register) be sure to use auth instead of api for the posts
  login({ commit, dispatch }, obj) {
    auth.post("login", obj)
      .then((res) => {
        // console.log(res)
        // res = JSON.parse(res);
        if (res.data.message == "successfully logged in") {
          router.push('userboards')          
          return console.log(res.data.message)
        } else {
          // dispatch('changeLog')
          return console.log(res.data.message)
        }

      })
      .catch(() => console.log('error'))
  },
  register({ commit, dispatch }, obj) {
    auth.post("register", obj)
      .then((res) => {
        // console.log(res)
        // res = JSON.parse(res);
        if (res.data.message) {
          console.log('account created')
          dispatch('changeLog')
          router.push('userboards')          
        } else if (res.error) {
          alert("Invalid Email or password");
        }
      })
      .catch(() => console.log('error'))
  },
  logout({ commit, dispatch }) {
    auth.delete('logout')
      .then((res) => {
        console.log(res.data.message)
        // dispatch('changeLog')
        dispatch('getAuth')      
        
      })
      .catch(() => console.log('error'))
  },
  reg({ commit, dispatch }) {
    commit('reg')
  },
  log({ commit, dispatch }) {
    commit('log')
  },
  changeLog({ commit, dispatch }) {
    commit('changeLog')
  },

  //login items ^^^^^^
  getAuth({commit, dispatch}) {
    auth('authenticate')
    .then(res => {
      if (!res.data.data) {
        return router.push('/')
      }
        commit('getAuth', res.data.data)
        // stateuser = res.data.data
        router.push('userboards')
        // router.replace('userboards')

    })
      .catch(err => {
        console.log(err)
        router.push('/')
      })
  },
  // board items below
  getBoards({ commit, dispatch }) {
    api('userboards')
      .then(res => {
        commit('setBoards', res.data.data)
        commit('setLists', {})
      })
      .catch(err => {
        commit('handleError', err)
      })
  },
  getBoard({ commit, dispatch }, id) {
    api('userboards/' + id)
      .then(res => {
        commit('setActiveBoard', res.data.data)
      })
      .catch(err => {
        commit('handleError', err)
      })
  },
  createBoard({ commit, dispatch }, board) {
    api.post('boards/', board)
      .then(res => {
        dispatch('getBoards')
      })
      .catch(err => {
        commit('handleError', err)
      })
  },
  editBoard({commit, dispatch}, obj){
    console.log(obj)
    api.put(`boards/${obj.boardId}`, obj)
    .then(res=>{
      console.log(res)
      dispatch('getBoards', obj.boardId)
    })
    .catch(err =>{
      commit ('handleError', err)
    })
  },
  removeBoard({ commit, dispatch }, board) {
    api.delete('boards/' + board._id)
      .then(res => {
        dispatch('getBoards')
      })
      .catch(err => {
        commit('handleError', err)
      })
  },
  // board items ^^^^^^^^^^^^

  // list items below
  getLists({ commit, dispatch }, boardId) {
    api(`userboards/${boardId}/lists`)
      .then(res => {
        commit('setLists', res.data.data)
      })
      .catch(err => {
        commit('handleError', err)
      })
  },
  createList({ commit, dispatch }, list) {
    // console.log(list)
    api.post(`userboards/${list.boardId}/lists/`, list)
      .then(res => {
        dispatch('getLists', list.boardId)
        // commit('clearTasks')
      })
      .catch(err => {
        commit('handleError', err)
      })
  },
  
  editList({commit, dispatch}, obj){
    // console.log(obj)
    api.put(`lists/${obj.listId}`, obj)
    .then(res=>{
      // console.log(res)
      dispatch('getLists', obj.boardId)
    })
    .catch(err =>{
      commit ('handleError', err)
    })
  },
  removeList({ commit, dispatch }, list) {
    // console.log(list)  
    api.delete(`userboards/${list.boardId}/lists/${list._id}`)
      .then(res => {
        dispatch('getLists', list.boardId)
      })
      .catch(err => {
        commit('handleError', err)
      })
  },
  getTasks({ commit, dispatch }, task) {
    // console.log('Task:', task)
    // console.log('getting tasks')
    api(`userboards/${task.boardId}/lists/${task.listId}/task`)
      .then(res => {
        // console.log('Task Res:', res)
        commit('setTasks', { tasks: res.data.data, boardId: task.boardId, listId: task.listId })
        // dispatch('getLists', task.boardId)
      })
      .catch(err => {
        commit('handleError', err)
      })
  },
  createTask({ commit, dispatch }, task) {
    // console.log(list)
    // commit('clearTasks')
    api.post(`userboards/${task.boardId}/lists/${task.listId}/task`, task)
      .then(res => {
        // console.log('created', res)
        dispatch('getTasks', task)
      })
      .catch(err => {
        commit('handleError', err)
      })
  },
  moveTask({commit, dispatch}, obj){
    // console.log(obj)
    var oldList = obj.task.listId
    obj.task.listId = obj.listId
    api.put(`tasks/${obj.task._id}`, obj)
    .then(res=> {
      dispatch('getTasks', {boardId: obj.boardId, listId: obj.listId})
      dispatch('getTasks', {boardId: obj.boardId, listId: oldList})
    })
    .catch(err =>{
      commit ('handleError', err)
    })
  },
  editTask({commit, dispatch}, obj){
    // console.log(obj)
    api.put(`tasks/${obj.task._id}`, obj)
    .then(res=>{
      // console.log(res)
      dispatch('getTasks', {boardId: obj.boardId, listId: obj.listId})
    })
    .catch(err =>{
      commit ('handleError', err)
    })
  },
  deleteTask({ commit, dispatch }, task) {
    // console.log(task)  
    api.delete(`tasks/${task.taskId}`)
      .then(res => {
        dispatch('getTasks', task)
      })
      .catch(err => {
        commit('handleError', err)
      })
  },
  getComments({ commit, dispatch }, comment) {
    // console.log('Task:', task)
    api(`userboards/${comment.boardId}/lists/${comment.listId}/task/${comment.taskId}/comments`)
      .then(res => {
        // console.log('Comment res:', res)
        commit('setComments', { comments: res.data.data, boardId: comment.boardId, listId: comment.listId, taskId: comment.taskId })

        // console.log(res)
      })
      .catch(err => {
        commit('handleError', err)
      })
  },
  createComment({ commit, dispatch }, comment) {
    // console.log(comment)
    // commit('clearTasks')
    api.post(`userboards/${comment.boardId}/lists/${comment.listId}/task/${comment.taskId}/comments`, comment)
      .then(res => {
        // console.log('created', res)
        dispatch('getComments', comment)
      })
      .catch(err => {
        commit('handleError', err)
      })
  },
  deleteComment({ commit, dispatch }, comment) {
    console.log(comment)
    api.delete(`comments/${comment.commentId}`)
      .then(res => {
        dispatch('getComments', comment)
      })
      .catch(err => {
        commit('handleError', err)
      })
  },

  handleError({ commit, dispatch }, err) {
    commit('handleError', err)
  }
}

})


export default store
