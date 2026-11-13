import { useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import {
  FileSearch, UploadCloud, FileText, X, BriefcaseBusiness,
  Sparkles, Trash2, AlertCircle, FileCheck, Users,
  ArrowUpRight, CheckCircle2, ExternalLink, ChevronDown,
  ChevronUp, LoaderCircle
} from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const SKILL_GROUPS = {
  "React": ["React", "React.js", "ReactJS"],
  "Node.js": ["Node.js", "NodeJS"],
  "JavaScript": ["JavaScript", "JS", "ECMAScript"],
  "HTML": ["HTML", "HTML5"],
  "CSS": ["CSS", "CSS3"],
  "REST API": ["REST API", "REST APIs", "RESTful API", "RESTful APIs", "RESTful Services"],
  "PostgreSQL": ["PostgreSQL", "Postgres"],
  "SQL": ["SQL", "Structured Query Language"],
  "MongoDB": ["MongoDB", "Mongo DB"],
  "UI Design": ["UI Design", "User Interface Design", "UI Development"],
  "UX Design": ["UX Design", "User Experience Design"],
  "Wireframing": ["Wireframing", "Wireframe", "Wireframes"],
  "Prototyping": ["Prototyping", "Prototype", "Prototypes"],
  "User Research": ["User Research", "UX Research"],
  "Usability Testing": ["Usability Testing", "User Testing"],
  "Git": ["Git", "Git Version Control"],
  "Docker": ["Docker", "Containerization"],
  "CI/CD": ["CI/CD", "Continuous Integration", "Continuous Delivery", "Continuous Deployment"],
  "FastAPI": ["FastAPI", "Fast API"],
  "Flask": ["Flask", "Python Flask"],
  "Adobe XD": ["Adobe XD", "XD"],
  "Photoshop": ["Photoshop", "Adobe Photoshop"],
  "Illustrator": ["Illustrator", "Adobe Illustrator"],
  "Figma": ["Figma"],
  "WordPress": ["WordPress", "Word Press"],
  "Material UI": ["Material UI", "MUI"],
  "Google Cloud Platform": ["Google Cloud Platform", "GCP"],
  "Travis CI": ["Travis CI", "TravisCI"],
  "C++": ["C++", "CPP"],
  "C": ["C Language", "C Programming"]
};

function normalizeSkill(skill) {
  return String(skill ?? "")
    .trim()
    .toLowerCase()
    .replace(/[._-]/g, " ")
    .replace(/\s+/g, " ");
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsSkill(text, skill) {
  const normalizedSkill = normalizeSkill(skill);
  const matchingGroup = Object.entries(SKILL_GROUPS).find(([, aliases]) =>
    aliases.some(alias => normalizeSkill(alias) === normalizedSkill)
  );

  const aliases = matchingGroup ? matchingGroup[1] : [skill];

  return aliases.some(alias => {
    const pattern = new RegExp(
      `(^|[^a-z0-9])${escapeRegex(alias)}(?=$|[^a-z0-9])`,
      "i"
    );

    return pattern.test(text) || text.toLowerCase().includes(normalizeSkill(alias));
  });
}

function findSkills(text) {
  const detected = new Set();

  for (const [canonical, aliases] of Object.entries(SKILL_GROUPS)) {
    if (aliases.some(alias => containsSkill(text, alias))) {
      detected.add(canonical);
    }
  }

  return [...detected];
}

function splitSkills(value) {
  return [...new Set(
    String(value ?? "")
      .split(/[,;\n]+/)
      .map(item => item.trim())
      .filter(Boolean)
  )];
}

function isValidName(value) {
  const name = value.replace(/\s+/g, " ").trim();

  if (name.length < 3 || name.length > 55) return false;
  if (/@|https?:|www\.|\d/.test(name)) return false;

  const ignored = /^(resume|curriculum vitae|profile|summary|objective|contact|personal details|professional summary|about me|portfolio|curriculum vitae)$/i;
  if (ignored.test(name)) return false;

  const words = name.split(" ");
  return words.length >= 2 && words.length <= 5 && /^[a-zA-Z][a-zA-Z .'-]*$/.test(name);
}

function findCandidateName(text) {
  const lines = text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  for (const line of lines.slice(0, 30)) {
    const match = line.match(/^(?:candidate\s+name|full\s+name|name)\s*[:\-]\s*(.+)$/i);
    if (match && isValidName(match[1])) return match[1].trim();
  }

  const ignoredWords = /resume|curriculum|profile|contact|email|phone|mobile|address|linkedin|github|portfolio|objective|summary|experience|education|skills|professional|designer|developer|engineer|manager|student/i;

  for (const line of lines.slice(0, 20)) {
    const cleaned = line.replace(/\s{2,}/g, " ").trim();

    if (
      ignoredWords.test(cleaned) ||
      cleaned.length > 55 ||
      /[@\d]|https?:|www\.|\.com/i.test(cleaned)
    ) {
      continue;
    }

    if (isValidName(cleaned)) {
      return cleaned;
    }
  }

  return "Name not identified";
}

function parseResumeDate(value) {
  const MONTHS = {
    jan: 0, january: 0,
    feb: 1, february: 1,
    mar: 2, march: 2,
    apr: 3, april: 3,
    may: 4,
    jun: 5, june: 5,
    jul: 6, july: 6,
    aug: 7, august: 7,
    sep: 8, sept: 8, september: 8,
    oct: 9, october: 9,
    nov: 10, november: 10,
    dec: 11, december: 11
  };

  const cleaned = String(value ?? "").toLowerCase().replace(/\./g, "").trim();

  if (/present|current|now/.test(cleaned)) {
    const today = new Date();
    return today.getFullYear() * 12 + today.getMonth();
  }

  const match = cleaned.match(/([a-z]+)\s+(\d{4})/);
  if (!match || MONTHS[match[1]] === undefined) return null;

  return Number(match[2]) * 12 + MONTHS[match[1]];
}

function getExperienceSection(text) {
  const match = text.match(
    /(?:^|\n)\s*(?:professional\s+)?experience\s*\n([\s\S]*?)(?=\n\s*(?:projects|education|technical skills|skills|certifications)\s*(?:\n|$)|$)/i
  );

  return match ? match[1] : text;
}

function findExperience(text) {
  const experienceText = getExperienceSection(text);
  const datePattern = /((?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+\d{4})\s*(?:-|–|—|to)\s*((?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?\.?\s+\d{4}|Present|Current|Now))/gi;

  const periods = [];
  let match;

  while ((match = datePattern.exec(experienceText)) !== null) {
    const start = parseResumeDate(match[1]);
    const end = parseResumeDate(match[2]);

    if (start !== null && end !== null && end >= start) {
      periods.push([start, end]);
    }
  }

  if (periods.length > 0) {
    periods.sort((a, b) => a[0] - b[0]);
    const merged = [];

    for (const period of periods) {
      const last = merged[merged.length - 1];
      if (!last || period[0] > last[1] + 1) {
        merged.push([...period]);
      } else {
        last[1] = Math.max(last[1], period[1]);
      }
    }

    const totalMonths = merged.reduce((sum, period) => sum + (period[1] - period[0] + 1), 0);
    return Math.round((totalMonths / 12) * 10) / 10;
  }

  const patterns = [
    /(\d+(?:\.\d+)?)\+?\s*years?\s+(?:of\s+)?experience/i,
    /experience\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*years?/i
  ];

  for (const pattern of patterns) {
    const found = text.match(pattern);
    if (found) return Number(found[1]);
  }

  return null;
}

async function extractPdfText(file) {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;

  let fullText = "";

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();

    const lines = [];
    let currentLine = [];
    let previousY = null;

    for (const item of content.items) {
      if (!item.str?.trim()) continue;
      const currentY = item.transform?.[5];

      if (previousY !== null && currentY !== undefined && Math.abs(currentY - previousY) > 3) {
        if (currentLine.length) lines.push(currentLine.join(" "));
        currentLine = [];
      }

      currentLine.push(item.str.trim());
      previousY = currentY;

      if (item.hasEOL) {
        if (currentLine.length) lines.push(currentLine.join(" "));
        currentLine = [];
        previousY = null;
      }
    }

    if (currentLine.length) lines.push(currentLine.join(" "));
    fullText += lines.join("\n") + "\n";
  }

  return { text: fullText.trim(), pages: pdf.numPages };
}

function getMatchedSkills(required, candidateSkills, text) {
  return required.filter(skill => {
    const normalized = normalizeSkill(skill);
    const skillFound = candidateSkills.some(candidateSkill => normalizeSkill(candidateSkill) === normalized);
    return skillFound || containsSkill(text, skill);
  });
}

function analyseCandidate(file, extracted, required, preferred, requiredExperience) {
  const text = extracted.text;
  const candidateSkills = findSkills(text);

  const matchedRequired = getMatchedSkills(required, candidateSkills, text);
  const missingRequired = required.filter(skill => !matchedRequired.some(matched => normalizeSkill(matched) === normalizeSkill(skill)));

  const matchedPreferred = getMatchedSkills(preferred, candidateSkills, text);
  const missingPreferred = preferred.filter(skill => !matchedPreferred.some(matched => normalizeSkill(matched) === normalizeSkill(skill)));

  const experienceYears = findExperience(text);

  let totalWeight = 75;
  let totalScore = required.length ? (matchedRequired.length / required.length) * 75 : 75;

  if (preferred.length > 0) {
    totalWeight += 15;
    totalScore += (matchedPreferred.length / preferred.length) * 15;
  }

  if (requiredExperience !== null) {
    totalWeight += 10;
    const experiencePoints = experienceYears === null ? 0 : Math.min(experienceYears / requiredExperience, 1) * 10;
    totalScore += experiencePoints;
  }

  const score = Math.round((totalScore / totalWeight) * 100);
  const requiredPercentage = required.length ? Math.round((matchedRequired.length / required.length) * 100) : 100;
  const preferredPercentage = preferred.length ? Math.round((matchedPreferred.length / preferred.length) * 100) : null;
  const experiencePercentage = requiredExperience !== null
    ? experienceYears === null ? null : Math.round(Math.min(experienceYears / requiredExperience, 1) * 100)
    : null;

  const email = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || "Not found";
  const phone = text.match(/(?:\+91[\s-]?)?[6-9]\d{9}/)?.[0] || "Not found";

  return {
    id: `${file.name}-${file.size}`,
    file,
    name: findCandidateName(text),
    email,
    phone,
    skills: candidateSkills,
    matchedRequired,
    missingRequired,
    matchedPreferred,
    missingPreferred,
    experienceYears,
    score,
    requiredPercentage,
    preferredPercentage,
    experiencePercentage,
    pages: extracted.pages,
    resumeText: text,
    needsVerification:
      experienceYears === null ||
      text.length < 100 ||
      findCandidateName(text) === "Name not identified"
  };
}

export default function AIResumeAnalyzer() {
  const fileInputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [preferredSkills, setPreferredSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const handleFiles = event => {
    const selectedFiles = Array.from(event.target.files || []);
    const validFiles = selectedFiles.filter(file => file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"));

    setFiles(previous => {
      const combined = [...previous, ...validFiles];
      return combined.filter((file, index, self) =>
        self.findIndex(item => item.name === file.name && item.size === file.size) === index
      );
    });

    if (validFiles.length !== selectedFiles.length) {
      setMessage("Only PDF files are supported.");
    } else if (validFiles.length > 0) {
      setMessage(`${validFiles.length} PDF file(s) added.`);
    }

    setResults([]);
    event.target.value = "";
  };

  const removeFile = index => {
    setFiles(previous => previous.filter((_, i) => i !== index));
    setResults([]);
    setMessage("");
  };

  const handleAnalyze = async () => {
    if (!jobTitle.trim()) {
      setMessage("Please enter the job title.");
      return;
    }

    if (!jobDescription.trim() && !requiredSkills.trim()) {
      setMessage("Enter a job description or required skills.");
      return;
    }

    if (files.length === 0) {
      setMessage("Please upload at least one PDF resume.");
      return;
    }

    const required = splitSkills(requiredSkills);
    const preferred = splitSkills(preferredSkills);
    const requiredFromDescription = findSkills(jobDescription);
    const finalRequired = [...new Map(
      [...required, ...requiredFromDescription].map(skill => [normalizeSkill(skill), skill])
    ).values()];

    if (finalRequired.length === 0) {
      setMessage("Please enter supported required skills separated by commas.");
      return;
    }

    const requiredExperience = Number((experience.match(/\d+(?:\.\d+)?/) || [])[0]) || null;

    setLoading(true);
    setResults([]);
    setMessage("Reading and analysing PDF resumes...");

    const analysed = [];

    for (const file of files) {
      try {
        const extracted = await extractPdfText(file);

        if (!extracted.text || extracted.text.length < 30) {
          analysed.push({
            id: `${file.name}-${file.size}`,
            file,
            name: "Text not available",
            email: "Not available",
            phone: "Not available",
            score: null,
            pages: extracted.pages,
            error: "No readable text found. This may be a scanned PDF."
          });
          continue;
        }

        analysed.push(analyseCandidate(file, extracted, finalRequired, preferred, requiredExperience));
      } catch (error) {
        analysed.push({
          id: `${file.name}-${file.size}`,
          file,
          name: "Unable to read PDF",
          email: "Not available",
          phone: "Not available",
          score: null,
          pages: 0,
          error: "Could not read this PDF. Check whether it is valid or password protected."
        });
      }
    }

    analysed.sort((a, b) => {
      if (a.score === null) return 1;
      if (b.score === null) return -1;
      return b.score - a.score;
    });

    setResults(analysed);
    setLoading(false);
    const successful = analysed.filter(item => item.score !== null).length;
    setMessage(`Analysis completed. ${successful} of ${files.length} resumes were readable.`);
  };

  const formatSize = bytes => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const openResume = file => {
    const url = URL.createObjectURL(file);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  return (
    <div className="resume-page">
      <style>{`
        .resume-page { width:100%; color:#29232b; padding-bottom:30px; }
        .resume-heading { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; margin-bottom:24px; }
        .resume-heading h2 { font-size:23px; font-weight:700; margin:0 0 7px; }
        .resume-heading p { color:#89818a; font-size:13px; margin:0; }
        .resume-ai-tag { display:flex; align-items:center; gap:7px; background:#f8edf2; color:#b44f75; padding:9px 12px; border-radius:9px; font-size:12px; font-weight:600; }
        .resume-layout { display:grid; grid-template-columns:minmax(0,1.15fr) minmax(280px,.85fr); gap:20px; align-items:start; }
        .resume-card { background:#fff; border:1px solid #eee8ec; border-radius:13px; padding:21px; margin-bottom:18px; }
        .resume-card-title { display:flex; align-items:center; gap:10px; margin-bottom:19px; }
        .resume-icon { width:35px; height:35px; display:grid; place-items:center; border-radius:9px; background:#f8edf2; color:#b95776; }
        .resume-card-title h3 { font-size:14px; font-weight:700; margin:0 0 3px; }
        .resume-card-title p { color:#99909a; font-size:11px; margin:0; }
        .resume-label { display:block; font-size:12px; font-weight:600; margin-bottom:7px; color:#514a53; }
        .resume-input,.resume-textarea { width:100%; box-sizing:border-box; border:1px solid #e9e3e8; border-radius:8px; padding:11px 12px; outline:none; background:#fff; color:#332d35; font:inherit; font-size:12px; margin-bottom:16px; }
        .resume-input:focus,.resume-textarea:focus { border-color:#c26c8b; box-shadow:0 0 0 3px #f9edf2; }
        .resume-textarea { min-height:105px; resize:vertical; line-height:1.6; }
        .resume-dropzone { border:1.5px dashed #d9b6c5; border-radius:11px; padding:27px 15px; text-align:center; background:#fdf9fb; cursor:pointer; }
        .resume-dropzone:hover { background:#faf0f4; border-color:#b95776; }
        .resume-upload-icon { width:46px; height:46px; border-radius:12px; display:grid; place-items:center; margin:0 auto 12px; background:#f7e9ef; color:#b95776; }
        .resume-dropzone strong { display:block; font-size:13px; margin-bottom:6px; }
        .resume-muted { color:#96909a; font-size:11px; }
        .resume-file-list { margin-top:17px; display:flex; flex-direction:column; gap:9px; }
        .resume-file { display:flex; align-items:center; gap:11px; border:1px solid #eee8ec; border-radius:9px; padding:11px; }
        .resume-pdf-icon { width:34px; height:34px; border-radius:8px; background:#fff0f0; color:#d65b68; display:grid; place-items:center; flex-shrink:0; }
        .resume-file-info { flex:1; min-width:0; }
        .resume-file-info strong { display:block; font-size:12px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .resume-file-info span { display:block; font-size:10px; color:#99909a; margin-top:4px; }
        .resume-remove { border:0; background:transparent; color:#a59ba4; cursor:pointer; padding:6px; }
        .resume-primary-btn { width:100%; border:0; border-radius:9px; padding:13px; background:#b95776; color:white; font-size:13px; font-weight:600; display:flex; justify-content:center; align-items:center; gap:9px; cursor:pointer; margin-top:17px; }
        .resume-primary-btn:disabled { opacity:.55; cursor:not-allowed; }
        .resume-info-box { padding:14px; border-radius:9px; background:#faf7fb; border:1px solid #eee6f2; margin-bottom:13px; }
        .resume-info-box h4 { font-size:12px; margin:0 0 7px; }
        .resume-info-box p { font-size:11px; color:#827986; line-height:1.6; margin:0; }
        .resume-step { display:flex; gap:11px; margin-bottom:17px; align-items:flex-start; }
        .resume-step-number { width:25px; height:25px; display:grid; place-items:center; border-radius:50%; background:#f7edf2; color:#b95776; font-size:11px; font-weight:700; flex-shrink:0; }
        .resume-step strong { display:block; font-size:12px; margin-bottom:4px; }
        .resume-step span { display:block; font-size:11px; color:#918994; line-height:1.5; }
        .resume-message { display:flex; align-items:flex-start; gap:9px; background:#f5f1fa; color:#70558a; border:1px solid #e8def0; padding:12px; border-radius:9px; font-size:11px; line-height:1.6; margin-top:15px; }
        .resume-count { font-size:11px; color:#89818a; margin-top:13px; }
        .resume-results { margin-top:22px; }
        .resume-results-heading { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:15px; }
        .resume-results-heading h3 { margin:0; font-size:18px; }
        .resume-rank { font-size:10px; font-weight:700; letter-spacing:.04em; padding:5px 8px; background:#f8edf2; color:#b44f75; border-radius:999px; }
        .resume-result { background:#fff; border:1px solid #eee8ec; border-radius:12px; padding:18px; margin-bottom:14px; }
        .resume-result-top { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; }
        .resume-candidate { display:flex; align-items:center; gap:12px; }
        .resume-candidate-icon { width:40px; height:40px; border-radius:10px; background:#f8edf2; display:grid; place-items:center; color:#b95776; }
        .resume-candidate h4 { margin:0 0 4px; font-size:16px; }
        .resume-candidate p { margin:2px 0; font-size:11px; color:#7b7079; }
        .resume-score { text-align:right; }
        .resume-score strong { display:block; font-size:28px; line-height:1; }
        .resume-score span { color:#a2959d; font-size:10px; }
        .resume-result-actions { display:flex; align-items:center; gap:10px; margin-top:16px; flex-wrap:wrap; }
        .resume-small-btn { border:1px solid #eed7e1; background:#fff; color:#b95776; border-radius:8px; padding:8px 10px; font-size:11px; font-weight:600; display:flex; align-items:center; gap:6px; cursor:pointer; }
        .resume-match-list { margin-top:14px; display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:12px; }
        .resume-match-box { background:#faf7fb; border:1px solid #f1e9f2; border-radius:9px; padding:12px; }
        .resume-match-box h5 { margin:0 0 8px; font-size:12px; }
        .resume-skill-list { display:flex; flex-wrap:wrap; gap:8px; }
        .resume-skill { padding:5px 8px; border-radius:999px; background:#fff; border:1px solid #f0e4eb; font-size:10px; color:#5d4958; }
        .resume-skill.missing { background:#fdf2f5; color:#a1586f; border-color:#f2dbe4; }
        .resume-advanced { margin-top:16px; }
        .resume-advanced button { border:0; background:transparent; color:#4d4a4d; padding:0; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:6px; }
        .resume-detail-panel { margin-top:12px; background:#faf7fb; border:1px solid #efe4ec; border-radius:9px; padding:12px; }
        .resume-detail-panel p { margin:0; font-size:11px; line-height:1.7; color:#4b4048; white-space:pre-wrap; }
      `}</style>

      <div className="resume-heading">
        <div>
          <div className="resume-ai-tag">
            <Sparkles size={14} /> Smart HRMS / Resume Intelligence
          </div>
          <h2>AI Resume Analyzer</h2>
          <p>Upload candidate resumes to compare them against your job requirements and score them instantly.</p>
        </div>
        <div className="resume-icon">
          <FileSearch size={22} />
        </div>
      </div>

      <div className="resume-layout">
        <div>
          <section className="resume-card">
            <div className="resume-card-title">
              <div className="resume-icon">
                <UploadCloud size={17} />
              </div>
              <div>
                <h3>Upload Candidate Resumes</h3>
                <p>Only PDF resumes are supported in this release.</p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFiles}
              style={{ display: "none" }}
            />

            <div className="resume-dropzone" onClick={() => fileInputRef.current?.click()}>
              <div className="resume-upload-icon"><UploadCloud size={27} /></div>
              <strong>Drop resumes here or click to browse</strong>
              <div className="resume-muted">Supported format: PDF</div>
            </div>

            {files.length > 0 && (
              <div className="resume-file-list">
                {files.map((file, index) => (
                  <div className="resume-file" key={`${file.name}-${file.size}-${index}`}>
                    <div className="resume-pdf-icon"><FileText size={18} /></div>
                    <div className="resume-file-info">
                      <strong>{file.name}</strong>
                      <span>{formatSize(file.size)}</span>
                    </div>
                    <button className="resume-remove" onClick={() => removeFile(index)}>
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button className="resume-primary-btn" onClick={handleAnalyze} disabled={loading || files.length === 0}>
              {loading ? <><LoaderCircle size={15} className="spin" /> Processing...</> : <><CheckCircle2 size={16} /> Analyze Resumes</>}
            </button>

            {message && (
              <div className="resume-message">
                <AlertCircle size={15} />
                <span>{message}</span>
              </div>
            )}
          </section>
        </div>

        <div>
          <section className="resume-card">
            <div className="resume-card-title">
              <div className="resume-icon"><BriefcaseBusiness size={17} /></div>
              <div>
                <h3>Job Requirements</h3>
                <p>Define the target role and required skill set.</p>
              </div>
            </div>

            <label className="resume-label">Job Title</label>
            <input className="resume-input" value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g. Frontend Developer" />

            <label className="resume-label">Job Description</label>
            <textarea className="resume-textarea" value={jobDescription} onChange={e => setJobDescription(e.target.value)} placeholder="Paste the job description or responsibilities here..." />

            <label className="resume-label">Required Skills</label>
            <input className="resume-input" value={requiredSkills} onChange={e => setRequiredSkills(e.target.value)} placeholder="React, JavaScript, SQL" />

            <label className="resume-label">Preferred Skills</label>
            <input className="resume-input" value={preferredSkills} onChange={e => setPreferredSkills(e.target.value)} placeholder="Node.js, REST API, UX Design" />

            <label className="resume-label">Required Experience (Years)</label>
            <input className="resume-input" value={experience} onChange={e => setExperience(e.target.value)} placeholder="e.g. 3" />

            <div className="resume-info-box">
              <h4>Score calculation</h4>
              <p>Required Skills: 75%, Preferred Skills: 15%, Experience: 10%. Optional categories are normalized automatically.</p>
            </div>
          </section>
        </div>
      </div>

      {results.length > 0 && (
        <section className="resume-results">
          <div className="resume-results-heading">
            <div>
              <h3>Candidate Analysis Results</h3>
              <p className="resume-muted">{jobTitle} · {results.length} resume(s) processed</p>
            </div>
            <span className="resume-rank">Highest match first</span>
          </div>

          {results.map((candidate, index) => (
            <article className="resume-result" key={candidate.id}>
              <div className="resume-result-top">
                <div className="resume-candidate">
                  <div className="resume-candidate-icon"><Users size={19} /></div>
                  <div>
                    <h4>{candidate.name}</h4>
                    <p>{candidate.email}</p>
                    <p>{candidate.file.name}</p>
                  </div>
                </div>

                <div className="resume-score">
                  <strong>{candidate.score === null ? "N/A" : `${candidate.score}%`}</strong>
                  <span>Match score</span>
                </div>
              </div>

              <div className="resume-result-actions">
                <span className="resume-rank">Rank #{index + 1}</span>
                <button className="resume-small-btn" onClick={() => openResume(candidate.file)}>
                  <ExternalLink size={13} /> View PDF
                </button>
                <button className="resume-small-btn" onClick={() => setExpandedId(expandedId === candidate.id ? null : candidate.id)}>
                  {expandedId === candidate.id ? <><ChevronUp size={13} /> Hide details</> : <><ChevronDown size={13} /> View details</>}
                </button>
              </div>

              <div className="resume-match-list">
                <div className="resume-match-box">
                  <h5>Matched Required Skills</h5>
                  <div className="resume-skill-list">
                    {candidate.matchedRequired.length > 0 ? candidate.matchedRequired.map(skill => (
                      <span key={skill} className="resume-skill">{skill}</span>
                    )) : <span className="resume-muted">None</span>}
                  </div>
                </div>

                <div className="resume-match-box">
                  <h5>Missing Required Skills</h5>
                  <div className="resume-skill-list">
                    {candidate.missingRequired.length > 0 ? candidate.missingRequired.map(skill => (
                      <span key={skill} className="resume-skill missing">{skill}</span>
                    )) : <span className="resume-muted">None</span>}
                  </div>
                </div>
              </div>

              {expandedId === candidate.id && (
                <div className="resume-advanced">
                  <div className="resume-detail-panel">
                    <p>{candidate.resumeText.slice(0, 3000)}{candidate.resumeText.length > 3000 ? "..." : ""}</p>
                  </div>
                </div>
              )}
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
