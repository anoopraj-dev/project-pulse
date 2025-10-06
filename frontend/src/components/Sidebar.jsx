import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

const Sidebar = () => {

  return (
    <div className="h-screen w-64 bg-[#0096C7] text-gray-100 flex flex-col mt-19">
      <nav className="flex-1">
        <div className="flex p-6">
          <img
            src="/profile.png"
            alt="Profile"
            className="rounded-full w-40 h-40 object-cover"
          />
        </div>

        <ul className="space-y-3 gap-3">
         <Link to='/patient/dashboard'>
           <li className="flex items-center gap-3 p-2 hover:bg-white hover:text-[#162C55] cursor-pointer">
            <Icon
              icon="mdi:home"
              className="w-7 h-7 text-gray-600 hover:text-[#162C55]"
              color="currentColor"
            />
            <span className="font-semibold">Dashboard</span>
          </li>
         </Link>

          <li className="flex items-center gap-3 p-2 hover:bg-white hover:text-[#162C55] cursor-pointer">
            <Icon
              icon="mdi:account"
              className="w-7 h-7 text-white hover:text-[#162C55]"
              color="currentColor"
            />
            <span className="font-semibold">Profile</span>
          </li>

          <li className="flex items-center gap-3 p-2 hover:bg-white hover:text-[#162C55] cursor-pointer">
            <Icon
              icon="mdi:message-bubble"
              className="w-7 h-7 text-white hover:text-[#162C55]"
              color="currentColor"
            />
            <span className="font-semibold">Messages</span>
          </li>

          <li className="flex items-center gap-3 p-2 hover:bg-white hover:text-[#162C55] cursor-pointer">
            <Icon
              icon="healthicons:doctor-male"
              className="w-8 h-8 text-white hover:text-[#162C55]"
              color="currentColor"
            />
            <span className="font-semibold">Doctors</span>
          </li>

          <li className="flex items-center gap-3 p-2 hover:bg-white hover:text-[#162C55] cursor-pointer">
            <Icon
              icon="mdi:calendar-month"
              className="w-7 h-7 text-white hover:text-[#162C55]"
              color="currentColor"
            />
            <span className="font-semibold">Appointments</span>
          </li>

          <li className="flex items-center gap-3 p-2 hover:bg-white hover:text-[#162C55] cursor-pointer">
            <Icon
              icon="mdi:file-document"
              className="w-7 h-7 text-white hover:text-[#162C55]"
              color="currentColor"
            />
            <span className="font-semibold">Records</span>
          </li>

          <li className="flex items-center gap-3 p-2 hover:bg-white hover:text-[#162C55] cursor-pointer">
            <Icon
              icon="mdi:bank-transfer"
              className="w-7 h-7 text-white hover:text-[#162C55]"
              color="currentColor"
            />
            <span className="font-semibold">Transactions</span>
          </li>

          <li className="flex items-center gap-3 p-2 hover:bg-white hover:text-[#162C55] cursor-pointer">
            <Icon
              icon="mdi:wallet"
              className="w-7 h-7 text-white hover:text-[#162C55]"
              color="currentColor"
            />
            <span className="font-semibold">Wallet</span>
          </li>

          <li className="flex items-center gap-3 p-2 hover:bg-white hover:text-[#162C55] cursor-pointer">
            <Icon
              icon="mdi:settings"
              className="w-7 h-7 text-white hover:text-[#162C55]"
              color="currentColor"
            />
            <span className="font-semibold">Settings</span>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
