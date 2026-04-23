package com.trohd.backend;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

@Service
public class AiService {
    private final String khoaApi = "AIzaSyBaOTx0cCcqNcNQgXE9Z_Ji4zpbpVydY2JU";
    private final String duongDanGemini = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + khoaApi;

    public String extractCriteria(String tinNhanNguoiDung) {
        RestTemplate mayGoiApi = new RestTemplate();

        String cauLenhDinhHuong = "You are the advanced AI NLP engine for 'TroHD' rental platform. "
            + "Parse the user query into a STRICT JSON format.\n\n"
            + "--- SCHEMA DEFINITION ---\n"
            + "1. 'area': Street/Ward/District (e.g., 'Mo Lao', 'Van Quan').\n"
            + "2. 'school': University (e.g., 'PTIT', 'Architecture', 'Phenikaa').\n"
            + "3. 'minPrice' & 'maxPrice': Budget as raw integers. CRITICAL: If user says 'under 2 million', minPrice=0, maxPrice=2000000. If '3-4 triệu', min=3000000, max=4000000.\n"
            + "4. 'ac': true if air conditioning needed.\n"
            + "5. 'wc': true if private bathroom needed.\n"
            + "6. 'heater': true if water heater needed.\n"
            + "7. 'kit': true if cooking area needed.\n"
            + "8. 'park': true if free parking needed.\n"
            + "9. 'lock': true if smart lock needed.\n"
            + "10. 'wash': true if washing machine needed.\n"
            + "11. 'nohost': true if no live-in landlord needed.\n\n"
            + "ONLY RETURN A VALID JSON OBJECT. NO MARKDOWN. NO EXPLANATIONS.";

        JsonObject phanText = new JsonObject();
        phanText.addProperty("text", cauLenhDinhHuong + "\n\nUser Query: " + tinNhanNguoiDung);
        
        JsonArray mangThanhPhan = new JsonArray(); 
        mangThanhPhan.add(phanText);
        
        JsonObject doiTuongNoiDung = new JsonObject(); 
        doiTuongNoiDung.add("parts", mangThanhPhan);
        
        JsonArray mangNoiDung = new JsonArray(); 
        mangNoiDung.add(doiTuongNoiDung);
        
        JsonObject yeuCauGoc = new JsonObject(); 
        yeuCauGoc.add("contents", mangNoiDung);

        JsonObject cauHinhTao = new JsonObject();
        cauHinhTao.addProperty("responseMimeType", "application/json");
        yeuCauGoc.add("generationConfig", cauHinhTao);

        HttpHeaders tieuDe = new HttpHeaders();
        tieuDe.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> thucThe = new HttpEntity<>(yeuCauGoc.toString(), tieuDe);

        try {
            ResponseEntity<String> phanHoi = mayGoiApi.postForEntity(duongDanGemini, thucThe, String.class);
            JsonObject phanHoiGoc = JsonParser.parseString(phanHoi.getBody()).getAsJsonObject();
            return phanHoiGoc.getAsJsonArray("candidates").get(0).getAsJsonObject()
                    .getAsJsonObject("content").getAsJsonArray("parts").get(0).getAsJsonObject()
                    .get("text").getAsString().trim();
        } catch (Exception loi) { 
            return "{}"; 
        }
    }
}