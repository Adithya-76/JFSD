package com.lexiscan.analysis;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lexiscan.common.ApiException;
import com.lexiscan.document.*;
import com.lexiscan.extraction.*;
import com.lexiscan.nlp.*;
import com.lexiscan.user.User;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.*;

import java.nio.file.*;
import java.time.*;
import java.util.*;

@Service
public class AnalysisService {
    final DocumentRepository docs;
    final AnalysisResultRepository results;
    final ClauseRepository clauses;
    final PdfTextExtractor pdf;
    final DocxTextExtractor docx;
    final NlpAnalysisService nlp;
    final ObjectMapper json;

    public AnalysisService(DocumentRepository d, AnalysisResultRepository r, ClauseRepository c,
                           PdfTextExtractor p, DocxTextExtractor x, NlpAnalysisService n, ObjectMapper j) {
        docs = d;
        results = r;
        clauses = c;
        pdf = p;
        docx = x;
        nlp = n;
        json = j;
    }

    public void trigger(UUID id, User u) {
        var d = docs.findById(id).filter(x -> x.getUser().getId().equals(u.getId()))
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Document not found"));
        d.setStatus(DocumentStatus.PROCESSING);
        docs.save(d);
        run(id);
    }

    @Async("analysisExecutor")
    @Transactional
    public void run(UUID id) {
        var d = docs.findById(id).orElseThrow();
        try {
            String text = d.getFileType().equals("PDF") ? pdf.extract(Paths.get(d.getStoredPath())) : docx.extract(Paths.get(d.getStoredPath()));
            var out = nlp.analyze(text);
            results.findByDocumentId(id).ifPresent(results::delete);
            clauses.deleteByDocumentId(id);
            var r = new AnalysisResult();
            r.setDocument(d);
            r.setSummary(out.summary());
            r.setOverallRiskScore(out.overallRiskScore());
            r.setOverallRiskLevel(out.overallRiskLevel());
            r.setKeyEntities(json.writeValueAsString(out.entities()));
            r.setClauseCount(out.clauses().size());
            r.setHighRiskCount((int) out.clauses().stream().filter(c -> c.riskLevel().equals("HIGH")).count());
            r.setMediumRiskCount((int) out.clauses().stream().filter(c -> c.riskLevel().equals("MEDIUM")).count());
            results.save(r);
            for (var o : out.clauses()) {
                var c = new Clause();
                c.setDocument(d);
                c.setClauseIndex(o.index());
                c.setClauseText(o.text());
                c.setCategory(o.category());
                c.setRiskLevel(o.riskLevel());
                c.setRiskScore(o.riskScore());
                c.setRiskReason(o.riskReason());
                clauses.save(c);
            }
            d.setStatus(DocumentStatus.ANALYZED);
            d.setAnalyzedAt(Instant.now());
            docs.save(d);
        } catch (Exception e) {
            d.setStatus(DocumentStatus.FAILED);
            d.setFailureReason("Analysis could not be completed: " + e.getMessage());
            docs.save(d);
        }
    }

    public AnalysisResult result(Document d) {
        return results.findByDocumentId(d.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Analysis not available"));
    }

    public List<Clause> clauses(Document d) {
        return clauses.findByDocumentIdOrderByClauseIndex(d.getId());
    }
}
