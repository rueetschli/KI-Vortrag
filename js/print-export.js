/**
 * KI-AKADEMIE - Print & Export Module
 * Generates printable version of slides with task results, without presenter notes
 */

(function () {

    function generatePrintHtml() {
        const app = window.app;
        if (!app || !app.modules.length) return '';

        let html = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>KI-Akademie - Folien</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Exo 2', 'Segoe UI', sans-serif;
            color: #1a1a1a;
            line-height: 1.6;
            padding: 20px;
            background: #fff;
        }

        .print-header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #f59e0b;
        }

        .print-header h1 {
            font-size: 1.8rem;
            color: #0a1628;
            margin-bottom: 4px;
        }

        .print-header p {
            color: #666;
            font-size: 0.9rem;
        }

        .print-module {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }

        .print-module-title {
            font-size: 1.3rem;
            color: #0a1628;
            background: #f59e0b;
            padding: 8px 16px;
            border-radius: 6px;
            margin-bottom: 16px;
            page-break-after: avoid;
        }

        .print-slide {
            padding: 16px 20px;
            margin-bottom: 16px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            page-break-inside: avoid;
        }

        .print-slide h1 {
            font-size: 1.5rem;
            color: #0a1628;
            margin-bottom: 10px;
        }

        .print-slide h2 {
            font-size: 1.2rem;
            color: #0a1628;
            border-bottom: 2px solid #f59e0b;
            padding-bottom: 4px;
            margin-bottom: 10px;
        }

        .print-slide h3 {
            font-size: 1.05rem;
            color: #333;
            margin-top: 12px;
            margin-bottom: 6px;
        }

        .print-slide p {
            margin-bottom: 8px;
            font-size: 0.95rem;
        }

        .print-slide strong {
            color: #b45309;
        }

        .print-slide ul, .print-slide ol {
            padding-left: 24px;
            margin-bottom: 8px;
        }

        .print-slide li {
            margin-bottom: 4px;
            font-size: 0.95rem;
        }

        .print-slide table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
            font-size: 0.85rem;
        }

        .print-slide th, .print-slide td {
            border: 1px solid #d1d5db;
            padding: 6px 10px;
            text-align: left;
        }

        .print-slide th {
            background: #f3f4f6;
            font-weight: 600;
        }

        .print-slide blockquote {
            margin: 10px 0;
            padding: 10px 16px;
            border-left: 4px solid #f59e0b;
            background: #fffbeb;
            font-style: italic;
        }

        .print-slide code {
            background: #f3f4f6;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 0.85em;
        }

        .info-box, .warning-box, .success-box {
            padding: 10px 14px;
            margin: 10px 0;
            border-radius: 6px;
            font-size: 0.9rem;
        }

        .info-box {
            background: #eff6ff;
            border: 1px solid #93c5fd;
        }

        .warning-box {
            background: #fffbeb;
            border: 1px solid #fcd34d;
        }

        .success-box {
            background: #ecfdf5;
            border: 1px solid #6ee7b7;
        }

        .print-task-results {
            margin-top: 16px;
            padding: 12px;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
        }

        .print-task-results h4 {
            color: #0a1628;
            margin-bottom: 8px;
            font-size: 1rem;
        }

        .print-result-card {
            padding: 10px;
            margin-bottom: 8px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            background: #fff;
        }

        .print-result-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
            font-size: 0.85rem;
            color: #666;
        }

        .print-result-header strong {
            color: #0a1628;
        }

        .print-result-content {
            font-size: 0.9rem;
        }

        .print-result-content h3, .print-result-content h4 {
            font-size: 0.95rem;
            margin-bottom: 4px;
        }

        .exercise-card { display: none; }
        .task-slide { display: none; }

        .slide-number {
            font-size: 0.75rem;
            color: #999;
            float: right;
        }

        /* Media layout in print */
        .media-layout {
            display: flex;
            gap: 16px;
            align-items: flex-start;
            margin: 10px 0;
        }

        .media-layout .media-left {
            flex: 0 0 40%;
        }

        .media-layout .media-right {
            flex: 1;
        }

        .media-layout img {
            max-width: 100%;
            border-radius: 4px;
        }

        .print-video-preview {
            margin: 10px 0;
        }

        .print-video-thumbnail {
            width: 100px;
            height: 100px;
            object-fit: cover;
            border-radius: 4px;
            border: 1px solid #d1d5db;
            display: block;
            margin-bottom: 6px;
        }

        .print-video-link {
            display: block;
            font-size: 0.8rem;
            color: #2563eb;
            text-decoration: underline;
            word-break: break-all;
        }

        .media-play-button {
            display: none !important;
        }

        .media-source {
            font-size: 0.75rem;
            color: #999;
            margin-top: 4px;
        }

        @media print {
            body { padding: 0; }
            .print-slide { border: none; border-bottom: 1px solid #eee; border-radius: 0; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="print-header">
        <h1>KI-Akademie</h1>
        <p>Wirtschaftsschule Five Digital &mdash; Künstliche Intelligenz Einführungsmodul</p>
    </div>
    <div class="no-print" style="text-align:center;margin-bottom:20px;">
        <button onclick="window.print()" style="padding:10px 30px;font-size:1rem;background:#f59e0b;border:none;border-radius:8px;cursor:pointer;font-weight:600;">Drucken / Als PDF speichern</button>
        <button onclick="window.close()" style="padding:10px 30px;font-size:1rem;background:#e5e7eb;border:none;border-radius:8px;cursor:pointer;margin-left:10px;">Schliessen</button>
    </div>`;

        let slideNum = 0;

        app.modules.forEach((mod, mi) => {
            html += `<div class="print-module">`;
            html += `<div class="print-module-title">Modul ${mi + 1}: ${escapeHtml(mod.title)}</div>`;

            mod.slides.forEach((slide, si) => {
                slideNum++;
                // Skip slides that are purely task QR slides
                if (slide.content.includes('task-slide') && !slide.content.includes('task-results-slide')) {
                    return;
                }

                html += `<div class="print-slide">`;
                html += `<span class="slide-number">Folie ${slideNum}</span>`;

                // Clean content: remove interactive elements and optimize video previews for print
                const content = sanitizeSlideForPrint(slide.content);

                html += content;

                // If this is a results slide, include task submissions
                if (slide.content.includes('task-results-slide')) {
                    const taskIdMatch = slide.content.match(/data-task-id="([^"]+)"/);
                    if (taskIdMatch) {
                        const taskId = taskIdMatch[1];
                        const submissions = window.taskSubmissions?.getSubmissions(taskId) || [];
                        if (submissions.length > 0) {
                            html += `<div class="print-task-results">`;
                            html += `<h4>Eingereichte Antworten (${submissions.length})</h4>`;
                            submissions.forEach(sub => {
                                html += `<div class="print-result-card">`;
                                html += `<div class="print-result-header"><strong>${escapeHtml(sub.name)}</strong>${sub.group ? ' (' + escapeHtml(sub.group) + ')' : ''}</div>`;
                                html += `<div class="print-result-content">${sub.content}</div>`;
                                html += `</div>`;
                            });
                            html += `</div>`;
                        }
                    }
                }

                html += `</div>`;
            });

            html += `</div>`;
        });

        html += `</body></html>`;
        return html;
    }

    function openPrintView() {
        const html = generatePrintHtml();
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            window.app?.showNotification('Popup blockiert. Bitte erlauben Sie Popups.', 'warning');
            return;
        }
        printWindow.document.open();
        printWindow.document.write(html);
        printWindow.document.close();
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function sanitizeSlideForPrint(rawContent) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(`<div>${rawContent}</div>`, 'text/html');
        const root = doc.body.firstElementChild;
        if (!root) return rawContent;

        root.querySelectorAll('button, input').forEach(el => el.remove());

        root.querySelectorAll('.media-video-container').forEach(container => {
            const videoUrl = container.getAttribute('data-video-url') || '';
            const thumbnail = container.querySelector('.media-thumbnail');
            const thumbSrc = thumbnail?.getAttribute('src') || '';

            const replacement = doc.createElement('div');
            replacement.className = 'print-video-preview';

            if (thumbSrc) {
                const img = doc.createElement('img');
                img.className = 'print-video-thumbnail';
                img.src = thumbSrc;
                img.alt = 'Video Vorschaubild';
                replacement.appendChild(img);
            }

            if (videoUrl) {
                const link = doc.createElement('a');
                link.className = 'print-video-link';
                link.href = videoUrl;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.textContent = `Video-Link: ${videoUrl}`;
                replacement.appendChild(link);
            }

            if (!thumbSrc && !videoUrl) {
                replacement.textContent = 'Video verfügbar (kein Link hinterlegt)';
            }

            container.replaceWith(replacement);
        });

        return root.innerHTML;
    }

    function bind() {
        const downloadBtn = document.getElementById('download-slides');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', openPrintView);
        }
    }

    window.printExport = { openPrintView, generatePrintHtml };

    document.addEventListener('DOMContentLoaded', bind);
})();
