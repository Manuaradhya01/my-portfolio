<h1 align="center">
  <img src="manoranjan_protfolio/images/profile.jpg" alt="Manoranjan L" width="100" style="border-radius:50%"/><br/>
  MANORANJAN L — Portfolio
</h1>

<p align="center">
  <b>Computer Science & Engineering (Data Science) · Backend Developer · AI Enthusiast</b><br/>
  MVJ College of Engineering, Bengaluru
</p>

<p align="center">
  <a href="https://github.com/Manuaradhya01/my-portfolio" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-my--portfolio-181717?style=for-the-badge&logo=github" alt="GitHub"/>
  </a>
  &nbsp;
  <img src="https://img.shields.io/badge/AWS-EC2%20Ubuntu-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" alt="AWS EC2"/>
  &nbsp;
  <img src="https://img.shields.io/badge/Docker-Nginx%20Alpine-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker & Nginx"/>
  &nbsp;
  <img src="https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" alt="GitHub Actions"/>
</p>

---

## ✨ About

A **creative 3D-inspired editorial portfolio** built entirely with vanilla HTML, CSS, and JavaScript — no frameworks, no dependencies. Designed to feel like a premium print magazine brought to life on the web.

> 📍 Bengaluru, IN · 12.9716° N, 77.5946° E

---

## 🗂️ Sections

| # | Section | Description |
|---|---------|-------------|
| 00 | **Hero** | Interactive 3D-layered title with ambient canvas animation |
| 01 | **Selected Work** | Featured projects and case studies |
| 02 | **About** | Background, education & profile |
| 03 | **Technical Skills** | Tech stack and expertise |
| 04 | **Leadership & Initiative** | Clubs, events, and leadership roles |
| 05 | **Contact** | Get in touch |

---

## 🛠️ Built With

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Google Fonts](https://img.shields.io/badge/Google_Fonts-4285F4?style=flat-square&logo=google&logoColor=white)
![AWS EC2](https://img.shields.io/badge/AWS_EC2-FF9900?style=flat-square&logo=amazonaws&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=flat-square&logo=nginx&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white)

---

## ✨ Features

- 🎨 **Editorial Design** — Magazine-inspired layout with ink & paper grain SVG textures
- 🌀 **3D Perspective Hero** — Interactive tilt card with parallax depth layers
- ✨ **Ambient Dust Canvas** — Lightweight animated particle canvas overlay
- 🖱️ **Custom Cursor** — Dot + ring cursor with hover morphing (desktop only)
- 📜 **Scroll Progress Bar** — Reading progress indicator at the top
- 📱 **Fully Responsive** — Mobile drawer navigation with smooth transitions
- ⚡ **Zero Dependencies** — Pure HTML/CSS/JS, no frameworks needed
- ♿ **Accessible** — Semantic HTML5, ARIA labels, reduced-motion support

---

## 📁 Project Structure

```
my-portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions CI/CD SSH deployment to AWS EC2
├── manoranjan_protfolio/
│   ├── index.html                  # Main portfolio page
│   ├── style.css                   # All styles (Editorial design system)
│   ├── script.js                   # Interactions, animations, cursor, canvas
│   ├── images/
│   │   └── profile.jpg             # Profile portrait
│   └── assets/
│       ├── 3dprotfoliotheam.jpeg   # Visual theme reference
│       └── Manoranjan_L_Resume.pdf # Downloadable résumé PDF
├── Dockerfile                      # Multi-stage Docker build (Alpine -> Nginx Alpine)
├── docker-compose.yml              # Container orchestration & port 80 mapping
├── nginx.conf                      # Nginx gzip, static caching, and SPA fallback rules
├── .dockerignore                   # Docker build context exclusions
├── .gitignore
├── Cloud_Deployment_Report.md      # Minor project submission report
└── README.md
```

---

## 🚀 Cloud Deployment (AWS EC2 + Docker + Nginx)

This site is containerized with **Docker** (`nginx:alpine`) and deployed to an **AWS EC2 Ubuntu** instance via **GitHub Actions** CI/CD on every push to `main` (or `master`).

```bash
# Clone the repo
git clone https://github.com/Manuaradhya01/my-portfolio.git
cd my-portfolio

# Run locally or on EC2 with Docker Compose (Port 80)
docker compose up -d --build

# Verify running container
docker ps
```

---

## 📬 Contact

| Platform | Link |
|----------|------|
| 📧 Email | manuaradhya2326@gmail.com |
| 🐙 GitHub | [@Manuaradhya01](https://github.com/Manuaradhya01) |
| ☁️ Hosting | AWS EC2 Public IP (`http://<EC2-PUBLIC-IP>`) |

---

<p align="center">
  Made with ❤️ by <b>Manoranjan L</b> · © 2025–2026
</p>
