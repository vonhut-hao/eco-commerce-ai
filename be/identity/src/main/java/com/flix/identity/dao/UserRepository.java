package com.flix.identity.dao;

import com.flix.identity.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    @Query("""
            SELECT u
            FROM User u where u.username = :username
            """)
    Optional<User> findByUsername(@Param("username") String username);

    @Query("""
                SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END
                FROM User u where u.username = :username
            """)
    boolean existsByUsername(@Param("username") String username);

    @Query("""
            SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END
            FROM User u WHERE u.email = :email
            """)
    boolean existsByEmail(@Param("email") String email);

    @Query("""
            SELECT u
            FROM User u where u.email = :email
            """)
    Optional<User> findByEmail(@Param("email") String email);

    @Query("""
            SELECT u
            FROM User u where u.username = :username OR u.email = :email
            """)
    Optional<User> findByUsernameOrEmail(@Param("username") String username, @Param("email") String email);

    @Query(value = """
            SELECT u.*
            FROM users u JOIN user_roles ur ON u.id = ur.user_id WHERE ur.roles = 'ADMIN' LIMIT 1
            """, nativeQuery = true)
    Optional<User> findFirstAdmin();

    @Query(value = """
            SELECT u FROM User u LEFT JOIN u.userProfile up
            WHERE (:query IS NULL OR :query = '' OR
                   LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%')) OR
                   LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')) OR
                   LOWER(up.fullName) LIKE LOWER(CONCAT('%', :query, '%')))
            """,
            countQuery = """
            SELECT COUNT(u) FROM User u LEFT JOIN u.userProfile up
            WHERE (:query IS NULL OR :query = '' OR
                   LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%')) OR
                   LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')) OR
                   LOWER(up.fullName) LIKE LOWER(CONCAT('%', :query, '%')))
            """)
    org.springframework.data.domain.Page<User> searchUsers(@Param("query") String query, org.springframework.data.domain.Pageable pageable);

    long countByIsEnabledTrue();
}