// ===== 전역 변수 및 상태 관리 =====
let cart = [];
let isLoggedIn = false;
let currentUser = null;
let searchVisible = false;
let wishlist = [];

// 접근성 설정 상태
let accessibilitySettings = {
  highContrast: false,
  largeText: false,
  enhancedFocus: false,
  screenReaderMode: false,
  reducedMotion: false,
};

// 상품 데이터 (확장됨)
const products = {
  1: {
    name: "iPhone 16 Pro 256GB",
    image: "images/iphone.jpg",
    price: 1350000,
    originalPrice: 1550000,
    description:
      "6.1인치 Super Retina XDR 디스플레이, A17 Pro 칩, Pro 카메라 시스템",
    category: "smartphone",
    stock: 15,
    rating: 4.6,
    reviewCount: 342,
  },
  2: {
    name: "MacBook Pro14",
    image: "images/macbook.jpg",
    price: 1912000,
    originalPrice: 2390000,
    description:
      "14인치 Liquid Retina XDR 디스플레이, M3 Pro 칩, 18GB 통합 메모리",
    category: "laptop",
    stock: 0,
    rating: 4.8,
    reviewCount: 156,
  },
  3: {
    name: "iPad Pro 12.9 M2",
    image: "images/ipad.jpg",
    price: 1199000,
    originalPrice: null,
    description: "12.9인치 Liquid Retina XDR 디스플레이, M2 칩, 256GB 저장공간",
    category: "tablet",
    stock: 7,
    rating: 4.7,
    reviewCount: 298,
  },
};

// 검색 제안 데이터
const searchSuggestions = [
  "iPhone 15 Pro",
  "MacBook Pro M3",
  "iPad Pro",
  "AirPods Pro",
  "Apple Watch",
  "무선 충전기",
  "케이스",
  "보호필름",
];

// ===== 접근성 유틸리티 함수 =====

/**
 * 스크린 리더에 메시지 전달 (다중 우선순위 지원)
 */
function announceToScreenReader(message, priority = "polite", atomic = true) {
  const regionId =
    priority === "assertive" ? "alert-announcements" : "status-announcements";
  let announcer = document.getElementById(regionId);

  if (!announcer) {
    announcer = document.createElement("div");
    announcer.id = regionId;
    announcer.setAttribute("aria-live", priority);
    announcer.setAttribute("aria-atomic", atomic.toString());
    announcer.className = "visually-hidden";
    announcer.setAttribute(
      "role",
      priority === "assertive" ? "alert" : "status",
    );
    document.body.appendChild(announcer);
  }

  // 기존 내용을 지우고 새 메시지 설정
  announcer.textContent = "";

  // 비동기적으로 메시지 설정 (스크린 리더가 감지할 수 있도록)
  requestAnimationFrame(() => {
    announcer.textContent = message;
    console.log(`[A11Y] ${priority.toUpperCase()}: ${message}`);
  });
}

/**
 * 진보된 포커스 관리
 */
function focusElement(element, options = {}) {
  const {
    scroll = true,
    preventScroll = false,
    announceTarget = true,
    scrollBehavior = "smooth",
    scrollBlock = "center",
  } = options;

  const targetElement =
    typeof element === "string" ? document.querySelector(element) : element;

  if (!targetElement) {
    console.warn(`[A11Y] 포커스 대상을 찾을 수 없습니다: ${element}`);
    return false;
  }

  // 포커스 가능하게 만들기
  if (targetElement.tabIndex < 0 && !targetElement.hasAttribute("tabindex")) {
    targetElement.tabIndex = -1;
  }

  try {
    targetElement.focus({ preventScroll });

    if (scroll && !preventScroll) {
      targetElement.scrollIntoView({
        behavior: scrollBehavior,
        block: scrollBlock,
        inline: "nearest",
      });
    }

    if (announceTarget) {
      const elementText = getElementText(targetElement);
      if (elementText) {
        announceToScreenReader(`${elementText}로 포커스가 이동되었습니다.`);
      }
    }

    return true;
  } catch (error) {
    console.error(`[A11Y] 포커스 이동 실패:`, error);
    return false;
  }
}

/**
 * 요소의 접근 가능한 텍스트 추출
 */
