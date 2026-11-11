# Cloud-Based Website Hosting and Deployment

**Minor Project Submission Report — DevOps & Cloud Infrastructure**

---

## 1. Author / Intern Details

| Field | Details |
| :--- | :--- |
| **Project Title** | Cloud-Based Website Hosting and Deployment |
| **Author / Student Name** | Manoranjan L |
| **USN / Intern ID** | `[Insert USN / Student or Intern ID]` |
| **Program & Department** | B.E. Computer Science & Engineering (Data Science) |
| **Institution** | MVJ College of Engineering, Bengaluru, Karnataka, India |
| **Email Address** | `manuaradhya2326@gmail.com` |
| **Source Repository** | `https://github.com/Manuaradhya01/my-portfolio` |
| **Deployed Cloud Endpoint** | `http://<EC2-PUBLIC-IP>` |
| **Evaluator / Mentor Name** | `[Insert Faculty / Technical Evaluator Name]` |
| **Submission Date** | `[Insert Submission Date]` |

---

## 2. Executive Summary & Project Objectives

### 2.1 Executive Summary

This project demonstrates end-to-end cloud infrastructure provisioning, containerization, reverse-proxy/web-server configuration, and automated Continuous Integration / Continuous Deployment (CI/CD) for a personal portfolio web application on **Amazon Web Services (AWS)**.

An initial codebase audit of the repository (`Manuaradhya01/my-portfolio`) established that the portfolio website is engineered with zero-dependency **Vanilla HTML5, CSS3, and ES6+ JavaScript** residing under the `manoranjan_protfolio/` directory, along with static image and PDF résumé assets. To host this application reliably on dedicated cloud compute rather than manual file uploads, the site is packaged using a **multi-stage Docker build**, served via a tuned **Nginx Alpine** container listening on **Port 80**, and hosted on an **AWS EC2 Ubuntu (`t2.micro`)** virtual machine. Every push to the production branch automatically triggers a **GitHub Actions** pipeline that SSHs into the EC2 instance, pulls the latest source, builds and tags a fresh Docker image, replaces the running container safely, and validates HTTP responsiveness.

### 2.2 Project Objectives

1. **Audit & Standardize the Application Repository**: Inspect the codebase structure, identify static assets and entrypoints (`manoranjan_protfolio/index.html`, `style.css`, `script.js`, `images/`, `assets/`), and eliminate non-AWS deployment artifacts.
2. **Containerize with Multi-Stage Docker Builds**: Separate asset validation/staging from the final runtime image so the production container remains minimal, reproducible, and portable.
3. **Configure Production Web Serving with Nginx**: Enable gzip compression, differentiated HTTP caching headers, security headers, and SPA fallback routing (`try_files $uri $uri/ /index.html;`).
4. **Provision & Secure AWS Compute**: Launch an AWS EC2 `t2.micro` Ubuntu Server instance and configure AWS Security Group firewall rules allowing controlled SSH (Port 22) and public HTTP (Port 80) traffic.
5. **Automate Delivery with GitHub Actions CI/CD**: Implement an automated SSH-based deployment pipeline triggered on code pushes, ensuring repeatable zero-manual-intervention updates and automatic cleanup of stale images.

---

## 3. Architecture Diagram & Deployment Workflow

### 3.1 System Architecture Diagram (Mermaid)

```mermaid
flowchart LR
    DEV["Developer<br/>(Local Git Push)"] -->|"git push (main / master)"| GH["GitHub Repository<br/>(Manuaradhya01/my-portfolio)"]
    GH -->|"Trigger on Push"| GHA["GitHub Actions<br/>CI/CD Pipeline"]
    GHA -->|"SSH (Port 22)<br/>EC2_HOST / EC2_USER / EC2_SSH_KEY"| EC2["AWS EC2 Instance<br/>(Ubuntu Linux · t2.micro)"]
    EC2 -->|"git pull & docker build"| DOCKER["Docker Engine<br/>(Multi-Stage Build)"]
    DOCKER -->|"docker run -p 80:80<br/>--restart unless-stopped"| NGINX["Nginx Alpine Container<br/>(Port 80 · Static + Gzip + Cache)"]
    NGINX -->|"HTTP Port 80<br/>(AWS Security Group Inbound)"| USERS["End Users<br/>(Web Browsers)"]
```

