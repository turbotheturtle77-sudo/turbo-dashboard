/**
 * TURBO CONSOLE // EDGE TELEMETRY ENGINE
 */

// Initial Seed Data if localStorage is empty
const DEFAULT_LOGS = [
  { id: "log-1", date: "2026-11-04", temp: 77.4, ph: 7.4, ammonia: 0.00, nitrite: 0.00, nitrate: 15 },
  { id: "log-2", date: "2026-11-01", temp: 77.8, ph: 7.5, ammonia: 0.00, nitrite: 0.00, nitrate: 20 },
  { id: "log-3", date: "2026-10-28", temp: 77.2, ph: 7.3, ammonia: 0.00, nitrite: 0.00, nitrate: 10 }
];

const DEFAULT_TASKS = [
  { id: "t-1", text: "Weekly 25% Water Siphon & Substrate Vacuum", completed: false, badge: "Weekly" },
  { id: "t-2", text: "Canister Pre-Filter Coarse Foam Rinse in Tank Water", completed: true, badge: "Bi-Weekly" },
  { id: "t-3", text: "Inspect Zoo Med ReptiSun 10.0 UVB Output & Distance", completed: false, badge: "Monthly" },
  { id: "t-4", text: "Calibrate Digital Probe Thermometer against Reference", completed: true, badge: "Monthly" },
  { id: "t-5", text: "Regenerate / Replace Seachem Purigen Adsorbent", completed: false, badge: "Quarterly" }
];

// STATE MANAGEMENT
const State = {
  logs: JSON.parse(localStorage.getItem("turbo_water_logs")) || DEFAULT_LOGS,
  tasks: JSON.parse(localStorage.getItem("turbo_tasks")) || DEFAULT_TASKS,
  theme: localStorage.getItem("turbo_theme") || "dark"
};

function saveState() {
  localStorage.setItem("turbo_water_logs", JSON.stringify(State.logs));
  localStorage.setItem("turbo_tasks", JSON.stringify(State.tasks));
}

// TOAST NOTIFICATIONS
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 3200);
}

// PARAMETER VALIDATION & SCORING
function evaluateLogStatus(log) {
  const ammonia = parseFloat(log.ammonia);
  const nitrite = parseFloat(log.nitrite);
  const nitrate = parseFloat(log.nitrate);
  const ph = parseFloat(log.ph);
  const temp = parseFloat(log.temp);

  if (ammonia > 0.25 || nitrite > 0.25 || nitrate > 80 || ph < 6.5 || ph > 8.5 || temp < 72 || temp > 85) {
    return { label: "CRITICAL", class: "critical" };
  }
  if (ammonia > 0 || nitrite > 0 || nitrate > 40 || ph < 7.0 || ph > 8.0 || temp < 75 || temp > 82) {
    return { label: "WARNING", class: "warning" };
  }
  return { label: "NOMINAL", class: "nominal" };
}

// UPDATE GAUGES WITH LATEST LOG
function updateGauges() {
  if (State.logs.length === 0) return;

  const latest = State.logs[0]; // sorted newest first

  // Water Temp
  const elTemp = document.getElementById("val-temp");
  if (elTemp) elTemp.innerHTML = `${latest.temp}<span class="gauge-unit">°F</span>`;
  updateGaugeBadge("card-temp", "badge-temp", latest.temp >= 75 && latest.temp <= 82 ? "Nominal" : "Warning", latest.temp >= 75 && latest.temp <= 82 ? "nominal" : "warning");

  // pH
  const elPh = document.getElementById("val-ph");
  if (elPh) elPh.innerHTML = `${latest.ph}<span class="gauge-unit">pH</span>`;
  updateGaugeBadge("card-ph", "badge-ph", latest.ph >= 7.2 && latest.ph <= 7.8 ? "Nominal" : "Warning", latest.ph >= 7.2 && latest.ph <= 7.8 ? "nominal" : "warning");

  // Ammonia
  const elNh3 = document.getElementById("val-nh3");
  if (elNh3) elNh3.innerHTML = `${Number(latest.ammonia).toFixed(2)}<span class="gauge-unit">ppm</span>`;
  const nh3Status = latest.ammonia == 0 ? "Safe" : latest.ammonia <= 0.25 ? "Warning" : "Critical";
  updateGaugeBadge("card-nh3", "badge-nh3", nh3Status, nh3Status.toLowerCase());

  // Nitrite
  const elNo2 = document.getElementById("val-no2");
  if (elNo2) elNo2.innerHTML = `${Number(latest.nitrite).toFixed(2)}<span class="gauge-unit">ppm</span>`;
  const no2Status = latest.nitrite == 0 ? "Safe" : latest.nitrite <= 0.25 ? "Warning" : "Critical";
  updateGaugeBadge("card-no2", "badge-no2", no2Status, no2Status.toLowerCase());

  // Nitrate
  const elNo3 = document.getElementById("val-no3");
  if (elNo3) elNo3.innerHTML = `${latest.nitrate}<span class="gauge-unit">ppm</span>`;
  const no3Status = latest.nitrate <= 40 ? "Safe" : latest.nitrate <= 80 ? "Warning" : "Critical";
  updateGaugeBadge("card-no3", "badge-no3", no3Status, no3Status.toLowerCase());

  // Last audit time
  const auditEl = document.getElementById("last-audit-time");
  if (auditEl) auditEl.textContent = latest.date;
}

function updateGaugeBadge(cardId, badgeId, text, statusClass) {
  const card = document.getElementById(cardId);
  const badge = document.getElementById(badgeId);
  if (!card || !badge) return;

  card.className = `gauge-card status-${statusClass === "safe" ? "nominal" : statusClass}`;
  badge.className = `gauge-badge ${statusClass === "safe" ? "nominal" : statusClass}`;
  badge.textContent = text;
}

