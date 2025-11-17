const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("sidebarOverlay");
const btn = document.getElementById("openSidebar");
const hamburger = document.getElementById("hamburgerIcon");
const closeIcon = document.getElementById("closeIcon");

let isOpen = false;

function openSidebar() {
  sidebar.classList.remove("-translate-x-full");
  overlay.classList.remove("hidden");
  hamburger.classList.add("hidden");
  closeIcon.classList.remove("hidden");
  isOpen = true;
}

function closeSidebar() {
  sidebar.classList.add("-translate-x-full");
  overlay.classList.add("hidden");
  hamburger.classList.remove("hidden");
  closeIcon.classList.add("hidden");
  isOpen = false;
}

function toggleSidebar() {
  isOpen ? closeSidebar() : openSidebar();
}

// --- Events ---
btn?.addEventListener("click", toggleSidebar);

overlay?.addEventListener("click", closeSidebar);
