import React from "react";
const Footer = () => {
  return (
    <footer class="tmpl-footer-all">
      <div class="tmpl-footer-wrap">
        <div class="tmpl-footer">
          <nav class="tmlp-footer__nav-wrap">
            <ul class="tmlp-footer__gnav">
              <li class="tmlp-footer__gnav__item">
                <a href="/terms">Terms and Conditions</a>
              </li>
              <li class="tmlp-footer__gnav__item">
                <a href="/privacy-policy/">Privacy Policy</a>
              </li>

              <li class="tmlp-footer__gnav__item">
                <a href="/about-us/">About this Site</a>
              </li>

              <li class="tmlp-footer__gnav__item">
                <a href="/contact-us/">Contact Us</a>
              </li>
            </ul>
          </nav>
          <div class="tmpl-footer__copyright" lang="en">
            Copyright 2022 BiGlory Entertainment designed by{" "}
            <a href="mailito:newage.groupss@gmail.com">IeDigitals Nig.</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
