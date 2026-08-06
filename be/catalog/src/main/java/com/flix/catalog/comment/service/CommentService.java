package com.flix.catalog.comment.service;

import com.flix.catalog.common.dto.CommentEntityRequest;
import com.flix.catalog.common.dto.CommentEntityResponse;
import com.flix.catalog.dao.CommentRepository;
import com.flix.catalog.dao.ProductRepository;
import com.flix.catalog.entity.CommentEntity;
import com.flix.common.enums.ErrorCode;
import com.flix.common.exception.BusinessException;
import com.flix.identity.dao.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.flix.common.util.FileConvert.serializeFile;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentService {
    private final CommentRepository commentRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CommentEntityResponse createOrUpdateComment(Long id, CommentEntityRequest request) {
        var userEntity = userRepository.findById(request.userId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        var productEntity = productRepository.findById(request.productId())
                .orElseThrow(() -> new BusinessException(ErrorCode.PRODUCT_NOT_FOUND));

        CommentEntity parent = null;
        if (request.parentId() != null) {
            parent = commentRepository.findById(request.parentId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.PARENT_COMMENT_NOT_FOUND));
        }

        CommentEntity commentEntity;
        if (id != null) {
            commentEntity = commentRepository.findById(id)
                    .orElseThrow(() -> new BusinessException(ErrorCode.COMMENT_NOT_FOUND));
            log.info("Updated comment with ID: {}", id);
        } else {
            commentEntity = new CommentEntity();
            log.info("Created comment for product ID: {}", request.productId());
        }

        request.toEntity(commentEntity, userEntity, productEntity, parent);

        var savedComment = commentRepository.save(commentEntity);
        return CommentEntityResponse.from(savedComment);
    }

    public List<CommentEntityResponse> listComments() {
        log.info("List all comments");
        var commentEntities = commentRepository.findAll();
        return commentEntities.stream()
                .map(CommentEntityResponse::from)
                .toList();
    }

    public void deleteComment(Long id) {
        if (id == null) {
            throw new BusinessException(ErrorCode.COMMENT_NOT_FOUND);
        }

        var commentEntity = commentRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.COMMENT_NOT_FOUND));
        commentRepository.delete(commentEntity);
        log.info("Deleted comment with ID: {}", commentEntity.getId());
    }

    public void changeStatus(Long id, String status) {
        if (id == null || status == null) {
            throw new IllegalArgumentException("Invalid parameter");
        }
        var commentEntity = commentRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.COMMENT_NOT_FOUND));
        commentEntity.setStatus(status);
        commentRepository.save(commentEntity);
        log.info("Updated status for comment ID: {} to {}", id, status);
    }
}
