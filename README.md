# TURBO // Habitat & Life-Support Vercel Dashboard 🐢⚡

> **Command Directive**: Real-time telemetry, water chemistry analysis, filtration diagnostics, and care management dashboard for Turbo the Turtle. Designed for zero-latency static edge deployment on Vercel.

---

## 🌌 System Architecture & Overview

The **TURBO Dashboard** bridges raw physical aquatic sensors and care records with an ultra-responsive, edge-hosted telemetry console. Hosted on Vercel, it operates without server overhead, caching static assets at the edge while persisting logs locally with instant JSON import/export.

```
turbo-dashboard/
├── vercel.json             # Vercel edge deployment configuration & cache control
├── index.html              # Core dashboard shell & semantic telemetry layout
├── styles.css              # Cyber-clean dark mode / Matrix green theme engine
├── app.js                  # Telemetry state engine, local persistence, metric math
└── README.md               # System architectural specifications
```

---

## ⚡ Core Telemetry Modules

### 1. Life-Support Metrics
- **Water Temperature**: Submersible heater loop target $76^\circ\text{F} - 82^\circ\text{F}$
- **Basking Surface**: Thermal basking zone target $88^\circ\text{F} - 92^\circ\text{F}$ + UVB 5.0/10.0 index
- **Water Level & Flow Rate**: GPH turnover (minimum $4\times - 6\times$ volume per hour)

### 2. Water Chemistry Benchmark Matrix
Strict chemical safety thresholds for Red-Eared Slider (Trachemys scripta elegans) environments:

| Parameter | Nominal Safe Target | Critical Action Level | Primary Hazard |
| :--- | :--- | :--- | :--- |
| **Ammonia ($NH_3/NH_4^+$)** | `0.00 ppm` | `> 0.25 ppm` | Gill burn, toxic shock |
| **Nitrite ($NO_2^-$)** | `0.00 ppm` | `> 0.25 ppm` | Methemoglobinemia |
| **Nitrate ($NO_3^-$)** | `< 40 ppm` | `> 80 ppm` | Chronic organ stress |
| **pH Target** | `7.2 - 7.8` | `< 6.5` or `> 8.2` | Shell softening / acidosis |
| **Water Temperature** | `76°F - 82°F` | `< 72°F` or `> 85°F` | Lethargy / Respiratory infection |

### 3. Filtration Diagnostics
- **Mechanical Stage**: Coarse to fine foam (10 PPI -> 30 PPI) debris trap.
- **Biological Stage**: Sintered glass & K1 media nitrifying bacterial colonization.
- **Chemical Stage**: Granular activated carbon & Purigen selective organic adsorption.

### 4. Nutrition & Maintenance Scheduler
- Feeding schedule (Staple pellets, leafy greens, calcium cuttlebone, protein treats).
- Routine maintenance (25% weekly water changes, canister impeller cleaning, filter rinse).

---

## 🚀 Vercel Edge Deployment

### Deploy with Vercel CLI
```bash
# Inside the ubuntu proot turbo workspace:
cd /home/turbo/10_DEV/11_PROJECTS/turbo-dashboard
vercel deploy --prod
```

### Local Development
```bash
# Serve locally via python3 HTTP server or node:
python3 -m http.server 3000
```

---

## 🔐 Data Sovereignty & Offline Capability
- All water logs, notes, and task checklists are persisted directly in browser storage (`localStorage`).
- Instant cryptographic backup via JSON export and zero-loss restore.
- Zero tracking, zero third-party dependencies, zero telemetry leakage.
