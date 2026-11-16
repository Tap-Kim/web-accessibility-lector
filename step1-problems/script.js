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
  // 실제 구현에서는 페이지 이동 로직
}

// 상품 페이지 표시
function showProducts() {
  console.log("상품 목록 표시");
  // 실제 구현에서는 상품 목록 로드
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
    alert("로그인이 필요합니다.");
  }
}

// 검색 토글
function toggleSearch() {
  console.log("검색 토글");
  // 실제 구현에서는 검색창 표시/숨김
}

// 특가 페이지 표시
function showSale() {
  console.log("특가 페이지 표시");
  alert("특가 상품을 확인하세요!");
}

// 상품 상세 보기
function showProduct(productId) {
  console.log(`상품 ${productId} 상세 보기`);
  // 실제 구현에서는 상품 상세 페이지로 이동
}

// 장바구니에 추가
function addToCart(productId) {
  if (!products[productId]) return;
  cart.push(productId);
  renderCart();
  console.log(`상품 ${productId}를 장바구니에 추가`);
  alert("장바구니에 추가되었습니다!");
}

// 로그인
function login() {
  const username = document.querySelector('input[type="text"]').value;
  const password = document.querySelector('input[type="password"]').value;

  if (username && password) {
    isLoggedIn = true;
    console.log("로그인 성공");
    alert("로그인되었습니다!");
  } else {
    alert("아이디와 비밀번호를 입력하세요.");
  }
}

// 이용약관 보기
function showTerms() {
  console.log("이용약관 보기");
  alert("이용약관 페이지로 이동합니다.");
}

// 개인정보처리방침 보기
function showPrivacy() {
  console.log("개인정보처리방침 보기");
  alert("개인정보처리방침 페이지로 이동합니다.");
}

// 고객센터 보기
function showContact() {
  console.log("고객센터 보기");
  alert("고객센터 페이지로 이동합니다.");
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", function () {
  console.log("페이지 로드 완료");
  // 초기화 로직
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
