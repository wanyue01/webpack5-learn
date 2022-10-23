import './css/index.css';

console.log('hello main');
function f1(x, y) {
  return x - y;
}
const a = f1(2, 1);
const app = document.getElementById('app');
app.innerHTML = a;
console.log('hello~');
const sum = (...args) => {
  return args.reduce((p, c) => p + c, 0);
}