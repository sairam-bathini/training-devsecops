package com.example;

/**
 * VULNERABLE CODE - DO NOT USE IN PRODUCTION
 * Sample user class with data exposure vulnerabilities
 */
public class User {
    private int id;
    private String email;
    private String socialSecurityNumber;
    private String creditCardNumber;
    private String password;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSocialSecurityNumber() {
        return socialSecurityNumber;
    }

    public void setSocialSecurityNumber(String ssn) {
        this.socialSecurityNumber = ssn;
    }

    public String getCreditCardNumber() {
        return creditCardNumber;
    }

    public void setCreditCardNumber(String ccn) {
        this.creditCardNumber = ccn;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
