import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import Nav2 from '../components/Nav';

const Layout = () => {
  return (
    <main className="App">
      <Nav2 />
      <Sidebar />
      <Outlet />
    </main>
  );
};

export default Layout;