function getElementText(element) {
  // aria-label 우선
  if (element.getAttribute("aria-label")) {
    return element.getAttribute("aria-label");
  }

  // aria-labelledby 참조
  const labelledBy = element.getAttribute("aria-labelledby");
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement) {
      return labelElement.textContent.trim();
    }
  }

  // 텍스트 콘텐츠
  const text = element.textContent.trim();
  if (text) {
    return text;
  }

  // alt 속성 (이미지 등)
  if (element.alt) {
    return element.alt;
  }

  // placeholder (입력 필드)
  if (element.placeholder) {
    return element.placeholder;
  }

  return element.tagName.toLowerCase();
}

/**
 * 폼 검증 및 에러 처리 (향상된 버전)
 */
function showFieldValidation(fieldId, message, isValid = false, options = {}) {
  const {
    focusOnError = true,
    announceError = true,
    showVisualIndicator = true,
  } = options;

  const field = document.getElementById(fieldId);
  const errorElement = document.getElementById(`${fieldId}-error`);

  if (!field || !errorElement) {
    console.warn(`[A11Y] 필드 또는 에러 요소를 찾을 수 없습니다: ${fieldId}`);
    return;
  }

  if (isValid) {
    field.setAttribute("aria-invalid", "false");
    field.classList.remove("error");
    errorElement.textContent = "";
    errorElement.removeAttribute("role");
  } else {
    field.setAttribute("aria-invalid", "true");
    if (showVisualIndicator) {
      field.classList.add("error");
    }
    errorElement.textContent = message;
    errorElement.setAttribute("role", "alert");

    if (focusOnError) {
      focusElement(field, { announceTarget: false });
    }

    if (announceError) {
      announceToScreenReader(`입력 오류: ${message}`, "assertive");
    }
  }
}

/**
 * 장바구니 카운트 업데이트 (개선된 버전)
 */
function updateCartCount() {
  const cartCountElement = document.getElementById("cart-count");
  const cartButton = cartCountElement
    ? cartCountElement.closest("button")
    : null;

  if (!cartCountElement || !cartButton) return;

  const count = cart.length;
  cartCountElement.textContent = count;

  // ARIA 라벨 업데이트
  cartButton.setAttribute("aria-label", `장바구니 (${count}개 상품)`);

  // 실시간 업데이트 알림
  cartCountElement.setAttribute("aria-live", count > 0 ? "polite" : "off");
}

// ===== 접근성 도구 기능 =====

/**
 * 고대비 모드 토글
 */
function toggleHighContrast() {
  accessibilitySettings.highContrast = !accessibilitySettings.highContrast;
  const button = document.getElementById("toggle-high-contrast");

  if (accessibilitySettings.highContrast) {
    document.documentElement.setAttribute("data-theme", "high-contrast");
    if (button) button.setAttribute("aria-pressed", "true");
    announceToScreenReader("고대비 모드가 활성화되었습니다.");
  } else {
    document.documentElement.removeAttribute("data-theme");
    if (button) button.setAttribute("aria-pressed", "false");
    announceToScreenReader("고대비 모드가 비활성화되었습니다.");
  }

  localStorage.setItem(
    "a11y-high-contrast",
    accessibilitySettings.highContrast,
  );
}

/**
 * 큰 글씨 모드 토글
 */
function toggleLargeText() {
  accessibilitySettings.largeText = !accessibilitySettings.largeText;
  const button = document.getElementById("toggle-large-text");

  if (accessibilitySettings.largeText) {
    document.documentElement.setAttribute("data-large-text", "true");
    if (button) button.setAttribute("aria-pressed", "true");
    announceToScreenReader("큰 글씨 모드가 활성화되었습니다.");
  } else {
    document.documentElement.removeAttribute("data-large-text");
    if (button) button.setAttribute("aria-pressed", "false");
    announceToScreenReader("큰 글씨 모드가 비활성화되었습니다.");
  }

  localStorage.setItem("a11y-large-text", accessibilitySettings.largeText);
}

/**
 * 강화된 포커스 표시 토글
 */
function toggleEnhancedFocus() {
  accessibilitySettings.enhancedFocus = !accessibilitySettings.enhancedFocus;
  const button = document.getElementById("toggle-focus-indicator");

  if (accessibilitySettings.enhancedFocus) {
    document.documentElement.setAttribute("data-enhanced-focus", "true");
    if (button) button.setAttribute("aria-pressed", "true");
    announceToScreenReader("강화된 포커스 표시가 활성화되었습니다.");
  } else {
    document.documentElement.removeAttribute("data-enhanced-focus");
    if (button) button.setAttribute("aria-pressed", "false");
    announceToScreenReader("강화된 포커스 표시가 비활성화되었습니다.");
  }

  localStorage.setItem(
    "a11y-enhanced-focus",
    accessibilitySettings.enhancedFocus,
  );
}