### 3.2 End-to-End Pipeline Flow (ASCII Schematic)

```text
+-------------+       git push        +-----------------------+
|  Developer  | --------------------> |   GitHub Repository   |
| Workstation |    (main / master)    |  Manuaradhya01/       |
+-------------+                       |  my-portfolio         |
                                      +-----------+-----------+
                                                  |
                                                  | Triggers workflow
                                                  v
                                      +-----------------------+
                                      | GitHub Actions Runner |
                                      |   (.github/workflows/ |
                                      |       deploy.yml)     |
                                      +-----------+-----------+
                                                  |
                                                  | Secure SSH (Port 22)
                                                  | using GitHub Secrets
                                                  v
+-------------------------------------------------------------------+
|               AWS EC2 Instance (Ubuntu · t2.micro)                |
|               AWS Security Group: Inbound Ports 22, 80            |
|                                                                   |
|  +-----------------------+          +--------------------------+  |
|  |     Docker Engine     |          |  Nginx Alpine Container  |  |
|  |  1. git fetch & reset | -------> |  - Port Mapping 80:80    |  |
|  |  2. docker build      |          |  - Gzip Compression      |  |
|  |  3. stop/rm old ctr   |          |  - Static Asset Caching  |  |
|  |  4. docker run -d     |          |  - SPA Fallback Routing  |  |
|  +-----------------------+          +------------+-------------+  |
+--------------------------------------------------|----------------+
                                                   |
                                                   | HTTP Traffic (Port 80)
                                                   v
                                        +---------------------+
                                        |      End Users      |
                                        | http://<EC2-IP>:80  |
                                        +---------------------+
```

### 3.3 Repository Audit Summary

| Audit Dimension | Finding |
| :--- | :--- |
| **Application Stack** | Vanilla HTML5, CSS3, ES6+ JavaScript (no Node.js bundler or runtime dependencies) |
| **Source / Output Directory** | `manoranjan_protfolio/` (`index.html`, `style.css`, `script.js`, `images/profile.jpg`, `assets/`) |
| **Build Command** | None required for transpilation; handled in Dockerfile Stage 1 via validation, cleanup, and permission normalization into `/dist` |
| **Routing & Asset Paths** | Relative URLs (`style.css`, `script.js`, `images/...`, `assets/...`) served cleanly from web root `/` |
| **Default Git Branch** | `master` (workflow configured to trigger on both `main` and `master`) |

---

## 4. Cloud & DevOps Tech Stack Breakdown

| Layer | Technology | Role in Infrastructure Stack |
| :--- | :--- | :--- |
| **Cloud Compute (IaaS)** | **AWS EC2 (`t2.micro`)** | Virtualized cloud server (1 vCPU, 1 GiB RAM, AWS Free Tier eligible) hosting the container runtime and exposing a public IPv4 endpoint. |
| **Operating System** | **Ubuntu Server LTS (Linux)** | Stable Debian-based POSIX server OS running Docker Engine, OpenSSH daemon, and system networking tools. |
| **Containerization** | **Docker & Docker Compose** | Packages the static site and Nginx config into an immutable image via a multi-stage `Dockerfile`, guaranteeing environment parity and automatic restarts (`unless-stopped`). |
| **Web Server** | **Nginx (`nginx:alpine`)** | Lightweight (~45 MB final footprint) event-driven HTTP server delivering static files on Port 80 with gzip compression, cache-control headers, and `try_files` routing fallback. |
| **CI/CD Automation** | **GitHub Actions** | Event-driven automation platform running on `ubuntu-latest` that validates repository artifacts and deploys updates over SSH on every push. |
| **Frontend Application** | **HTML5 / CSS3 / Vanilla JS** | Editorial 3D-perspective portfolio interface featuring SVG grain filters, ambient particle canvas, interactive tilt physics, and downloadable PDF résumé. |

---

## 5. Step-by-Step Implementation Guide

