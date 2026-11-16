// ===== 전역 변수 및 상태 관리 =====
let cart = [];
let isLoggedIn = false;
let currentUser = null;
let searchVisible = false;

// 상품 데이터
const products = {
  1: {
    name: "iPhone 16 Pro",
    price: 1200000,
    originalPrice: 1550000,
    image: "images/iphone.jpg",
  },
  2: {
    name: "MacBook Pro14",
    price: 1912000,
    originalPrice: 2390000,
    image: "images/macbook.jpg",
  },
  3: {
    name: "iPad Pro 11",
    price: 1599000,
    originalPrice: null,
    image: "images/ipad.jpg",
  },
};

// ===== 접근성 유틸리티 함수 =====

/**
 * 스크린 리더에 메시지 전달 (ARIA live region 사용)
 * @param {string} message - 전달할 메시지
 * @param {string} priority - 'polite' 또는 'assertive'
 */
function announceToScreenReader(message, priority = "polite") {
  const regionId =
    priority === "assertive" ? "alert-announcements" : "status-announcements";
  let announcer = document.getElementById(regionId);

  if (!announcer) {
    announcer = document.createElement("div");
    announcer.id = regionId;
    announcer.setAttribute("aria-live", priority);
    announcer.setAttribute("aria-atomic", "true");
    announcer.className = "visually-hidden";
    document.body.appendChild(announcer);
  }

  // 기존 내용을 지우고 새 메시지 설정
  announcer.textContent = "";
  setTimeout(() => {
    announcer.textContent = message;
  }, 100);
}

/**
 * 포커스 관리 - 요소로 포커스 이동
 * @param {string|Element} element - 포커스할 요소 또는 선택자
 * @param {boolean} scroll - 스크롤 여부
 */
