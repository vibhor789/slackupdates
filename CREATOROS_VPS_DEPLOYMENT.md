# CreatorOS - Complete Hostinger VPS Deployment Guide

## 🎯 What You're Deploying

**CreatorOS** - A social media management platform (like Buffer/Hootsuite) that allows users to:
- Post to Instagram, Facebook, Twitter simultaneously
- Manage DMs across all platforms
- View analytics and follower growth
- Schedule content
- Connect multiple social accounts

**Tech Stack:**
- Frontend: React Native + Expo (Web version)
- Backend: Supabase (PostgreSQL + Auth)
- API: Ayrshare (social media posting)

---

## 💰 Business Model (Your Revenue)

With this setup, you can charge clients:
- **Small Business:** $149/month (1-3 users)
- **Professional:** $299/month (5-10 users)
- **Agency:** $599/month (unlimited users)
- **Setup Fee:** $500-1,000 per client

**Your costs:**
- VPS: $10/month
- Ayrshare: $50-200/month (ALL clients combined)
- Supabase: Free or $25/month

**Profit with 10 clients:** $2,000-5,000/month! 💰

---

## 📋 Prerequisites

Before starting, you need:

### 1. Hostinger VPS Access
- VPS IP address
- Root or sudo user access
- SSH credentials

### 2. Domain Name
- A domain pointed to your VPS IP
- Example: `creatoros.yourdomain.com`

### 3. Supabase Account (You Have This!)
- Free account at https://supabase.com
- Project URL
- Anon Key
- Service Role Key

### 4. Ayrshare Account (You Have This!)
- Account at https://ayrshare.com
- API Key
- Profile Key (create one for the app)

### 5. On Your Local Computer
- Node.js 18+ installed
- Git installed
- The CreatorOS code (already downloaded)

---

## 🚀 PART 1: Prepare Your VPS

### Step 1: Connect to Your VPS

**Using PuTTY (Windows):**
1. Open PuTTY
2. Host Name: Your VPS IP (e.g., 123.456.789.10)
3. Port: 22
4. Click "Open"
5. Login with your credentials

**Or using SSH:**
```bash
ssh root@your-vps-ip
```

### Step 2: Update System

```bash
# Update package list
apt update && apt upgrade -y

# Install essential tools
apt install -y curl wget git build-essential
```

### Step 3: Install Node.js 20

```bash
# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

### Step 4: Install Nginx (Web Server)

```bash
# Install Nginx
apt install -y nginx

# Start and enable Nginx
systemctl start nginx
systemctl enable nginx

# Check status
systemctl status nginx
```

### Step 5: Install PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Verify installation
pm2 --version
```

### Step 6: Install Certbot (For HTTPS/SSL)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx
```

---

## 🏗️ PART 2: Build CreatorOS for Web

### Step 1: On Your Local Computer

Open Command Prompt in the CreatorOS folder:

```bash
cd C:\Users\vibho\Desktop\creatoros-app
```

### Step 2: Create Environment File

Create a file named `.env` in the project root:

```bash
# Copy the example
copy .env.example .env

# Or create manually with these contents:
```

`.env` file contents:
```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Ayrshare Configuration
EXPO_PUBLIC_AYRSHARE_API_KEY=your-ayrshare-api-key
EXPO_PUBLIC_AYRSHARE_PROFILE_KEY=your-profile-key

# App Configuration
EXPO_PUBLIC_APP_URL=https://creatoros.yourdomain.com
```

**Get your Supabase credentials:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Settings → API
4. Copy "Project URL" and "anon public" key

**Get your Ayrshare credentials:**
1. Go to https://app.ayrshare.com
2. API Keys section
3. Copy your API key
4. Create a new "Profile" and copy the Profile Key

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Build for Web

```bash
# Build the web version
npx expo export:web

# This creates a 'dist' folder with your web app
```

**Troubleshooting:**
- If you get errors about Expo CLI, run: `npm install -g expo-cli`
- If build fails, try: `npx expo install --check` to fix dependencies

### Step 5: Create Production Build

```bash
# Optional: Optimize for production
npm run build
```

---

## 📤 PART 3: Upload to Your VPS

### Step 1: Create App Directory on VPS

In PuTTY/SSH:

```bash
# Create directory for the app
mkdir -p /var/www/creatoros
cd /var/www/creatoros
```

### Step 2: Upload Files from Your Computer

**Option A: Using WinSCP (Easiest for Windows)**

1. Download WinSCP: https://winscp.net
2. Connect to your VPS:
   - Host: Your VPS IP
   - Username: root
   - Password: Your password
3. Navigate to `/var/www/creatoros`
4. Upload the entire `dist` folder from `C:\Users\vibho\Desktop\creatoros-app\dist`

**Option B: Using SCP Command**

On your Windows computer (in Git Bash or PowerShell):

```bash
# Upload the dist folder
scp -r C:\Users\vibho\Desktop\creatoros-app\dist root@your-vps-ip:/var/www/creatoros/

