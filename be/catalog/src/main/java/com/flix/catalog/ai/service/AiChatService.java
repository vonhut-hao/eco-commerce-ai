package com.flix.catalog.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.flix.catalog.common.dto.AiChatRequest;
import com.flix.catalog.common.dto.AiChatResponse;
import com.flix.catalog.entity.ProductEntity;
import com.flix.catalog.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiChatService {

    private final ProductService productService;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api-key:}")
    private String geminiApiKey;

    public AiChatResponse getChatResponse(AiChatRequest request) {
        if (geminiApiKey == null || geminiApiKey.isEmpty()) {
            log.warn("Gemini API key is not configured.");
            return new AiChatResponse("Xin lỗi, tính năng AI hiện tại chưa được cấu hình (Thiếu API Key).");
        }

        String prompt = buildPrompt(request);
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey;

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> textPart = new HashMap<>();
            textPart.put("text", prompt);

            Map<String, Object> partMap = new HashMap<>();
            partMap.put("parts", List.of(textPart));

            Map<String, Object> body = new HashMap<>();
            body.put("contents", List.of(partMap));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            JsonNode root = objectMapper.readTree(response.getBody());
            String replyText = root.path("candidates").get(0)
                                   .path("content")
                                   .path("parts").get(0)
                                   .path("text").asText();

            return new AiChatResponse(replyText);

        } catch (Exception e) {
            log.error("Failed to call Gemini API", e);
            return new AiChatResponse("Xin lỗi, hệ thống AI đang quá tải hoặc gặp sự cố. Vui lòng thử lại sau.");
        }
    }

    private String buildPrompt(AiChatRequest request) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Bạn là chuyên gia tư vấn môi trường (Carbon Advisor) của hệ thống thương mại điện tử GreenLife Eco-Commerce. ");
        prompt.append("Nhiệm vụ của bạn là giải đáp ngắn gọn, dễ hiểu và thân thiện về các chỉ số tác động môi trường của sản phẩm cho khách hàng.\n\n");

        if (request.getProductId() != null) {
            try {
                var productResponse = productService.getProductDetail(request.getProductId());
                prompt.append("Khách hàng đang hỏi về sản phẩm: '").append(productResponse.name()).append("'.\n");
                prompt.append("Thông tin môi trường của sản phẩm này:\n");
                prompt.append("- Chỉ số Carbon (Lượng CO2 phát thải): ").append(productResponse.carbonIndex()).append(" kg CO2/đơn vị.\n");
                prompt.append("- Xếp hạng thân thiện (Eco-friendliness): ").append(productResponse.ecoFriendliness()).append(".\n");
                prompt.append("- Điểm xanh tích luỹ khi mua (Green points): ").append(productResponse.greenPoints()).append(" điểm.\n");
                if (productResponse.materials() != null && !productResponse.materials().isEmpty()) {
                    prompt.append("- Vật liệu: ");
                    productResponse.materials().forEach(m -> prompt.append(m.name()).append(", "));
                    prompt.append("\n");
                }
                if (productResponse.greenCertificates() != null && !productResponse.greenCertificates().isEmpty()) {
                    prompt.append("- Chứng chỉ xanh: ");
                    productResponse.greenCertificates().forEach(c -> prompt.append(c.name()).append(", "));
                    prompt.append("\n");
                }
            } catch (Exception e) {
                log.warn("Could not fetch product for AI prompt, id: {}", request.getProductId(), e);
            }
        }

        prompt.append("\nCâu hỏi của khách hàng: \"").append(request.getMessage()).append("\"\n\n");
        prompt.append("Yêu cầu trả lời:\n");
        prompt.append("- Trả lời trực tiếp vào câu hỏi.\n");
        prompt.append("- Tư vấn rõ ý nghĩa của con số CO2 (cao hay thấp, tác động thế nào).\n");
        prompt.append("- Không dùng định dạng quá phức tạp, giữ tông giọng thân thiện, tự nhiên.");

        return prompt.toString();
    }
}
