import React,{useState} from "react";
import { Link } from "react-router-dom";
import { UserIcon } from "./UserIcon";
const Menu = () => {
  const [selectedMenu , setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen , setIsProfileDropdownOpen] = useState(false);

  const handeleMenuClick = (index) => {
    setSelectedMenu(index);
  }

  const handeleProfileDropdownClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  }
  const munuClass = "menu";
  const avtiveMenuClass = "menu selected";
  return (
    <>
      <div className="menu-container">
        <img src="./tranquvest_logo.svg" alt="" width={"150px"} />
        <div className="menus">
          <ul>
            <li>
              <Link to="/" style={{textDecoration: "none"}}
               onClick={() => handeleMenuClick(0)}> <p className={selectedMenu === 0 ? avtiveMenuClass : munuClass}>
                
                Dashboard</p></Link>
         
            </li>
            <li>
              <Link to="/orders" style={{textDecoration: "none"}}
               onClick={() => handeleMenuClick(1)}> <p className={selectedMenu === 1 ? avtiveMenuClass : munuClass}>
                Orders</p></Link>
            </li>
            <li>
              <Link to="/holdings" style={{textDecoration: "none"}}
               onClick={() => handeleMenuClick(2)}> <p className={selectedMenu === 2 ? avtiveMenuClass : munuClass}>
                Holdings</p></Link>
            </li>
            <li>
              <Link to="/positions" style={{textDecoration: "none"}}
               onClick={() => handeleMenuClick(3)}> <p className={selectedMenu === 3 ? avtiveMenuClass : munuClass}>
                Positions</p></Link>
            </li>
            <li>
              <Link to="/funds" style={{textDecoration: "none"}}
               onClick={() => handeleMenuClick(4)}> <p className={selectedMenu === 4 ? avtiveMenuClass : munuClass}>
                Funds</p></Link>
            </li>
            <li>
              <Link to="/" style={{textDecoration: "none"}}
               onClick={() => handeleMenuClick(5)}> <p className={selectedMenu === 5 ? avtiveMenuClass : munuClass}>
                Apps</p></Link>
            </li>
          </ul>
          <hr />
          <div className="profile" onClick={handeleProfileDropdownClick}>
            <Link to="/profile" className="nav-link">
              <UserIcon />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;