### Step 1: AWS EC2 Instance Provisioning

1. Sign in to the **AWS Management Console** and open the **EC2 Dashboard** in the desired region (e.g., `ap-south-1` Mumbai or `us-east-1` N. Virginia).
2. Click **Launch instance** and configure the following parameters:
   - **Name**: `portfolio-web-ec2`
   - **Application and OS Images (AMI)**: Select **Ubuntu Server 24.04 LTS (HVM), SSD Volume Type** (or Ubuntu Server 22.04 LTS), `64-bit (x86)`.
   - **Instance Type**: Select **`t2.micro`** (1 vCPU, 1 GiB memory — Free Tier eligible).
   - **Key Pair (login)**: Click **Create new key pair**, name it `portfolio-ec2-key`, select **RSA** and **`.pem`** format, and download `portfolio-ec2-key.pem` safely.
   - **Network Settings**: Ensure **Auto-assign public IP** is set to **Enable**.
   - **Configure Storage**: Allocate **15 GiB `gp3`** (within the 30 GiB Free Tier EBS allowance) to leave headroom for Docker image layers.
3. Click **Launch instance** and wait until the **Instance state** changes to **Running** and **2/2 checks passed** completes.
4. Note the **Public IPv4 address** from the EC2 Instance Summary panel.
5. On your local workstation, restrict private key permissions before connecting:
   ```bash
   chmod 400 portfolio-ec2-key.pem
   ssh -i portfolio-ec2-key.pem ubuntu@<EC2-PUBLIC-IP>
   ```

---

### Step 2: AWS Security Group Configuration

During instance creation or via **EC2 -> Network & Security -> Security Groups -> Inbound rules**, attach a Security Group (e.g., `portfolio-web-sg`) with the following rules:

| Direction | Type | Protocol | Port Range | Source | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Inbound** | SSH | TCP | `22` | `My IP` (or `0.0.0.0/0` when GitHub Actions runners connect dynamically) | Administrative SSH access & GitHub Actions CI/CD deployment channel |
| **Inbound** | HTTP | TCP | `80` | `0.0.0.0/0`, `::/0` | Public browser access to the portfolio web application |
| **Outbound** | All traffic | All | `All` | `0.0.0.0/0` | Allows `apt`, `git clone/fetch`, and Docker Hub image pulls |

> **Security Note**: Because GitHub-hosted Actions runners use dynamic public IP ranges, Port 22 must either accept SSH connections from GitHub runner CIDR ranges / `0.0.0.0/0` protected strictly by asymmetric RSA/Ed25519 key authentication (with password authentication disabled in `/etc/ssh/sshd_config`), or use a dedicated Bastion/self-hosted runner.

---

### Step 3: EC2 Host Setup & Docker Installation

After connecting via SSH to the Ubuntu EC2 instance (`ubuntu@<EC2-PUBLIC-IP>`), install Docker Engine, Docker Compose v2, Git, and curl:

```bash
# 1. Update apt package index and upgrade base OS packages
sudo apt-get update && sudo apt-get upgrade -y

# 2. Install prerequisite packages and Git
sudo apt-get install -y ca-certificates curl gnupg git

# 3. Add Docker's official GPG key and apt repository
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 4. Install Docker Engine, CLI, containerd, and Compose plugin
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 5. Add the 'ubuntu' user to the 'docker' group (avoids sudo in CI/CD scripts)
sudo usermod -aG docker ubuntu

# 6. Enable Docker daemon on system boot
sudo systemctl enable --now docker
```

Log out (`exit`) and reconnect via SSH so the `docker` group membership takes effect, then verify:

```bash
docker --version
docker compose version
git --version
```

---

### Step 4: Containerization with Docker & Nginx

1. Clone the repository on the EC2 host (optional for manual bootstrap; the CI/CD pipeline also performs this automatically on first run):
   ```bash
   git clone https://github.com/Manuaradhya01/my-portfolio.git ~/my-portfolio
   cd ~/my-portfolio
   ```
2. Build and launch the containerized Nginx application using Docker Compose:
   ```bash
   docker compose up -d --build
   ```