function focusElement(element, scroll = true) {
  const targetElement =
    typeof element === "string" ? document.querySelector(element) : element;

  if (targetElement) {
    targetElement.focus();
    if (scroll) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
}

/**
 * 키보드 트랩 관리
 * @param {Element} container - 트랩할 컨테이너
 * @param {Event} event - 키보드 이벤트
 */
function handleKeyboardTrap(container, event) {
  if (event.key !== "Tab") return;

  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

/**
 * 폼 검증 및 에러 표시
 * @param {string} fieldId - 필드 ID
 * @param {string} message - 에러 메시지
 * @param {boolean} isValid - 유효성 여부
 */
function showFieldValidation(fieldId, message, isValid = false) {
  const field = document.getElementById(fieldId);
  const errorElement = document.getElementById(`${fieldId}-error`);

  if (!field || !errorElement) return;

  if (isValid) {
    field.setAttribute("aria-invalid", "false");
    errorElement.textContent = "";
    field.classList.remove("error");
  } else {
    field.setAttribute("aria-invalid", "true");
    errorElement.textContent = message;
    field.classList.add("error");
    announceToScreenReader(message, "assertive");
  }
}

/**
 * 장바구니 카운트 업데이트
 */
function updateCartCount() {
  const cartCountElement = document.getElementById("cart-count");
  const cartButton = cartCountElement.closest("button");

  cartCountElement.textContent = cart.length;
  cartButton.setAttribute("aria-label", `장바구니 (${cart.length}개 상품)`);

  // 실시간 업데이트 알림
  if (cart.length > 0) {
    cartCountElement.setAttribute("aria-live", "polite");
  }
}

// ===== 메인 내비게이션 함수 =====

/**
 * 홈으로 이동
 */
function goHome() {
  console.log("홈으로 이동");
  announceToScreenReader("홈 페이지로 이동합니다.");

  // 현재 페이지 상태 업데이트
  updateCurrentPage("home");
}

/**
 * 상품 페이지 표시
 */
function showProducts() {
  console.log("상품 목록 표시");
  announceToScreenReader("상품 목록 페이지로 이동합니다.");

  updateCurrentPage("products");
}

/**
 * 장바구니 표시
 */
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

/**
 * 마이페이지 표시
 */
function showMyPage() {
  console.log("마이페이지 표시");

  if (!isLoggedIn) {
    const message = "로그인이 필요합니다. 로그인 폼으로 이동합니다.";
    announceToScreenReader(message, "assertive");
    alert(message);

    // 로그인 폼으로 포커스 이동
    setTimeout(() => {
      focusElement("#username");
    }, 500);
  } else {
    announceToScreenReader(`${currentUser}님의 마이페이지로 이동합니다.`);
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

  // 해당 페이지 버튼에 current 상태 설정
  const pageMapping = {
    home: 0,
    products: 0,
    cart: 1,
    mypage: 2,
  };

  if (pageMapping[page] !== undefined) {
    navButtons[pageMapping[page]].setAttribute("aria-current", "page");
  }
}

// ===== 검색 기능 =====

/**
 * 검색창 토글
 */
function toggleSearch() {
  const searchBtn = document.getElementById("search");
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");

  searchVisible = !searchVisible;

  if (searchVisible) {
    searchForm.hidden = false;
    searchBtn.setAttribute("aria-expanded", "true");
    searchBtn.setAttribute("aria-label", "검색창 닫기");

    // 검색 입력 필드로 포커스 이동
    setTimeout(() => {
      searchInput.focus();
    }, 100);

    announceToScreenReader("검색창이 열렸습니다. 검색어를 입력하세요.");
  } else {
    searchForm.hidden = true;
    searchBtn.setAttribute("aria-expanded", "false");
    searchBtn.setAttribute("aria-label", "검색창 열기");

    announceToScreenReader("검색창이 닫혔습니다.");
  }
}

/**
 * 검색 실행
 */
function performSearch() {
  const searchInput = document.getElementById("search-input");
  const query = searchInput.value.trim();

  if (!query) {
    showFieldValidation("search-input", "검색어를 입력해주세요.");
    return;
  }

  console.log(`검색 실행: ${query}`);
  announceToScreenReader(`"${query}"에 대한 검색 결과를 가져오고 있습니다.`);

  // 실제 구현에서는 검색 API 호출
  setTimeout(() => {
    announceToScreenReader(`"${query}" 검색이 완료되었습니다.`);
  }, 1000);
}

// ===== 상품 관련 함수 =====

/**
 * 특가 페이지 표시
 */
function showSale() {
  console.log("특가 페이지 표시");
  announceToScreenReader(
    "특가 상품 페이지로 이동합니다. 최대 50% 할인된 상품들을 만나보세요.",
  );
}

/**
 * 상품 상세 보기
 */
function showProduct(productId) {
  const product = products[productId];
  if (!product) return;

  console.log(`상품 ${productId} 상세 보기`);
  announceToScreenReader(`${product.name} 상세 페이지로 이동합니다.`);
}

/**
 * 장바구니에 추가
 */
function addToCart(productId) {
  const product = products[productId];
  if (!product) return;

  cart.push(productId);
  renderCart();
  console.log(`상품 ${productId}를 장바구니에 추가`);

  const message = `${product.name}이(가) 장바구니에 추가되었습니다. 현재 ${cart.length}개 상품이 담겨있습니다.`;
  announceToScreenReader(message);

  // 성공 알림
  showNotification(message, "success");
}

/**
 * 알림 표시
 */
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.setAttribute("role", "alert");
  notification.setAttribute("aria-live", "assertive");
  notification.textContent = message;

  // 스타일 적용
  Object.assign(notification.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "15px 20px",
    borderRadius: "8px",
    color: "white",
    fontWeight: "600",
    zIndex: "9999",
    maxWidth: "400px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  });

  // 타입별 색상
  const colors = {
    success: "#155724",
    error: "#721c24",
    warning: "#856404",
    info: "#0c5460",
  };

  notification.style.backgroundColor = colors[type] || colors.info;

  document.body.appendChild(notification);

  // 3초 후 자동 제거
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
}

// ===== 로그인 관련 함수 =====

/**
 * 로그인 폼 처리
 */
function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  // 실시간 검증
  let isValid = true;

  if (!username) {
    showFieldValidation("username", "아이디를 입력해주세요.");
    isValid = false;
  } else if (username.length < 3) {
    showFieldValidation("username", "아이디는 3자 이상이어야 합니다.");
    isValid = false;
  } else {
    showFieldValidation("username", "", true);
  }

  if (!password) {
    showFieldValidation("password", "비밀번호를 입력해주세요.");
    isValid = false;
  } else if (password.length < 8) {
    showFieldValidation("password", "비밀번호는 8자 이상이어야 합니다.");
    isValid = false;
  } else {
    showFieldValidation("password", "", true);
  }

  if (!isValid) {
    // 첫 번째 에러 필드로 포커스 이동
    const firstErrorField = document.querySelector('[aria-invalid="true"]');
    if (firstErrorField) {
      focusElement(firstErrorField);
    }
    return false;
  }

  // 로그인 처리
  isLoggedIn = true;
  currentUser = username;
  console.log("로그인 성공");

  const message = `${username}님, 환영합니다! 로그인이 완료되었습니다.`;
  announceToScreenReader(message);
  showNotification(message, "success");

  // 폼 초기화
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";

  // 성공 후 포커스 관리
  setTimeout(() => {
    focusElement('.nav-list button[aria-current="page"]');
  }, 1000);

  return false;
}

/**
 * 회원가입 페이지 이동
 */
function showSignup() {
  console.log("회원가입 페이지 이동");
  announceToScreenReader("회원가입 페이지로 이동합니다.");
}

/**
 * 비밀번호 찾기 페이지 이동
 */
function showFindPassword() {
  console.log("비밀번호 찾기 페이지 이동");
  announceToScreenReader("비밀번호 찾기 페이지로 이동합니다.");
}

// ===== 푸터 링크 함수 =====

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
  announceToScreenReader(
    "고객센터 페이지로 이동합니다. 1588-1234로 전화 또는 이메일로 문의 가능합니다.",
  );
}

function showAccessibility() {
  console.log("접근성 정책 보기");
  announceToScreenReader("웹 접근성 정책 페이지로 이동합니다.");
}

// ===== 키보드 접근성 향상 =====

/**
 * 키보드 내비게이션 개선
 */
function enhanceKeyboardNavigation() {
  // 전역 키보드 이벤트 처리
  document.addEventListener("keydown", function (event) {
    // ESC 키 처리
    if (event.key === "Escape") {
      if (searchVisible) {
        toggleSearch();
      }

      // 모달이나 드롭다운이 열려있다면 닫기
      const openModals = document.querySelectorAll('[aria-expanded="true"]');
      openModals.forEach((element) => {
        if (element.id === "search") return; // 검색은 위에서 처리
        element.click();
      });
    }

    // Alt + 숫자키로 빠른 내비게이션
    if (event.altKey && !event.ctrlKey && !event.shiftKey) {
      const navButtons = document.querySelectorAll(".nav-list button");
      const key = parseInt(event.key);

      if (key >= 1 && key <= navButtons.length) {
        event.preventDefault();
        navButtons[key - 1].click();
        navButtons[key - 1].focus();
      }
    }
  });

  // 폼 내 엔터 키 처리
  const formInputs = document.querySelectorAll("input");
  formInputs.forEach((input) => {
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        const form = input.closest("form");
        if (form && input.type !== "submit") {
          // 검색 폼의 경우
          if (input.id === "search-input") {
            event.preventDefault();
            performSearch();
            return;
          }

          // 일반 폼의 경우 다음 필드로 이동
          const inputs = Array.from(form.querySelectorAll("input, button"));
          const currentIndex = inputs.indexOf(input);
          const nextInput = inputs[currentIndex + 1];

          if (nextInput) {
            event.preventDefault();
            nextInput.focus();
          }
        }
      }
    });
  });

  // 실시간 폼 검증
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  if (usernameInput) {
    usernameInput.addEventListener("blur", function () {
      const value = this.value.trim();
      if (value && value.length < 3) {
        showFieldValidation("username", "아이디는 3자 이상이어야 합니다.");
      } else if (value) {
        showFieldValidation("username", "", true);
      }
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener("blur", function () {
      const value = this.value.trim();
      if (value && value.length < 8) {
        showFieldValidation("password", "비밀번호는 8자 이상이어야 합니다.");
      } else if (value) {
        showFieldValidation("password", "", true);
      }
    });
  }
}

/**
 * 스킵 링크 기능 구현
 */
function setupSkipLinks() {
  const skipLinks = document.querySelectorAll(".skip-link");

  skipLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        // 포커스 가능하게 만들기
        if (targetElement.tabIndex < 0) {
          targetElement.tabIndex = -1;
        }

        targetElement.focus();
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });

        announceToScreenReader(`${this.textContent} 완료`);
      }
    });
  });
}