/**
 * 스크린 리더 최적화 모드 토글
 */
function toggleScreenReaderMode() {
  accessibilitySettings.screenReaderMode =
    !accessibilitySettings.screenReaderMode;
  const button = document.getElementById("toggle-screen-reader-mode");

  if (accessibilitySettings.screenReaderMode) {
    document.documentElement.setAttribute("data-screen-reader-mode", "true");
    if (button) button.setAttribute("aria-pressed", "true");
    announceToScreenReader("스크린 리더 최적화 모드가 활성화되었습니다.");
  } else {
    document.documentElement.removeAttribute("data-screen-reader-mode");
    if (button) button.setAttribute("aria-pressed", "false");
    announceToScreenReader("스크린 리더 최적화 모드가 비활성화되었습니다.");
  }

  localStorage.setItem(
    "a11y-screen-reader-mode",
    accessibilitySettings.screenReaderMode,
  );
}

// ===== 메인 내비게이션 함수 =====

function goHome() {
  console.log("홈으로 이동");
  announceToScreenReader("홈 페이지로 이동합니다.");
  updateCurrentPage("home");
}

function showProducts() {
  console.log("상품 목록 표시");
  announceToScreenReader("상품 목록 페이지로 이동합니다.");
  updateCurrentPage("products");
}

function showCart() {
  renderCart();
  document.getElementById("cart-panel").hidden = false;
  const title = document.getElementById("cart-title");
  title.focus({ preventScroll: true });
  document
    .getElementById("cart-panel")
    .scrollIntoView({ block: "start", behavior: "instant" });
  if (typeof updateCurrentPage === "function") updateCurrentPage("cart");
}

function showMyPage() {
  console.log("마이페이지 표시");

  if (!isLoggedIn) {
    const message = "로그인이 필요합니다. 로그인 폼으로 이동합니다.";
    announceToScreenReader(message, "assertive");
    showNotification(message, "warning");

    setTimeout(() => {
      focusElement("#username", { announceTarget: false });
    }, 1000);
  } else {
    const message = `${currentUser}님의 마이페이지로 이동합니다.`;
    announceToScreenReader(message);
    updateCurrentPage("mypage");
  }
}

/**
 * 현재 페이지 상태 업데이트
 */
function updateCurrentPage(page) {
  const navButtons = document.querySelectorAll(".nav-list button");
  navButtons.forEach((button) => {
    button.setAttribute("aria-current", "false");
  });

  const pageMapping = {
    home: 0,
    products: 0,
    cart: 1,
    mypage: 2,
  };

  if (pageMapping[page] !== undefined && navButtons[pageMapping[page]]) {
    navButtons[pageMapping[page]].setAttribute("aria-current", "page");
  }
}

// ===== 검색 기능 =====

function toggleSearch() {
  const searchBtn = document.getElementById("search");
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");

  searchVisible = !searchVisible;

  if (searchVisible) {
    if (searchForm) searchForm.hidden = false;
    if (searchBtn) {
      searchBtn.setAttribute("aria-expanded", "true");
      searchBtn.setAttribute("aria-label", "검색창 닫기");
    }

    setTimeout(() => {
      if (searchInput) searchInput.focus();
    }, 100);

    announceToScreenReader("검색창이 열렸습니다. 검색어를 입력하세요.");
  } else {
    if (searchForm) searchForm.hidden = true;
    if (searchBtn) {
      searchBtn.setAttribute("aria-expanded", "false");
      searchBtn.setAttribute("aria-label", "검색창 열기");
      searchBtn.focus();
    }

    announceToScreenReader("검색창이 닫혔습니다.");
  }
}

