import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "LexiScan — AI-Powered Legal Document Analyzer | Technical Project Documentation")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(54, 742, 612 - 54, 742)
            
        # Footer
        footer_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(612 - 54, 36, footer_text)
        self.drawString(54, 36, "CONFIDENTIAL & PROPRIETARY — Java Full Stack Development (JFSD) 5th Sem")
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(54, 48, 612 - 54, 48)
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    c_primary = colors.HexColor("#0284c7")
    c_dark = colors.HexColor("#0f233a")
    c_slate = colors.HexColor("#334155")
    c_border = colors.HexColor("#dbe4ee")
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=c_dark,
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=c_primary,
        spaceAfter=15
    )
    
    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=18,
        textColor=c_dark,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=c_primary,
        spaceBefore=10,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=c_slate,
        spaceAfter=8
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=c_slate
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=table_cell_style,
        fontName='Helvetica-Bold',
        textColor=c_dark
    )

    code_style = ParagraphStyle(
        'CodeStyle',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#1e293b")
    )

    story = []

    # Title & Metadata Card
    story.append(Paragraph("LexiScan — AI Legal Document Analyzer", title_style))
    story.append(Paragraph("Full-Stack Enterprise Architecture & Technical Specification Document", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=c_primary, spaceBefore=0, spaceAfter=14))

    meta_data = [
        [Paragraph("<b>Project Title:</b>", body_style), Paragraph("LexiScan (Legal Document Intelligence)", body_style),
         Paragraph("<b>Curriculum / Sem:</b>", body_style), Paragraph("JFSD — 5th Semester Capstone", body_style)],
        [Paragraph("<b>Author / Dev:</b>", body_style), Paragraph("Full Stack Engineering Team", body_style),
         Paragraph("<b>Architecture:</b>", body_style), Paragraph("Multi-Tier Containerized Micro-Services", body_style)],
        [Paragraph("<b>Deployment:</b>", body_style), Paragraph("Docker Compose (Multi-Container)", body_style),
         Paragraph("<b>Documentation Date:</b>", body_style), Paragraph("October 2026 | Version 1.0", body_style)]
    ]
    meta_table = Table(meta_data, colWidths=[100, 160, 100, 144])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 14))

    # 1. Executive Summary
    story.append(Paragraph("1. Executive Summary & Purpose", h1_style))
    story.append(Paragraph(
        "<b>LexiScan</b> is an intelligent, full-stack legal technology application designed to analyze complex contracts "
        "(such as rental leases, non-disclosure agreements, master services agreements, and employment contracts) in PDF and "
        "Microsoft Word (DOCX) formats. It parses unstructured legal prose, normalizes text, segments numbered and headed "
        "clauses, identifies named legal entities (parties, financial amounts, durations, deadlines, and governing jurisdictions), "
        "flags risky or one-sided obligations, and scores the contract on a standardized 0–100 risk scale. Additionally, it compiles "
        "and exports an official executive audit report in PDF format.",
        body_style
    ))
    story.append(Paragraph(
        "The system aims to democratize legal comprehension for individuals, tenants, freelancers, and small business owners, "
        "providing plain-language clarity before executing binding agreements while adhering to strict compliance disclaimers.",
        body_style
    ))
    story.append(Spacer(1, 10))

    # 2. Technology Stack Table
    story.append(Paragraph("2. Comprehensive Technology Stack", h1_style))
    tech_data = [
        [Paragraph("Layer / Tier", table_header_style), Paragraph("Technology", table_header_style), Paragraph("Version", table_header_style), Paragraph("Key Role & Responsibility", table_header_style)],
        [Paragraph("Frontend UI", table_cell_bold), Paragraph("React.js (SPA)", table_cell_style), Paragraph("18.3.1", table_cell_style), Paragraph("Declarative component UI, document upload, real-time polling", table_cell_style)],
        [Paragraph("Frontend Build", table_cell_bold), Paragraph("Vite", table_cell_style), Paragraph("8.3.5", table_cell_style), Paragraph("Ultra-fast ESM bundling, asset optimization, production build", table_cell_style)],
        [Paragraph("Frontend Styling", table_cell_bold), Paragraph("Modern CSS3 (Vars)", table_cell_style), Paragraph("Native", table_cell_style), Paragraph("Calm & Cold design system, dual Light/Dark mode themes", table_cell_style)],
        [Paragraph("HTTP Client", table_cell_bold), Paragraph("Axios", table_cell_style), Paragraph("1.7.7", table_cell_style), Paragraph("REST API client with JWT Authorization bearer interceptors", table_cell_style)],
        [Paragraph("Backend Framework", table_cell_bold), Paragraph("Spring Boot", table_cell_style), Paragraph("3.4.3", table_cell_style), Paragraph("Enterprise Java REST API, Spring MVC, Spring Data JPA", table_cell_style)],
        [Paragraph("Programming Runtime", table_cell_bold), Paragraph("Java SE / Temurin", table_cell_style), Paragraph("JDK 17 LTS", table_cell_style), Paragraph("Modern record classes, pattern matching, parallel streams", table_cell_style)],
        [Paragraph("Security & Auth", table_cell_bold), Paragraph("Spring Security + JJWT", table_cell_style), Paragraph("0.12.6", table_cell_style), Paragraph("BCrypt encryption, stateless JWT authentication, RBAC, CORS", table_cell_style)],
        [Paragraph("Database Engine", table_cell_bold), Paragraph("PostgreSQL", table_cell_style), Paragraph("16 Alpine", table_cell_style), Paragraph("Relational ACID storage for users, documents, clauses, rules", table_cell_style)],
        [Paragraph("DB Migrations", table_cell_bold), Paragraph("Flyway", table_cell_style), Paragraph("10.x", table_cell_style), Paragraph("Automated database versioning, schema creation & rule seeding", table_cell_style)],
        [Paragraph("PDF Parsing", table_cell_bold), Paragraph("Apache PDFBox", table_cell_style), Paragraph("3.0.4", table_cell_style), Paragraph("Text extraction, font parsing, document structure stripper", table_cell_style)],
        [Paragraph("DOCX Parsing", table_cell_bold), Paragraph("Apache POI (ooxml)", table_cell_style), Paragraph("5.4.0", table_cell_style), Paragraph("Word XML paragraph traversal and heading decomposition", table_cell_style)],
        [Paragraph("PDF Report Engine", table_cell_bold), Paragraph("OpenPDF", table_cell_style), Paragraph("2.0.3", table_cell_style), Paragraph("Dynamic generation of official audit reports with legal summary", table_cell_style)],
        [Paragraph("API Documentation", table_cell_bold), Paragraph("SpringDoc OpenAPI", table_cell_style), Paragraph("2.8.5", table_cell_style), Paragraph("Interactive Swagger UI at /swagger-ui.html for API testing", table_cell_style)],
        [Paragraph("Web Server / Proxy", table_cell_bold), Paragraph("Nginx Alpine", table_cell_style), Paragraph("1.31.8", table_cell_style), Paragraph("Static asset web server hosting compiled React SPA", table_cell_style)],
        [Paragraph("Containerization", table_cell_bold), Paragraph("Docker & Compose", table_cell_style), Paragraph("v2.x", table_cell_style), Paragraph("Multi-container microservices, healthchecks, network isolation", table_cell_style)]
    ]
    tech_table = Table(tech_data, colWidths=[90, 110, 60, 244])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0369a1")),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(tech_table)
    story.append(Spacer(1, 14))

    story.append(PageBreak())

    # 3. System Architecture & Diagram
    story.append(Paragraph("3. System Architecture & Component Interaction", h1_style))
    story.append(Paragraph(
        "LexiScan follows a decoupled, containerized three-tier architecture ensuring high maintainability, fault isolation, "
        "and clean separation of concerns.",
        body_style
    ))
    
    arch_data = [
        [Paragraph("Tier", table_header_style), Paragraph("Component", table_header_style), Paragraph("Port & Protocol", table_header_style), Paragraph("Responsibility & Data Flow", table_header_style)],
        [Paragraph("Presentation Tier", table_cell_bold), Paragraph("React SPA + Nginx", table_cell_style), Paragraph("Port 5173 (HTTP)", table_cell_style), Paragraph("Renders user interface, dark mode theme engine, dropzone file upload, polling mechanism for real-time status updates.", table_cell_style)],
        [Paragraph("Application Tier", table_cell_bold), Paragraph("Spring Boot 3 API", table_cell_style), Paragraph("Port 8081 (Internal 8080)", table_cell_style), Paragraph("Dispatches REST requests, performs JWT verification, validates file magic bytes, triggers asynchronous NLP execution thread pool.", table_cell_style)],
        [Paragraph("NLP Processing", table_cell_bold), Paragraph("Java NLP Engine", table_cell_style), Paragraph("In-Process Async Thread Pool", table_cell_style), Paragraph("Extracts text via PDFBox/POI, segments clauses, extracts regex entities, executes heuristic risk rules matching, calculates score.", table_cell_style)],
        [Paragraph("Data Storage Tier", table_cell_bold), Paragraph("PostgreSQL 16 DB", table_cell_style), Paragraph("Port 5432 (Internal)", table_cell_style), Paragraph("Stores relational tables (Users, Documents, Clauses, Analysis Results, Risk Rules) with cascading foreign key integrity.", table_cell_style)],
        [Paragraph("Document Storage", table_cell_bold), Paragraph("Private File System", table_cell_style), Paragraph("Volume: /app/uploads", table_cell_style), Paragraph("Saves raw uploaded contracts using cryptographically secure UUID file names to eliminate directory traversal attacks.", table_cell_style)]
    ]
    arch_table = Table(arch_data, colWidths=[90, 110, 100, 204])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f233a")),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(arch_table)
    story.append(Spacer(1, 14))

    # 4. End-to-End Processing Workflow
    story.append(Paragraph("4. End-to-End Document Analysis Workflow", h1_style))
    workflow_steps = [
        "<b>Step 1: Document Upload & Magic Byte Verification:</b> The client uploads a contract through the React dropzone. The Spring Boot backend inspects the stream's first 4 bytes (magic bytes: <code>%PDF</code> for PDFs or <code>PK..</code> for Word DOCX) to prevent malicious executable masquerading. Stored files are assigned random UUIDs in <code>/app/uploads</code>.",
        "<b>Step 2: Database Registration & Transaction Initialization:</b> A new record is created in <code>documents</code> table with status <code>UPLOADED</code> and tied to the authenticated user's UUID.",
        "<b>Step 3: Asynchronous Trigger:</b> The frontend calls <code>POST /api/documents/{id}/analyze</code>. The service updates status to <code>PROCESSING</code> and delegates the analysis task to a managed Spring <code>ThreadPoolTaskExecutor</code>.",
        "<b>Step 4: Text Extraction & Normalization:</b> For PDF files, <code>PdfTextExtractor</code> runs <code>PDFTextStripper</code>. For DOCX, <code>DocxTextExtractor</code> traverses all XML body paragraphs. The extracted string is normalized (whitespace collapsed, line-breaks harmonized).",
        "<b>Step 5: Clause Segmentation & Classification:</b> The NLP engine segments clauses using regex boundary detection (numbered clauses e.g. <code>1. TERM</code>, <code>2. LIABILITY</code> or uppercase headings). Each clause is classified into legal categories (e.g., PAYMENT, TERMINATION, INDEMNITY, CONFIDENTIALITY, GOVERNING LAW, DURATION) using weighted keyword dictionaries.",
        "<b>Step 6: Entity Extraction:</b> Specialized regex patterns scan for financial currencies and amounts (INR, USD, EUR, $), timeframes and durations (months, days, years), calendar dates, and counter-party identities.",
        "<b>Step 7: Risk Rule Matching & Scoring:</b> Each clause is matched against active database rules and contextual risk patterns (e.g. uncapped indemnity, unilateral short termination notices, excessive late payment interest >24%, non-refundable deposits). Each clause receives a risk score (0–100) and risk tier (LOW, MEDIUM, HIGH).",
        "<b>Step 8: Aggregate Scoring & Persistence:</b> The overall document risk score is calculated as the capped arithmetic mean: <code>min(100, round(sum(clause scores) / clause count))</code>. Records are written to <code>analysis_results</code> and <code>clauses</code>, and document status is updated to <code>ANALYZED</code>.",
        "<b>Step 9: Interactive UI Display & PDF Report Export:</b> The React client polls <code>GET /api/documents/{id}</code>, detects <code>ANALYZED</code> status, renders the circular score gauge, entity badges, plain-language summary, and searchable clause explorer, and enables on-demand OpenPDF report downloads."
    ]
    for step in workflow_steps:
        story.append(Paragraph(f"• {step}", bullet_style))
    story.append(Spacer(1, 14))

    # 5. Database Schema & Relational Model
    story.append(Paragraph("5. Database Schema & Data Models", h1_style))
    story.append(Paragraph(
        "PostgreSQL maintains relational consistency with cascading foreign key deletions:",
        body_style
    ))
    
    schema_data = [
        [Paragraph("Table Name", table_header_style), Paragraph("Primary Key", table_header_style), Paragraph("Foreign Keys / Constraints", table_header_style), Paragraph("Core Columns & Attributes", table_header_style)],
        [Paragraph("users", table_cell_bold), Paragraph("id (UUID)", table_cell_style), Paragraph("UNIQUE(email)", table_cell_style), Paragraph("name, email, password_hash (BCrypt), role (USER/ADMIN), enabled, created_at", table_cell_style)],
        [Paragraph("documents", table_cell_bold), Paragraph("id (UUID)", table_cell_style), Paragraph("user_id -> users(id) ON DELETE CASCADE", table_cell_style), Paragraph("file_name, stored_path, file_type (PDF/DOCX), file_size, status (UPLOADED/PROCESSING/ANALYZED/FAILED), uploaded_at, analyzed_at", table_cell_style)],
        [Paragraph("analysis_results", table_cell_bold), Paragraph("id (UUID)", table_cell_style), Paragraph("document_id -> documents(id) ON DELETE CASCADE", table_cell_style), Paragraph("overall_risk_score (INT), overall_risk_level (VARCHAR), summary (TEXT), key_entities (JSON text), clause_count, high_risk_count, medium_risk_count", table_cell_style)],
        [Paragraph("clauses", table_cell_bold), Paragraph("id (UUID)", table_cell_style), Paragraph("document_id -> documents(id) ON DELETE CASCADE", table_cell_style), Paragraph("clause_index (INT), clause_text (TEXT), category (VARCHAR), risk_level (LOW/MED/HIGH), risk_score (INT), risk_reason (VARCHAR)", table_cell_style)],
        [Paragraph("risk_rules", table_cell_bold), Paragraph("id (UUID)", table_cell_style), Paragraph("None (System Rules Engine)", table_cell_style), Paragraph("category, pattern (regex), risk_level, risk_score, risk_reason, active (BOOLEAN)", table_cell_style)]
    ]
    schema_table = Table(schema_data, colWidths=[90, 80, 150, 184])
    schema_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0d9488")),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(schema_table)

    story.append(PageBreak())

    # 6. REST API Specification
    story.append(Paragraph("6. REST API Endpoints Specification", h1_style))
    api_data = [
        [Paragraph("HTTP Method", table_header_style), Paragraph("Endpoint Path", table_header_style), Paragraph("Auth Required", table_header_style), Paragraph("Description & Output", table_header_style)],
        [Paragraph("POST", table_cell_bold), Paragraph("/api/auth/register", code_style), Paragraph("Public", table_cell_style), Paragraph("Registers a new user account; returns JWT bearer token and user profile.", table_cell_style)],
        [Paragraph("POST", table_cell_bold), Paragraph("/api/auth/login", code_style), Paragraph("Public", table_cell_style), Paragraph("Authenticates email & password via BCrypt; issues stateless JWT session token.", table_cell_style)],
        [Paragraph("GET", table_cell_bold), Paragraph("/api/auth/me", code_style), Paragraph("Bearer JWT", table_cell_style), Paragraph("Returns current authenticated user details and permission role (USER/ADMIN).", table_cell_style)],
        [Paragraph("POST", table_cell_bold), Paragraph("/api/documents", code_style), Paragraph("Bearer JWT", table_cell_style), Paragraph("Multipart upload for .pdf or .docx contracts; validates magic bytes & size.", table_cell_style)],
        [Paragraph("GET", table_cell_bold), Paragraph("/api/documents", code_style), Paragraph("Bearer JWT", table_cell_style), Paragraph("Paginated list of the current user's uploaded documents with statuses.", table_cell_style)],
        [Paragraph("GET", table_cell_bold), Paragraph("/api/documents/{id}", code_style), Paragraph("Bearer JWT", table_cell_style), Paragraph("Fetches status, file details, and risk level of a user's document.", table_cell_style)],
        [Paragraph("DELETE", table_cell_bold), Paragraph("/api/documents/{id}", code_style), Paragraph("Bearer JWT", table_cell_style), Paragraph("Deletes document record, associated clauses, analysis results, and disk file.", table_cell_style)],
        [Paragraph("POST", table_cell_bold), Paragraph("/api/documents/{id}/analyze", code_style), Paragraph("Bearer JWT", table_cell_style), Paragraph("Triggers asynchronous NLP clause analysis, risk pattern evaluation, and scoring.", table_cell_style)],
        [Paragraph("GET", table_cell_bold), Paragraph("/api/documents/{id}/analysis", code_style), Paragraph("Bearer JWT", table_cell_style), Paragraph("Returns overall score, summary, detected entities, and full clause breakdown.", table_cell_style)],
        [Paragraph("GET", table_cell_bold), Paragraph("/api/documents/{id}/clauses", code_style), Paragraph("Bearer JWT", table_cell_style), Paragraph("Retrieves clauses with optional category and riskLevel query filters.", table_cell_style)],
        [Paragraph("GET", table_cell_bold), Paragraph("/api/documents/{id}/report", code_style), Paragraph("Bearer JWT", table_cell_style), Paragraph("Dynamically compiles and streams downloadable OpenPDF audit report.", table_cell_style)],
        [Paragraph("GET", table_cell_bold), Paragraph("/api/admin/stats", code_style), Paragraph("Role: ADMIN", table_cell_style), Paragraph("Platform analytics: total users, total documents, and completed analyses count.", table_cell_style)],
        [Paragraph("GET", table_cell_bold), Paragraph("/api/admin/rules", code_style), Paragraph("Role: ADMIN", table_cell_style), Paragraph("Lists all active legal risk pattern rules in the heuristic database.", table_cell_style)],
        [Paragraph("GET", table_cell_bold), Paragraph("/actuator/health", code_style), Paragraph("Public", table_cell_style), Paragraph("Spring Boot Actuator operational health status ({\"status\":\"UP\"}).", table_cell_style)]
    ]
    api_table = Table(api_data, colWidths=[65, 145, 75, 219])
    api_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0284c7")),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(api_table)
    story.append(Spacer(1, 14))

    # 7. Security & Compliance
    story.append(Paragraph("7. Security, Privacy & Integrity Measures", h1_style))
    sec_points = [
        "<b>Stateless Authentication:</b> Uses JSON Web Tokens (JJWT) with HMAC-SHA256 digital signatures, expiring in 120 minutes. Passwords use BCrypt hashing with standard salt rounds.",
        "<b>Binary Magic Byte Verification:</b> Validates file signatures at the stream header level to prevent malicious file uploads disguised with altered file extensions.",
        "<b>Anti-Path Traversal File Storage:</b> Stored contract files are decoupled from their original filenames and written to disk as randomized UUIDs.",
        "<b>Ownership Isolation:</b> Database queries enforce user ID filtering at the JPA repository layer; unauthorized requests to other users' documents return HTTP 404.",
        "<b>Cross-Origin Resource Sharing (CORS):</b> Spring Security explicitly handles preflight <code>OPTIONS</code> requests and binds allowed origin patterns for <code>localhost:5173</code> and <code>127.0.0.1:5173</code> with full HTTP method support."
    ]
    for p in sec_points:
        story.append(Paragraph(f"• {p}", bullet_style))
    story.append(Spacer(1, 14))

    # 8. User Interface & Dark Mode
    story.append(Paragraph("8. User Interface, Cold Palette & Dark Mode", h1_style))
    story.append(Paragraph(
        "The frontend is crafted around a <b>Nordic Frost & Glacial Slate</b> calm color palette with built-in instant dark mode switching:",
        body_style
    ))
    ui_points = [
        "<b>Dual Theme Engine:</b> Supports Light (Frosted Ice `#f0f4f8`) and Dark (Midnight Glacier `#0b111e`) modes with instant CSS variable switching and persistent local storage.",
        "<b>Drag & Drop Dropzone:</b> Visual contract upload box with file size calculation, file preview, and upload progress spinners.",
        "<b>Risk Score Meter:</b> Color-coded circular score dial (0–100) with High/Medium/Low risk badge indicators and clause counter cards.",
        "<b>Real-Time Clause Search:</b> Client-side instant keyword filtering across contract text, category tags, and risk explanations.",
        "<b>Administrator Telemetry:</b> Specialized metrics card surfacing real-time system counts when signed in with admin credentials."
    ]
    for p in ui_points:
        story.append(Paragraph(f"• {p}", bullet_style))
    story.append(Spacer(1, 14))

    # 9. Operational & Deployment Guide
    story.append(Paragraph("9. Operational Run & Deployment Guide", h1_style))
    run_steps = [
        "<b>Prerequisites:</b> Docker Desktop running on the host system.",
        "<b>Directory:</b> Navigate to the project root: <code>cd \"D:\\JFSD-5th sem\"</code>",
        "<b>Launch Services:</b> Run <code>docker compose up --build -d</code> to build containers, run migrations, and start Nginx, Spring Boot, and PostgreSQL.",
        "<b>Access Application:</b> Open <code>http://localhost:5173</code> in any browser.",
        "<b>Access API Documentation:</b> Open <code>http://localhost:8081/swagger-ui.html</code> for live OpenAPI Swagger documentation.",
        "<b>Stop Services:</b> Run <code>docker compose down</code> to stop and tear down containers while keeping database data intact."
    ]
    for r in run_steps:
        story.append(Paragraph(f"• {r}", bullet_style))

    # Build the PDF
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Documentation generated successfully at: {filename}")

if __name__ == "__main__":
    output_pdf = "LexiScan_Project_Documentation.pdf"
    build_pdf(output_pdf)
