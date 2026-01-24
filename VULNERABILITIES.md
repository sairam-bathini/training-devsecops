# Vulnerable Code Samples - SAST & SCA Testing

This workspace contains intentionally vulnerable code samples for security scanning and testing purposes. **DO NOT use this code in production.**

## Overview

This repository includes vulnerable source code in multiple languages to test:
- **SAST (Static Application Security Testing)** tools
- **SCA (Software Composition Analysis)** tools

## Project Structure

```
├── src/
│   ├── main/
│   │   ├── java/com/example/
│   │   │   ├── VulnerableUserController.java
│   │   │   └── User.java
│   │   ├── python/
│   │   │   └── vulnerable_app.py
│   │   └── javascript/
│   │       └── vulnerable-app.js
├── pom.xml (Maven with vulnerable dependencies)
├── requirements.txt (Python with vulnerable packages)
└── package.json (Node.js with vulnerable packages)
```

## Vulnerabilities Included

### Java Code (`src/main/java/com/example/`)

#### VulnerableUserController.java
1. **SQL Injection (CWE-89)** - Line 27: Direct string concatenation in SQL queries
2. **Command Injection (CWE-78)** - Line 37: Runtime.exec() with user input
3. **Path Traversal (CWE-22)** - Line 47: File path construction without validation
4. **Hardcoded Credentials (CWE-798)** - Line 57: Database credentials hardcoded
5. **Insecure Deserialization (CWE-502)** - Line 70: ObjectInputStream.readObject()
6. **Weak Cryptography (CWE-327)** - Line 81: MD5 for password hashing
7. **Sensitive Data Exposure (CWE-200)** - Line 94: Returning SSN and credit card data

#### User.java
- Sensitive data properties exposed without proper access controls

### Python Code (`src/main/python/vulnerable_app.py`)

1. **SQL Injection (CWE-89)** - Line 31: f-string with unsanitized input
2. **Command Injection (CWE-78)** - Line 43: os.system() with user input
3. **Path Traversal (CWE-22)** - Line 54: os.path.join() without validation
4. **Insecure Deserialization (CWE-502)** - Line 67: pickle.loads() with untrusted data
5. **Weak Cryptography (CWE-327)** - Line 80: hashlib.md5() without salt
6. **Sensitive Data Exposure (CWE-200)** - Line 97: Exposing sensitive user data
7. **Unrestricted File Upload (CWE-434)** - Line 113: No file type validation
8. **Code Injection (CWE-95)** - Line 132: eval() with user input
9. **Hardcoded Credentials (CWE-798)** - Lines 16-20: API keys and passwords
10. **Debug Mode Enabled** - Line 163: Flask running in debug mode

### JavaScript/Node.js Code (`src/main/javascript/vulnerable-app.js`)

1. **SQL Injection (CWE-89)** - Line 37: Template literal with user input
2. **Cross-Site Scripting (XSS) (CWE-79)** - Line 49: Direct HTML output of user input
3. **Command Injection (CWE-78)** - Line 61: child_process.exec() with user input
4. **Path Traversal (CWE-22)** - Line 73: path.join() without validation
5. **Insecure Deserialization (CWE-502)** - Line 86: eval() for deserialization
6. **Sensitive Data in Logs (CWE-532)** - Line 103: Logging passwords
7. **Sensitive Data Exposure (CWE-200)** - Line 122: Exposing sensitive data
8. **Unrestricted File Upload (CWE-434)** - Line 137: No file type validation
9. **Weak Cryptography (CWE-327)** - Line 157: MD5 for hashing
10. **Insecure Random (CWE-338)** - Line 163: Math.random() for tokens
11. **Cross-Site Request Forgery (CWE-352)** - Line 173: No CSRF protection
12. **Hardcoded Credentials (CWE-798)** - Lines 16-22: API keys and secrets
13. **Insecure Direct Object Reference (CWE-639)** - Line 191: No authorization checks

## Vulnerable Dependencies

### Maven (pom.xml)