function performSearch() {
  const searchInput = document.getElementById("search-input");
  const query = searchInput ? searchInput.value.trim() : "";

  if (!query) {
    showFieldValidation("search-input", "검색어를 입력해주세요.");
    return;
  }

  console.log(`검색 실행: ${query}`);
  announceToScreenReader(`"${query}"에 대한 검색을 시작합니다.`);

  // 검색 시뮬레이션
  setTimeout(() => {
    const resultCount = Object.keys(products).length;
    announceToScreenReader(
      `"${query}" 검색이 완료되었습니다. ${resultCount}개의 결과를 찾았습니다.`,
      "assertive",
    );
    showNotification(`검색 완료: ${resultCount}개 결과`, "success");
  }, 1000);
}

// ===== 상품 관련 함수 =====

function showSale() {
  console.log("특가 페이지 표시");
  announceToScreenReader("특가 상품 페이지로 이동합니다.");
  showNotification("특가 페이지로 이동합니다!", "info");
}

function showCoupon() {
  console.log("쿠폰 받기");
  announceToScreenReader("쿠폰함으로 이동합니다.");
  showNotification("10% 할인 쿠폰이 발급되었습니다!", "success");
}

function showProduct(productId) {
  const product = products[productId];
  if (!product) return;

  console.log(`상품 ${productId} 상세 보기`);
  const message = `${
    product.name
  } 상세 페이지로 이동합니다. 가격: ${product.price.toLocaleString()}원`;
  announceToScreenReader(message);
}

function changeProductImage(productId, imageIndex) {
  const productCard = document.querySelector(
    `[data-product-id="${productId}"]`,
  );
  if (!productCard) return;

  const mainImage = productCard.querySelector(".product-image");
  const thumbnails = productCard.querySelectorAll(".thumbnail-btn");
  const targetThumbnail = thumbnails[imageIndex];
  const thumbnailImage = targetThumbnail?.querySelector("img");

  if (!mainImage || !thumbnailImage) return;

  mainImage.src = thumbnailImage.src;
  mainImage.alt = `${products[productId]?.name || "상품"} 이미지 ${imageIndex + 1}`;

  thumbnails.forEach((button, index) => {
    const isActive = index === imageIndex;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive.toString());
  });

  announceToScreenReader(`상품 이미지 ${imageIndex + 1}번으로 변경되었습니다.`);
}

function addToCart(productId) {
  const product = products[productId];
  if (!product) return;

  // 재고 확인
  if (product.stock <= 0) {
    const message = `${product.name}은(는) 현재 품절된 상품입니다.`;
    announceToScreenReader(message, "assertive");
    showNotification(message, "error");
    return;
  }

  cart.push(productId);
  renderCart();
  console.log(`상품 ${productId}를 장바구니에 추가`);

  const message = `${product.name}이(가) 장바구니에 추가되었습니다. 현재 ${cart.length}개 상품이 담겨있습니다.`;
  announceToScreenReader(message);

  showNotification(message, "success");
}

function toggleWishlist(productId) {
  const product = products[productId];
  if (!product) return;

  const button = document.querySelector(
    `[data-product-id="${productId}"] .wishlist-btn`,
  );
  const isInWishlist = wishlist.includes(productId);

  if (isInWishlist) {
    wishlist = wishlist.filter((id) => id !== productId);
    if (button) {
      button.setAttribute("aria-pressed", "false");
      button.setAttribute("aria-label", `${product.name} 위시리스트에 추가`);
    }
    announceToScreenReader(
      `${product.name}이(가) 위시리스트에서 제거되었습니다.`,
    );
    showNotification("위시리스트에서 제거되었습니다", "info");
  } else {
    wishlist.push(productId);
    if (button) {
      button.setAttribute("aria-pressed", "true");
      button.setAttribute("aria-label", `${product.name} 위시리스트에서 제거`);
    }
    announceToScreenReader(
      `${product.name}이(가) 위시리스트에 추가되었습니다.`,
    );
    showNotification("위시리스트에 추가되었습니다", "success");
  }
}

function requestRestock(productId) {
  const product = products[productId];
  if (!product) return;

  console.log(`상품 ${productId} 재입고 알림 신청`);

  const message = `${product.name}의 재입고 알림이 신청되었습니다. 재입고 시 알려드리겠습니다.`;
  announceToScreenReader(message);
  showNotification(message, "success");
}

// ===== 로그인 관련 함수 =====