3. Confirm that the `portfolio-web` container is running and bound to `0.0.0.0:80->80/tcp`:
   ```bash
   docker ps
   ```

---

### Step 5: Automated Deployment via GitHub Actions

1. Open the GitHub repository **`https://github.com/Manuaradhya01/my-portfolio`**.
2. Navigate to **Settings -> Secrets and variables -> Actions -> New repository secret** and create the following three encrypted secrets:

| Secret Name | Value Description | Example |
| :--- | :--- | :--- |
| `EC2_HOST` | Public IPv4 address (or Elastic IP) of the AWS EC2 instance | `13.234.xxx.xxx` |
| `EC2_USER` | SSH login username for the Ubuntu AMI | `ubuntu` |
| `EC2_SSH_KEY` | Full contents of the downloaded `.pem` private key file (including `-----BEGIN ...-----` and `-----END ...-----` lines) | `-----BEGIN RSA PRIVATE KEY----- ...` |

3. Commit and push the infrastructure files (`Dockerfile`, `docker-compose.yml`, `nginx.conf`, `.dockerignore`, `.github/workflows/deploy.yml`) to `main` (or `master`).
4. Open the **Actions** tab on GitHub to monitor the **Deploy Portfolio to AWS EC2** workflow execution in real time.

---

## 6. Configuration Code Snippets & Technical Explanations

### 6.1 `Dockerfile` (Multi-Stage Static Build)

```dockerfile
# ==============================================================================
# Stage 1: Build & Asset Packaging Stage
# Tailored for Vanilla HTML5 / CSS3 / ES6+ static portfolio (manoranjan_protfolio)
# ==============================================================================
FROM alpine:3.20 AS builder

WORKDIR /build

# Install build/packaging utilities for validation and permission normalization
RUN apk add --no-cache findutils

# Copy static portfolio source directory
COPY manoranjan_protfolio/ ./site/

# Verify required entrypoints, remove stray OS files, normalize permissions, and stage /dist
RUN test -f ./site/index.html \
    && test -f ./site/style.css \
    && test -f ./site/script.js \
    && find ./site -type f \( -name '.DS_Store' -o -name 'Thumbs.db' -o -name '*.tmp' \) -delete \
    && find ./site -type d -exec chmod 755 {} + \
    && find ./site -type f -exec chmod 644 {} + \
    && mv ./site /dist

# ==============================================================================
# Stage 2: Production Stage (Lightweight Nginx Alpine)
# ==============================================================================
FROM nginx:alpine AS production

LABEL maintainer="Manoranjan L <manuaradhya2326@gmail.com>"
LABEL description="Containerized Portfolio Website hosted on AWS EC2 with Nginx"

# Remove default Nginx placeholder content and configuration
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

# Copy custom Nginx server configuration (gzip, static caching, SPA fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static output from builder stage
COPY --from=builder /dist /usr/share/nginx/html

# Expose HTTP port 80
EXPOSE 80

# Healthcheck using BusyBox wget included in nginx:alpine
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://127.0.0.1:80/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

**Technical Explanation:**
- **Stage 1 (`builder` on `alpine:3.20`)**: Because this repository uses pure Vanilla HTML5/CSS3/ES6+ without a `package.json`, Stage 1 acts as an asset validation and packaging stage. It asserts the presence of `index.html`, `style.css`, and `script.js` inside `manoranjan_protfolio/`, strips stray OS metadata files (`.DS_Store`, `Thumbs.db`), sets deterministic read permissions (`755` directories / `644` files), and stages the verified bundle into `/dist`.
- **Stage 2 (`production` on `nginx:alpine`)**: Copies only `/dist` and `nginx.conf` from Stage 1 into a minimal `nginx:alpine` image, discarding build tooling (`findutils`) from the final image.
- **`HEALTHCHECK`**: Uses `wget` (included via BusyBox inside `nginx:alpine`) against `127.0.0.1:80` so Docker tracks actual HTTP availability rather than just process liveness.
- **`daemon off;`**: Keeps Nginx in the foreground as PID 1 so Docker does not mistakenly treat the container as exited.

---

### 6.2 `nginx.conf` (Gzip, Caching Headers & SPA Routing)

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # Hide Nginx version information from response headers
    server_tokens off;

    # Enable gzip compression for text-based assets
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_types
        text/plain
        text/css
        text/javascript
        application/javascript
        application/json
        application/xml
        application/xml+rss
        image/svg+xml
        font/woff
        font/woff2;

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Do not cache HTML entrypoint so CI/CD updates appear immediately
    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate" always;
        add_header Pragma "no-cache" always;
        add_header Expires "0" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    }

    # Cache CSS and JS with browser revalidation (unhashed asset filenames)
    location ~* \.(?:css|js)$ {
        expires 7d;
        add_header Cache-Control "public, max-age=604800, must-revalidate" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        access_log off;
    }

    # Long-term cache headers for images, fonts, and resume PDF
    location ~* \.(?:jpg|jpeg|png|gif|ico|svg|webp|woff|woff2|pdf)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        access_log off;
    }

    # SPA fallback routing rule
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Block access to hidden dotfiles
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

**Technical Explanation:**
- **Gzip Compression (`gzip_comp_level 6`, `gzip_min_length 256`)**: Compresses HTML, CSS, JavaScript, JSON, SVG, and WOFF2 fonts in transit, significantly shrinking payload transfer size for the 2,675-line `style.css` and `index.html`.
- **Differentiated Static Caching**:
  - `index.html` uses `no-cache, no-store, must-revalidate` so clients always fetch fresh deployments immediately.
  - `*.css` and `*.js` use a 7-day cache paired with `must-revalidate` (since filenames are unhashed, ensuring browsers validate ETags cleanly after updates).
  - Binary media (`profile.jpg`, `3dprotfoliotheam.jpeg`, `Manoranjan_L_Resume.pdf`) is cached for 30 days (`max-age=2592000`).
- **SPA Fallback (`try_files $uri $uri/ /index.html;`)**: Attempts to serve an exact file or directory first and gracefully falls back to `/index.html` for client-side routes instead of returning `404 Not Found`.
- **Security Hardening**: Disables Nginx version banners (`server_tokens off`), blocks access to dotfiles (`location ~ /\.`), and preserves security headers across child `location` blocks where `add_header` overrides parent inheritance.

---

### 6.3 `docker-compose.yml` & `.dockerignore`

#### `docker-compose.yml`

```yaml
services:
  portfolio-web:
    build:
      context: .
      dockerfile: Dockerfile
    image: portfolio-web:latest
    container_name: portfolio-web
    ports:
      - "80:80"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1:80/"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 5s
