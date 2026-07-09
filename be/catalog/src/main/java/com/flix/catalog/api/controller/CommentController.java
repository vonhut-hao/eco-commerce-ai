package com.flix.catalog.api.controller;

import com.flix.catalog.comment.service.CommentService;
import com.flix.catalog.common.dto.CommentEntityRequest;
import com.flix.catalog.common.dto.CommentEntityResponse;
import com.flix.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/catalog/comments")
public class CommentController {
    private final CommentService commentService;

    @PostMapping(value = {"", "/{id}"})
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<CommentEntityResponse> createOrUpdateComment(
            @PathVariable(value = "id", required = false) Long id,
            @Valid @RequestBody CommentEntityRequest request) {
        return ApiResponse.success(commentService.createOrUpdateComment(id, request));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ApiResponse<List<CommentEntityResponse>> listComments() {
        return ApiResponse.success(commentService.listComments());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("isAuthenticated()")
    public void deleteComment(@PathVariable("id") Long id) {
        commentService.deleteComment(id);
    }
}
