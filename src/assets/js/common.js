/**
 * グロナビの処理.
 * コンテンツ内でjQueryのバージョンが競合して上書きされてしまうため
 * jQuery を使用せずに実装.
 */
import $ from "jquery";

if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var el = this;

    do {
      if (Element.prototype.matches.call(el, s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

var COMMON_DATA = {
  lang: "en",
};

var Header = function () {
  var getDOM = function (selector) {
    return document.querySelector(selector);
  };

  var getDOMAll = function (selector) {
    return document.querySelectorAll(selector);
  };

  this.$body = getDOM("body");
  this.$header = getDOM(".tmpl-header");
  this.$bg = getDOM(".tmpl-header_bg");
  this.$head = getDOM(".tmpl-header_head");
  this.$hamburgerBtn = getDOM(".tmpl-headerHamburger");
  this.$hamburgerBtnName = getDOM(".tmpl-headerHamburger_name");
  this.$nav = getDOM(".tmpl-headerNav"); // SP サイズ スクロール要素.
  this.$navItem = getDOMAll(".tmpl-headerNav_item");
  this.$navItemHome = getDOM(".tmpl-headerNavItem_home");
  this.$navItemLink = getDOMAll(".tmpl-headerNavItem_label");
  this.$navTopLink = getDOMAll(".tmpl-headerNavDropDown_toCategoryTop > a");
  this.$navLink = getDOMAll(".tmpl-headerNavDropDown_item > a");
  this.$slideBtn = getDOMAll(".tmpl-headerNavDropDown_imgContainer a");
  this.$dropDownBg = getDOM(".tmpl-headerNavDropDownBg");
  this.$dropDownBtn = getDOMAll(".tmpl-headerNavItem_label");
  this.$spDropDownBtn = getDOMAll(
    ".tmpl-headerNavItem_home, .tmpl-headerNavItem_label, .contactLink"
  );
  this.$dropDown = getDOMAll(".tmpl-headerNavDropDown");
  this.$dropDownItem = getDOMAll(".tmpl-headerNavDropDownItem");
  this.$searchBtn = getDOM(
    ".tmpl-header_searchBtn:not(.tmpl-headerSearch_close)"
  );
  this.$searchOpenBtn = getDOM(".search_open");
  this.$searchNotBtn = getDOM(".search_close");
  this.$search = getDOM(".tmpl-headerSearch");
  this.$searchInput = getDOM(".tmpl-headerSearch_input");
  this.$searchBlue = getDOM("#searchBlue");
  this.searchImg = getDOM(".tmpl-header_searchBtn svg");
  this.searchcloseBtn = getDOM(".tmpl-header_searchCloseBtn");
  this.$searchSubmit = getDOM('.tmpl-headerSearch input[type="submit"]');
  this.$searchName = getDOM(".tmpl-header_searchBtn_name");
  this.$searchClose = getDOMAll(".tmpl-headerSearch_close");
  this.$contact = getDOM(".contactLink");
  this.$pauseBtn = getDOM(".tmpl-headerNav_pauseController_btn");
  this.$link = this.$header.querySelectorAll("a");

  this.dropDownClassNames = ["js-dropDown", "js-dropDownBg"];

  this.isOpen = false;
  this.isEnter = false;
  this.onReadySlider = false;
  this.isTablet = false;

  this.dropDownDelay = 150; // メガドロのナナメ移動などを制御するための判定時間.
  this.savedScrollTop = 0;
  this.scrollTimer = false;
  this.isPauseSlider = false;

  this.duration = 0.28;

  this.className = {
    open: "is-open",
    hide: "is-hide",
    active: "is-active",
  };

  this.Slider = {};
  this.$sliderPauseBtn = getDOMAll(".pause");
  this.$sliderPlayBtn = getDOMAll(".play");
  this.$sliderBtn = getDOMAll(".tmpl-headerNav_pauseController_btn");
  this.$noBtn = getDOMAll(".no_button");
  this.dropCategoryItem = getDOMAll(".tmpl-headerNavItem_dropDown");

  for (var i = 0; i < this.dropCategoryItem.length; i++) {
    var categoryItem = this.dropCategoryItem[i].getAttribute("data-category");

    this.dropCategoryItem[i]
      .querySelector(".swiper-container")
      .classList.add("swiper-" + categoryItem);

    var sliderItems = this.dropCategoryItem[i].querySelectorAll(
      ".tmpl-headerNavSlider_item"
    );

    // 一枚しかない画像にはズームできるクラスを追加
    if (sliderItems.length == 1) {
      sliderItems[0].classList.add("zoom_image");
    }

    /**
     * スライドのアイテムが1つだけの時は定義させない.
     * @update 20.10.29
     */
    if (sliderItems.length <= 1) continue;

    this.Slider[categoryItem] = new Swiper(".swiper-" + categoryItem, {
      loop: true,
      autoplay: {
        delay: 4000,
      },
      speed: 2000,
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },

      on: {
        //スライド切り替え開始時に実行
        transitionStart: function () {
          //以前アクティブだったスライドのインデックス番号を取得する
          var previousIndex = this.previousIndex;
          //取得したインデックス番号を持つスライド要素を取得する
          var previousSlide =
            document.getElementsByClassName("swiper-slide")[previousIndex];
          //n秒後に「is-play」のクラス属性を削除する
          setTimeout(function () {
            previousSlide.firstElementChild.classList.remove("is-play");
          }, 2000);
        },

        //スライド切り替え完了後に実行
        transitionEnd: function () {
          //現在アクティブ状態にあるスライドのインデックス番号を取得する
          var activeIndex = this.activeIndex;
          //取得したインデックス番号を持つスライド要素を取得する
          var activeSlide =
            document.getElementsByClassName("swiper-slide")[activeIndex];
          //スライド要素に「is-play」のクラス属性を追加する
          activeSlide.firstElementChild.classList.add("is-play");
        },
      },
    });

    this.Slider[categoryItem].autoplay.stop();
  }
  this.addEventsSliderAll();

  this.isShowSearchArea = false;
  this.isDrop = false;
  // this.isIE = this.getIsIE();
};

/** ----------------------------------------
 * Header.prototype START
 ---------------------------------------- */
Header.prototype = {
  init: function () {
    this.prepare();
    // this.initSlider();
    this.addEvents();
  },

  prepare: function () {
    this.isSmallLayout = window.innerWidth <= 640;
    if (window.innerWidth >= 640 && window.ontouchstart === null) {
      this.isTablet = true;
    }

    // グロナビリンク表示判定
    if (this.isSmallLayout) {
      this.$header.classList.add("sp-header");
    } else {
      this.$header.classList.remove("sp-header");
    }

    for (var i = 0; i < this.$navItem.length; i++) {
      this.$navItem[i].classList.add("play");
    }

    // タッチデバイス判定
    if (
      (this.isTouchDevice() && navigator.userAgent.indexOf("iPhone") > 0) ||
      navigator.userAgent.indexOf("iPad") > 0 ||
      navigator.userAgent.indexOf("iPod") > 0
    ) {
      this.$body.classList.add("touch");
    }
  },

  addEvents: function () {
    var that = this;
    this.$hamburgerBtn.addEventListener(
      "click",
      this.onClickHamburgerBtn.bind(this)
    );
    for (var i = 0; i < this.$dropDownBtn.length; i++) {
      this.$dropDownBtn[i].addEventListener("click", function (e) {
        that.onClickDropDownBtn(e);
      });
      // this.$dropDownBtn[i].addEventListener("focus", function (e) {
      //   that.onMouseEnterDropDownBtn(e);
      // });
    }

    document.addEventListener("click", function (e) {
      // クラス属性の値で判定
      if (e.target && e.target.classList.contains("search_open")) {
        that.showSearchArea(e);
      } else if (e.target && e.target.classList.contains("search_close")) {
        that.hideSearchArea(e);
      }
    });

    // this.$searchBtn.onblur = function(){
    //     that.closeDropDown(that.$navItem, that.$dropDown, {duration: 0});
    // };
    for (var s = 0; s < this.$searchClose.length; s++) {
      this.$searchClose[s].addEventListener("click", function (e) {
        that.hideSearchArea(e);
      });
    }

    for (var i = 0; i < this.$dropDownBtn.length; i++) {
      this.$dropDownBtn[i].addEventListener("mouseenter", function (e) {
        that.onMouseEnterDropDownBtn(e);
      });
      this.$dropDownBtn[i].addEventListener("mouseleave", function (e) {
        that.onMouseLeaveDropDownBtn(e);
      });
    }
    for (var i = 0; i < this.$dropDown.length; i++) {
      this.$dropDown[i].addEventListener("mouseenter", function (e) {
        that.onMouseEnterDropDown(e);
      });
      this.$dropDown[i].addEventListener("mouseleave", function (e) {
        that.onMouseLeaveDropDown(e);
      });
    }
    // ホームにマウスオーバーしたらメニューを閉じる
    this.$navItemHome.addEventListener("mouseenter", function (e) {
      that.closeDropDown(that.$navItem, that.$dropDown, { duration: 0 });
    });
    // PCはお問い合わせにフォーカスがあったらドロップダウンが閉じる仕組み
    this.$contact.addEventListener("focus", function (e) {
      that.closeDropDown(that.$navItem, that.$dropDown, { duration: 0 });
    });
    // スマホ版は検索アイコンにフォーカスが合ったら閉じる仕組み
    this.$searchBtn.addEventListener("focus", function () {
      that.onCloseHamburgerBtn();
    });

    for (var i = 0; i < this.$link.length; i++) {
      this.$link[i].addEventListener("click", function (e) {
        that.analyticsClickLink(e);
      });
    }

    for (var n = 0; n < this.$navItemLink.length; n++) {
      this.$navItemLink[n].addEventListener("click", function (e) {
        that.navClickLink(e);
      });
    }

    // スマホ版のみ
    if (window.innerWidth <= 640) {
      this.$hamburgerBtn.addEventListener("blur", function (e) {
        if (that.isOpen) {
          that.$navItemHome.focus();
        }
      });
    }

    /** 検索関係のイベントまとめ */
    this.addSearchEvents(that);

    window.addEventListener("resize", this.onResize.bind(this));

    document.addEventListener("keydown", function (e) {
      that.onKeyDown(e);
    });
  },

  /** 検索関係のイベントまとめ */
  addSearchEvents: function (that) {
    /**
     * 行数が離れているのでコメント...
     * this.$searchBtn = getDOM(".tmpl-header_searchBtn:not(.tmpl-headerSearch_close)");
     * this.$searchInput = getDOM(".tmpl-headerSearch_input");
     * this.$searchSubmit = getDOM('.tmpl-headerSearch input[type="submit"]');
     */

    var $searchClose = document.getElementById("tmpl-header_searchClose");

    /** キーボード操作時に検索エリア内でループさせる. */
    this.$searchSubmit.addEventListener("blur", function () {
      that.$searchBtn.focus();
      $searchClose.classList.add("onfocus");
    });

    this.$searchBtn.addEventListener("blur", function () {
      that.$searchInput.focus();
      $searchClose.classList.remove("onfocus");
    });

    this.$searchInput.addEventListener("blur", function () {
      that.$searchBlue.focus();
    });
  },

  onClickHamburgerBtn: function () {
    var tweenOption = {
      ease: "circ.out",
    };

    if (this.isOpen == true) {
      this.isOpen = false;
      for (var i = 0; i < this.$spDropDownBtn.length; i++) {
        this.$spDropDownBtn[i].style.visibility = "hidden";
      }
      this.close(tweenOption);
      this.$hamburgerBtnName.innerText = "menu";
    } else if (this.isOpen == false) {
      this.isOpen = true;
      for (var i = 0; i < this.$spDropDownBtn.length; i++) {
        this.$spDropDownBtn[i].style.visibility = "visible";
      }
      this.open(tweenOption);
      this.$hamburgerBtnName.innerText = "close";
    }
  },

  // 検索アイコンにフォーカスがのった時にメニューを閉じる
  onCloseHamburgerBtn: function () {
    if (window.innerWidth <= 640) {
      var tweenOption = {
        ease: "circ.out",
      };

      this.isOpen = false;
      for (var i = 0; i < this.$spDropDownBtn.length; i++) {
        this.$spDropDownBtn[i].style.visibility = "hidden";
      }
      this.close(tweenOption);
      this.$hamburgerBtnName.innerText = "menu";
    }
  },

  // SPサイズでのアコーディオン. タブレットは別挙動
  onClickDropDownBtn: function (e) {
    if (
      (this.isSmallLayout = window.innerWidth <= 640 || this.isTablet == true)
    ) {
      e.preventDefault();
    }
    if (!this.isTouchDevice() && !this.isSmallLayout) return;

    if (this.isTablet) {
      var option = this.setDropDownTarget(e);
      var $navItem = option.$navItem;
      var $dropDown = option.$dropDown;
      var tweenOption = option.tweenOption;

      var that = this;
      // 一旦is-openを外す
      $navItem.classList.remove(this.className.open);

      // 通り過ぎた場合は無視
      setTimeout(function () {
        var isheaderItemHover = that.checkIsHoverDropDown();

        if (e.type === "focus") isheaderItemHover = true;

        // - !_self.isEnter ナナメのカーソル移動を制御.
        if (isheaderItemHover && !that.isEnter) {
          if ($navItem.classList.contains("js-dropDown") == true) {
            that.openDropDown($navItem, $dropDown, tweenOption, e);
          } else {
            that.closeDropDown($navItem, $dropDown, tweenOption);
          }
        }
      }, this.dropDownDelay);
    } else {
      var option = this.setDropDownTarget(e);
      var $navItem = option.$navItem;
      var $dropDown = option.$dropDown;
      var tweenOption = option.tweenOption;

      if ($navItem.classList.contains(this.className.open) == true) {
        $navItem.querySelector(".tmpl-headerNavItem_name").innerText = "open";
        this.closeDropDown($navItem, $dropDown, tweenOption);
      } else {
        $navItem.querySelector(".tmpl-headerNavItem_name").innerText = "close";
        this.openDropDown($navItem, $dropDown, tweenOption);
      }
    }
  },

  onMouseEnterDropDownBtn: function (e) {
    if (this.isSmallLayout) return;

    var option = this.setDropDownTarget(e);
    var $navItem = option.$navItem;
    var $dropDown = option.$dropDown;
    var tweenOption = option.tweenOption;

    // 通り過ぎた場合は無視
    var that = this;

    // クラスの追加する前に一旦削除
    for (var l = 0; l < this.$navItemLink.length; l++) {
      this.$navItemLink[l].classList.remove("enterLink");
    }

    // 全てのドロップダウンリンクをhiddenにする
    for (var t = 0; t < this.$navTopLink.length; t++) {
      this.$navTopLink[t].style.visibility = "hidden";
    }
    for (var o = 0; o < this.$navLink.length; o++) {
      this.$navLink[o].style.visibility = "hidden";
    }
    for (var p = 0; p < this.$slideBtn.length; p++) {
      this.$slideBtn[p].style.visibility = "hidden";
    }

    // クラスの追加する
    e.currentTarget.classList.add("enterLink");

    setTimeout(function () {
      var isheaderItemHover = that.checkIsHoverDropDown();

      if (e.type === "focus") isheaderItemHover = true;

      // - !_self.isEnter ナナメのカーソル移動を制御.
      // if (isheaderItemHover && !that.isEnter) {
      if ($navItem.classList.contains("js-dropDown") == true) {
        that.openDropDown($navItem, $dropDown, tweenOption, e);
      } else {
        that.closeDropDown($navItem, $dropDown, tweenOption);
      }
      // }
    }, this.dropDownDelay);
  },

  onMouseLeaveDropDownBtn: function (e) {
    if (this.isSmallLayout) return;
    this.isEnter = false;

    var option = this.setDropDownTarget(e);
    var $navItem = option.$navItem;
    var $dropDown = option.$dropDown;
    var tweenOption = option.tweenOption;

    var isDropDownHover = this.checkIsHoverDropDown();

    if (isDropDownHover && !this.isEnter) return;

    var that = this;

    // クラスの削除
    for (var l = 0; l < this.$navItemLink.length; l++) {
      this.$navItemLink[l].classList.remove("enterLink");
    }

    setTimeout(function () {
      var isheaderNavItemHover = that.checkIsHoverDropDown();

      // - カーソルが外れた直後にドロップダウンに戻った場合は無視.
      if (isheaderNavItemHover && that.isEnter) return;
      that.closeDropDown($navItem, $dropDown, tweenOption);
    }, that.dropDownDelay);
  },

  onMouseEnterDropDown: function () {
    this.isEnter = true;
  },

  onMouseLeaveDropDown: function (e) {
    this.onMouseLeaveDropDownBtn(e);
  },

  /**
   * TAB + shift で focus した際もドロップダウンを開く.
   * @param {Event} e
   */
  onFocusDropDownItem: function (e) {
    var $target = $(e.currentTarget);
    var $navItem = $target[0].closest(".tmpl-headerNav_item");
    var $dropDown = $navItem.querySelector(".tmpl-headerNavItem_dropDown");

    var tweenOption = {
      ease: "circ.out",
      duration: this.duration,
    };

    var isFocusEvent = true;

    this.openDropDown($navItem, $dropDown, tweenOption, isFocusEvent);
  },

  onTouchStart: function (e) {
    if (!this.isOpen) return;
    this.touchStartX = e.touches[0].pageX;
    this.touchStartY = e.touches[0].pageY;
  },

  onTouchMove: function (e) {
    if (!this.isOpen) return;
    this.touchMoveX = e.changedTouches[0].pageX;
    this.touchMoveY = e.changedTouches[0].pageY;
  },

  onTouchEnd: function (e) {
    if (!this.isOpen) return;
    const isSwipeRight =
      this.touchMoveX - this.touchStartX > 50 &&
      Math.abs(this.touchMoveY - this.touchStartY) < 100;

    if (this.$header.classList.contains(this.className.open) && isSwipeRight) {
      this.close({ ease: "circ.out" });
      this.touchMoveX = this.touchStartX;
      this.touchMoveY = this.touchStartY;
    }
  },

  onKeyDown: function (e) {
    this.isShiftKeyDown = e.shiftKey ? true : false;

    if (e.ctrlKey && e.shiftKey && e.keyCode === 70) {
      this.$header.classList.remove(this.className.hide);
      return false;
    } else if (e.keyCode === 27) {
      if (this.isShowSearchArea) this.hideSearchArea();
      if (this.isDrop)
        this.closeDropDown(this.$navItem, this.$dropDown, { duration: 0 });
      return false;
    }
  },

  onScroll: function () {
    this.scrollTop = window.scrollTo();
    var ScrollDirection = this.getScrollDirection();

    if (this.scrollTop < 50 || this.isOpen) {
      this.$header.classList.remove(this.className.hide);
    } else {
      switch (ScrollDirection) {
        case "down":
          this.$header.classList.add(this.className.hide);
          break;
        case "up":
          this.$header.classList.remove(this.className.hide);
          break;
      }
    }
    this.saveScrollTop();
  },

  onResize: function (e) {
    if (this.resizeTimer) clearTimeout(this.resizeTimer);

    var that = this;
    this.resizeTimer = setTimeout(function () {
      that.prepare();
      that.reset();
      if (window.innerWidth <= 640) {
        that.$header.classList.add("sp-header");
      } else {
        that.$header.classList.remove("sp-header");
      }
    }, 100);
  },

  navClickLink: function (e) {
    // enterが押されたか判定する
    var $target = e.currentTarget;
    if (
      e.detail == 0 ||
      window.innerWidth <= 640 ||
      document.activeElement == $target
    ) {
      e.preventDefault();
      if ($target.classList.contains("enterLink")) {
        this.onMouseLeaveDropDownBtn(e);
      } else {
        this.onMouseEnterDropDownBtn(e);
      }
    }
  },

  /**
   * グロナビ内のリンクをクリックした際の計測.
   * @param {Event} e
   */
  analyticsClickLink: function (e) {
    // s: AppMeasurement.js, s_code.js が問題なく読み込めていれば定義されている.
    if (!s) return;

    var $target = e.currentTarget;
    var name = $target.getAttribute("data-analytics-name");
    var category = "";

    /**
     * closest: ドロップダウン内のリンクをクリックした場合.
     * nextElementSibling: グロナビの項目をクリックした場合.
     */
    var dropDownDOM =
      $target.closest(".tmpl-headerNavItem_dropDown") ||
      $target.nextElementSibling;
    if (dropDownDOM) {
      category = dropDownDOM.getAttribute("data-category");
    }
    var url = location.href;
    var lang = COMMON_DATA.lang;
    var txt = "headernavi_" + lang + "+" + category + "_to_" + name + "+" + url;

    s.tl(true, "o", txt);
  },

  /**
   * ドロップダウンが開いたタイミングで発火する計測.
   * @param {JQuery} $dropDown // - ドロップダウンのJqueryオブジェクト.
   */
  analyticsOpenDropDown: function ($dropDown) {
    var category = $dropDown.getAttribute("data-category");
    var url = location.href;
    var txt =
      "headernavi_" + COMMON_DATA.lang + "_show_" + category + "+" + url;

    s.tl(true, "o", txt);
  },

  /**
   * スクロールの方向を "down" か "up" 文字列で返す.
   */
  getScrollDirection: function () {
    return this.scrollTop > this.savedScrollTop ? "down" : "up";
  },

  /**
   * this.scrollTop を this.savedScrollTop に保存.
   */
  saveScrollTop: function () {
    // IE の挙動が不安定なので出しわけ.
    var that = this;
    if (this.isIE) {
      if (this.scrollTimer) clearTimeout(that.scrollTimer);
      this.scrollTimer = setTimeout(function () {
        that.savedScrollTop = that.scrollTop;
      }, 100);
    } else {
      this.savedScrollTop = this.scrollTop;
    }
  },

  setDropDownTarget: function (e) {
    var $target = e.currentTarget;
    var $navItem = $target.parentNode;
    var $dropDown = $navItem.querySelector(".tmpl-headerNavItem_dropDown");

    var tweenOption = {
      ease: "circ.out",
      duration: this.duration,
    };

    var option = {
      $navItem: $navItem,
      $dropDown: $dropDown,
      tweenOption: tweenOption,
    };

    return option;
  },

  /**
   * ホバー要素のセレクタに this.dropDownClassNames が含まれているかを判定.
   */
  checkIsHoverDropDown: function () {
    var $hovers = document.querySelectorAll(":hover");
    let isDropDownHover = false;

    var that = this;

    for (var i = 0; i < $hovers.length; i++) {
      var $elem = $hovers[i];
      this.dropDownClassNames.forEach(function (className) {
        if ($elem.classList.contains(className) == true) {
          return (isDropDownHover = true);
        }
      });
      if (isDropDownHover) break;
    }

    // $hovers.each(function (_, elem) {
    // var $elem = $(elem);

    // that.dropDownClassNames.forEach(function (className) {
    //     if ($elem.classList.contains(className) == true){
    //         return (isDropDownHover = true);
    //     }
    // });
    // if (isDropDownHover) return false;
    // });

    return isDropDownHover;
  },

  /**
   * グロナビを開く処理.
   * @param {*} tweenOption - アニメーションの設定.
   */
  open: function (tweenOption) {
    this.isOpen = true;
    this.$head.classList.add(this.className.open);
    this.headHeight = this.$head.offsetHeight;
    // tweenOption.x = 0;
    tweenOption.height = window.innerHeight - this.headHeight;
    // this.$nav.height(window.innerHeight - this.headHeight);
    this.$header.classList.add(this.className.open);

    // TweenMax.to(this.$nav, this.duration, tweenOption);
    this.$nav.style.height = tweenOption.height + "px";

    this.toDisableScroll();
    this.onOutScroll(this.$nav, "HeaderEvent");

    // イベント発火
    var detail = { foo: 1 };
    var event;

    try {
      event = new CustomEvent("onOpenDropDown", { detail: detail });
    } catch (e) {
      event = document.createEvent("CustomEvent");
      event.initCustomEvent("onOpenDropDown", false, false, detail);
    }
  },

  /**
   * グロナビを閉じる処理.
   * @param {*} tweenOption - アニメーションの設定.
   */
  close: function (tweenOption) {
    this.isOpen = false;
    this.$head.classList.remove(this.className.open);
    this.$header.classList.remove(this.className.open);
    // tweenOption.x = this.$nav.width();
    // tweenOption.height = 0;

    // var that = this;
    // tweenOption.onComplete = function () {
    //   that.$nav.style.height = "0px";
    // };

    // TweenMax.to(this.$nav, this.duration, tweenOption);
    this.$nav.style.height = "0px";

    this.toEnableScroll();
    this.offOutScroll(this.$nav, "HeaderEvent");

    document.dispatchEvent(new Event("onCloseDropDown"));
  },

  /**
   * ドロップダウンを開く関数.
   * @param {JQuery} $navItem
   * @param {JQuery} $dropDown
   * @param {Object} tweenOption - アニメーションの設定.
   */
  openDropDown: function ($navItem, $dropDown, tweenOption, e) {
    /**
     * focus イベントの場合.
     */
    if (e && e.type === "focus") {
      var focusNavItem = this.openDropDownByFocus($navItem, $dropDown);
      if (focusNavItem) $navItem = focusNavItem;
    }

    var $dropDownContent = $dropDown.querySelector(
      ".tmpl-headerNavDropDown_inner"
    );
    var $topLink = $dropDownContent.querySelector(
      ".tmpl-headerNavDropDown_toCategoryTop > a"
    );
    var $dropLink = $dropDownContent.querySelectorAll(
      ".tmpl-headerNavDropDown_item > a"
    );
    var $dropBtn = $dropDownContent.querySelector(
      ".tmpl-headerNavDropDown_imgContainer a"
    );
    var dropDownHeight = $dropDownContent.offsetHeight;
    var category = $dropDown.getAttribute("data-category");

    this.isDrop = true;

    if (this.isSmallLayout) {
      for (var i = 0; i < this.$navItem.length; i++) {
        if (!this.$dropDown[i]) {
          break;
        }
        this.closeDropDown(this.$navItem[i], this.$dropDown[i], {
          duration: 0,
        }); // いったんすべてのドロップダウンを閉じる.
      }
    }

    // ナビゲーション内のリンクをvisibleにする
    $topLink.style.visibility = "visible";
    for (var v = 0; v < $dropLink.length; v++) {
      $dropLink[v].style.visibility = "visible";
    }
    // スライドコントロールボタン
    if ($dropBtn != null) {
      $dropBtn.style.visibility = "visible";
    }

    for (var i = 0; i < this.$navItem.length; i++) {
      this.$navItem[i].classList.remove(this.className.open);
    }

    $navItem.classList.add(this.className.open);

    tweenOption.height = dropDownHeight;

    // ウィンドウサイズで処理を出しわけ.
    var that = this;
    if (this.isSmallLayout) {
      var itemHeight = $navItem.offsetHeight;
      // var scrollPos = itemHeight * $navItem.index();
      var scrollPos =
        itemHeight * Array.prototype.indexOf.call($navItem, this.target);
      TweenMax.to($dropDown, that.duration, tweenOption);
      this.$nav.animate({ scrollTop: scrollPos }, this.duration * 1000);
    } else {
      TweenMax.to(this.$dropDownBg, this.duration, tweenOption);
      this.$dropDownBg.classList.add(this.className.open);
    }

    this.analyticsOpenDropDown($dropDown);

    // TOP ページのスライダーを止めるためにイベントを発火
    var detail = { foo: 1 };
    var event;

    try {
      event = new CustomEvent("onOpenDropDown", { detail: detail });
    } catch (e) {
      event = document.createEvent("CustomEvent");
      event.initCustomEvent("onOpenDropDown", false, false, detail);
    }
    document.dispatchEvent(event);

    /**
     * 開いたドロップダウンのスライダーを取得.
     * @update 20.10.29
     */
    var currentSlider = this.Slider[category];

    // 一旦全部のスライド止める
    for (var i = 0; i < this.dropCategoryItem.length; i++) {
      var categoryItem = this.dropCategoryItem[i].getAttribute("data-category");
      /**
       * currentSlider が存在しない場合は実行させない.
       * @update 20.10.29
       */
      if (currentSlider) currentSlider.autoplay.stop();
      if (this.dropCategoryItem[i].querySelector("video"))
        this.dropCategoryItem[i].querySelector("video").pause();
    }

    // グロナビ内のスライダーを動かす
    if (this.$pauseBtn.classList.contains("-pause")) {
      /**
       * currentSlider が存在しない場合は実行させない.
       * @update 20.10.29
       */
      if (currentSlider) {
        currentSlider.autoplay.start();
      } else if ($dropDown.querySelector("video")) {
        $dropDown.querySelector("video").play();
      }

      for (var i = 0; i < this.$navItem.length; i++) {
        this.$navItem[i].classList.add("play");
      }
    } else {
      for (var i = 0; i < this.$navItem.length; i++) {
        this.$navItem[i].classList.remove("play");
      }
    }
  },

  /**
   * ドロップダウンを閉じる関数.
   * @param {JQuery} $navItem
   * @param {JQuery} $dropDown
   * @param {Object} tweenOption - アニメーションの設定.
   */
  closeDropDown: function ($navItem, $dropDown, tweenOption) {
    // クラスの削除
    for (var l = 0; l < this.$navItemLink.length; l++) {
      this.$navItemLink[l].classList.remove("enterLink");
    }

    for (var i = 0; i < this.$navItem.length; i++) {
      this.$navItem[i].classList.remove(this.className.open); // 全部消さないと移動が早いときに消えない.
      this.$navItem[i].classList.remove("play");
    }

    // 全てのドロップダウンリンクをhiddenにする
    for (var t = 0; t < this.$navTopLink.length; t++) {
      this.$navTopLink[t].style.visibility = "hidden";
    }
    for (var o = 0; o < this.$navLink.length; o++) {
      this.$navLink[o].style.visibility = "hidden";
    }
    for (var p = 0; p < this.$slideBtn.length; p++) {
      this.$slideBtn[p].style.visibility = "hidden";
    }

    tweenOption.ease = this.isSmallLayout ? "circ.out" : "none";
    tweenOption.height = 0;

    var duration = tweenOption.duration === 0 ? 0 : this.duration;

    // ウィンドウサイズで処理を出しわけ.
    if (this.isSmallLayout) {
      TweenMax.to($dropDown, duration, tweenOption);
    } else {
      TweenMax.to(this.$dropDownBg, this.duration, tweenOption);
      this.$dropDownBg.classList.remove(this.className.open);
    }

    this.isDrop = false;

    // TOP ページのスライダーを止めるためにイベントを発火.
    var detail = { foo: 1 };
    var event;

    try {
      event = new CustomEvent("onCloseDropDown", { detail: detail });
    } catch (e) {
      event = document.createEvent("CustomEvent");
      event.initCustomEvent("onCloseDropDown", false, false, detail);
    }
    document.dispatchEvent(event);

    // グロナビスライド全部止める
    for (var i = 0; i < this.dropCategoryItem.length; i++) {
      var sliderItems = this.dropCategoryItem[i].querySelectorAll(
        ".tmpl-headerNavSlider_item"
      );
      var categoryItem = this.dropCategoryItem[i].getAttribute("data-category");
      /**
       * スライドのアイテムが1つだけの時は定義させない.
       * @update 20.10.29
       */
      if (sliderItems.length <= 1) continue;
      this.Slider[categoryItem].autoplay.stop();
    }
  },

  /**
   * ドロップダウンの要素に focus したときに発生する処理.
   * @returns {DOM} prevNavItem - shift + Tab で戻った時のグロナビアイテム.
   */
  openDropDownByFocus: function ($navItem, $dropDown) {
    if (this.isEnter) return;
    var topLink = $dropDown.querySelector(
      ".tmpl-headerNavDropDown_toCategoryTop > a"
    );
    if (this.isShiftKeyDown) {
      var index = [].slice.call(this.$navItem).indexOf($navItem);
      if (index > 0) {
        var selector = {
          videoBtn: ".tmpl-headerNav_pauseController_btn",
          linkItem: ".tmpl-headerNavDropDown_item a",
        };
        var prevNavItem = this.$navItem[index - 1];
        var prevVideoBtn = prevNavItem.querySelector(selector.videoBtn);
        var prevLinkItem = prevNavItem.querySelectorAll(selector.linkItem);
        var focusTarget = prevVideoBtn || prevLinkItem[prevLinkItem.length - 1];

        focusTarget.focus();
        return prevNavItem;
      }
    } else {
      topLink.focus();
    }
  },

  checkHasVideo: function ($elm) {
    var $video = $elm.querySelectorAll("video");
    var hasVideo = $video.length ? true : false;
    return hasVideo;
  },

  showSearchArea: function (e) {
    e.preventDefault();
    this.isShowSearchArea = true;
    this.$search.style.display = "block";
    this.$search.classList.add(this.className.open);
    this.$searchInput.focus();

    // クラスの付けはずし
    this.$searchBtn.classList.remove("search_open");
    this.$searchBtn.classList.add("search_close");
    // 閉じるボタンに変換する
    this.$searchName.innerText = "close";
    // アイコンを変更する
    this.searchImg.style.display = "none";
    this.searchcloseBtn.style.display = "block";

    // var that = this;
    // this.$searchSubmit.onblur = function () {
    // _self.$searchInput.focus();
    // that.$searchInput.focus();
    // that.$test.focus();
    // that.$test.classList.add("onblur");
    // };
  },

  hideSearchArea: function () {
    this.isShowSearchArea = false;
    this.$search.style.display = "none";
    this.$search.classList.remove(this.className.open);
    // クラスの付けはずし
    this.$searchBtn.classList.remove("search_close");
    this.$searchBtn.classList.add("search_open");
    // 開くボタンに変更する
    this.$searchName.innerText = "Search";
    // アイコンを変更する
    this.searchcloseBtn.style.display = "none";
    this.searchImg.style.display = "block";
    this.$searchInput.blur();
    this.$searchBtn.focus();
  },

  /**
   * SP サイズ時に fixed 要素のスクロール領域から外れた場合を監視.
   * touch イベントを無効化させる.
   * @param {JQuery} $elem - スクロール要素.
   * @param {String} nameSpace - イベントの名前空間.
   */
  onOutScroll: function ($elem, nameSpace) {
    let touchStartY = 0,
      touchMoveY = 0,
      diff = 0;

    var elem = $elem[0];

    $elem.addEventListener("touchstart." + nameSpace, function (e) {
      touchStartY = e.touches[0].pageY;
    });
    $elem.addEventListener("touchmove." + nameSpace, function (e) {
      touchMoveY = e.changedTouches[0].pageY;
      diff = touchStartY - touchMoveY;

      var scrollPosFlg = {
        top: elem.scrollTop == 0 && diff < 0,
        bottom:
          elem.scrollTop + elem.clientHeight == elem.scrollHeight && diff > 0,
      };

      if (scrollPosFlg.top || scrollPosFlg.bottom) {
        if (e.cancelable) e.preventDefault();
      }
    });
  },

  offOutScroll: function ($elem, nameSpace) {
    // $elem.off(nameSpace);
    $elem.removeEventListener(nameSpace, $elem, false);
  },

  isTouchDevice: function () {
    window.ontouchstart = false;
    return window.ontouchstart === null ? true : false;
  },

  /**
   * 無効化したスクロールを有効化する.
   */
  toEnableScroll: function () {
    this.$body.style.position = "";
    this.$body.style.top = "";
    window.scrollTo(0, this.savedScrollTop);
  },

  /**
   * スクロールを無効化する.
   */
  toDisableScroll: function () {
    this.savedScrollTop = this.scrollTop ? this.scrollTop : window.scrollTo();

    var that = this;
    setTimeout(function () {
      that.$body.style.position = "fixed";
      that.$body.style.top = "-" + that.savedScrollTop;
    }, 0);
  },

  /**
   * JS で付与したスタイルやクラス名をリセット.
   */
  reset: function () {
    this.$head.classList.remove(this.className.open);
    for (var i = 0; i < this.$navItem.length; i++) {
      this.$navItem[i].classList.remove(this.className.open);
    }
    this.$nav.style.height = "";
    for (var i = 0; i < this.$dropDown.length; i++) {
      this.$dropDown[i].style.height = "";
    }
    this.$dropDownBg.style.width = "";
    this.$dropDownBg.style.height = "";
  },

  /** ---------------------------------------------
    * ドロップダウンの画像スライダー.
     ---------------------------------------------- */
  addEventsSliderAll: function () {
    for (var i = 0; i < this.$sliderBtn.length; i++) {
      this.$sliderBtn[i].addEventListener("click", this.moveSlider.bind(this));
    }
  },

  moveSlider: function (e) {
    e.preventDefault();
    var that = this;
    for (var i = 0; i < this.$sliderBtn.length; i++) {
      if (this.$sliderBtn[i].classList.contains("-pause")) {
        this.isPauseSlider = true;
        this.$sliderPauseBtn[i].classList.remove(this.className.active);
        this.$sliderPlayBtn[i].classList.add(this.className.active);

        // グロナビスライド全部止める
        for (var j = 0; j < this.dropCategoryItem.length; j++) {
          var sliderItem = this.dropCategoryItem[j].querySelector(
            ".tmpl-headerNavSlider_item"
          );
          var sliderItems = this.dropCategoryItem[j].querySelectorAll(
            ".tmpl-headerNavSlider_item"
          );
          var categoryItem =
            this.dropCategoryItem[j].getAttribute("data-category");
          /**
           * スライドのアイテムが1つだけの時は定義させない.
           * @update 20.10.29
           */
          if (sliderItem.querySelector("video")) {
            sliderItem.querySelector("video").pause();
          }

          if (sliderItems.length <= 1) continue;

          this.Slider[categoryItem].autoplay.stop();
        }

        this.$sliderBtn[i].classList.remove("-pause");
        this.$sliderBtn[i].classList.add("-play");
        this.$noBtn[i].innerText = "play";
      } else if (this.$sliderBtn[i].classList.contains("-play")) {
        this.isPauseSlider = false;
        this.$sliderPlayBtn[i].classList.remove(this.className.active);
        this.$sliderPauseBtn[i].classList.add(this.className.active);

        // 移動してもズーム処理復活
        for (var j = 0; j < this.$navItem.length; j++) {
          this.$navItem[j].classList.add("play");
        }

        // 現在表示してあるスライドだけ動かす
        var $target = e.currentTarget;
        var $target_elm = e.currentTarget.closest(
          ".tmpl-headerNavItem_dropDown"
        );
        var category = $target_elm.getAttribute("data-category");
        if ($target_elm.querySelector("video")) {
          $target_elm.querySelector("video").play();
        } else {
          this.Slider[category].autoplay.start();
        }

        this.$sliderBtn[i].classList.remove("-play");
        this.$sliderBtn[i].classList.add("-pause");
        this.$noBtn[i].innerText = "pause";
      }
    }
  },
};

//ready
document.addEventListener("DOMContentLoaded", function () {
  var header = new Header();
  header.init();
});
