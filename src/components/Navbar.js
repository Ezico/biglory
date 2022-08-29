import { useState, React } from "react";
import logo from "../assets/img/logo.png";
import { useNavigate } from "react-router-dom";

function Navbar(props) {
  const navigate = useNavigate();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const handleToggle = () => {
    setNavbarOpen((prev) => !prev);
  };
  const handleLogout = () => {
    // Cookies.remove('user')
    localStorage.clear();
    console.log("cleared");
    navigate("/account/login");
  };

  const currentUser = props.currentUser;

  return (
    <header id="tmpl-header" class="tmpl-header">
      <div class="tmpl-header_bg"></div>
      <div class="tmpl-header_head">
        <div class="tmpl-header_inner">
          <h1 class="tmpl-header_logo">
            <a href="/" data-analytics-name="SonyLogo">
              <img src={logo} alt="logo" class="logo" />
            </a>
          </h1>

          <a
            href="/#"
            onClick={handleToggle}
            class="tmpl-header_hamburger tmpl-headerHamburger"
            tabindex="0"
          >
            <div class="tmpl-headerHamburger_inner">
              <span class="tmpl-headerHamburger_line -line-01"></span>
              <span class="tmpl-headerHamburger_line -line-02"></span>
              <span class="tmpl-headerHamburger_line -line-03"></span>
              <span class="tmpl-headerHamburger_name">menu</span>
            </div>
          </a>
        </div>
      </div>

      <nav
        class={`tmpl-header_nav tmpl-headerNav ${
          navbarOpen ? " showMenu" : ""
        }`}
      >
        <div class="tmpl-headerNavDropDownBg js-dropDownBg"></div>
        <ul id="tmpl-headerNav_list" class="tmpl-headerNav_list">
          <li class="tmpl-headerNav_item tmpl-headerNavItem js-dropDown">
            <a
              href="/"
              class="tmpl-headerNavItem_home"
              data-analytics-name="home"
            >
              Home
            </a>
          </li>

          <li class="tmpl-headerNav_item tmpl-headerNavItem js-dropDown">
            <a
              href="/about-us"
              class="tmpl-headerNavItem_label"
              data-analytics-name="topD"
            >
              About Us
              <span class="tmpl-headerNavItem_name">open</span>
            </a>
          </li>

          {/* <!-- ソニーグループについて --> */}
          <li class="tmpl-headerNav_item tmpl-headerNavItem js-dropDown">
            <a
              href="/watch-videos"
              class="tmpl-headerNavItem_label"
              data-analytics-name="topD"
            >
              Watch Videos
              <span class="tmpl-headerNavItem_name">open</span>
            </a>
          </li>

          <li class="tmpl-headerNav_item tmpl-headerNavItem js-dropDown">
            <a
              href="/brand-promotion"
              class="tmpl-headerNavItem_label"
              data-analytics-name="topD"
            >
              Brand Promotion
              <span class="tmpl-headerNavItem_name">open</span>
            </a>
          </li>

          <li class="tmpl-headerNav_item tmpl-headerNavItem js-dropDown">
            <a
              href="/event-promotion"
              class="tmpl-headerNavItem_label"
              data-analytics-name="topD"
            >
              Event Promotion
              <span class="tmpl-headerNavItem_name">open</span>
            </a>
          </li>

          <li class="tmpl-headerNav_item tmpl-headerNavItem js-dropDown">
            <a
              href="/events"
              class="tmpl-headerNavItem_label"
              data-analytics-name="topD"
            >
              Live Events
              <span class="tmpl-headerNavItem_name">open</span>
            </a>
          </li>

          <li class="tmpl-headerNav_item tmpl-headerNavItem js-dropDown">
            <a
              href="/contact-us"
              class="tmpl-headerNavItem_label"
              data-analytics-name="topD"
            >
              Contact Us
              <span class="tmpl-headerNavItem_name">open</span>
            </a>
          </li>

          <li class="tmpl-headerNav_item tmpl-headerNavItem -contact">
            <ul class="absoluteList">
              {currentUser ? (
                <>
                  <li>
                    <a href="/my-account">My Account</a>
                  </li>
                  <li>
                    <a onClick={handleLogout} href="/#">
                      Logout
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    {" "}
                    <a
                      href="/account/login"
                      data-analytics-name="Support"
                      class="contactLink"
                    >
                      Login
                    </a>
                  </li>
                  <li>
                    <a
                      href="/account/register"
                      data-analytics-name="u-Careers"
                      class="contactLink"
                    >
                      Register
                    </a>
                  </li>
                </>
              )}
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
