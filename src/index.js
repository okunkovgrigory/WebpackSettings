import 'bootstrap';
import Post from './assets/js/Post.js';
import './assets/sass/style.sass';

const post = new Post('Webpack Post Title');

console.log(post.toString());

let add = (a, b) => a + b;

alert(add(5, 7));


