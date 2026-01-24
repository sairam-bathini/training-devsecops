# Training DevSecOps - Vulnerable Code Repository

A comprehensive repository containing intentionally vulnerable source code and dependencies for **SAST (Static Application Security Testing)** and **SCA (Software Composition Analysis)** training and testing.

## Purpose

This repository provides a realistic test environment to:
- Learn how SAST and SCA tools work
- Test different security scanning tools
- Understand common vulnerabilities (CWE/OWASP Top 10)
- Practice security code review
- Train development teams on secure coding

## Repository Contents

### Source Code Samples

Intentionally vulnerable code in multiple languages:

- **Java** (`src/main/java/com/example/`)
  - SQL Injection, Command Injection, Path Traversal
  - Hardcoded Credentials, Insecure Deserialization
  - Weak Cryptography, Sensitive Data Exposure

- **Python** (`src/main/python/`)
  - SQL Injection, Command Injection, Path Traversal
  - Insecure Deserialization, Weak Hashing
  - Unrestricted File Upload, Code Injection

- **JavaScript/Node.js** (`src/main/javascript/`)
  - XSS (Cross-Site Scripting), SQL Injection
  - Command Injection, Path Traversal
  - CSRF, Insecure Random, IDOR vulnerabilities

### Vulnerable Dependencies

- **pom.xml** - Maven with known vulnerable Java libraries
- **requirements.txt** - Python packages with security issues
- **package.json** - Node.js packages with CVEs

## Quick Start

### 1. View Vulnerabilities

```bash
# Open the vulnerabilities guide
cat VULNERABILITIES.md
```

### 2. Run SAST Analysis with SonarQube

#### Setup SonarQube for IDE

```bash
# Install SonarQube for IDE extension in VS Code
# Search for: "SonarQube for IDE" in VS Code Extensions

# Connect to SonarQube Server (if available)
# Or use SonarQube Cloud with your organization
```

#### Analyze Files in VS Code

1. Install the **SonarQube for IDE** extension
2. Open any vulnerable source file
3. Issues will be highlighted in the editor
4. Check the Problems panel for detailed findings

### 3. Run SCA Analysis

#### For Maven (Java)

```bash
# Using OWASP Dependency-Check
dependency-check --project "training-devsecops" --scan . --format HTML

# Using Maven plugin
mvn org.owasp:dependency-check-maven:check
```

#### For Python

```bash
# Using pip-audit
pip-audit -r requirements.txt

# Using Safety
safety check -r requirements.txt

# Using Snyk
snyk test --file=requirements.txt
```

#### For Node.js

```bash
# Using npm audit (built-in)
npm audit

# Using Snyk
snyk test --file=package.json

# Using OWASP Dependency-Check
dependency-check --project "training-devsecops-js" --scan . --format HTML
```

## Vulnerabilities by Category

### SAST (Code-level)

| Category | CWE | Examples |
|----------|-----|----------|
| Injection | 78, 89, 95 | SQL Injection, Command Injection, Code Injection |
| Broken Access | 22, 639 | Path Traversal, IDOR |
| Sensitive Data | 200, 532, 798 | Data Exposure, Hardcoded Credentials, Logs |
| Weak Security | 327, 338 | Weak Crypto, Insecure Random |
| XSS | 79 | Reflected XSS, Stored XSS |
| CSRF | 352 | Cross-Site Request Forgery |
| Deserialization | 502 | Insecure Object Deserialization |
| File Upload | 434 | Unrestricted File Upload |

### SCA (Dependencies)

- **Critical** CVEs in Log4j, Apache Commons, Jackson
- **High** severity vulnerabilities in Django, Flask, Express
- **Medium** issues in cryptography, SQLAlchemy, Mongoose

## Tools Recommended for Testing

### SAST Tools

- **SonarQube** - Comprehensive, integrates with IDE
- **Checkmarx** - Enterprise-grade
- **Fortify** - Static analysis
- **Semgrep** - Pattern-based, lightweight
- **CodeQL** - GitHub's code analysis engine
- **Veracode** - Cloud-based scanning

### SCA Tools

- **OWASP Dependency-Check** - Free, open-source
- **Snyk** - Developer-focused
- **WhiteSource** - Commercial SCA
- **Black Duck** - License and vulnerability scanning
- **npm audit** / **pip-audit** - Built-in tools

## Project Structure

```
training-devsecops/
├── README.md                          # This file
├── VULNERABILITIES.md                 # Detailed vulnerability guide
├── pom.xml                            # Maven with vulnerable dependencies
├── requirements.txt                   # Python packages with CVEs
├── package.json                       # Node.js packages with vulnerabilities
└── src/
    └── main/
        ├── java/
        │   └── com/example/
        │       ├── VulnerableUserController.java
        │       └── User.java
        ├── python/
        │   └── vulnerable_app.py
        └── javascript/
            └── vulnerable-app.js
```

## Key Vulnerabilities by File

### Java
- **VulnerableUserController.java** - 7 different vulnerability types
- **User.java** - Sensitive data exposure

### Python
- **vulnerable_app.py** - 10 vulnerability types
- Covers web framework security issues
- Flask-specific vulnerabilities

### JavaScript
- **vulnerable-app.js** - 13 vulnerability types
- Express.js security issues
- Client-side and server-side vulnerabilities

## Running Scans

### Example: SonarQube in VS Code

1. Install SonarQube for IDE extension
2. Open command palette (Ctrl+Shift+P)
3. Run: "SonarQube: Show Security Hotspots"
4. Files will be analyzed and issues shown

### Example: OWASP Dependency-Check

```bash
# Scan the entire project
dependency-check --project "training-devsecops" --scan . --format HTML --out .

# Open the resulting report
start dependency-check-report.html
```

### Example: npm audit

```bash
npm install  # Install packages first
npm audit    # Run security audit
npm audit fix # Auto-fix some issues
```

## CWE Reference

This repository covers 14+ CWE categories:

- **CWE-22** - Path Traversal
- **CWE-78** - OS Command Injection
- **CWE-79** - Cross-site Scripting
- **CWE-89** - SQL Injection
- **CWE-95** - Code Injection
- **CWE-200** - Sensitive Data Exposure
- **CWE-327** - Weak Cryptography
- **CWE-338** - Insecure Random
- **CWE-352** - CSRF
- **CWE-434** - Unrestricted File Upload
- **CWE-502** - Insecure Deserialization
- **CWE-532** - Information Exposed in Logs
- **CWE-639** - Authorization Bypass (IDOR)
- **CWE-798** - Hardcoded Credentials

See [VULNERABILITIES.md](VULNERABILITIES.md) for detailed analysis.

## Learning Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE/SANS Top 25](https://cwe.mitre.org/top25/)
- [SonarQube Security Rules](https://rules.sonarsource.com/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [MITRE ATT&CK Framework](https://attack.mitre.org/)

## ⚠️ Important Disclaimer

**WARNING**: This repository contains **intentionally vulnerable code**. 

### DO NOT:
- ❌ Use this code in production
- ❌ Deploy to public or shared networks
- ❌ Use as reference for writing production code
- ❌ Run in environments with real data

### DO:
- ✅ Use for security training only
- ✅ Run in isolated environments
- ✅ Test security scanning tools
- ✅ Learn secure coding practices

## Getting Help

For questions about:
- **Vulnerabilities**: See VULNERABILITIES.md
- **Security scanning**: Consult tool documentation
- **Secure coding**: Visit OWASP.org

## License

This educational material is provided for training purposes.

---

**Last Updated**: January 2026
**Repository Type**: DevSecOps Training
**Security Level**: Intentionally Vulnerable - Training Use Only
