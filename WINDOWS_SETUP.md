# Windows 11 Setup Guide

This project is a Laravel 10 application with a Vite/React frontend. To run it on Windows 11, install the tools below and then follow the setup steps in order.

## Git Setup First

Install Git for Windows before anything else so you can clone the repository, pull updates, and push your code.

- Download Git for Windows: <https://git-scm.com/download/win>

After installing Git, open `Git Bash` or a normal terminal and set your identity:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

## Clone the Project

This repository can be cloned with either HTTPS or SSH.

### Option 1: HTTPS

Use this if you want the simplest setup:

```bash
git clone https://github.com/RamiKhouja/hbaq.git
cd hbaq
```

To push with HTTPS, GitHub may ask you to authenticate with your GitHub account and a personal access token instead of your password.

### Option 2: SSH

Use this if you want easier authenticated push/pull after initial setup:

1. Generate an SSH key:

```bash
ssh-keygen -t ed25519 -C "you@example.com"
```

2. Start the SSH agent and add your key:

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

3. Copy your public key:

```bash
cat ~/.ssh/id_ed25519.pub
```

4. Add that public key to your GitHub account:
   - GitHub -> Settings -> SSH and GPG keys -> New SSH key

5. Test the connection:

```bash
ssh -T git@github.com
```

6. Clone the project:

```bash
git clone git@github.com:RamiKhouja/hbaq.git
cd hbaq
```

If you need push access, your GitHub account must be added as a collaborator or team member on the repository.

## Required Installations

1. Git for Windows
   - Needed to clone the repository and work with version control.
   - Download: <https://git-scm.com/download/win>

2. XAMPP with PHP 8.1
   - Use a XAMPP build that includes PHP 8.1.x.
   - Make sure Apache and MySQL are included.
   - PHP extensions commonly needed for Laravel should be enabled in `php.ini`: `openssl`, `pdo_mysql`, `mbstring`, `tokenizer`, `xml`, `ctype`, `json`, `fileinfo`, and `zip`.
   - Download: <https://www.apachefriends.org/download.html?lan=english>
   - For this project, choose the Windows installer that includes PHP `8.1.x`.

3. Composer 2
   - Install the latest Composer 2.x for Windows.
   - During installation, point Composer to the PHP executable from XAMPP, usually:
   - `C:\xampp\php\php.exe`

4. Node.js 18 LTS
   - This project uses Vite 4 and modern frontend packages.
   - Node.js 18 was a safe baseline for this stack, but it is now end-of-life.
   - If the project works without version issues on your machine, prefer the current official LTS download page first.
   - If you need Node 18 specifically for compatibility, use the official archive page.
   - `npm` is included with Node.js.
   - Current official downloads: <https://nodejs.org/en/download>
   - Official previous releases page: <https://nodejs.org/en/about/previous-releases>
   - Example Node 18 archive page: <https://nodejs.org/en/download/archive/v18.18.0>

5. A code editor
   - VS Code is recommended, but any editor is fine.

## Recommended Versions

- Windows 11
- XAMPP with PHP `8.1.x`
- Composer `2.x`
- Node.js `18.x LTS`
- MySQL from XAMPP on port `3306`

## Project Requirements From This Repo

From the current project files:

- PHP requirement: `^8.1`
- Laravel version: `^10.10`
- Database driver: MySQL
- Frontend toolchain: Vite + React

## Initial XAMPP Setup

1. Install XAMPP.
2. Open the XAMPP Control Panel.
3. Start `Apache`.
4. Start `MySQL`.
5. Confirm MySQL is running on port `3306`.

If Apache port `80` is busy on your machine, update the Apache port in XAMPP and then update the app URL if needed.

## Create the Database

1. Open `http://localhost/phpmyadmin`
2. Create a database named:
   - `hbaq`
3. Keep the default local XAMPP MySQL user unless your setup is different:
   - username: `root`
   - password: empty by default

## Environment Configuration

This repo already contains an `.env` file configured for local MySQL:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hbaq
DB_USERNAME=root
DB_PASSWORD=
```

Before running the app, review `.env` and adjust anything machine-specific.

For safety, use local development values for mail and third-party services. Do not rely on shared or production-style secrets in local setup.

## Install Project Dependencies

Open a terminal in the project root and run:

```bash
composer install
npm install
```

## Laravel First Run

Run these commands in the project root:

```bash
php artisan key:generate
php artisan migrate
```

If the project includes seeders and you want sample data, you can also run:

```bash
php artisan db:seed
```

## Start the Project

Use two terminals.

Terminal 1:

```bash
php artisan serve
```

Terminal 2:

```bash
npm run dev
```

Then open:

- Laravel app: `http://127.0.0.1:8000`

If you prefer Apache instead of `php artisan serve`, point XAMPP Apache to the project `public` directory.

## Quick Checklist

- XAMPP installed with PHP 8.1
- Git installed and configured
- repository cloned with HTTPS or SSH
- Apache running
- MySQL running
- Composer installed and linked to XAMPP PHP
- Node.js 18 installed
- Database `hbaq` created
- `composer install` completed
- `npm install` completed
- `php artisan key:generate` completed
- `php artisan migrate` completed
- `php artisan serve` and `npm run dev` both running

## Common Issues

### `composer` uses the wrong PHP version

Make sure Composer is using:

```text
C:\xampp\php\php.exe
```

You can verify with:

```bash
php -v
composer -V
```

### MySQL connection error

Check:

- XAMPP MySQL is running
- the database `hbaq` exists
- `.env` has the correct username/password
- port `3306` is not blocked or changed

### Frontend assets do not load

Check that:

- `npm install` finished successfully
- `npm run dev` is still running
- Node.js is installed correctly

### `php artisan migrate` fails

Usually this means:

- database settings in `.env` are wrong
- MySQL is not started
- required PHP extensions are missing

## Optional Helpful Tools

- Laravel VS Code extensions
- Postman or Insomnia for API testing
- HeidiSQL if you prefer a desktop MySQL client over phpMyAdmin