```

#### `.dockerignore`

```text
# Version control & CI/CD metadata
.git
.gitignore
.github

# Dependencies & environment secrets
node_modules
.env
.env.*
*.pem
*.key

# Local build artifacts & logs
dist
build
out
.cache
*.log

# Docker & documentation files not required in runtime context
Dockerfile
docker-compose.yml
.dockerignore
README.md
Cloud_Deployment_Report.md

# OS & IDE metadata
.DS_Store
Thumbs.db
__MACOSX
.vscode
.idea
```

**Technical Explanation:**
- **`ports: ["80:80"]`**: Maps host TCP port 80 on the EC2 instance directly to container port 80 exposed by Nginx.
- **`restart: unless-stopped`**: Ensures the container recovers automatically after unexpected crashes or AWS EC2 host reboots, unless explicitly stopped by an administrator or CI/CD pipeline.
- **`.dockerignore`**: Shrinks the Docker build context by excluding `.git`, `.github`, `node_modules`, `.env`, local build folders, and documentation, improving build speed and preventing secrets from entering build layers.

---

### 6.4 `.github/workflows/deploy.yml` (Automated CI/CD Pipeline)

```yaml
name: Deploy Portfolio to AWS EC2

on:
  push:
    branches:
      - main
      - master # Supports current repository default branch alongside main
  workflow_dispatch:

concurrency:
  group: aws-ec2-production-deploy
  cancel-in-progress: false

