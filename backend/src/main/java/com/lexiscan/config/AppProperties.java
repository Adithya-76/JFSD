package com.lexiscan.config;
import org.springframework.boot.context.properties.ConfigurationProperties;
@ConfigurationProperties(prefix="app") public record AppProperties(String storageDir, Jwt jwt, Nlp nlp, Cors cors, Admin admin) { public record Jwt(String secret,long expirationMinutes){} public record Nlp(String mode,String remoteUrl){} public record Cors(String allowedOrigins){} public record Admin(String email,String password){} }