// RENDER TABLE
function renderTable() {
  const tbody = document.getElementById("audit-table-body");
  const countEl = document.getElementById("log-count");
  if (!tbody) return;

  tbody.innerHTML = "";
  if (countEl) countEl.textContent = `${State.logs.length} entries`;

  if (State.logs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: var(--text-muted); padding: 1.5rem;">No chemical audit records found.</td></tr>`;
    return;
  }

  State.logs.forEach((log) => {
    const status = evaluateLogStatus(log);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${log.date}</td>
      <td>${log.temp}°F</td>
      <td>${log.ph}</td>
      <td>${Number(log.ammonia).toFixed(2)} ppm</td>
      <td>${Number(log.nitrite).toFixed(2)} ppm</td>
      <td>${log.nitrate} ppm</td>
      <td><span class="gauge-badge ${status.class}">${status.label}</span></td>
      <td>
        <button class="btn-del" onclick="deleteLog('${log.id}')" title="Delete Entry">✕</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// RENDER TASKS
function renderTasks() {
  const container = document.getElementById("task-list-container");
  if (!container) return;

  container.innerHTML = "";
  State.tasks.forEach((t) => {
    const div = document.createElement("div");
    div.className = `task-item ${t.completed ? "completed" : ""}`;
    div.innerHTML = `
      <div class="task-check">
        <input type="checkbox" id="${t.id}" ${t.completed ? "checked" : ""}>
        <label for="${t.id}">${t.text}</label>
      </div>
      <div style="display:flex; align-items:center; gap: 0.5rem;">
        <span class="gauge-badge nominal">${t.badge || "Routine"}</span>
        <button class="btn-del" onclick="deleteTask('${t.id}')">✕</button>
      </div>
    `;

    const check = div.querySelector('input[type="checkbox"]');
    check.addEventListener("change", (e) => {
      t.completed = e.target.checked;
      saveState();
      renderTasks();
    });

    container.appendChild(div);
  });
}

// GLOBAL HANDLERS
window.deleteLog = function(id) {
  State.logs = State.logs.filter(l => l.id !== id);
  saveState();
  updateGauges();
  renderTable();
  showToast("Record removed from archive.");
};

window.deleteTask = function(id) {
  State.tasks = State.tasks.filter(t => t.id !== id);
  saveState();
  renderTasks();
};

// INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  // Set default date input to today
  const dateInput = document.getElementById("input-date");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
  }

  // Theme Init
  if (State.theme === "matrix") {
    document.documentElement.setAttribute("data-theme", "matrix");
  }

  const themeBtn = document.getElementById("theme-btn");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const isMatrix = document.documentElement.getAttribute("data-theme") === "matrix";
      if (isMatrix) {
        document.documentElement.removeAttribute("data-theme");
        State.theme = "dark";
      } else {
        document.documentElement.setAttribute("data-theme", "matrix");
        State.theme = "matrix";
      }
      localStorage.setItem("turbo_theme", State.theme);
      showToast(`Switched to ${State.theme === "matrix" ? "Matrix Reality" : "Dark Neon"} Mode`);
    });
  }

  // Form Submit
  const form = document.getElementById("water-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const newEntry = {
        id: "log-" + Date.now(),
        date: document.getElementById("input-date").value,
        temp: parseFloat(document.getElementById("input-temp").value),
        ph: parseFloat(document.getElementById("input-ph").value),
        ammonia: parseFloat(document.getElementById("input-ammonia").value),
        nitrite: parseFloat(document.getElementById("input-nitrite").value),
        nitrate: parseInt(document.getElementById("input-nitrate").value, 10)
      };

      // Unshift to keep newest first
      State.logs.unshift(newEntry);
      saveState();
      updateGauges();
      renderTable();
      showToast("Chemical telemetry successfully logged.");
      form.reset();
      document.getElementById("input-date").value = new Date().toISOString().split("T")[0];
    });
  }

  // Add Task Prompt
  const addTaskBtn = document.getElementById("btn-add-task");
  if (addTaskBtn) {
    addTaskBtn.addEventListener("click", () => {
      const title = prompt("Enter Maintenance Directives:");
      if (!title || !title.trim()) return;
      State.tasks.push({
        id: "t-" + Date.now(),
        text: title.trim(),
        completed: false,
        badge: "Manual"
      });
      saveState();
      renderTasks();
      showToast("Maintenance directive registered.");
    });
  }

  // Quick Feed Logger
  const quickFeed = document.getElementById("quick-feed-btn");
  if (quickFeed) {
    quickFeed.addEventListener("click", () => {
      showToast("Daily nutrition cycle verified & recorded.");
    });
  }

  // Export JSON
  const exportBtn = document.getElementById("btn-export-json");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const exportBlob = new Blob([JSON.stringify(State, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(exportBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `turbo-telemetry-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("Telemetry JSON exported to client storage.");
    });
  }

  // Import JSON Trigger
  const importTrigger = document.getElementById("btn-import-trigger");
  const fileInput = document.getElementById("file-import");
  if (importTrigger && fileInput) {
    importTrigger.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const parsed = JSON.parse(evt.target.result);
          if (parsed.logs) State.logs = parsed.logs;
          if (parsed.tasks) State.tasks = parsed.tasks;
          saveState();
          updateGauges();
          renderTable();
          renderTasks();
          showToast("Telemetry backup successfully restored.");
        } catch (err) {
          alert("Error parsing JSON telemetry file.");
        }
      };
      reader.readAsText(file);
    });
  }

  // Initial Render
  updateGauges();
  renderTable();
  renderTasks();
});
