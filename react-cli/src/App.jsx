import React, { lazy, Suspense } from 'react';
import { Link, Routes, Route, Navigate } from 'react-router-dom';
import { Button } from 'antd';
// import Home from './pages/Home';
// import About from './pages/About';

const Home = lazy(() => import(/* webpackChunkName: 'home' */'./pages/Home'));
const About = lazy(() => import(/* webpackChunkName: 'about'  */'./pages/About'));

export default function App() {
  return (
    <div>
      <h1>App</h1>
      <Button type='primary'>按钮</Button>
      <ul>
        <li><Link to='/home'>Home</Link></li>
        <li><Link to='/about'>About</Link></li>
      </ul>

      <Suspense fallback={<h1>Loading...</h1>}>
        <Routes>
          <Route path='/home' element={<Home />}></Route>
          <Route path='/about' element={<About />}></Route>
          <Route path='/' element={<Navigate to='/home'></Navigate>}></Route>
        </Routes>
      </Suspense>
    </div>
  )
}