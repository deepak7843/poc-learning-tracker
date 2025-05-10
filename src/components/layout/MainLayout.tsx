import React, { ReactNode, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onMobileMenuToggle={toggleMobileMenu} />
      <div className="flex flex-1">
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block fixed md:relative w-64 h-[calc(100vh-4rem)] z-30 bg-white`}>
          <Sidebar />
        </div>
        <main className="flex-1 bg-neutral-50 p-4 md:p-6 animate-fade-in">
          {children}
        </main>
      </div>
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}
    </div>
  );
};

export default MainLayout;