// var mode = process.env.NODE_ENV
// let API_SERVER = 'http://localhost'



// if (mode === 'development') {
//   API_SERVER = 'http://121.43.61.154:9000'
//   // API_SERVER = 'http://localhost'
// }

// if (mode === 'production') {
//   API_SERVER = 'http://121.43.61.154:9000'
// }

// export { API_SERVER }



const mode = process.env.NODE_ENV;
const API_SERVER = `http://${process.env.REACT_APP_API_SERVER}:${process.env.REACT_APP_API_PORT}` || 'http://localhost';

export { API_SERVER };