package com.lexiscan.user;
import jakarta.persistence.*; import lombok.*; import java.time.*; import java.util.*;
@Entity @Table(name="users") @Getter @Setter @NoArgsConstructor public class User { @Id private UUID id=UUID.randomUUID(); @Column(nullable=false) private String name; @Column(nullable=false,unique=true) private String email; @Column(name="password_hash",nullable=false) private String passwordHash; @Enumerated(EnumType.STRING) private Role role=Role.USER; private boolean enabled=true; @Column(name="created_at",nullable=false) private Instant createdAt=Instant.now(); }