function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById("username")?.value.trim() || "";
  const password = document.getElementById("password")?.value.trim() || "";

  // 실시간 검증
  let isValid = true;
  let firstErrorField = null;

  // 이메일 검증
  if (!username) {
    showFieldValidation("username", "이메일 주소를 입력해주세요.");
    isValid = false;
    firstErrorField = firstErrorField || "username";
  } else if (!isValidEmail(username)) {
    showFieldValidation("username", "올바른 이메일 주소 형식이 아닙니다.");
    isValid = false;
    firstErrorField = firstErrorField || "username";
  } else {
    showFieldValidation("username", "", true);
  }

  // 비밀번호 검증
  if (!password) {
    showFieldValidation("password", "비밀번호를 입력해주세요.");
    isValid = false;
    firstErrorField = firstErrorField || "password";
  } else if (password.length < 8) {
    showFieldValidation("password", "비밀번호는 8자 이상이어야 합니다.");
    isValid = false;
    firstErrorField = firstErrorField || "password";
  } else {
    showFieldValidation("password", "", true);
  }

  if (!isValid) {
    const errorCount = document.querySelectorAll(
      '[aria-invalid="true"]',
    ).length;
    announceToScreenReader(
      `${errorCount}개의 입력 오류가 있습니다.`,
      "assertive",
    );

    if (firstErrorField) {
      setTimeout(() => {
        focusElement(`#${firstErrorField}`, { announceTarget: false });
      }, 500);
    }
    return false;
  }

  // 로그인 처리 시뮬레이션
  announceToScreenReader("로그인을 처리하고 있습니다.", "assertive");

  setTimeout(() => {
    isLoggedIn = true;
    currentUser = username;
    console.log("로그인 성공");

    const message = `${username}님, 환영합니다! 로그인이 완료되었습니다.`;
    announceToScreenReader(message, "assertive");
    showNotification(message, "success");

    // 폼 초기화
    const usernameField = document.getElementById("username");
    const passwordField = document.getElementById("password");
    if (usernameField) usernameField.value = "";
    if (passwordField) passwordField.value = "";
  }, 1000);

  return false;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function togglePasswordVisibility() {
  const passwordInput = document.getElementById("password");
  const toggleButton = document.querySelector(".password-toggle");
  const toggleIcon = document.getElementById("password-toggle-icon");

  if (!passwordInput || !toggleButton) return;

  const isVisible = passwordInput.type === "text";

  passwordInput.type = isVisible ? "password" : "text";
  toggleButton.setAttribute("aria-pressed", (!isVisible).toString());
  toggleButton.setAttribute(
    "aria-label",
    isVisible ? "비밀번호 보기" : "비밀번호 숨기기",
  );
  if (toggleIcon) toggleIcon.textContent = isVisible ? "👁️" : "🙈";

  announceToScreenReader(
    isVisible ? "비밀번호가 숨겨졌습니다." : "비밀번호가 표시됩니다.",
  );
}

function loginWithGoogle() {
  console.log("구글 로그인");
  announceToScreenReader("구글 계정으로 로그인을 시도합니다.");
  showNotification("구글 로그인 페이지로 이동합니다.", "info");
}

function loginWithKakao() {
  console.log("카카오 로그인");
  announceToScreenReader("카카오 계정으로 로그인을 시도합니다.");
  showNotification("카카오 로그인 페이지로 이동합니다.", "info");
}

function showSignup() {
  console.log("회원가입 페이지 이동");
  announceToScreenReader("회원가입 페이지로 이동합니다.");
}

function showFindPassword() {
  console.log("비밀번호 찾기 페이지 이동");
  announceToScreenReader("비밀번호 찾기 페이지로 이동합니다.");
}

// ===== 알림 시스템 =====

function showNotification(message, type = "info", options = {}) {
  const { duration = 5000 } = options;

  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.setAttribute("role", type === "error" ? "alert" : "status");
  notification.setAttribute(
    "aria-live",
    type === "error" ? "assertive" : "polite",
  );
  notification.textContent = message;

  // 알림 컨테이너 확인/생성
  let container = document.getElementById("notification-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "notification-container";
    container.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
        `;
    document.body.appendChild(container);
  }

  // 스타일 적용
  const colors = {
    success: "#155724",
    error: "#721c24",
    warning: "#856404",
    info: "#055160",
  };

  notification.style.cssText = `
        padding: 16px 20px;
        margin-bottom: 12px;
        border-radius: 8px;
        color: white;
        background-color: ${colors[type] || colors.info};
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

  container.appendChild(notification);

  // 자동 제거
  if (duration > 0) {
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, duration);
  }

  return notification;
}

