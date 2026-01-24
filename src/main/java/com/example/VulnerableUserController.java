package com.example;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import org.springframework.web.bind.annotation.*;

/**
 * VULNERABLE CODE - DO NOT USE IN PRODUCTION
 * Sample vulnerable code for SAST testing
 */
@RestController
@RequestMapping("/api/users")
public class VulnerableUserController {

    private Connection dbConnection;

    /**
     * Vulnerability: SQL Injection (CWE-89)
     * User input is directly concatenated into SQL query
     */
    @GetMapping("/search")
    public String searchUser(@RequestParam String username) {
        try {
            String query = "SELECT * FROM users WHERE username = '" + username + "'";
            Statement stmt = dbConnection.createStatement();
            ResultSet rs = stmt.executeQuery(query);
            
            if (rs.next()) {
                return "User found: " + rs.getString("email");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "User not found";
    }

    /**
     * Vulnerability: Command Injection (CWE-78)
     * User input is passed directly to Runtime.exec()
     */
    @PostMapping("/execute")
    public String executeCommand(@RequestParam String cmd) {
        try {
            Process p = Runtime.getRuntime().exec(cmd);
            return "Command executed";
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "Error";
    }

    /**
     * Vulnerability: Path Traversal (CWE-22)
     * User input used directly in file path
     */
    @GetMapping("/file")
    public String readFile(@RequestParam String filename) {
        try {
            String basePath = "/uploads/";
            String filePath = basePath + filename;
            java.nio.file.Files.readAllLines(java.nio.file.Paths.get(filePath));
            return "File content retrieved";
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "Error reading file";
    }

    /**
     * Vulnerability: Hardcoded Credentials (CWE-798)
     */
    public void connectToDatabase() {
        String dbUrl = "jdbc:mysql://localhost:3306/mydb";
        String dbUser = "admin";
        String dbPassword = "SuperSecret123!"; // Hardcoded password
        
        try {
            Class.forName("com.mysql.jdbc.Driver");
            dbConnection = java.sql.DriverManager.getConnection(dbUrl, dbUser, dbPassword);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Vulnerability: Insecure Deserialization (CWE-502)
     */
    @PostMapping("/deserialize")
    public String deserializeObject(@RequestBody byte[] data) {
        try {
            java.io.ByteArrayInputStream bais = new java.io.ByteArrayInputStream(data);
            java.io.ObjectInputStream ois = new java.io.ObjectInputStream(bais);
            Object obj = ois.readObject(); // Insecure deserialization
            return "Object deserialized: " + obj.toString();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "Error";
    }

    /**
     * Vulnerability: Weak Cryptography (CWE-327)
     */
    public String encryptPassword(String password) {
        try {
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("MD5"); // Weak algorithm
            byte[] digest = md.digest(password.getBytes());
            return javax.xml.bind.DatatypeConverter.printHexBinary(digest);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Vulnerability: Sensitive Data Exposure (CWE-200)
     */
    @GetMapping("/user/{id}")
    public User getUserData(@PathVariable int id) {
        // Returns sensitive user data without authorization check
        User user = new User();
        user.setId(id);
        user.setEmail("user@example.com");
        user.setSocialSecurityNumber("123-45-6789"); // Sensitive data
        user.setCreditCardNumber("1234-5678-9012-3456"); // Sensitive data
        return user;
    }
}
