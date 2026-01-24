# Security Scanning Guide

This guide walks through running various SAST and SCA tools on the vulnerable code samples.

## Table of Contents

1. [SonarQube (SAST)](#sonarqube-sast)
2. [OWASP Dependency-Check (SCA)](#owasp-dependency-check-sca)
3. [Snyk (SCA/SAST)](#snyk-scasast)
4. [npm audit (SCA)](#npm-audit-sca)
5. [pip-audit (SCA)](#pip-audit-sca)
6. [Semgrep (SAST)](#semgrep-sast)
7. [Comparing Tools](#comparing-tool-results)

## SonarQube (SAST)

### Installation & Setup

#### Option 1: Using VS Code Extension

```bash
# Install the extension from VS Code Marketplace
# Search for: "SonarQube for IDE"
```

#### Option 2: Using Docker (Local Server)

```bash
# Start SonarQube server
docker run -d --name sonarqube -p 9000:9000 sonarqube:latest

# Access at http://localhost:9000
# Default credentials: admin/admin
```

### Running Analysis

#### Method 1: SonarQube for IDE (VS Code)

1. Install the **SonarQube for IDE** extension
2. Press `Ctrl+Shift+P` to open command palette
3. Run: **SonarQube: Show Security Hotspots**
4. Files will be analyzed and issues displayed

#### Method 2: SonarQube Scanner CLI

```bash
# Install sonar-scanner
npm install -g sonarqube-scanner

# Run scan
sonar-scanner \
  -Dsonar.projectKey=training-devsecops \
  -Dsonar.sources=src \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=admin \
  -Dsonar.password=admin
```

### Expected Findings

| Severity | Issues | File |
|----------|--------|------|
| Blocker | SQL Injection, Command Injection | VulnerableUserController.java |
| Critical | Hardcoded Password, Insecure Deserialization | VulnerableUserController.java |
| Major | Weak Cryptography, Path Traversal | All files |
| Minor | Code Smells, Documentation | All files |

## OWASP Dependency-Check (SCA)

### Installation

```bash
# On Windows (using Chocolatey)
choco install dependencycheck

# Using Docker
docker run --rm -e USER_CHECKS_HOME=/home/dependency-check/not-used \
  -v $(pwd):/src \
  owasp/dependency-check:latest \
  --project "training-devsecops" \
  --scan /src \
  --format HTML \
  --out /src
```

### Running Scan

```bash
# Basic scan
dependency-check --project "training-devsecops" --scan . --format HTML

# With detailed output
dependency-check --project "training-devsecops" \
  --scan . \
  --format HTML \
  --out ./dependency-check-reports \
  --verbose

# Scan only specific files
dependency-check --scan pom.xml --format HTML
dependency-check --scan requirements.txt --format HTML
dependency-check --scan package.json --format HTML
```

### Expected Findings

#### Java Dependencies (pom.xml)
- **Log4j 1.2.17** - CVE-2019-17571 (RCE)
- **Commons Collections 3.1** - CVE-2015-6420 (RCE via deserialization)
- **Jackson Databind 2.9.8** - Multiple CVEs
- **Struts 2.3.15** - CVE-2017-5638 (RCE)
- **MySQL Connector 5.1.38** - Multiple CVEs

#### Python Packages (requirements.txt)
- **Flask 1.1.0** - CVE-2020-25540
- **PyYAML 3.13** - CVE-2019-20477 (Unsafe deserialization)
- **Pillow 6.2.0** - CVE-2019-19911

#### Node.js Packages (package.json)
- **express 4.16.2** - Multiple middleware CVEs
- **mongoose 4.11.11** - NoSQL injection
- **passport 0.3.2** - Authentication bypass

## Snyk (SCA/SAST)

### Installation

```bash
# Install Snyk CLI
npm install -g snyk

# Authenticate
snyk auth

# Or use Docker
docker run --rm -v $(pwd):/app -w /app snyk/snyk:npm snyk test
```

### Running Tests

```bash
# Scan dependencies
snyk test

# Generate detailed report
snyk test --json > snyk-report.json

# Scan specific file
snyk test --file=pom.xml
snyk test --file=requirements.txt
snyk test --file=package.json

# Fix vulnerabilities (interactive)
snyk fix

# Monitor for continuous scanning
snyk monitor
```

### Expected Findings

- High severity vulnerabilities in all three dependency files
- Detailed remediation guidance
- Alternative package recommendations

## npm audit (SCA)

### Using npm audit

```bash
# Install dependencies first
npm install

# Run audit
npm audit

# Detailed JSON output
npm audit --json > audit-report.json

# Fix automatically
npm audit fix

# Fix including breaking changes
npm audit fix --force
```

### Expected Output

```
found X vulnerabilities (Y critical, Z high, ...)
```

## pip-audit (SCA)

### Installation & Usage

```bash
# Install pip-audit
pip install pip-audit

# Scan requirements.txt
pip-audit -r requirements.txt

# Generate JSON report
pip-audit -r requirements.txt --format json > audit-report.json

# Scan installed packages
pip-audit

# Scan with detailed output
pip-audit -r requirements.txt --desc
```

### Expected Findings

- Critical: Flask, PyYAML, Pillow vulnerabilities
- High: SQLAlchemy, cryptography issues
- Medium: Various utility package issues

## Semgrep (SAST)

### Installation

```bash
# Install via pip
pip install semgrep

# Or using Docker
docker run --rm -v $(pwd):/src semgrep/semgrep semgrep --config=auto /src
```

### Running Scans

```bash
# Auto-detect rules
semgrep --config=auto .

# Using specific rules
semgrep --config=p/owasp-top-ten .
semgrep --config=p/security-audit .

# Scan specific language
semgrep --config=p/python src/main/python/
semgrep --config=p/java src/main/java/
semgrep --config=p/javascript src/main/javascript/

# JSON output
semgrep --config=auto . --json > semgrep-report.json
```

### Expected Findings

- XSS vulnerabilities
- SQL Injection patterns
- Command injection issues
- Hardcoded credentials

## Comparing Tool Results

### Create Comparison Matrix

```bash
# Generate reports from different tools
echo "Running SonarQube..."
sonar-scanner -Dsonar.projectKey=training-devsecops -Dsonar.sources=src

echo "Running OWASP Dependency-Check..."
dependency-check --project "training-devsecops" --scan . --format JSON --out dependency-check.json

echo "Running Snyk..."
snyk test --json > snyk-report.json

echo "Running Semgrep..."
semgrep --config=auto . --json > semgrep-report.json

echo "Running npm audit..."
npm audit --json > npm-audit.json

echo "Running pip-audit..."
pip-audit -r requirements.txt --format json > pip-audit.json
```

### Vulnerability Mapping

| Vulnerability | SonarQube | Dependency-Check | Snyk | Semgrep | Tool Coverage |
|----------------|-----------|------------------|------|---------|---|
| SQL Injection | ✅ | ❌ | ⚠️ | ✅ | 75% |
| Command Injection | ✅ | ❌ | ⚠️ | ✅ | 75% |
| Hardcoded Credentials | ✅ | ❌ | ✅ | ✅ | 100% |
| Weak Crypto | ✅ | ✅ | ✅ | ✅ | 100% |
| Vulnerable Dependencies | ❌ | ✅ | ✅ | ❌ | 100% |

Legend: ✅ Full coverage, ⚠️ Partial coverage, ❌ No coverage

## Best Practices

### 1. Use Multiple Tools

No single tool catches everything. Use complementary tools:
- **SAST**: SonarQube + Semgrep
- **SCA**: Snyk + OWASP Dependency-Check
- **Built-in**: npm audit, pip-audit

### 2. Baseline Metrics

Document findings for comparison:

```bash
# Create baseline
mkdir baseline-$(date +%Y%m%d)

# Save reports
sonar-scanner ... # Save sonarqube report
dependency-check ... # Save dependency-check report
snyk test --json > baseline-$(date +%Y%m%d)/snyk.json

# Compare over time
diff baseline-*/snyk.json
```

### 3. Automate Scanning

```bash
# Create scan script
cat > scan.sh << 'EOF'
#!/bin/bash
echo "Running security scans..."
sonar-scanner -Dsonar.projectKey=training-devsecops -Dsonar.sources=src
dependency-check --project "training-devsecops" --scan . --format HTML
snyk test
semgrep --config=auto . --json
echo "Scans complete!"
EOF

chmod +x scan.sh
./scan.sh
```

### 4. CI/CD Integration

#### GitHub Actions

```yaml
name: Security Scanning

on: [push, pull_request]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Run Semgrep
        run: |
          pip install semgrep
          semgrep --config=auto . --json
      
      - name: Run Snyk
        run: |
          npm install -g snyk
          snyk test
      
      - name: Run Dependency-Check
        run: |
          docker run --rm -v $(pwd):/src owasp/dependency-check:latest \
            --project "training-devsecops" \
            --scan /src \
            --format JSON
```

## Troubleshooting

### Issue: SonarQube server not responding

```bash
# Check if server is running
curl http://localhost:9000

# Restart server
docker restart sonarqube
```

### Issue: npm audit returns modules not found

```bash
# Clear cache and reinstall
npm cache clean --force
npm install
npm audit
```

### Issue: pip-audit permission denied

```bash
# Use sudo or install in virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate      # Windows
pip install pip-audit
pip-audit
```

## Additional Resources

- [SonarQube Documentation](https://docs.sonarqube.org/)
- [OWASP Dependency-Check](https://owasp.org/www-project-dependency-check/)
- [Snyk Documentation](https://docs.snyk.io/)
- [Semgrep Rules](https://semgrep.dev/explore)
- [npm audit Documentation](https://docs.npmjs.com/cli/audit)

---

**Happy Scanning!** 🔒
