# Fynxx – Influencer Fintech Platform

> A full-stack web platform connecting micro-influencers, brands and administrators—built with Next.js (monorepo), Express, MongoDB and modern UI tooling.

---


## 📖 Project Overview  
Fynxx is designed to empower micro-influencers (e.g., Instagram, YouTube) by participating in brand campaigns, earning rewards and managing their profiles, while enabling brands to launch campaigns and admins to oversee the ecosystem.  
The platform supports **three user roles** (Admin, Brand, Influencer) each with dedicated dashboards, supporting CRUD operations, role-based access, and real-time workflow.

---

## ✨ Key Features  
**Admin Dashboard**  
- Manage users (influencers, brands), approve/reject campaigns  
- View analytics and system overview  

**Brand Dashboard**  
- Create & manage campaigns, view influencer applications  
- Track campaign performance and influencer engagement  

**Influencer Dashboard**  
- Sign up, complete profile, connect social platform & follower count  
- Browse available campaigns, apply, view reward history  

**Common Features**  
- Authentication with JWT and Role-based Access Control  
- Full-stack monorepo architecture (Next.js + Express + MongoDB)  
- Modern UI built with TailwindCSS & ShadCN (and optionally Three.js for interactive elements)  
- Performance-optimized, scalable and designed for real-world usage  

---

## 🧠 Tech Stack  
| Layer | Technology |
|-------|-------------|
| Frontend | Next.js, React, TailwindCSS, ShadCN UI |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Auth | JWT (JSON Web Tokens) |
| Monorepo Tools | (if used) Yarn Workspaces / Turborepo |
| Others | Zustand, React Query, Prisma (optional), Recharts (for analytics) |

---

🔮 Future Roadmap

Add real‐time notifications (via WebSockets) for brand-influencer interactions

Add payment/cash-out integration for influencer rewards

Improve analytics dashboards with more metrics and visualizations

Deploy group for production with CI/CD, Docker, and cloud hosting



