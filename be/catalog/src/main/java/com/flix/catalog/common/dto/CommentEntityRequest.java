package com.flix.catalog.common.dto;

import com.flix.catalog.entity.CommentEntity;
import com.flix.catalog.entity.ProductEntity;
import com.flix.common.util.FileConvert;
import com.flix.identity.entity.User;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CommentEntityRequest(
        @NotBlank String content,
        @NotNull @Min(0) Integer rating,
        List<String> mediaUrls,
        @NotNull Long userId,
        @NotNull Long productId,
        Long parentId
) {
    public void toEntity(CommentEntity entity, User user, ProductEntity productEntity, CommentEntity parentComment) {
        entity.setContent(content);
        entity.setRating(rating);
        entity.setMediaUrls(FileConvert.serializeFile(mediaUrls));
        entity.setUserEntity(user);
        entity.setProductEntity(productEntity);
        entity.setParent(parentComment);
    }
}