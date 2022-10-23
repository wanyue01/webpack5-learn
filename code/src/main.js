// 全部引入
// import 'core-js';
// 手动按需引入
// import 'core-js/es/promise';
import count from "./js/count";
import sum from "./js/sum";
import './css/index.css';
import './less/index.less';
import './sass/index.sass';
import './sass/index.scss';
import './stylus/index.styl';

console.log(count(2, 1));
console.log(sum(1, 2, 3, 4));

// document.getElementById('btn').click = function () {
//   // eslint不识别动态导入语法，需要额外追加配置
//   console.log(111);
//   import('./js/math')
//     .then(res => {
//       console.log(111,res);
//     })
//     .catch(err => {
//       console.log(err);
//     })
// }

document.querySelector('#btn').addEventListener('click', () => {
  // /* webpackChunkName: 'math' */ webpack魔法命名
  import(/* webpackChunkName: 'math' */ './js/math')
    .then(({ mul }) => {
      console.log(mul(3, 3));
    })
    .catch(err => {
      console.log(err);
    })
})

// babel解析不了，需要core-js
new Promise(resolve => {
  setTimeout(() => {
    resolve();
  }, 1000);
});

console.log([1,2,3].includes(1));

// 对js文件如果要热替换，要手动操作
// 判断是否支持
if (module.hot) {
  module.hot.accept('./js/count');
}