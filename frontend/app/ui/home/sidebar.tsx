// import React, { useState } from "react";
// import Link from "next/link";
// import useIsMediumScreen from "../../lib/hooks";

// interface MenuItem {
//   label: string;
//   href: string;
// }

// interface SidebarProps {
//   menuItems: MenuItem[];
// }

// const Sidebar: React.FC<SidebarProps> = ({ menuItems }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const isMediumScreen = useIsMediumScreen();
//   const toggleSidebar = () => setIsOpen(!isOpen);

//   return (
//     <>
//       {/* Toggle button for mobile view */}
//       <button
//         className="z-20 p-4 bg-red-500 lg:hidden"
//         onClick={toggleSidebar}
//         aria-label="Toggle Sidebar"
//       >
//         <span className="material-icons text-gray-600">
//           {isOpen ? "close" : "menu"}
//         </span>
//       </button>
//       {/* Sidebar */}
//       <div
//         className={`sticky top-20 h-[calc(100vh-5rem)] flex-col border-r border-blue-100 text-black transition-transform duration-300 ease-in-out ${
//           isOpen || isMediumScreen ? "flex" : "hidden"
//         } lg:translate-x-0`}
//       >
//         {/* Items */}
//         <nav className="mt-4 flex flex-col space-y-2">
//           {menuItems.map((item) => (
//             <Link
//               key={item.href}
//               href={item.href}
//               className="px-6 py-3 transition-colors hover:bg-gray-700"
//               onClick={() => setIsOpen(false)}
//             >
//               {item.label}
//             </Link>
//           ))}
//         </nav>
//       </div>
//       {/* Overlay for mobile view */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
//           onClick={toggleSidebar}
//         ></div>
//       )}
//     </>
//   );
// };

// export default Sidebar;
