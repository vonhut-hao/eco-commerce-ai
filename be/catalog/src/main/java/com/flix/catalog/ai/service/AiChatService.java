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
            return new AiChatResponse("Sorry, AI features are currently not configured (Missing API Key).");
        }

        String prompt = buildPrompt(request);
        String url = "https://generativelanguage.googleapis.com/v1beta/interactions";

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-goog-api-key", geminiApiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("model", "gemini-3.6-flash");
            body.put("input", prompt);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            JsonNode root = objectMapper.readTree(response.getBody());
            String replyText = "";
            try {
                for (JsonNode step : root.path("steps")) {
                    if ("model_output".equals(step.path("type").asText())) {
                        for (JsonNode content : step.path("content")) {
                            if ("text".equals(content.path("type").asText())) {
                                replyText = content.path("text").asText();
                                break;
                            }
                        }
                    }
                    if (!replyText.isEmpty()) break;
                }
                if (replyText.isEmpty()) {
                    return new AiChatResponse("Parse error (no text found). Raw JSON: " + response.getBody());
                }
                return new AiChatResponse(replyText);
            } catch (Exception e) {
                return new AiChatResponse("Parse error. Raw JSON: " + response.getBody());
            }

        } catch (Exception e) {
            log.error("Failed to call Gemini API", e);
            String errorMsg = e.getMessage();
            if (e instanceof org.springframework.web.client.HttpStatusCodeException httpEx) {
                errorMsg = httpEx.getResponseBodyAsString();
            }
            return new AiChatResponse("Gemini API Error: " + errorMsg);
        }
    }

    private String buildPrompt(AiChatRequest request) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are an environmental consultant (Carbon Advisor) for the GreenLife Eco-Commerce platform. ");
        prompt.append("Your mission is to provide concise, easy-to-understand, and friendly explanations regarding the environmental impact metrics of products to customers.\n\n");

        prompt.append("Below is a quick reference catalog of products in the GreenLife system (Use this to answer if the customer compares or asks about other products):\n");
        try {
            var products = productService.listProducts(org.springframework.data.domain.PageRequest.of(0, 50)).getContent();
            for (var p : products) {
                prompt.append(String.format("- %s: %s kg CO2, %s green points, Rank: %s\n", p.name(), p.carbonIndex(), p.greenPoints(), p.ecoFriendliness()));
            }
            prompt.append("\n");
        } catch (Exception e) {
            log.warn("Could not fetch product list for AI prompt", e);
        }

        if (request.getProductId() != null) {
            try {
                var productResponse = productService.getProductDetail(request.getProductId());
                prompt.append("The customer is currently viewing the details of the product: '").append(productResponse.name()).append("'.\n");
                prompt.append("Full environmental information for this product:\n");
                prompt.append("- Carbon Index (CO2 emissions): ").append(productResponse.carbonIndex()).append(" kg CO2/unit.\n");
                prompt.append("- Eco-friendliness rating: ").append(productResponse.ecoFriendliness()).append(".\n");
                prompt.append("- Green points earned upon purchase: ").append(productResponse.greenPoints()).append(" points.\n");
                if (productResponse.materials() != null && !productResponse.materials().isEmpty()) {
                    prompt.append("- Materials: ");
                    productResponse.materials().forEach(m -> prompt.append(m.name()).append(", "));
                    prompt.append("\n");
                }
                if (productResponse.greenCertificates() != null && !productResponse.greenCertificates().isEmpty()) {
                    prompt.append("- Green Certificates: ");
                    productResponse.greenCertificates().forEach(c -> prompt.append(c.name()).append(", "));
                    prompt.append("\n");
                }
            } catch (Exception e) {
                log.warn("Could not fetch product for AI prompt, id: {}", request.getProductId(), e);
            }
        }

        prompt.append("\nCustomer's question: \"").append(request.getMessage()).append("\"\n\n");
        prompt.append("Response requirements:\n");
        prompt.append("- Answer the question directly.\n");
        prompt.append("- Clearly advise on the meaning of the CO2 number (is it high or low, what is the impact).\n");
        prompt.append("- Based on the system catalog, make comparisons if necessary.\n");
        prompt.append("- Do not use overly complex formatting; maintain a friendly and natural tone.\n");
        prompt.append("- IMPORTANT RULE: Please communicate with the user in English, but if they speak to you in another language, you may gracefully respond in their language to assist them.\n");

        return prompt.toString();
    }
}
