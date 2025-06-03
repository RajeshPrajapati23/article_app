import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, logout } from "../common/helper";

const Navbar = () => {
  const [inputData, setInput] = useState({
    loader: true,
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const menubtnRef = useRef(null);
  const navigator = useNavigate();

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    document.addEventListener("click", (e) => {
      const menubar = document.querySelector(".menubar");
      // not click on menubutton and menubar
      if (
        !menubtnRef.current?.contains(e.target) &&
        !menubar?.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    });
  }, []);

  const { userdata } = inputData;

  return (
    <>
      <div id="overlay" style={{ right: menuOpen ? "0px" : "100%" }}></div>
      <div className={`menubar ${menuOpen ? "open" : ""} `}>
        <span
          id="closemenu"
          onClick={handleToggleMenu}
          style={{ top: menuOpen ? "0px" : "-30px" }}
        >
          <span className="material-symbols-outlined">x</span>
        </span>
        <div className="user-info">
          <Link
            to={"/myprofile"}
            className="d-flex flex-row align-items-center"
          >
            <span>
              Hello,{" "}
              <span className="text-capitalize">
                {getUser().name || "user"}
              </span>
            </span>
          </Link>
        </div>
        <ul id="vertical-menu">
          <li>
            <Link to={"/"}>
              <span>Dashboard</span>
            </Link>
          </li>

          <li>
            <a
              onClick={() => {
                logout(), navigator("/login");
              }}
            >
              <span>Logout</span>
            </a>
          </li>
        </ul>
      </div>
      <header>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex flex-row align-items-center">
            <div
              className="menubtn"
              onClick={handleToggleMenu}
              ref={menubtnRef}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
            <Link to={"/"}>
              <div className="d-inline-flex align-items-center justify-content-center">
                <div className="logodiv">
                  {/* <img src={dashboardlogo} alt="" /> */}
                  <h1 className="redcolor m-0 px-2">Article</h1>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};
export default Navbar;