/**
 * 동적 콘텐츠 로딩시 접근성 알림
 */
function announceContentUpdate(message) {
  announceToScreenReader(message);

  // 로딩 상태 표시
  const loadingIndicator = document.createElement("div");
  loadingIndicator.setAttribute("aria-live", "polite");
  loadingIndicator.className = "visually-hidden";
  loadingIndicator.textContent = "콘텐츠를 불러오는 중입니다...";
  document.body.appendChild(loadingIndicator);

  setTimeout(() => {
    if (loadingIndicator.parentNode) {
      loadingIndicator.parentNode.removeChild(loadingIndicator);
    }
  }, 2000);
}

// ===== 페이지 초기화 =====

/**
 * 페이지 로드 시 초기화
 */
document.addEventListener("DOMContentLoaded", function () {
  console.log("페이지 로드 완료 - WCAG 2.1 AA 접근성 기능 활성화");

  // 접근성 기능 초기화
  enhanceKeyboardNavigation();
  setupSkipLinks();
  updateCartCount();

  // 초기 페이지 상태 설정
  updateCurrentPage("home");

  // 검색 폼 이벤트 리스너
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        performSearch();
      }
    });
  }

  // 초기 로딩 완료 안내
  setTimeout(() => {
    announceToScreenReader(
      "A11Y 쇼핑몰 페이지가 완전히 로드되었습니다. 모든 접근성 기능이 활성화되어 있습니다.",
    );
  }, 1000);

  // 페이지 성능 모니터링 (접근성 관련)
  if ("performance" in window) {
    window.addEventListener("load", function () {
      const loadTime = performance.now();
      console.log(`페이지 로드 시간: ${Math.round(loadTime)}ms`);

      // 3초 이상 걸리면 사용자에게 알림
      if (loadTime > 3000) {
        announceToScreenReader(
          "페이지 로딩이 완료되었습니다. 네트워크 상태가 느려 시간이 다소 걸렸습니다.",
        );
      }
    });
  }
});

// ===== 에러 처리 및 디버깅 =====

/**
 * 전역 에러 핸들러
 */
window.addEventListener("error", function (event) {
  console.error("JavaScript 에러 발생:", event.error);
  announceToScreenReader(
    "일시적인 오류가 발생했습니다. 페이지를 새로고침해 주세요.",
    "assertive",
  );
});

/**
 * 접근성 디버깅 도구 (개발용)
 */
if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  console.log("🔍 접근성 디버깅 모드 활성화");

  // Ctrl + Alt + A로 접근성 정보 출력
  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.altKey && event.key === "a") {
      console.log("=== 접근성 상태 ===");
      console.log("장바구니 아이템:", cart.length);
      console.log("로그인 상태:", isLoggedIn);
      console.log("검색창 상태:", searchVisible);
      console.log("현재 사용자:", currentUser);

      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      console.log("포커스 가능한 요소 수:", focusableElements.length);
    }
  });
}

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
