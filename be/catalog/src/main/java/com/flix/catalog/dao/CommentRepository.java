package com.flix.catalog.dao;

import com.flix.catalog.entity.CommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<CommentEntity, Long> {
    List<CommentEntity> findByProductEntityId(Long productId);

    List<CommentEntity> findByProductEntityIdAndParentIsNull(Long productId);
}
