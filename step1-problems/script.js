// 전역 변수
let cart = [];
let isLoggedIn = false;

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
  console.log("장바구니 표시");
  alert(`장바구니에 ${cart.length}개 상품이 있습니다.`);
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
  cart.push(productId);
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