jobs:
  validate-and-deploy:
    name: Validate Assets & Deploy to AWS EC2
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Verify Deployment Configuration & Portfolio Files
        run: |
          test -f Dockerfile
          test -f docker-compose.yml
          test -f nginx.conf
          test -f .dockerignore
          test -f manoranjan_protfolio/index.html
          test -f manoranjan_protfolio/style.css
          test -f manoranjan_protfolio/script.js
          echo "Verified Docker, Nginx, and static portfolio files."

      - name: Deploy Containerized Portfolio to AWS EC2 via SSH
        env:
          EC2_HOST: ${{ secrets.EC2_HOST }}
          EC2_USER: ${{ secrets.EC2_USER }}
          EC2_SSH_KEY: ${{ secrets.EC2_SSH_KEY }}
          GITHUB_REPO: ${{ github.repository }}
          TARGET_BRANCH: ${{ github.ref_name }}
          COMMIT_SHA: ${{ github.sha }}
        run: |
          set -euo pipefail

          if [ -z "$EC2_HOST" ] || [ -z "$EC2_USER" ] || [ -z "$EC2_SSH_KEY" ]; then
            echo "Error: Missing required GitHub Secrets (EC2_HOST, EC2_USER, EC2_SSH_KEY)." >&2
            exit 1
          fi

          mkdir -p ~/.ssh
          chmod 700 ~/.ssh
          printf '%s\n' "$EC2_SSH_KEY" | tr -d '\r' > ~/.ssh/ec2_deploy_key
          chmod 600 ~/.ssh/ec2_deploy_key

          trap 'rm -f ~/.ssh/ec2_deploy_key' EXIT

          ssh -i ~/.ssh/ec2_deploy_key \
            -o StrictHostKeyChecking=accept-new \
            -o ServerAliveInterval=30 \
            -o ConnectTimeout=20 \
            "${EC2_USER}@${EC2_HOST}" \
            "GITHUB_REPO='$GITHUB_REPO' TARGET_BRANCH='$TARGET_BRANCH' COMMIT_SHA='$COMMIT_SHA' bash -s" <<'EOF'
            set -euo pipefail

            APP_DIR="$HOME/my-portfolio"
            REPO_URL="https://github.com/${GITHUB_REPO}.git"
            IMAGE_NAME="portfolio-web"
            CONTAINER_NAME="portfolio-web"
            SHORT_SHA="${COMMIT_SHA:0:7}"

            echo "==> [1/5] Pulling latest repository changes..."
            if [ ! -d "$APP_DIR/.git" ]; then
              git clone --branch "$TARGET_BRANCH" "$REPO_URL" "$APP_DIR"
            fi
            cd "$APP_DIR"
            git fetch origin "$TARGET_BRANCH"
            git checkout "$TARGET_BRANCH"
            git reset --hard "origin/$TARGET_BRANCH"

            echo "==> [2/5] Building and re-tagging Docker image (${IMAGE_NAME}:${SHORT_SHA})..."
            docker build -t "${IMAGE_NAME}:${SHORT_SHA}" -t "${IMAGE_NAME}:latest" .

            echo "==> [3/5] Stopping and removing existing container..."
            if docker ps -a --format '{{.Names}}' | grep -qx "$CONTAINER_NAME"; then
              docker stop "$CONTAINER_NAME" || true
              docker rm -f "$CONTAINER_NAME" || true
            fi

            echo "==> [4/5] Starting new containerized application on port 80..."
            docker run -d \
              --name "$CONTAINER_NAME" \
              --restart unless-stopped \
              -p 80:80 \
              "${IMAGE_NAME}:latest"

            echo "==> [5/5] Cleaning dangling images & verifying container health..."
            docker image prune -f
            sleep 2
            docker ps --filter "name=$CONTAINER_NAME"
            curl -fsS -I http://127.0.0.1:80/
          EOF