# Upload package.json and other needed files
scp C:\Users\vibho\Desktop\creatoros-app\package.json root@your-vps-ip:/var/www/creatoros/
```

**Option C: Using Git (If Code is in GitHub)**

On VPS:

```bash
cd /var/www/creatoros

# Clone the repository
git clone https://github.com/kevinbadi/creatoros-app.git .

# Install dependencies
npm install

# Build on the server
npx expo export:web
```

### Step 3: Set Permissions

```bash
# Set proper ownership
chown -R www-data:www-data /var/www/creatoros

# Set proper permissions
chmod -R 755 /var/www/creatoros
```

---

## ⚙️ PART 4: Configure Nginx

### Step 1: Create Nginx Configuration

```bash
# Create new site configuration
nano /etc/nginx/sites-available/creatoros
```

Paste this configuration:

```nginx
server {
    listen 80;
    server_name creatoros.yourdomain.com;  # Change to your domain

    root /var/www/creatoros/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Disable access to hidden files
    location ~ /\. {
        deny all;
    }
}
```

**Important:** Replace `creatoros.yourdomain.com` with your actual domain!

### Step 2: Enable the Site

```bash
# Create symbolic link to enable site
ln -s /etc/nginx/sites-available/creatoros /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# If test passes, reload Nginx
systemctl reload nginx
```

---

## 🔒 PART 5: Set Up HTTPS (SSL Certificate)

### Step 1: Point Domain to VPS

Before getting SSL, make sure your domain DNS is configured:

1. Go to your domain registrar
2. Add an A record:
   - Type: A
   - Name: creatoros (or @)
   - Value: Your VPS IP address
   - TTL: 3600

Wait 5-10 minutes for DNS to propagate.

### Step 2: Get Free SSL Certificate

```bash
# Get certificate from Let's Encrypt
certbot --nginx -d creatoros.yourdomain.com

# Follow the prompts:
# - Enter email address
# - Agree to terms
# - Choose whether to redirect HTTP to HTTPS (choose Yes)
```

### Step 3: Auto-Renew SSL

```bash
# Test auto-renewal
certbot renew --dry-run

# Set up auto-renewal (already configured by Certbot)
# Certificates auto-renew every 60 days
```

---

## 🗄️ PART 6: Configure Supabase Database

### Step 1: Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Name: `creatoros-production`
4. Database Password: Create a strong password (save it!)
5. Region: Choose closest to your VPS
6. Click "Create new project"

### Step 2: Run Database Migrations

The CreatorOS project includes migration files. You need to run them:

**Option A: Using Supabase Dashboard (Easiest)**

1. Go to your Supabase project
2. Click "SQL Editor"
3. Copy the contents from these files (from your local computer):
   - `C:\Users\vibho\Desktop\creatoros-app\supabase\migrations\*.sql`
4. Paste and run each migration file in order

**Option B: Using Supabase CLI**

On your local computer:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### Step 3: Enable Row Level Security (RLS)

In Supabase Dashboard → Authentication → Policies:

Make sure RLS is enabled for these tables:
- `profiles`
- `social_accounts`
- `social_messages`
- `social_analytics`

The migration files should have created these automatically.

### Step 4: Configure Authentication

In Supabase Dashboard → Authentication → Settings:

1. **Enable Email Auth** (if using email/password login)
2. **Configure OAuth** (if using social login):
   - Google, Apple, etc.
   - Add redirect URLs: `https://creatoros.yourdomain.com`

---

## 🔑 PART 7: Configure Ayrshare

### Step 1: Create Profile for Production

1. Go to https://app.ayrshare.com
2. Click "Profiles"
3. Create new profile: "Production App"
4. Copy the Profile Key
5. Update your `.env` file with this key

### Step 2: Understand Profile Limits

Check your Ayrshare plan:
- **How many profiles can you create?**
- Each client user needs a profile
- Make sure your plan supports enough profiles for your clients

**Upgrade if needed:**
- Genesis ($50/month): ~10 profiles
- Titan ($200/month): ~50 profiles
- Enterprise: Custom

---

## ✅ PART 8: Test Your Deployment

### Step 1: Access Your App

Open browser and go to:
```
https://creatoros.yourdomain.com
```

You should see the CreatorOS login page!

### Step 2: Create Test Account

1. Click "Sign Up"
2. Create an account
3. Verify it works

### Step 3: Test Features