Known vulnerable packages:
- **Log4j 1.2.17** - Multiple CVEs including Log4Shell precursors
- **Apache Commons Collections 3.1** - Remote code execution via deserialization
- **Jackson Databind 2.9.8** - Multiple CVEs
- **Apache Struts 2.3.15** - RCE vulnerabilities
- **MySQL Connector 5.1.38** - Multiple vulnerabilities
- **Xstream 1.4.0** - XXE (XML External Entity) vulnerability

### Python (requirements.txt)

Known vulnerable packages:
- **Flask 1.1.0** - CVE-2020-25540 and others
- **PyYAML 3.13** - Unsafe YAML deserialization
- **Pillow 6.2.0** - Multiple CVEs
- **SQLAlchemy 1.2.19** - SQL injection vulnerabilities
- **Django 2.2.0** - Multiple CVEs

### Node.js (package.json)

Known vulnerable packages:
- **express 4.16.2** - Middleware vulnerabilities
- **sqlite3 3.1.8** - Multiple vulnerabilities
- **passport 0.3.2** - Authentication bypass
- **mongoose 4.11.11** - NoSQL injection vulnerabilities
- **request 2.81.0** - SSRF vulnerabilities

## Testing with SonarQube

### Setup SonarQube for IDE

To analyze these files with SonarQube:

```bash
# For SonarQube Server
sonarqube-setup-connected-mode --server-url=https://your-sonarqube-server --project-key=your-project-key

# For SonarQube Cloud
sonarqube-setup-connected-mode --organization=your-org --project-key=your-project-key
```

### Running Analysis

In VS Code:
1. Use the SonarQube for IDE extension (Search for security issues in the Problems view)
2. Run SAST analysis on individual files
3. Review detected security hotspots and vulnerabilities

## SAST Tools to Test

- **SonarQube** - Comprehensive SAST analysis
- **Checkmarx** - Application security testing
- **Fortify** - Static security analysis
- **Veracode** - Cloud-based security scanning
- **Semgrep** - Lightweight pattern-based scanning
- **FindBugs/SpotBugs** - Bug finding for Java

## SCA Tools to Test

- **OWASP Dependency-Check** - Dependency vulnerability scanner
- **Snyk** - Dependency and container scanning
- **WhiteSource (Mend)** - Software composition analysis
- **Black Duck** - Open source license and vulnerability scanner
- **Artifactory** - Repository with security scanning
- **npm audit** - Built-in Node.js dependency checker
- **pip-audit** - Python vulnerability scanner

## How to Use

1. **For SAST Testing**: Run your SAST tool against the source code files
2. **For SCA Testing**: Run your SCA tool against the dependency files (pom.xml, requirements.txt, package.json)
3. **Compare Results**: Use this as a baseline to compare different scanning tools

## CWE Coverage

This repository includes samples for these CWE (Common Weakness Enumeration) categories:

| CWE | Title | Location |
|-----|-------|----------|
| CWE-22 | Path Traversal | Java, Python, JavaScript |
| CWE-78 | OS Command Injection | Java, Python, JavaScript |
| CWE-89 | SQL Injection | Java, Python, JavaScript |
| CWE-95 | Code Injection | Python |
| CWE-200 | Sensitive Data Exposure | Java, Python, JavaScript |
| CWE-327 | Weak Cryptography | Java, Python, JavaScript |
| CWE-338 | Insecure Random | JavaScript |
| CWE-352 | CSRF | JavaScript |
| CWE-434 | Unrestricted File Upload | Python, JavaScript |
| CWE-502 | Insecure Deserialization | Java, Python, JavaScript |
| CWE-532 | Sensitive Data in Logs | JavaScript |
| CWE-639 | IDOR | JavaScript |
| CWE-798 | Hardcoded Credentials | Java, Python, JavaScript |
| CWE-79 | XSS | JavaScript |

## Disclaimer

⚠️ **WARNING**: These are intentionally vulnerable code samples. They are designed ONLY for security testing and educational purposes. DO NOT:
- Use this code in production environments
- Deploy these applications to public networks
- Use as reference for writing production code
- Ignore the security vulnerabilities demonstrated here

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE/SANS Top 25](https://cwe.mitre.org/top25/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [SonarQube Security Rules](https://rules.sonarsource.com/)
