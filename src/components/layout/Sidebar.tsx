
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  UserCircle, 
  Settings, 
  BarChart3, 
  FileText, 
  Menu
} from 'lucide-react';

export function Sidebar() {
  const [collapsed, setCollapsed] = React.useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside 
      className={`bg-blue-600 text-white transition-all duration-300 ease-in-out ${
        collapsed ? 'w-[70px]' : 'w-[230px]'
      }`}
    >
      <div className="p-4 flex items-center justify-between">
        <div className={`flex items-center space-x-2 ${collapsed ? 'opacity-0 invisible' : 'opacity-100 visible'} transition-opacity duration-200`}>
          <div className="bg-white rounded-full p-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" fill="#4D7EFF"/>
            </svg>
          </div>
          <h1 className="font-bold text-xl">TalentATS</h1>
        </div>
        <button onClick={toggleSidebar} className="text-white/80 hover:text-white">
          <Menu size={20} />
        </button>
      </div>

      <nav className="mt-6 px-2">
        <SidebarLink to="/dashboard" icon={<LayoutDashboard />} label="Dashboard" collapsed={collapsed} />
        <SidebarLink to="/applications" icon={<FileText />} label="Applications" collapsed={collapsed} />
        <SidebarLink to="/jobs" icon={<Briefcase />} label="Jobs" collapsed={collapsed} />
        <SidebarLink to="/candidates" icon={<UserCircle />} label="Candidates" collapsed={collapsed} />
        <SidebarLink to="/stats" icon={<BarChart3 />} label="Statistics" collapsed={collapsed} />
        <SidebarLink to="/settings" icon={<Settings />} label="Settings" collapsed={collapsed} />
      </nav>

      <div className="absolute bottom-4 left-0 right-0 px-4">
        <div className={`flex items-center space-x-2 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 bg-blue-300 rounded-full overflow-hidden">
            <img 
              src="/lovable-uploads/ef393a9e-3b69-4cac-8255-5350f9bce562.png" 
              alt="User" 
              className="w-full h-full object-cover"
            />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Sarah Johnson</p>
              <p className="text-xs text-blue-200 truncate">HR Manager</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

function SidebarLink({ to, icon, label, collapsed }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => 
        `flex items-center py-3 px-3 my-1 rounded-md transition-colors ${
          isActive 
            ? 'bg-white text-blue-600' 
            : 'text-white/80 hover:bg-blue-500/30 hover:text-white'
        } ${collapsed ? 'justify-center' : 'space-x-3'}`
      }
    >
      <span className="text-xl">{icon}</span>
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </NavLink>
  );
}