- ✅ Login/Signup
- ✅ Connect social accounts
- ✅ Post to social media
- ✅ View analytics
- ✅ Check DMs

### Step 4: Check Logs

If something doesn't work:

```bash
# Check Nginx logs
tail -f /var/log/nginx/error.log

# Check Nginx access
tail -f /var/log/nginx/access.log
```

---

## 🔄 PART 9: Update and Maintenance

### When You Make Changes

**On your local computer:**

```bash
# Make your changes
# Build new version
npx expo export:web

# Upload to VPS (using WinSCP or SCP)
```

**On VPS:**

```bash
# Clear Nginx cache
systemctl reload nginx
```

### Automatic Deployment (Advanced)

Set up Git-based deployment:

```bash
# On VPS, create update script
nano /var/www/creatoros/update.sh
```

Contents:
```bash
#!/bin/bash
cd /var/www/creatoros
git pull origin main
npm install
npx expo export:web
chown -R www-data:www-data /var/www/creatoros
systemctl reload nginx
echo "Deployment complete!"
```

Make it executable:
```bash
chmod +x /var/www/creatoros/update.sh
```

To update:
```bash
/var/www/creatoros/update.sh
```

---

## 🛡️ PART 10: Security Best Practices

### 1. Set Up Firewall

```bash
# Install UFW
apt install -y ufw

# Allow SSH
ufw allow 22/tcp

# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check status
ufw status
```

### 2. Disable Root SSH Login

```bash
# Edit SSH config
nano /etc/ssh/sshd_config

# Change this line:
PermitRootLogin no

# Restart SSH
systemctl restart sshd
```

### 3. Set Up Fail2Ban (Prevent Brute Force)

```bash
# Install Fail2Ban
apt install -y fail2ban

# Start and enable
systemctl start fail2ban
systemctl enable fail2ban
```

### 4. Regular Backups

**Backup Supabase:**
- Supabase has automatic backups (check your plan)
- Or export database manually: Project → Database → Backups

**Backup VPS files:**
```bash
# Create backup script
nano /root/backup.sh
```

Contents:
```bash
#!/bin/bash
tar -czf /root/backups/creatoros-$(date +%Y%m%d).tar.gz /var/www/creatoros
# Keep only last 7 days
find /root/backups -name "creatoros-*.tar.gz" -mtime +7 -delete
```

Run weekly:
```bash
crontab -e
# Add this line:
0 2 * * 0 /root/backup.sh
```

---

## 🚨 Troubleshooting

### Issue: White screen / Blank page

**Solution:**
```bash
# Check if dist folder exists
ls -la /var/www/creatoros/dist

# Check Nginx error log
tail -f /var/log/nginx/error.log

# Verify index.html exists
cat /var/www/creatoros/dist/index.html
```

### Issue: "Cannot connect to Supabase"

**Solution:**
- Check `.env` file has correct Supabase URL and key
- Rebuild with correct environment variables
- Check Supabase project is active (not paused)

### Issue: Social media posting not working

**Solution:**
- Verify Ayrshare API key is correct
- Check Ayrshare account has active subscription
- Verify profile key is valid
- Check user has connected their social accounts

### Issue: SSL certificate errors

**Solution:**
```bash
# Renew certificate
certbot renew

# If that fails, delete and recreate
certbot delete --cert-name creatoros.yourdomain.com
certbot --nginx -d creatoros.yourdomain.com
```

---

## 📊 Monitoring and Analytics

### Check Server Resources

```bash
# CPU and Memory usage
htop

# Disk space
df -h

# Nginx status
systemctl status nginx
```

### Set Up Monitoring (Optional)

Use free tools:
- **UptimeRobot:** Monitor uptime (https://uptimerobot.com)
- **Google Analytics:** Add to your app for user tracking
- **Sentry:** Error tracking (https://sentry.io)

---

## 💼 Next Steps: Onboarding Clients

Now that your app is deployed, see:
- `CLIENT_ONBOARDING.md` - How to add clients
- `PRICING_STRATEGY.md` - How much to charge
- `CLIENT_PROPOSAL_TEMPLATE.md` - Sales template

---

## 🎉 Congratulations!

Your CreatorOS platform is now live and ready to serve clients!

**Your app is at:** `https://creatoros.yourdomain.com`

**You can now:**
- Sell subscriptions to clients
- Charge $149-599/month per client
- Make $2,000-5,000/month with just 10 clients!

---

## Support

If you need help, check:
1. Expo documentation: https://docs.expo.dev
2. Supabase docs: https://supabase.com/docs
3. Ayrshare API docs: https://docs.ayrshare.com
4. Nginx docs: https://nginx.org/en/docs/

Good luck! 🚀💰
