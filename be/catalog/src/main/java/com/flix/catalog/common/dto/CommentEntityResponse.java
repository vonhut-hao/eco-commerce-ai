package com.flix.catalog.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.flix.catalog.entity.CommentEntity;

import java.util.List;

import static com.flix.common.util.FileConvert.deserializeFile;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record CommentEntityResponse(
        Long id,
        String content,
        Integer rating,
        List<String> mediaUrls,
        Long userId,
        Long productId,
        Long parentId,
        String userName
) {
    public static CommentEntityResponse from(CommentEntity entity) {
        if (entity == null) {
            return null;
        }

        Long userId = null;
        String userName = null;
        if (entity.getUserEntity() != null) {
            userId = entity.getUserEntity().getId();
            userName = entity.getUserEntity().getUsername();
        }

        Long productId = null;
        if (entity.getProductEntity() != null) {
            productId = entity.getProductEntity().getId();
        }

        Long parentId = null;
        if (entity.getParent() != null) {
            parentId = entity.getParent().getId();
        }

        return new CommentEntityResponse(
                entity.getId(),
                entity.getContent(),
                entity.getRating(),
                deserializeFile(entity.getMediaUrls()),
                userId,
                productId,
                parentId,
                userName
        );
    }
}