```

**Technical Explanation:**
- **Triggers & Concurrency**: Runs automatically on pushes to `main` or `master` (plus manual `workflow_dispatch`), while `concurrency` serializes deployments so concurrent pushes cannot race on Port 80.
- **Secret Hygiene**: Normalizes Windows CRLF (`tr -d '\r'`), enforces `chmod 600` on the ephemeral key file, and deletes `~/.ssh/ec2_deploy_key` via an `EXIT` trap regardless of job outcome.
- **Immutable Image Tagging & Safe Cutover**: Builds and tags each release with both the 7-character commit SHA (`portfolio-web:<short-sha>`) and `:latest`, stops/removes any existing `portfolio-web` container cleanly, starts the new container on Port 80, prunes dangling layers (`docker image prune -f`), and executes a live `curl` smoke check before marking the pipeline green.

---

## 7. Testing & Verification

Run the following verification checks from the EC2 SSH session and local browser after deployment:

### 7.1 Container Status & Health Verification

```bash
# 1. Confirm container is Up and mapped to 0.0.0.0:80->80/tcp
docker ps --filter "name=portfolio-web"

# 2. Check Docker HEALTHCHECK status (expects: healthy)
docker inspect --format='{{.State.Health.Status}}' portfolio-web

# 3. Inspect recent Nginx container logs
docker logs --tail 20 portfolio-web
```

### 7.2 Listening Ports & Host Firewall Verification

```bash
# Verify Docker proxy / Nginx is listening on TCP port 80
sudo ss -tulnp | grep :80

# If Ubuntu UFW firewall is active, confirm Port 80 and Port 22 are allowed
sudo ufw status
```

### 7.3 HTTP Headers, Gzip, Caching & SPA Routing Verification

```bash
# 1. Verify HTTP 200 and no-cache headers on HTML root
curl -I http://localhost/

# 2. Verify gzip encoding and Cache-Control on CSS assets
curl -I -H "Accept-Encoding: gzip" http://localhost/style.css

# 3. Verify SPA fallback routing returns HTTP 200 instead of 404
curl -I http://localhost/projects/preview
```

Expected indicators in responses:
- `HTTP/1.1 200 OK`
- `Cache-Control: no-cache, no-store, must-revalidate` on `/` and `/index.html`
- `Content-Encoding: gzip` and `Cache-Control: public, max-age=604800, must-revalidate` on `/style.css`
- `HTTP/1.1 200 OK` on `/projects/preview` via `try_files $uri $uri/ /index.html;`

### 7.4 Live Browser Validation

Open `http://<EC2-PUBLIC-IP>` in a desktop and mobile browser and verify:
- All sections render cleanly (`Hero`, `Selected Projects`, `About`, `Technical Skills`, `Leadership`, `Contact`).
- `images/profile.jpg` loads without falling back to the monogram placeholder.
- Clicking `06. RESUME ↓` downloads `assets/Manoranjan_L_Resume.pdf`.
- Browser Developer Tools (`F12 -> Console`) confirms `Manoranjan L Portfolio engine initialized successfully.` with zero 404 asset errors.

---

## 8. Required Submission Screenshots

Insert captured screenshots in the placeholders below before converting this document to PDF:

### Screenshot 1: AWS EC2 Running Instance & Public IPv4 Details
> **[Screenshot 1: AWS EC2 Running Instance & Public IPv4 details]**
>
> *Capture the EC2 Console Instance Summary showing Instance State: `Running`, Instance Type: `t2.micro`, Platform: `Ubuntu`, and the assigned Public IPv4 address.*

---

### Screenshot 2: AWS Inbound Security Group Rules
> **[Screenshot 2: AWS Inbound Security Group Rules (Ports 22 & 80)]**
>
> *Capture the Security Group Inbound Rules tab displaying TCP Port `22` (SSH) and TCP Port `80` (HTTP).*

---

### Screenshot 3: EC2 Terminal SSH Session & Running Container
> **[Screenshot 3: Terminal SSH session showing Docker container running (`docker ps`)]**
>
> *Capture the SSH session on `ubuntu@<EC2-PUBLIC-IP>` displaying `docker ps` output with `portfolio-web` status `Up ... (healthy)` and port mapping `0.0.0.0:80->80/tcp`.*

---

### Screenshot 4: Successful GitHub Actions CI/CD Run
> **[Screenshot 4: Successful GitHub Actions CI/CD deployment execution]**
>
> *Capture the GitHub Actions workflow summary and expanded `Deploy Containerized Portfolio to AWS EC2 via SSH` job steps showing green checkmarks.*

