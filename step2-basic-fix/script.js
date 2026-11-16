// 전역 변수
let cart = [];
let isLoggedIn = false;

// 상품 카드와 같은 상품명, 가격을 사용합니다.
const products = {
  1: { name: "iPhone 16 Pro", price: 1550000, image: "images/iphone.jpg" },
  2: { name: "MacBook Pro14", price: 2390000, image: "images/macbook.jpg" },
  3: { name: "iPad Pro 11", price: 1599000, image: "images/ipad.jpg" },
};

// 홈으로 이동
function goHome() {
  console.log("홈으로 이동");
  announceToScreenReader("홈 페이지로 이동합니다.");
}

// 상품 페이지 표시
function showProducts() {
  console.log("상품 목록 표시");
  announceToScreenReader("상품 목록 페이지로 이동합니다.");
}

// 장바구니 표시
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

// 마이페이지 표시
function showMyPage() {
  console.log("마이페이지 표시");
  if (!isLoggedIn) {
    const message = "로그인이 필요합니다.";
    announceToScreenReader(message);
    alert(message);
    // 로그인 폼으로 포커스 이동
    document.getElementById("username").focus();
  } else {
    announceToScreenReader("마이페이지로 이동합니다.");
  }
}

// 검색 토글
function toggleSearch() {
  console.log("검색 토글");
  announceToScreenReader("검색 기능을 준비 중입니다.");
}

// 특가 페이지 표시
function showSale() {
  console.log("특가 페이지 표시");
  const message = "특가 상품 페이지로 이동합니다.";
  announceToScreenReader(message);
  alert(message);
}

// 상품 상세 보기
function showProduct(productId) {
  console.log(`상품 ${productId} 상세 보기`);
  const productNames = {
    1: "스마트폰",
    2: "노트북",
    3: "태블릿",
  };
  const message = `${productNames[productId]} 상세 페이지로 이동합니다.`;
  announceToScreenReader(message);
}

// 장바구니에 추가
function addToCart(productId) {
  if (!products[productId]) return;
  cart.push(productId);
  renderCart();
  console.log(`상품 ${productId}를 장바구니에 추가`);

  const productNames = {
    1: "스마트폰",
    2: "노트북",
    3: "태블릿",
  };

  const message = `${productNames[productId]}이(가) 장바구니에 추가되었습니다. 현재 ${cart.length}개 상품이 담겨있습니다.`;
  announceToScreenReader(message);
  alert(message);
}

// 로그인 폼 처리
function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  // 폼 검증
  if (!username) {
    showFieldError("username", "아이디를 입력해주세요.");
    return false;
  }

  if (!password) {
    showFieldError("password", "비밀번호를 입력해주세요.");
    return false;
  }

  if (password.length < 8) {
    showFieldError("password", "비밀번호는 8자 이상이어야 합니다.");
    return false;
  }

  // 로그인 성공
  isLoggedIn = true;
  console.log("로그인 성공");

  const message = `${username}님, 로그인되었습니다!`;
  announceToScreenReader(message);
  alert(message);

  // 폼 초기화
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";

  return false;
}

// 필드 에러 표시
function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);

  // 기존 에러 메시지 제거
  const existingError = field.parentNode.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }

  // 새 에러 메시지 추가
  const errorElement = document.createElement("div");
  errorElement.className = "error-message";
  errorElement.style.color = "#dc3545";
  errorElement.style.fontSize = "0.9rem";
  errorElement.style.marginTop = "5px";
  errorElement.textContent = message;
  errorElement.setAttribute("role", "alert");

  field.parentNode.appendChild(errorElement);
  field.focus();
  announceToScreenReader(message);
}

// 이용약관 보기
function showTerms() {
  console.log("이용약관 보기");
  announceToScreenReader("이용약관 페이지로 이동합니다.");
  alert("이용약관 페이지로 이동합니다.");
}

// 개인정보처리방침 보기
function showPrivacy() {
  console.log("개인정보처리방침 보기");
  announceToScreenReader("개인정보처리방침 페이지로 이동합니다.");
  alert("개인정보처리방침 페이지로 이동합니다.");
}

// 고객센터 보기
function showContact() {
  console.log("고객센터 보기");
  announceToScreenReader("고객센터 페이지로 이동합니다.");
  alert("고객센터 페이지로 이동합니다.");
}

// 스크린 리더에 메시지 전달 (ARIA live region 사용)
function announceToScreenReader(message) {
  let announcer = document.getElementById("sr-announcer");

  if (!announcer) {
    announcer = document.createElement("div");
    announcer.id = "sr-announcer";
    announcer.setAttribute("aria-live", "polite");
    announcer.setAttribute("aria-atomic", "true");
    announcer.style.position = "absolute";
    announcer.style.left = "-10000px";
    announcer.style.width = "1px";
    announcer.style.height = "1px";
    announcer.style.overflow = "hidden";
    document.body.appendChild(announcer);
  }

  announcer.textContent = message;
}

// 키보드 접근성 향상
function enhanceKeyboardNavigation() {
  // ESC 키로 모달/알림 닫기
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      // 현재 열린 모달이나 알림이 있다면 닫기
      console.log("ESC 키가 눌렸습니다.");
    }
  });

  // 폼 입력 시 엔터 키 처리
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && input.type !== "submit") {
        // 다음 입력 필드로 이동
        const form = input.closest("form");
        if (form) {
          const inputs = Array.from(form.querySelectorAll("input, button"));
          const currentIndex = inputs.indexOf(input);
          const nextInput = inputs[currentIndex + 1];
          if (nextInput) {
            nextInput.focus();
          }
        }
      }
    });
  });
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", function () {
  console.log("페이지 로드 완료");

  // 접근성 기능 초기화
  enhanceKeyboardNavigation();

  // 스킵 링크 기능 확인
  const skipLink = document.querySelector(".skip-link");
  if (skipLink) {
    skipLink.addEventListener("click", function (event) {
      event.preventDefault();
      const target = document.querySelector(skipLink.getAttribute("href"));
      if (target) {
        // 포커스 이동이 보장되도록 프로그램적 포커스 허용
        if (!target.hasAttribute("tabindex")) {
          target.setAttribute("tabindex", "-1");
        }
        target.focus();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  announceToScreenReader(
    "페이지가 로드되었습니다. 접근성 쇼핑몰에 오신 것을 환영합니다.",
  );
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
