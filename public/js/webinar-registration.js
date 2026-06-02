// eventId can be overridden via the config form; falls back to server .env default.
const config = { eventId: "" };

// ── DOM refs ──────────────────────────────────────────────────────────────────
const configForm = document.getElementById("configForm");
const eventIdInput = document.getElementById("eventIdInput");
const configError = document.getElementById("configError");
const configStatus = document.getElementById("configStatus");

const regForm = document.getElementById("regForm");
const firstNameInput = document.getElementById("firstNameInput");
const lastNameInput = document.getElementById("lastNameInput");
const emailInput = document.getElementById("emailInput");
const registerBtn = document.getElementById("registerBtn");
const regError = document.getElementById("regError");
const regConfirmed = document.getElementById("regConfirmed");
const alreadyReg = document.getElementById("alreadyReg");

const getAttendeesBtn = document.getElementById("getAttendeesBtn");
const attendeesTable = document.getElementById("attendeesTable");

const toastContainer = document.getElementById("toastContainer");

// ── Toasts ────────────────────────────────────────────────────────────────────
function showToast(message, type = "info", duration = 4000) {
  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add("toast--visible"));
  });
  setTimeout(() => {
    toast.classList.remove("toast--visible");
    toast.addEventListener("transitionend", () => toast.remove(), {
      once: true,
    });
  }, duration);
}

// ── Generic fetch helper ──────────────────────────────────────────────────────
async function api(path, body) {
  const url = new URL(path, window.location.origin);
  if (config.eventId) url.searchParams.set("eventId", config.eventId);
  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

// ── Config form ───────────────────────────────────────────────────────────────
configForm.addEventListener("submit", (e) => {
  e.preventDefault();
  config.eventId = eventIdInput.value.trim();
  configError.textContent = "";
  configError.classList.add("hidden");
  configStatus.textContent = config.eventId
    ? `Event ID set: ${config.eventId}.`
    : "Using server default event ID.";
  configStatus.classList.remove("hidden");
  showToast("Config saved.", "success", 2500);
});

// ── Registration form ─────────────────────────────────────────────────────────
regForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const email = emailInput.value.trim();

  // Basic client-side validation
  if (!firstName || !lastName || !email) {
    regError.textContent = "Please fill in all fields.";
    regError.classList.remove("hidden");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    regError.textContent = "Please enter a valid email address.";
    regError.classList.remove("hidden");
    return;
  }

  regError.classList.add("hidden");
  registerBtn.disabled = true;
  registerBtn.textContent = "Checking…";

  try {
    // Step 1: check for existing registration
    const check = await api("/api/webinar-registration/check-registered", {
      email,
    });

    if (!check.ok) {
      throw new Error(check.data.error || `Server error ${check.status}.`);
    }

    if (check.data.registered) {
      showAlreadyRegistered();
      return;
    }

    // Step 2: register
    registerBtn.textContent = "Registering…";
    const reg = await api("/api/webinar-registration/register", {
      first_name: firstName,
      last_name: lastName,
      email,
    });

    if (reg.ok) {
      showConfirmed();
    } else {
      throw new Error(reg.data.error || `Registration failed (${reg.status}).`);
    }
  } catch (err) {
    regError.textContent = err.message || "Could not connect to the server.";
    regError.classList.remove("hidden");
    registerBtn.disabled = false;
    registerBtn.textContent = "Register";
  }
});

function showConfirmed() {
  regForm.classList.add("hidden");
  regConfirmed.classList.remove("hidden");
  showToast("Registration successful!", "success");
}

function showAlreadyRegistered() {
  regForm.classList.add("hidden");
  alreadyReg.classList.remove("hidden");
  showToast("Already registered for this event.", "info");
}

// ── Get Attendees List ───────────────────────────────────────────────────────────
getAttendeesBtn.addEventListener("click", async () => {
  getAttendeesBtn.disabled = true;
  getAttendeesBtn.textContent = "Loading…";
  attendeesTable.classList.remove("hidden");

  try {
    const res = await api("/api/webinar-registration/get-attendees", {});
    if (!res.ok) {
      throw new Error(res.data.error || `Server error ${res.status}.`);
    }

    const attendees = res.data.attendees || [];
    if (attendees.length === 0) {
      showToast("No attendees found for this event.", "info");
      return;
    }

    // Clear existing table rows
    attendeesTable.querySelector("tbody").innerHTML = "";

    // Populate table with attendees
    attendees.forEach(({ first_name, last_name, email }) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${first_name}</td>
        <td>${last_name}</td>
        <td>${email}</td>
      `;
      attendeesTable.querySelector("tbody").appendChild(row);
    });
  } catch (err) {
    showToast(err.message || "Could not load attendees.", "error");
  } finally {
    getAttendeesBtn.disabled = false;
    getAttendeesBtn.textContent = "Get All Attendees";
  }
});