---

### Screenshot 5: Live Portfolio Website in Browser
> **[Screenshot 5: Live portfolio website running in browser via `http://<EC2-PUBLIC-IP>`]**
>
> *Capture the browser address bar clearly showing `http://<EC2-PUBLIC-IP>` and the rendered 3D editorial portfolio hero section.*

---

## 9. Challenges Faced & Solutions Implemented

| # | Challenge Encountered | Root Cause | Implemented Solution |
| :-: | :--- | :--- | :--- |
| 1 | **Port 80 Bind Conflicts on EC2** | Pre-installed system web services or an older container still occupying TCP Port 80 caused `Bind for 0.0.0.0:80 failed: port is already allocated`. | Added explicit pre-launch container detection (`docker ps -a --format '{{.Names}}'`) followed by `docker stop` and `docker rm -f` in `deploy.yml`, and verified host port availability with `ss -tulnp \| grep :80`. |
| 2 | **Docker Daemon Permission Denied** | Running `docker` over SSH as the non-root `ubuntu` user initially failed with `permission denied while trying to connect to the Docker daemon socket`. | Added `ubuntu` to the `docker` group (`sudo usermod -aG docker ubuntu`) during EC2 provisioning and established a fresh SSH login session before triggering CI/CD. |
| 3 | **Stale Browser Caching After Deployments** | Aggressive static caching on `index.html` or unhashed `style.css`/`script.js` files can cause returning visitors to load outdated markup after a push. | Split `nginx.conf` caching policies: `no-cache, no-store, must-revalidate` on `index.html`, `max-age=604800, must-revalidate` on CSS/JS, and `max-age=2592000` on static images and PDFs. |
| 4 | **Subdirectory Portfolio Structure (`manoranjan_protfolio/`)** | Static website assets reside inside a nested folder (`manoranjan_protfolio/`) rather than the repository root, causing default web-root mounts to serve directory listings or 404 errors. | Designed the multi-stage `Dockerfile` to ingest `manoranjan_protfolio/`, verify required entrypoints, normalize permissions, and copy the staged `/dist` directly into `/usr/share/nginx/html`. |
| 5 | **EBS Storage Exhaustion on `t2.micro`** | Repeated CI/CD Docker builds leave dangling intermediate layers that gradually consume the limited Free Tier EBS root volume. | Excluded `.git`, logs, and documentation via `.dockerignore` and added `docker image prune -f` after every deployment in `.github/workflows/deploy.yml`. |
| 6 | **SSH Key Formatting & Non-Interactive Host Verification** | Copying `.pem` keys on Windows can inject `\r` (CRLF) characters, and non-interactive SSH runners stall on interactive host-key confirmation prompts. | Normalized keys with `tr -d '\r'`, enforced strict `chmod 600` permissions with automatic `trap` cleanup, and passed `-o StrictHostKeyChecking=accept-new`. |
| 7 | **Git Branch Trigger Alignment (`main` vs `master`)** | Existing repository history uses `master` as its default branch while standard CI/CD templates target `main`. | Configured `deploy.yml` to listen on both `main` and `master` under `on.push.branches`, ensuring immediate automation compatibility. |

---

## 10. Conclusion & Future Scope

This project successfully migrates a static portfolio web application onto an industry-standard, self-managed **AWS EC2 + Docker + Nginx + GitHub Actions** deployment pipeline. By isolating the web server in an Alpine-based multi-stage Docker container and automating SSH rollouts through GitHub Actions, deployments are deterministic, version-tagged, and recoverable across instance restarts.

**Recommended Future Enhancements:**
- Attach an **AWS Elastic IP** and map a custom domain via **Amazon Route 53** to prevent public IP changes across instance stop/start cycles.
- Enable **HTTPS (Port 443)** using **Certbot / Let's Encrypt** TLS certificates (or terminate SSL via an AWS Application Load Balancer with ACM) so features like the Web Clipboard API work over encrypted connections.
- Export container logs and metrics to **Amazon CloudWatch** for centralized uptime monitoring and alerting.

