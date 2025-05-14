document.addEventListener("DOMContentLoaded", () => {
  // Sidebar collapse logic
  const collapseBtn = document.getElementById("collapseBtn") as HTMLButtonElement | null;
  const sidebar = document.getElementById("sidebar") as HTMLElement | null;

  if (collapseBtn && sidebar) {
    collapseBtn.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  }

  // Login Form Logic
  const form = document.querySelector("form") as HTMLFormElement | null;
  const emailInput = document.getElementById("email") as HTMLInputElement | null;
  const passwordInput = document.getElementById("password") as HTMLInputElement | null;

  const validEmail = "user@example.com";
  const validPassword = "password123";

  if (form && emailInput && passwordInput) {
    form.addEventListener("submit", (e: Event) => {
      e.preventDefault();

      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      if (email === validEmail && password === validPassword) {
        window.location.href = "dashboard.tsx";
      } else {
        // You can replace this with an actual error message display later
        window.location.href = "dashboard.tsx";
      }
    });
  }
});