// ===== 푸터 링크 함수들 =====

function showTerms() {
  console.log("이용약관 보기");
  announceToScreenReader("이용약관 페이지로 이동합니다.");
}

function showPrivacy() {
  console.log("개인정보처리방침 보기");
  announceToScreenReader("개인정보처리방침 페이지로 이동합니다.");
}

function showContact() {
  console.log("고객센터 보기");
  announceToScreenReader("고객센터 페이지로 이동합니다.");
}

function showAccessibility() {
  console.log("접근성 정책 보기");
  announceToScreenReader("웹 접근성 정책 페이지로 이동합니다.");
}

function showShippingInfo() {
  announceToScreenReader("배송 안내 페이지로 이동합니다.");
  showNotification("배송 안내 페이지로 이동합니다.", "info");
}

function showReturnInfo() {
  announceToScreenReader("반품 및 교환 안내 페이지로 이동합니다.");
  showNotification("반품 및 교환 안내 페이지로 이동합니다.", "info");
}

function showPaymentInfo() {
  announceToScreenReader("결제 방법 안내 페이지로 이동합니다.");
  showNotification("결제 방법 안내 페이지로 이동합니다.", "info");
}

function showFAQ() {
  announceToScreenReader("자주 묻는 질문 페이지로 이동합니다.");
  showNotification("자주 묻는 질문 페이지로 이동합니다.", "info");
}

function showA11yGuide() {
  announceToScreenReader("접근성 가이드 문서로 이동합니다.");
  showNotification("접근성 가이드 페이지로 이동합니다.", "info");
}

function showScreenReaderHelp() {
  announceToScreenReader("스크린 리더 도움말 페이지로 이동합니다.");
  showNotification("스크린 리더 도움말 페이지로 이동합니다.", "info");
}

function reportA11yIssue() {
  announceToScreenReader(
    "접근성 문제 신고 양식으로 이동합니다. 불편 사항을 자세히 작성해 주세요.",
    "assertive",
  );
  showNotification("접근성 문제 신고 페이지로 이동합니다.", "warning");
}

function showKeyboardShortcuts() {
  const shortcuts = [
    "Ctrl + K: 검색창 열기",
    "Alt + 1, 2, 3: 메뉴 바로가기",
    "Tab / Shift + Tab: 요소 간 이동",
    "Enter / Space: 버튼 실행",
    "Escape: 닫기/취소",
  ];

  announceToScreenReader("키보드 단축키: " + shortcuts.join(", "));
  showNotification("키보드 단축키가 콘솔에 출력되었습니다.", "info");
  console.log("⌨️ 키보드 단축키:", shortcuts);
}

// ===== 키보드 접근성 =====

function enhanceKeyboardNavigation() {
  document.addEventListener("keydown", function (event) {
    const { key, ctrlKey, altKey } = event;

    // Ctrl+K: 검색창 열기
    if (ctrlKey && key === "k") {
      event.preventDefault();
      if (!searchVisible) {
        toggleSearch();
      }
    }

    // Alt + 숫자키: 빠른 내비게이션
    if (altKey && ["1", "2", "3"].includes(key)) {
      event.preventDefault();
      const navButtons = document.querySelectorAll(".nav-list button");
      const index = parseInt(key) - 1;
      if (navButtons[index]) {
        navButtons[index].click();
      }
    }

    // Alt + H: 키보드 도움말
    if (altKey && key === "h") {
      event.preventDefault();
      showKeyboardShortcuts();
    }

    // ESC: 검색창 닫기
    if (key === "Escape" && searchVisible) {
      toggleSearch();
    }
  });
}

// ===== 설정 관리 =====

function loadAccessibilitySettings() {
  const saved = localStorage.getItem("a11y-settings");
  if (saved) {
    try {
      const settings = JSON.parse(saved);
      Object.assign(accessibilitySettings, settings);

      if (settings.highContrast) toggleHighContrast();
      if (settings.largeText) toggleLargeText();
      if (settings.enhancedFocus) toggleEnhancedFocus();
      if (settings.screenReaderMode) toggleScreenReaderMode();
    } catch (error) {
      console.warn("[A11Y] 설정 복원 실패:", error);
    }
  }

  // 시스템 설정 감지
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    accessibilitySettings.reducedMotion = true;
  }
}

// ===== 초기화 =====

document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 4단계 페이지 로드 완료 - 최고 수준의 접근성 기능 활성화");

  // 접근성 설정 복원
  loadAccessibilitySettings();

  // 접근성 기능 초기화
  enhanceKeyboardNavigation();
  updateCartCount();

  // 초기 페이지 상태 설정
  updateCurrentPage("home");

  // 접근성 도구 버튼 이벤트 리스너
  const tools = [
    { id: "toggle-high-contrast", handler: toggleHighContrast },
    { id: "toggle-large-text", handler: toggleLargeText },
    { id: "toggle-focus-indicator", handler: toggleEnhancedFocus },
    { id: "toggle-screen-reader-mode", handler: toggleScreenReaderMode },
  ];

  tools.forEach(({ id, handler }) => {
    const button = document.getElementById(id);
    if (button) {
      button.addEventListener("click", handler);
    }
  });

  // 초기 로딩 완료 안내
  setTimeout(() => {
    announceToScreenReader(
      "Ultimate A11Y 쇼핑몰 페이지가 완전히 로드되었습니다. " +
        "모든 고급 접근성 기능이 활성화되어 있습니다. " +
        "Alt+H를 눌러 키보드 단축키를 확인할 수 있습니다.",
      "assertive",
    );
  }, 1500);
});

// ===== 에러 처리 =====

window.addEventListener("error", function (event) {
  console.error("[A11Y] JavaScript 에러 발생:", event.error);
  announceToScreenReader(
    "일시적인 오류가 발생했습니다. 페이지를 새로고침해 주세요.",
    "assertive",
  );
  showNotification("오류가 발생했습니다. 다시 시도해 주세요.", "error");
});

// ===== 장바구니 내역 =====
// cart는 상품 ID 배열입니다. 같은 상품을 여러 번 담으면 수량으로 묶습니다.
function renderCart() {
  const items = document.getElementById("cart-items");
  const quantities = new Map();
  cart.forEach((id) => quantities.set(id, (quantities.get(id) || 0) + 1));
  document.querySelectorAll("[data-cart-product]").forEach((button) => {
    button.hidden = !quantities.has(Number(button.dataset.cartProduct));
  });
  items.replaceChildren();
  let total = 0;
  quantities.forEach((quantity, id) => {
    const product = products[id];
    const subtotal = product.price * quantity;
    total += subtotal;

    const item = document.createElement("li");
    item.className = "cart-item";
    const image = document.createElement("img");
    image.className = "cart-image";
    image.src = product.image;
    image.alt = "";
    const info = document.createElement("div");
    info.className = "cart-item-info";
    const name = document.createElement("p");
    name.className = "cart-item-name";
    name.textContent = product.name;
    const detail = document.createElement("p");
    detail.className = "cart-item-detail";
    detail.textContent = `${product.price.toLocaleString("ko-KR")}원 × ${quantity}개`;
    info.append(name, detail);
    const price = document.createElement("p");
    price.className = "cart-item-price";
    price.textContent = `${subtotal.toLocaleString("ko-KR")}원`;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "btn-secondary cart-remove";
    remove.textContent = "삭제";
    remove.setAttribute("aria-label", `${product.name} 장바구니에서 삭제`);
    remove.addEventListener("click", () => removeFromCart(id));
    item.append(image, info, price, remove);
    items.appendChild(item);
  });
  document.getElementById("cart-empty").hidden = cart.length > 0;
  document.getElementById("cart-summary").textContent =
    `총 ${cart.length}개 상품, 합계 ${total.toLocaleString("ko-KR")}원`;
  if (typeof updateCartCount === "function") updateCartCount();
}

function removeFromCart(productId) {
  const buttons = [...document.querySelectorAll(".cart-remove")];
  const index = buttons.indexOf(document.activeElement);
  cart = cart.filter((id) => id !== productId);
  renderCart();
  const remaining = document.querySelectorAll(".cart-remove");
  const target =
    remaining[Math.min(Math.max(index, 0), remaining.length - 1)] ||
    document.getElementById("cart-title");
  target.focus();
}

function closeCart() {
  document.getElementById("cart-panel").hidden = true;
  const title = document.querySelector(".products .section-title");
  title.tabIndex = -1;
  title.focus();
  title.scrollIntoView({ block: "start", behavior: "instant" });
  if (typeof updateCurrentPage === "function") updateCurrentPage("products");
}
