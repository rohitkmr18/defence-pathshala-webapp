import streamlit as st
import pandas as pd
import re
from groq import Groq
import plotly.express as px
import time
import streamlit.components.v1 as components
import base64
import requests
import io
import html
import json

# ==========================================
# --- PAGE CONFIG ---
# ==========================================
st.set_page_config(page_title="Defence Pathshala | PYQ Engine", layout="wide", initial_sidebar_state="collapsed")

# ==========================================
# --- IMAGE ENCODING & CSS INJECTION ---
# ==========================================
def get_base64_of_bin_file(bin_file):
    try:
        with open(bin_file, 'rb') as f:
            data = f.read()
        return base64.b64encode(data).decode()
    except FileNotFoundError:
        return None

# Attempt to read the camo image
camo_img_base64 = get_base64_of_bin_file(str(__import__('pathlib').Path(__file__).resolve().parent / 'images.jpg'))

if camo_img_base64:
    background_css = 'url("data:image/jpeg;base64,' + camo_img_base64 + '")'
else:
    background_css = '#4B5320'

# Define the CSS as a standard string
css_template = """
<style>
/* Premium compact Database Overview control bar */
.overview-filter-panel {
    display:flex;
    align-items:baseline;
    gap:10px;
    margin:2px 0 4px;
    padding:0 2px;
}
.overview-filter-kicker {
    font-family:'Space Grotesk', sans-serif;
    font-size:0.70rem;
    font-weight:800;
    letter-spacing:0.12em;
    color:#64748B;
}
.overview-filter-subtitle {
    font-size:0.82rem;
    color:#94A3B8;
}
/* Base Typography & Negative Space */
html, body, [class*="css"] {
    font-family: 'Inter', 'Segoe UI', sans-serif;
}
.block-container {
    padding-top: 2rem !important;
    padding-bottom: 2rem !important;
}

/* Banner Design - Tactical Camo Frame */
.hero-banner {
    background-image: REPLACE_ME_BACKGROUND;
    background-size: 100% 100%; 
    background-position: center;
    background-repeat: no-repeat;
    background-color: #F8FAFC; 
    padding: 50px 20px; 
    border-radius: 12px;
    text-align: center;
    margin-bottom: 15px;
    box-shadow: 0 6px 15px rgba(0,0,0,0.5);
}

.hero-title {
    font-family: 'Black Ops One', 'Impact', sans-serif;
    font-weight: 400;
    font-size: 2.8rem;
    margin-bottom: 5px;
    line-height: 1.2;
    color: #0F172A; 
    letter-spacing: 2px;
    text-transform: uppercase;
    text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.8);
}

.hero-tagline {
    font-family: 'Inter', 'Segoe UI', sans-serif;
    font-size: 1.15rem;
    color: #1E293B; 
    margin-top: 5px;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
}

/* Credential Badge */
.cred-badge {
    background-color: #F8FAFC;
    border-left: 5px solid #F59E0B;
    padding: 14px;
    border-radius: 6px;
    font-size: 0.95rem;
    text-align: center;
    margin: 20px auto;
    font-weight: 700;
    color: #0F172A;
    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

/* Dashboard Description */
.dash-intro {
    text-align: center;
    font-size: 0.95rem;
    color: #475569;
    line-height: 1.6;
    margin-bottom: 30px;
    padding: 0 10px;
}

/* Briefing Card */
.briefing-card {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    margin-bottom: 25px;
}
.briefing-header {
    font-size: 1.3rem;
    font-weight: 800;
    color: #0F172A;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
}
.briefing-item {
    margin-bottom: 12px;
    line-height: 1.6;
    color: #334155;
    font-size: 0.96rem;
}

/* Mobile-Optimized Radio Buttons */
div.stRadio > div[role="radiogroup"] > label {
    padding: 14px 18px !important;
    margin-bottom: 10px !important;
    background-color: #F8FAFC;
    border-radius: 8px;
    border: 1px solid #E2E8F0;
    cursor: pointer;
    transition: all 0.2s ease;
}
div.stRadio > div[role="radiogroup"] > label:hover {
    border-color: #3B82F6;
    background-color: #EFF6FF;
}

/* Metric Typography Override */
[data-testid="stMetricValue"] {
    font-family: 'Manrope', 'Segoe UI', sans-serif !important;
    font-weight: 800 !important;
    color: #1E3A8A;
}

/* Premium typography */
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');

html, body, [class*="css"], .stApp {
    font-family: 'Manrope', 'Segoe UI', sans-serif !important;
    letter-spacing: -0.01em;
}

h1, h2, h3, h4, h5, h6 {
    font-family: 'Space Grotesk', 'Manrope', sans-serif !important;
    letter-spacing: -0.025em !important;
    color: #172033 !important;
}

/* Premium controls */
div[data-testid="stMultiSelect"] > div,
div[data-testid="stSelectbox"] > div {
    border-radius: 12px !important;
}

div[data-testid="stMultiSelect"] [data-baseweb="select"] > div,
div[data-testid="stSelectbox"] [data-baseweb="select"] > div {
    border: 1px solid #D7DEE9 !important;
    border-radius: 12px !important;
    background: #F8FAFC !important;
    min-height: 50px !important;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.8), 0 2px 8px rgba(15,23,42,.04) !important;
}

div[data-testid="stMultiSelect"] [data-baseweb="select"] > div:focus-within,
div[data-testid="stSelectbox"] [data-baseweb="select"] > div:focus-within {
    border-color: #64748B !important;
    box-shadow: 0 0 0 3px rgba(100,116,139,.12) !important;
}

/* Premium question cards */
div[data-testid="stVerticalBlockBorderWrapper"] {
    border: 1px solid #DCE3EC !important;
    border-radius: 16px !important;
    background: linear-gradient(180deg, #FFFFFF 0%, #FBFCFE 100%) !important;
    box-shadow: 0 8px 24px rgba(15,23,42,.06) !important;
    padding: 8px 4px !important;
    margin: 0 0 18px 0 !important;
}

.question-number {
    font-family: 'Space Grotesk', sans-serif;
    font-size: .76rem;
    font-weight: 700;
    letter-spacing: .12em;
    color: #64748B;
    text-transform: uppercase;
    margin-bottom: 8px;
}

.question-text {
    font-family: 'Manrope', sans-serif;
    font-size: 1.08rem;
    line-height: 1.72;
    font-weight: 500;
    color: #172033;
    margin-bottom: 16px;
}

.match-prompt {
    font-family: 'Manrope', sans-serif;
    font-size: 1.03rem;
    line-height: 1.65;
    font-weight: 500;
    color: #334155;
    margin: 2px 0 18px 0;
}

.match-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin: 10px 0 20px 0;
}
.match-column {
    border: 1px solid #DCE3EC;
    border-radius: 12px;
    overflow: hidden;
    background: #FFFFFF;
}
.match-column-header {
    background: #F1F5F9;
    border-bottom: 1px solid #DCE3EC;
    padding: 12px 14px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: .92rem;
    font-weight: 600;
    color: #334155;
}
.match-row {
    display: grid;
    grid-template-columns: 42px 1fr;
    gap: 8px;
    padding: 11px 14px;
    border-bottom: 1px solid #EEF2F7;
    font-family: 'Manrope', sans-serif;
    font-size: .94rem;
    line-height: 1.5;
    color: #334155;
}
.match-row:last-child { border-bottom: none; }
.match-label {
    font-family: 'Space Grotesk', sans-serif;
    color: #64748B;
    font-weight: 600;
}
@media (max-width: 700px) {
    .match-grid { grid-template-columns: 1fr; }
}

/* Boxed answer options */
div[data-testid="stRadio"] > div[role="radiogroup"] {
    gap: 10px !important;
}

div[data-testid="stRadio"] > div[role="radiogroup"] > label {
    padding: 14px 16px !important;
    margin: 0 !important;
    background: #FFFFFF !important;
    border: 1px solid #DCE3EC !important;
    border-radius: 12px !important;
    box-shadow: 0 2px 8px rgba(15,23,42,.035) !important;
    cursor: pointer !important;
    transition: all .18s ease !important;
    font-weight: 500 !important;
}

div[data-testid="stRadio"] > div[role="radiogroup"] > label:hover {
    border-color: #94A3B8 !important;
    background: #F8FAFC !important;
    transform: translateY(-1px);
    box-shadow: 0 5px 14px rgba(15,23,42,.07) !important;
}

div[data-testid="stRadio"] > div[role="radiogroup"] > label:has(input:checked) {
    border-color: #475569 !important;
    background: #F1F5F9 !important;
    box-shadow: 0 0 0 2px rgba(71,85,105,.08) !important;
}

/* Filter panel */
.filter-panel {
    background: linear-gradient(135deg, #F8FAFC 0%, #EEF2F7 100%);
    border: 1px solid #DCE3EC;
    border-radius: 16px;
    padding: 18px 20px;
    margin: 4px 0 18px 0;
}
.filter-panel-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.05rem;
    font-weight: 700;
    color: #172033;
}
.filter-panel-subtitle {
    color: #64748B;
    font-size: .88rem;
    line-height: 1.55;
    margin-top: 3px;
}
.filter-divider {
    height: 1px;
    background: #E2E8F0;
    margin: 20px 0;
}

/* Buttons */
div.stButton > button {
    border-radius: 11px !important;
    min-height: 44px !important;
    font-family: 'Manrope', sans-serif !important;
    font-weight: 700 !important;
    letter-spacing: .01em !important;
    transition: all .18s ease !important;
}

div.stButton > button:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(15,23,42,.10) !important;
}

/* Expander */
div[data-testid="stExpander"] {
    border: 1px solid #DCE3EC !important;
    border-radius: 12px !important;
    overflow: hidden !important;
}


/* Anchor offset for smooth scrolling under fixed headers */
.anchor-offset {
    position: relative;
    top: -80px; 
}

/* Active Grid Compact Columns */
.active-grid-wrapper [data-testid="column"] {
    min-width: 45px !important;
    padding: 2px !important;
}

/* Active Grid Square Buttons */
.active-grid-wrapper [data-testid="stButton"] button {
    height: 45px !important;
    width: 100% !important;
    padding: 0px !important;
    border-radius: 4px;
    font-weight: 800;
    transition: all 0.2s ease;
}
</style>
"""

# Inject the image into the CSS string using replace
final_css = css_template.replace("REPLACE_ME_BACKGROUND", background_css)
st.markdown(final_css, unsafe_allow_html=True)

# ==========================================
# --- HELPER FUNCTIONS ---
# ==========================================
def reset_test_state():
    """Clears all test progress, timer, and pagination states."""
    # A new run ID gives question widgets a fresh namespace. This prevents a
    # previous test's radio-widget values from being restored after a reset.
    st.session_state['test_run_id'] = st.session_state.get('test_run_id', 0) + 1
    st.session_state['user_answers'] = {}
    st.session_state['checked_questions'] = set()
    st.session_state['error_tags'] = {}
    st.session_state['marked_for_review'] = set()
    st.session_state['exam_submitted'] = False
    st.session_state['exam_started'] = False
    st.session_state['start_time'] = None
    st.session_state['auto_submitted'] = False
    st.session_state['current_page'] = 0
    st.session_state['scroll_trigger'] = False
    st.session_state['review_selected_qid'] = None
    st.session_state['show_revision_notes'] = False
    st.session_state['practice_filters_applied'] = False
    st.session_state['practice_filter_signature'] = None

def clean_text(text):
    if pd.isna(text):
        return ""
    return str(text).replace('\\n', '  \n').replace('\n', '  \n')

def display_value(value, fallback="N/A"):
    if pd.isna(value):
        return fallback
    value = str(value).strip()
    return fallback if not value or value.lower() in {"nan", "none", "null"} else value


def get_option_text(row, option_letter):
    option_map = {"A": row.get("opt_a", ""), "B": row.get("opt_b", ""),
                  "C": row.get("opt_c", ""), "D": row.get("opt_d", "")}
    return display_value(option_map.get(str(option_letter).strip(), ""), "")


def format_answer(row, option_letter):
    letter = display_value(option_letter, "")
    if not letter:
        return "N/A"
    option_text = get_option_text(row, letter)
    return f"{letter}) {option_text}" if option_text else letter



def _question_source_text(value):
    """Return question text with common HTML entities decoded and newlines normalized."""
    text = display_value(value, "")
    if not text:
        return ""
    text = html.unescape(text)
    text = text.replace("\\n", "\n")
    return text.strip()


def parse_match_lists(question_text):
    """Parse UPSC-style List-I/List-II questions when both lists are embedded in the question field."""
    text = _question_source_text(question_text)
    if not text or not re.search(r"\bMatch\s+List[- ]I\b", text, flags=re.IGNORECASE):
        return None

    list1_match = re.search(r"\bList[- ]I\s*\(([^)]*)\)", text, flags=re.IGNORECASE)
    list2_match = re.search(r"\bList[- ]II\s*\(([^)]*)\)", text, flags=re.IGNORECASE)
    if not list1_match or not list2_match or list2_match.start() <= list1_match.end():
        return None

    prompt = text[:list1_match.start()].strip()
    list1_body = text[list1_match.end():list2_match.start()].strip()
    list2_body = text[list2_match.end():].strip()

    # Remove trailing instruction text if it was appended to List-II.
    list2_body = re.split(
        r"\b(?:select\s+the\s+answer|choose\s+the\s+correct|codes?\s+given|which\s+of\s+the\s+following)\b",
        list2_body,
        maxsplit=1,
        flags=re.IGNORECASE,
    )[0].strip(" :;-—")

    def parse_items(body, pattern):
        matches = list(re.finditer(pattern, body, flags=re.IGNORECASE | re.DOTALL))
        items = []
        for i, match in enumerate(matches):
            start = match.end()
            end = matches[i + 1].start() if i + 1 < len(matches) else len(body)
            value = re.sub(r"\s+", " ", body[start:end]).strip(" \t\r\n-—;:")
            if value:
                items.append((match.group(1).upper(), value))
        return items

    left_items = parse_items(list1_body, r"(?:^|\s)([A-D])[.)]\s*")
    right_items = parse_items(list2_body, r"(?:^|\s)([1-9][0-9]*)[.)]\s*")

    if not left_items or not right_items:
        return None

    return {
        "prompt": prompt,
        "list1_title": list1_match.group(1).strip(),
        "list2_title": list2_match.group(1).strip(),
        "list1": left_items,
        "list2": right_items,
    }


def render_question_stem(row):
    """Render a question normally, or as a two-column UPSC List-I/List-II layout."""
    question_text = _question_source_text(row.get("question", ""))
    parsed = parse_match_lists(question_text)

    if not parsed:
        st.markdown(
            f"<div class='question-text'>{html.escape(question_text).replace(chr(10), '<br>')}</div>",
            unsafe_allow_html=True,
        )
        return

    prompt = html.escape(parsed["prompt"]).replace("\n", "<br>")
    st.markdown(f"<div class='match-prompt'>{prompt}</div>", unsafe_allow_html=True)

    left_rows = "".join(
        f"<div class='match-row'><div class='match-label'>{html.escape(label)}</div>"
        f"<div>{html.escape(value)}</div></div>"
        for label, value in parsed["list1"]
    )
    right_rows = "".join(
        f"<div class='match-row'><div class='match-label'>{html.escape(label)}</div>"
        f"<div>{html.escape(value)}</div></div>"
        for label, value in parsed["list2"]
    )

    st.markdown(
        f"""
        <div class='match-grid'>
            <div class='match-column'>
                <div class='match-column-header'>List-I — {html.escape(parsed['list1_title'])}</div>
                {left_rows}
            </div>
            <div class='match-column'>
                <div class='match-column-header'>List-II — {html.escape(parsed['list2_title'])}</div>
                {right_rows}
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

def render_pyq_intelligence(row):
    st.markdown("#### 🎯 PYQ Intelligence")
    c1, c2 = st.columns(2)
    with c1:
        st.markdown(f"Subject: {display_value(row.get('subject'))}")
        st.markdown(f"Topic: {display_value(row.get('topic'))}")
        st.markdown(f"Theme: {display_value(row.get('theme'))}")
    with c2:
        st.markdown(f"Subtopic: {display_value(row.get('subtopic'))}")
        st.markdown(f"Source: {display_value(row.get('source'))}")

    st.markdown("#### 📝 Answer Analysis")
    user_choice = display_value(row.get("User_Choice"), "Unattempted")
    correct_opt = display_value(row.get("final_opt"), "")
    user_answer = "Unattempted" if user_choice == "Unattempted" else format_answer(row, user_choice)
    correct_answer = format_answer(row, correct_opt)

    a1, a2 = st.columns(2)
    with a1:
        st.markdown(f"Your Answer: {user_answer}")
    with a2:
        st.markdown(f"Correct Answer: {correct_answer}")

    status = display_value(row.get("Status"))
    if status == "Correct":
        st.success("🎯 Status: Correct")
    elif status == "Incorrect":
        st.error("🚨 Status: Incorrect")
        st.markdown(f"Error Type: {display_value(row.get('Error_Type'), ERROR_TYPE_FALLBACK)}")
    else:
        st.warning("⚠️ Status: Unattempted")

    st.markdown("#### 💡 Explanation")
    st.info(f"Explanation:\n{clean_text(row.get('explanation', ''))}")


ERROR_TYPE_FALLBACK = "Unrecognised"


def resolve_error_type(row, question_id=None):
    """Derive Error Type exclusively from database property P: q_type."""
    q_type = display_value(row.get("q_type"), "").strip().casefold()
    if "concept" in q_type:
        return "Conceptual Gap"
    if "factual" in q_type or "fact" in q_type:
        return "Lack of Revision"
    if "analytical" in q_type or "analytic" in q_type:
        return "Analytical Error"
    return ERROR_TYPE_FALLBACK


def clean_revision_explanation(text):
    """Remove answer-key/statement-validation language from revision notes."""
    text = display_value(text, "")
    if not text:
        return ""

    import re
    # Remove common answer-validation sentences while preserving the substantive explanation.
    patterns = [
        r"(?:^|(?<=[.!?])\s*)statement\s*1\s+is\s+(?:in)?correct\.?\s*",
        r"(?:^|(?<=[.!?])\s*)statement\s*2\s+is\s+(?:in)?correct\.?\s*",
        r"(?:^|(?<=[.!?])\s*)both\s+statements?\s+are\s+(?:in)?correct\.?\s*",
        r"(?:^|(?<=[.!?])\s*)only\s+statement\s*[12]\s+is\s+correct\.?\s*",
        r"(?:^|(?<=[.!?])\s*)statement\s*[12]\s+is\s+the\s+correct\s+answer\.?\s*",
    ]
    cleaned = text.replace("\n", " ")
    for pattern in patterns:
        cleaned = re.sub(pattern, " ", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\s+", " ", cleaned).strip(" .;:-")
    return cleaned


def revision_bullet(row):
    """Return the substantive explanation for an incorrect/skipped question."""
    explanation = clean_revision_explanation(row.get("explanation", ""))
    if explanation:
        return explanation
    topic = display_value(row.get("topic"), "")
    subtopic = display_value(row.get("subtopic"), "")
    theme = display_value(row.get("theme"), "")
    return " — ".join(part for part in (topic, subtopic, theme) if part) or "Review the core concept tested by this question."
# ============================================================
# DP REVISION INTELLIGENCE ENGINE
# ============================================================

DP_REVISION_PROMPT = """
You are the Defence Pathshala Revision Intelligence Engine.

Your task is to transform raw revision notes generated from a
student's mock-test performance into clear, systematic,
high-quality revision notes for serious UPSC, CAPF and CDS
aspirants.

CORE PRINCIPLE:

You are an editor and organizer of the supplied information.
You are NOT a general knowledge generator.

Use ONLY information contained in the supplied raw revision notes.

You may:
- reorganize information
- group related information
- remove repetition
- improve wording
- improve logical flow
- create headings
- create tables using supplied information
- make information easier to revise

You MUST NOT:
- add outside facts
- add additional dates
- add additional locations
- add additional names
- add statistics
- add historical background
- invent PYQ connections
- invent examination trends
- invent exam traps
- strengthen claims beyond what the source says
- change question numbering

If the source says something, preserve its factual meaning.

Never reconstruct question-option numbering.

For example, if the source says:
"Bonin and Kermadec are in the Pacific."

Do not infer that they correspond to option 2 or option 4.

Organize the notes around the underlying concepts rather than
simply reproducing question-by-question explanations.

Use:
- clear headings
- concise bullets
- compact tables where useful
- important distinctions
- rapid-revision points

Only include a common confusion or exam trap when it can be
directly derived from the supplied information.

Do not manufacture PYQ insights.

At the end, provide a concise "Rapid Revision" section.

Return ONLY the refined revision notes in Markdown.
"""


def refine_revision_notes(raw_notes):
    """
    Send raw DP revision notes to Groq and return refined notes.

    If Groq fails for any reason, return the original notes so
    the existing revision-note system continues to work.
    """

    try:
        client = Groq(
            api_key=st.secrets["GROQ_API_KEY"]
        )

        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "system",
                    "content": DP_REVISION_PROMPT
                },
                {
                    "role": "user",
                    "content": raw_notes
                }
            ],
            temperature=0.2
        )

        refined_notes = response.choices[0].message.content

        if refined_notes and refined_notes.strip():
            return refined_notes.strip()

        return raw_notes

    except Exception as e:
        st.warning(
            "AI refinement was unavailable. Showing the standard "
            "revision notes instead."
        )

        return raw_notes

def render_revision_notes(analysis_df):
    """Generate and display AI-refined revision notes."""

    st.markdown("## 📚 Revision Notes")

    st.caption(
        "AI-refined from explanations of incorrect and skipped "
        "questions in this paper."
    )

    revision_df = analysis_df[
        analysis_df["Status"].isin(["Incorrect", "Unattempted"])
    ].copy()

    if revision_df.empty:
        st.success(
            "🎯 No incorrect or skipped questions. "
            "No revision notes are required."
        )

        st.button(
            "← Go Back to Analysis",
            type="primary",
            use_container_width=True,
            on_click=hide_revision_notes
        )

        return

    # --------------------------------------------------------
    # STEP 1: BUILD RAW REVISION NOTES
    # --------------------------------------------------------

    raw_sections = []

    for subject, subject_df in revision_df.groupby(
        "subject",
        sort=True
    ):

        subject_lines = [
            f"### {display_value(subject)}",
            ""
        ]

        seen = set()

        for _, row in subject_df.sort_values(
            ["q_num", "question_id"],
            kind="stable"
        ).iterrows():

            point = revision_bullet(row)

            normalized = point.casefold()

            if not point or normalized in seen:
                continue

            seen.add(normalized)

            label = f"Q{display_value(row.get('q_num'))}"

            topic = display_value(
                row.get("topic"),
                ""
            )

            subtopic = display_value(
                row.get("subtopic"),
                ""
            )

            context = " · ".join(
                x for x in (topic, subtopic)
                if x
            )

            if context:
                subject_lines.append(
                    f"- **{label} — {context}:** {point}"
                )
            else:
                subject_lines.append(
                    f"- **{label}:** {point}"
                )

        if len(subject_lines) > 2:
            raw_sections.append(
                "\n".join(subject_lines)
            )

    raw_notes = "\n\n".join(raw_sections)

    # --------------------------------------------------------
    # STEP 2: SEND COMPLETE NOTES TO GROQ
    # --------------------------------------------------------

    with st.spinner(
        "🧠 Defence Pathshala is refining your revision notes..."
    ):

        refined_notes = refine_revision_notes(
            raw_notes
        )

    # --------------------------------------------------------
    # STEP 3: DISPLAY REFINED NOTES
    # --------------------------------------------------------

    st.markdown(refined_notes)

    # --------------------------------------------------------
    # STEP 4: RETURN BUTTON
    # --------------------------------------------------------

    st.button(
        "← Go Back to Analysis",
        type="primary",
        use_container_width=True,
        on_click=hide_revision_notes
    )

# ============================================================
# DP STRATEGIC ROADMAP ENGINE
# Steps 1-3: Performance Profile -> Diagnostics -> Priorities
# Step 4: Groq converts deterministic signals into student-facing
# language. Step 5: render the roadmap in the results UI.
# ============================================================


def _roadmap_clean(value):
    """Return a safe string for roadmap JSON while preserving database values."""
    if pd.isna(value):
        return ""
    return str(value).strip()


def _evidence_strength(attempted):
    attempted = int(attempted or 0)
    if attempted <= 2:
        return "low"
    if attempted <= 7:
        return "moderate"
    return "strong"


def build_performance_profile(analysis_df, exam, year, cycle, attempt_type="Full Paper"):
    """Build the deterministic V1 current-mock performance profile."""
    work = analysis_df.copy()
    work["Status"] = work["Status"].astype(str).str.strip()
    work["subject"] = work.get("subject", pd.Series(index=work.index, dtype="object")).map(_roadmap_clean)
    work["topic"] = work.get("topic", pd.Series(index=work.index, dtype="object")).map(_roadmap_clean)
    work["subtopic"] = work.get("subtopic", pd.Series(index=work.index, dtype="object")).map(_roadmap_clean)
    work["Error_Type"] = work.get("Error_Type", pd.Series(index=work.index, dtype="object")).map(_roadmap_clean)

    total = len(work)
    attempted_df = work[work["Status"] != "Unattempted"]
    attempted = len(attempted_df)
    correct = int((work["Status"] == "Correct").sum())
    incorrect = int((work["Status"] == "Incorrect").sum())
    unattempted = int((work["Status"] == "Unattempted").sum())
    attempt_rate = round((attempted / total * 100), 1) if total else 0.0
    accuracy = round((correct / attempted * 100), 1) if attempted else 0.0

    pos_mark = 0.83 if str(exam).strip() == "CDS" else 2.0
    neg_mark = 0.27 if str(exam).strip() == "CDS" else 0.667
    score = round((correct * pos_mark) - (incorrect * neg_mark), 2)
    max_score = round(total * pos_mark, 2)

    subjects = []
    if "subject" in work.columns:
        for subject, g in work.groupby("subject", sort=True):
            if not subject:
                continue
            q = len(g)
            a = int((g["Status"] != "Unattempted").sum())
            c = int((g["Status"] == "Correct").sum())
            ic = int((g["Status"] == "Incorrect").sum())
            u = int((g["Status"] == "Unattempted").sum())
            subjects.append({
                "subject": subject,
                "questions": q,
                "attempted": a,
                "correct": c,
                "incorrect": ic,
                "unattempted": u,
                "attempt_rate": round(a / q * 100, 1) if q else 0.0,
                "accuracy": round(c / a * 100, 1) if a else 0.0,
                "evidence_strength": _evidence_strength(a),
                "error_types": g.loc[g["Status"] == "Incorrect", "Error_Type"].value_counts().to_dict()
            })

    topics = []
    topic_cols = [c for c in ["subject", "topic"] if c in work.columns]
    if topic_cols:
        for keys, g in work.groupby(topic_cols, sort=True, dropna=False):
            if not isinstance(keys, tuple):
                keys = (keys,)
            subject = _roadmap_clean(keys[0]) if len(keys) > 0 else ""
            topic = _roadmap_clean(keys[1]) if len(keys) > 1 else ""
            if not topic:
                continue
            q = len(g)
            a = int((g["Status"] != "Unattempted").sum())
            c = int((g["Status"] == "Correct").sum())
            ic = int((g["Status"] == "Incorrect").sum())
            u = int((g["Status"] == "Unattempted").sum())
            topics.append({
                "subject": subject,
                "topic": topic,
                "questions": q,
                "attempted": a,
                "correct": c,
                "incorrect": ic,
                "unattempted": u,
                "attempt_rate": round(a / q * 100, 1) if q else 0.0,
                "accuracy": round(c / a * 100, 1) if a else 0.0,
                "evidence_strength": _evidence_strength(a),
                "error_types": g.loc[g["Status"] == "Incorrect", "Error_Type"].value_counts().to_dict()
            })

    error_counts = work.loc[work["Status"] == "Incorrect", "Error_Type"].value_counts().to_dict()
    error_profile = {}
    for error_type, count in error_counts.items():
        if not error_type:
            continue
        error_profile[error_type] = {
            "count": int(count),
            "percentage_of_incorrect": round(count / incorrect * 100, 1) if incorrect else 0.0
        }

    question_evidence = []
    for _, row in work.iterrows():
        qid = _roadmap_clean(row.get("question_id", row.get("q_num", "")))
        question_evidence.append({
            "question_id": qid,
            "subject": _roadmap_clean(row.get("subject", "")),
            "topic": _roadmap_clean(row.get("topic", "")),
            "subtopic": _roadmap_clean(row.get("subtopic", "")),
            "status": _roadmap_clean(row.get("Status", "")),
            "error_type": _roadmap_clean(row.get("Error_Type", "")) or None
        })

    return {
        "mock": {
            "exam": _roadmap_clean(exam),
            "year": _roadmap_clean(year),
            "cycle": _roadmap_clean(cycle),
            "attempt_type": attempt_type,
            "total_questions": total
        },
        "overall": {
            "attempted": attempted,
            "correct": correct,
            "incorrect": incorrect,
            "unattempted": unattempted,
            "attempt_rate": attempt_rate,
            "accuracy": accuracy,
            "score": score,
            "max_score": max_score
        },
        "subjects": subjects,
        "topics": topics,
        "error_profile": error_profile,
        "question_evidence": question_evidence
    }


def diagnose_performance(profile):
    """Apply deterministic V1 diagnostic rules. No LLM is used here."""
    overall = profile["overall"]
    signals = []

    ar = overall["attempt_rate"]
    acc = overall["accuracy"]

    if ar < 60:
        signals.append({"signal": "LOW_ATTEMPT_COVERAGE", "scope": "overall", "evidence_strength": "strong"})
    if ar >= 75 and acc < 60:
        signals.append({"signal": "HIGH_ATTEMPT_LOW_ACCURACY", "scope": "overall", "evidence_strength": "strong"})
    elif ar < 60 and acc < 60:
        signals.append({"signal": "LOW_ATTEMPT_LOW_ACCURACY", "scope": "overall", "evidence_strength": "strong"})
    elif ar >= 75 and acc >= 75:
        signals.append({"signal": "STRONG_PAPER_HANDLING", "scope": "overall", "evidence_strength": "strong"})

    subject_signals = []
    for item in profile["subjects"]:
        s = []
        if item["attempted"] >= 3 and item["accuracy"] < 60:
            s.append("SUBJECT_ACCURACY_GAP")
        if item["questions"] >= 5 and item["attempt_rate"] < 60:
            s.append("SUBJECT_COVERAGE_GAP")
        if item["attempted"] >= 3 and item["accuracy"] >= 75 and item["attempt_rate"] < 60:
            s.append("SUBJECT_UNDER_ATTEMPTING")
        if item["attempted"] >= 3 and item["accuracy"] >= 75:
            s.append("SUBJECT_RELATIVE_STRENGTH")
        if s:
            subject_signals.append({
                "subject": item["subject"],
                "signals": s,
                "evidence_strength": item["evidence_strength"]
            })

    topic_signals = []
    for item in profile["topics"]:
        s = []
        if item["attempted"] >= 3 and item["accuracy"] < 60:
            s.append("TOPIC_ACCURACY_GAP")
        if item["questions"] >= 3 and item["attempt_rate"] < 60:
            s.append("TOPIC_COVERAGE_GAP")
        if item["attempted"] >= 3 and item["accuracy"] >= 75:
            s.append("TOPIC_RELATIVE_STRENGTH")
        if s:
            topic_signals.append({
                "subject": item["subject"],
                "topic": item["topic"],
                "signals": s,
                "evidence_strength": item["evidence_strength"]
            })

    error_signals = []
    for error_type, data in profile["error_profile"].items():
        if data["count"] >= 3:
            error_signals.append({"type": error_type, **data})
    error_signals.sort(key=lambda x: (-x["count"], x["type"]))

    unattempted_signals = []
    for item in profile["subjects"]:
        if item["questions"] >= 5 and item["unattempted"] > 0:
            unattempted_share = round(item["unattempted"] / item["questions"] * 100, 1)
            if unattempted_share >= 40:
                unattempted_signals.append({
                    "subject": item["subject"],
                    "unattempted": item["unattempted"],
                    "questions": item["questions"],
                    "unattempted_share": unattempted_share
                })

    return {
        "overall_signals": signals,
        "subject_signals": subject_signals,
        "topic_signals": topic_signals,
        "error_signals": error_signals,
        "unattempted_signals": unattempted_signals
    }


def _candidate_score(severity, exposure, evidence):
    evidence_weight = {"low": 0.5, "moderate": 0.8, "strong": 1.0}.get(evidence, 0.5)
    return round(float(severity) * float(exposure) * evidence_weight, 4)


def build_priority_engine(profile, diagnostics):
    """Convert diagnostic signals into a maximum of three actionable priorities."""
    candidates = []
    overall = profile["overall"]

    # Overall attempt behaviour has the widest exposure, so it is considered first.
    if any(x["signal"] == "HIGH_ATTEMPT_LOW_ACCURACY" for x in diagnostics["overall_signals"]):
        candidates.append({
            "category": "ATTEMPT_BEHAVIOUR", "name": "Attempt Selection & Accuracy",
            "reason": {"attempt_rate": overall["attempt_rate"], "accuracy": overall["accuracy"]},
            "supporting_signals": ["HIGH_ATTEMPT_LOW_ACCURACY"],
            "evidence_strength": "strong", "recommended_intervention": "Attempt-selection and elimination drill",
            "score": _candidate_score(2, 1.0, "strong")
        })
    elif any(x["signal"] == "LOW_ATTEMPT_COVERAGE" for x in diagnostics["overall_signals"]):
        candidates.append({
            "category": "ATTEMPT_BEHAVIOUR", "name": "Attempt Coverage",
            "reason": {"attempt_rate": overall["attempt_rate"], "accuracy": overall["accuracy"]},
            "supporting_signals": ["LOW_ATTEMPT_COVERAGE"],
            "evidence_strength": "strong", "recommended_intervention": "Controlled attempt-coverage drill",
            "score": _candidate_score(2, 1.0, "strong")
        })
    elif any(x["signal"] == "LOW_ATTEMPT_LOW_ACCURACY" for x in diagnostics["overall_signals"]):
        candidates.append({
            "category": "ATTEMPT_BEHAVIOUR", "name": "Coverage + Accuracy",
            "reason": {"attempt_rate": overall["attempt_rate"], "accuracy": overall["accuracy"]},
            "supporting_signals": ["LOW_ATTEMPT_LOW_ACCURACY"],
            "evidence_strength": "strong", "recommended_intervention": "Foundation review followed by controlled attempt drills",
            "score": _candidate_score(2, 1.0, "strong")
        })

    subject_map = {x["subject"]: x for x in profile["subjects"]}
    selected_subjects = set()
    for signal in diagnostics["subject_signals"]:
        item = subject_map.get(signal["subject"])
        if not item or "SUBJECT_RELATIVE_STRENGTH" in signal["signals"] and len(signal["signals"]) == 1:
            continue
        severity = 2 if "SUBJECT_ACCURACY_GAP" in signal["signals"] else 1
        exposure = item["questions"] / max(profile["mock"]["total_questions"], 1)
        candidates.append({
            "category": "SUBJECT", "name": item["subject"],
            "reason": {k: item[k] for k in ["questions", "attempted", "incorrect", "unattempted", "attempt_rate", "accuracy"]},
            "supporting_signals": signal["signals"],
            "evidence_strength": item["evidence_strength"],
            "recommended_intervention": "Targeted concept/revision/PYQ work based on the dominant error pattern",
            "score": _candidate_score(severity, exposure, item["evidence_strength"])
        })

    topic_map = { (x["subject"], x["topic"]): x for x in profile["topics"] }
    for signal in diagnostics["topic_signals"]:
        item = topic_map.get((signal["subject"], signal["topic"]))
        if not item or ("TOPIC_RELATIVE_STRENGTH" in signal["signals"] and len(signal["signals"]) == 1):
            continue
        severity = 2 if "TOPIC_ACCURACY_GAP" in signal["signals"] else 1
        exposure = item["questions"] / max(profile["mock"]["total_questions"], 1)
        candidates.append({
            "category": "TOPIC", "name": item["topic"], "subject": item["subject"],
            "reason": {k: item[k] for k in ["questions", "attempted", "incorrect", "unattempted", "attempt_rate", "accuracy"]},
            "supporting_signals": signal["signals"],
            "evidence_strength": item["evidence_strength"],
            "recommended_intervention": "Focused topic revision followed by targeted PYQ drill",
            "score": _candidate_score(severity, exposure, item["evidence_strength"])
        })

    if diagnostics["error_signals"]:
        top = diagnostics["error_signals"][0]
        if top["percentage_of_incorrect"] >= 35:
            intervention = {
                "Conceptual Gap": "Concept rebuilding + targeted PYQ practice",
                "Lack of Revision": "Active recall + focused revision drill",
                "Analytical Error": "Reasoning/elimination drill + targeted PYQs"
            }.get(top["type"], "Review the associated incorrect questions")
            candidates.append({
                "category": "ERROR_TYPE", "name": top["type"],
                "reason": {"count": top["count"], "percentage_of_incorrect": top["percentage_of_incorrect"]},
                "supporting_signals": ["DOMINANT_ERROR_TYPE"],
                "evidence_strength": "strong" if top["count"] >= 8 else "moderate",
                "recommended_intervention": intervention,
                "score": _candidate_score(2, top["percentage_of_incorrect"] / 100, "strong" if top["count"] >= 8 else "moderate")
            })

    # Sort by internal score only. Never expose this score to the student.
    candidates.sort(key=lambda x: (-x["score"], x["category"], x["name"]))

    priorities = []
    used_subjects = set()
    for candidate in candidates:
        if len(priorities) >= 3:
            break
        if candidate["category"] == "SUBJECT":
            used_subjects.add(candidate["name"])
        if candidate["category"] == "TOPIC" and candidate.get("subject") in used_subjects:
            continue
        if candidate["category"] == "ERROR_TYPE" and any(p["category"] == "SUBJECT" and p["reason"].get("accuracy", 101) < 60 for p in priorities):
            continue
        candidate = {k: v for k, v in candidate.items() if k != "score"}
        candidate["priority"] = len(priorities) + 1
        priorities.append(candidate)

    maintain = []
    for item in sorted(profile["subjects"], key=lambda x: (-x["accuracy"], x["subject"])):
        if item["attempted"] >= 3 and item["accuracy"] >= 75:
            maintain.append({
                "subject": item["subject"],
                "accuracy": item["accuracy"],
                "attempt_rate": item["attempt_rate"],
                "evidence_strength": item["evidence_strength"]
            })
        if len(maintain) >= 3:
            break

    return {"priorities": priorities, "maintain": maintain}


DP_STRATEGIC_ROADMAP_PROMPT = """
You are the Defence Pathshala Strategic Roadmap Engine.

Transform the supplied deterministic mock-performance data into a concise,
student-facing strategic roadmap.

SOURCE OF TRUTH:
- Use ONLY the supplied JSON.
- Do not invent statistics, weaknesses, causes, history, trends, resources,
  study durations, PYQ patterns, or previous performance.
- This is a SINGLE-MOCK analysis. Never imply longitudinal knowledge.
- Do not create, reorder, or remove priorities. The Priority Engine has already
  selected them.
- Do not calculate or alter numbers. Preserve supplied values exactly.
- Do not assume why an unattempted question was skipped.
- Low evidence means the signal is limited; phrase it cautiously.
- Do not add motivational filler.

Your job is to explain the supplied priorities and turn them into practical
next actions.

Return ONLY Markdown using exactly this structure:

# 🎯 Strategic Roadmap

## Performance Snapshot
[2 concise sentences based only on the overall data]

## Your Focus
### 1. [Priority name]
**What:** ...
**Why:** ...
**Do:** ...

### 2. [Priority name]
**What:** ...
**Why:** ...
**Do:** ...

### 3. [Priority name]
**What:** ...
**Why:** ...
**Do:** ...

## ✓ Maintain
[1-3 concise bullets. If no maintain areas are supplied, write "No area has enough evidence to be listed as a maintain area in this attempt."]

## → Your Next Move
[One concrete immediate action derived from Priority 1.]

## ↻ Reassess
[One concise way to reassess the identified priority using a targeted PYQ/practice set.]

If fewer than three priorities are supplied, omit the unused priority sections.
"""


def generate_strategic_roadmap(profile, diagnostics, priority_output):
    """Call Groq for language generation; return a deterministic fallback on failure."""
    payload = {
        "performance_profile": profile,
        "diagnostics": diagnostics,
        "priority_engine": priority_output
    }
    fallback = build_rule_based_roadmap(profile, priority_output)
    try:
        client = Groq(api_key=st.secrets["GROQ_API_KEY"])
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {"role": "system", "content": DP_STRATEGIC_ROADMAP_PROMPT},
                {"role": "user", "content": json.dumps(payload, ensure_ascii=False)}
            ],
            temperature=0.2
        )
        text = response.choices[0].message.content
        return text.strip() if text and text.strip() else fallback
    except Exception:
        return fallback


def build_rule_based_roadmap(profile, priority_output):
    """Deterministic fallback so roadmap functionality survives Groq outages."""
    overall = profile["overall"]
    lines = [
        "# 🎯 Strategic Roadmap",
        "",
        "## Performance Snapshot",
        f"You attempted {overall['attempted']} of {overall['mock_total'] if 'mock_total' in overall else profile['mock']['total_questions']} questions ({overall['attempt_rate']}%) with {overall['accuracy']}% accuracy.",
        f"This roadmap is based only on this {profile['mock']['exam']} mock attempt.",
        "",
        "## Your Focus"
    ]
    for p in priority_output["priorities"]:
        reason = p.get("reason", {})
        evidence = p.get("evidence_strength", "moderate")
        if p["category"] == "SUBJECT":
            why = f"{reason.get('attempted', 0)} of {reason.get('questions', 0)} questions were attempted, with {reason.get('accuracy', 0)}% accuracy."
        elif p["category"] == "TOPIC":
            why = f"{reason.get('attempted', 0)} of {reason.get('questions', 0)} questions were attempted, with {reason.get('accuracy', 0)}% accuracy."
        elif p["category"] == "ERROR_TYPE":
            why = f"{reason.get('count', 0)} incorrect responses ({reason.get('percentage_of_incorrect', 0)}% of incorrect answers) were classified this way."
        else:
            why = f"Attempt rate was {reason.get('attempt_rate', 0)}% and accuracy was {reason.get('accuracy', 0)}%."
        if evidence == "low":
            why += " Current evidence is limited."
        lines += [
            f"### {p['priority']}. {p['name']}",
            f"**What:** Address this area before moving on to lower-priority signals.",
            f"**Why:** {why}",
            f"**Do:** {p.get('recommended_intervention', 'Review the relevant incorrect and unattempted questions and practise the same area again.')}",
            ""
        ]
    lines += ["## ✓ Maintain"]
    if priority_output["maintain"]:
        for item in priority_output["maintain"]:
            lines.append(f"- {item['subject']}: {item['accuracy']}% accuracy in this attempt; maintain through regular mixed practice.")
    else:
        lines.append("No area has enough evidence to be listed as a maintain area in this attempt.")
    if priority_output["priorities"]:
        first = priority_output["priorities"][0]
        lines += ["", "## → Your Next Move", f"Start with **{first['name']}**: {first.get('recommended_intervention', 'review the supporting questions and practise the identified area') }.", "", "## ↻ Reassess", "Use a focused PYQ/practice set covering the identified area and compare the new attempt rate and accuracy with this mock."]
    return "\n".join(lines)


def render_strategic_roadmap(analysis_df, exam, year, cycle, attempt_type="Full Paper"):
    """Render the V1 Strategic Roadmap and cache the Groq result per mock."""
    profile = build_performance_profile(analysis_df, exam, year, cycle, attempt_type)
    diagnostics = diagnose_performance(profile)
    priority_output = build_priority_engine(profile, diagnostics)

    signature_payload = {
        "mock": profile["mock"],
        "overall": profile["overall"],
        "priorities": priority_output["priorities"],
        "maintain": priority_output["maintain"]
    }
    signature = json.dumps(signature_payload, sort_keys=True, default=str)
    cache = st.session_state.setdefault("strategic_roadmap_cache", {})

    if signature not in cache:
        with st.spinner("🧠 Building your strategic roadmap..."):
            cache[signature] = generate_strategic_roadmap(profile, diagnostics, priority_output)

    st.markdown(cache[signature])

def start_full_paper():
    """Starts a clean, timed full-paper attempt."""
    reset_test_state()
    st.session_state['exam_started'] = True
    st.session_state['start_time'] = time.time()


def change_mock_page(delta):
    """Changes the active mock page and requests one browser-side scroll."""
    st.session_state['current_page'] = max(0, st.session_state['current_page'] + delta)
    st.session_state['scroll_trigger'] = True


def submit_mock():
    """The only manual transition from an active mock to submitted state."""
    st.session_state['exam_submitted'] = True
    st.session_state['scroll_trigger'] = True


def show_revision_notes():
    st.session_state['show_revision_notes'] = True


def hide_revision_notes():
    st.session_state['show_revision_notes'] = False


def go_back_to_pre_test():
    """Leaves results without retaining the completed full-paper attempt."""
    reset_test_state()
    st.session_state['full_paper_active'] = False


def go_home():
    """Returns to the initial selection view and clears test-specific state."""
    reset_test_state()
    st.session_state['full_paper_active'] = False
    st.session_state.pop('subject_selection', None)
    st.session_state.pop('difficulty_selection', None)


def reset_for_exam_change():
    """Resets a test and removes dependent selection widget values."""
    reset_test_state()
    st.session_state.pop('year_selection', None)
    st.session_state.pop('cycle_selection', None)


def reset_for_year_change():
    """Resets a test and removes the cycle selection for the new year."""
    reset_test_state()
    st.session_state.pop('cycle_selection', None)


# ==========================================
# --- DATA FETCHING & SESSION LOCKING ---
# ==========================================
def fetch_google_sheet():
    sheet_id = "1bufEL9Fe-JtQLI8kSvdsI8T-4dSdiqaVBA-5pnoFuVY"
    sheet_url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=csv&gid=0"
    
    try:
        response = requests.get(sheet_url, timeout=10)
        
        if response.status_code != 200:
            st.error(f"HTTP Error {response.status_code}: Cannot access Google Sheet.")
            st.stop()
            
        if "<html" in response.text[:20].lower():
            st.error("Access Denied: Google is redirecting to a login page. Please ensure your Google Sheet sharing settings are set to 'Anyone with the link' (Viewer).")
            st.stop()
            
        # Google Sheets returns UTF-8 CSV without always declaring a charset.
        # Parsing raw bytes with utf-8-sig avoids Requests' ISO-8859-1 fallback,
        # which corrupts multi-byte characters such as an en dash.
        return pd.read_csv(io.BytesIO(response.content), encoding='utf-8-sig')
        
    except Exception as e:
        st.error(f"Failed to fetch database: {str(e)}")
        st.stop()

# Lock the data to the user's browser session on their first load
if 'master_db' not in st.session_state:
    with st.spinner("Downloading Tactical Database..."):
        st.session_state['master_db'] = fetch_google_sheet()

df = st.session_state['master_db'].copy()

# ==========================================
# --- DIFFICULTY DATA NORMALIZATION ---
# ==========================================
# IMPORTANT: difficulty_category (database property AC) is the source of truth
# for the dashboard's difficulty distribution. Do NOT derive/overwrite it from
# difficulty_score; the category stored in the PYQ database must be reflected
# exactly in the UI. Only harmless whitespace/casing cleanup is applied.
if 'difficulty_score' in df.columns:
    df['difficulty_score'] = pd.to_numeric(df['difficulty_score'], errors='coerce')

if 'difficulty_category' in df.columns:
    df['difficulty_category'] = (
        df['difficulty_category']
        .astype('string')
        .str.strip()
        .str.replace(r'\s+', ' ', regex=True)
        .replace({'': pd.NA, 'nan': pd.NA, 'None': pd.NA, 'NaN': pd.NA})
    )

# ==========================================
# --- SESSION STATE INITIALIZATION ---
# ==========================================
if 'user_answers' not in st.session_state:
    st.session_state['user_answers'] = {}
if 'checked_questions' not in st.session_state:
    st.session_state['checked_questions'] = set()
if 'error_tags' not in st.session_state:
    st.session_state['error_tags'] = {}
if 'marked_for_review' not in st.session_state:
    st.session_state['marked_for_review'] = set()
if 'exam_submitted' not in st.session_state:
    st.session_state['exam_submitted'] = False
if 'exam_started' not in st.session_state:
    st.session_state['exam_started'] = False
if 'start_time' not in st.session_state:
    st.session_state['start_time'] = None
if 'time_limit_seconds' not in st.session_state:
    st.session_state['time_limit_seconds'] = 7200
if 'auto_submitted' not in st.session_state:
    st.session_state['auto_submitted'] = False
if 'current_page' not in st.session_state:
    st.session_state['current_page'] = 0
if 'is_full_paper' not in st.session_state:
    st.session_state['is_full_paper'] = False
if 'scroll_trigger' not in st.session_state:
    st.session_state['scroll_trigger'] = False
if 'test_run_id' not in st.session_state:
    st.session_state['test_run_id'] = 0
if 'review_selected_qid' not in st.session_state:
    st.session_state['review_selected_qid'] = None
if 'show_revision_notes' not in st.session_state:
    st.session_state['show_revision_notes'] = False
if 'full_paper_active' not in st.session_state:
    st.session_state['full_paper_active'] = False
if 'full_paper_exam' not in st.session_state:
    st.session_state['full_paper_exam'] = None
if 'full_paper_year' not in st.session_state:
    st.session_state['full_paper_year'] = None
if 'full_paper_cycle' not in st.session_state:
    st.session_state['full_paper_cycle'] = ''
if 'practice_filters_applied' not in st.session_state:
    st.session_state['practice_filters_applied'] = False
if 'practice_filter_signature' not in st.session_state:
    st.session_state['practice_filter_signature'] = None

# ==========================================
# --- HERO SECTION ---
# ==========================================
st.markdown(f"""
<div style="
    background:{background_css};
    background-size:100% 100%;
    background-position:center;
    background-repeat:no-repeat;
    background-color:#4B5320;
    padding:50px 20px;
    border-radius:12px;
    text-align:center;
    margin-bottom:15px;
    box-shadow:0 6px 15px rgba(0,0,0,0.5);
    display:block !important;
    visibility:visible !important;
    opacity:1 !important;
">
    <div style="
        font-family:'Black Ops One','Impact','Arial Black',sans-serif;
        font-weight:400;
        font-size:2.8rem;
        line-height:1.2;
        color:#FFFFFF;
        letter-spacing:2px;
        text-transform:uppercase;
        text-shadow:2px 2px 4px rgba(0,0,0,0.65);
    ">DEFENCE PATHSHALA</div>
    <div style="
        font-family:'Inter','Segoe UI',sans-serif;
        font-size:1.15rem;
        color:#FFFFFF;
        margin-top:8px;
        font-weight:800;
        letter-spacing:1.5px;
        text-transform:uppercase;
        text-shadow:1px 1px 3px rgba(0,0,0,0.65);
    ">PYQ INTELLIGENCE ENGINE</div>
</div>

<div style="
    background:#F8FAFC;
    border-left:5px solid #F59E0B;
    padding:14px;
    border-radius:6px;
    font-size:0.95rem;
    text-align:center;
    margin:20px auto;
    font-weight:700;
    color:#0F172A;
    box-shadow:0 2px 4px rgba(0,0,0,0.02);
">🧠 Built by:     UPSC CAPF AC AIR 163 &nbsp;|&nbsp; IIT Kanpur Graduate &nbsp;|&nbsp; Qualified CDS-AFA 4 times</div>

<div class="dash-intro">Transform raw PYQs into a tactical, data-driven preparation engine. Stop passive reading and start actively eliminating. This intelligence dashboard analyzes your performance patterns, isolates specific examiner traps, and dynamically builds a personalized syllabus roadmap to maximize your final score.</div>
""", unsafe_allow_html=True)

# ==========================================
# --- EXAM, YEAR, & CYCLE SELECTION ---
# ==========================================

# Clean dataframe columns to prevent hidden space bugs
for _col in ("exam", "year", "cycle"):
    if _col in df.columns:
        df[_col] = df[_col].astype(str).str.strip()

# ==========================================
# --- IMMERSIVE MODE (HIDE UI) LOGIC ---
# ==========================================
is_active_full_mock = st.session_state.get("exam_started", False)
full_paper = st.session_state.get("full_paper_active", False)

# Runtime defaults. These are deliberately separate from Database Overview.
selected_exam = st.session_state.get("full_paper_exam", "CAPF-AC")
selected_year = st.session_state.get("full_paper_year", "2025")
selected_cycle = st.session_state.get("full_paper_cycle", "")

if not is_active_full_mock:
    # ==========================================
    # --- DATABASE OVERVIEW ---
    # ==========================================
    st.markdown("### 📊 Database Overview")
    st.markdown(
        "<div class='overview-filter-panel'>"
        "<div class='overview-filter-kicker'>DATABASE SCOPE</div>"
        "<div class='overview-filter-subtitle'>Choose the PYQ universe to analyse</div>"
        "</div>",
        unsafe_allow_html=True
    )

    overview_exam_options = sorted(
        df["exam"].dropna().astype(str).str.strip().unique().tolist()
    ) if "exam" in df.columns else []

    filter_col1, filter_col2, filter_col3 = st.columns(
        [1.35, 1.0, 0.95],
        gap="small",
        vertical_alignment="bottom"
    )

    with filter_col1:
        overview_exams = st.multiselect(
            "Exam(s)",
            options=overview_exam_options,
            key="overview_exam_selection",
            placeholder="Select exam(s)",
            help="Select one or more exams to analyse."
        )

    if overview_exams:
        overview_year_source = df[
            df["exam"].isin(overview_exams)
        ].copy()

        overview_year_options = sorted(
            overview_year_source["year"]
            .dropna()
            .astype(str)
            .str.strip()
            .unique()
            .tolist()
        ) if "year" in overview_year_source.columns else []
    else:
        overview_year_options = []

    valid_overview_years = [
        year for year in st.session_state.get(
            "overview_year_selection", []
        )
        if year in overview_year_options
    ]

    with filter_col2:
        overview_years = st.multiselect(
            "Year(s)",
            options=overview_year_options,
            default=valid_overview_years,
            key="overview_year_selection",
            placeholder=(
                "Select year(s)"
                if overview_exams
                else "Select exam(s) first"
            ),
            disabled=not bool(overview_exams),
            help="Leave empty to include all years for the selected exam(s)."
        )

    if overview_exams and "CDS" in overview_exams and "cycle" in df.columns:
        overview_cycle_source = df[
            df["exam"].eq("CDS")
        ].copy()

        if overview_years:
            overview_cycle_source = overview_cycle_source[
                overview_cycle_source["year"].isin(overview_years)
            ]

        overview_cycle_options = sorted(
            overview_cycle_source["cycle"]
            .dropna()
            .astype(str)
            .str.strip()
            .unique()
            .tolist()
        )
    else:
        overview_cycle_options = []

    valid_overview_cycles = [
        cycle for cycle in st.session_state.get(
            "overview_cycle_selection", []
        )
        if cycle in overview_cycle_options
    ]

    with filter_col3:
        overview_cycles = st.multiselect(
            "CDS Cycle(s)",
            options=overview_cycle_options,
            default=valid_overview_cycles,
            key="overview_cycle_selection",
            placeholder=(
                "Select cycle(s)"
                if overview_cycle_options
                else "Not applicable"
            ),
            disabled=not bool(overview_cycle_options),
            help="Leave empty to include all CDS cycles."
        )

    st.caption(
        "Select one or more exams. Year and CDS Cycle are optional."
    )

    # No exam selected means no overview data is displayed.
    overview_df = df.copy()

    if not overview_exams:
        overview_df = overview_df.iloc[0:0]
    else:
        overview_df = overview_df[
            overview_df["exam"].isin(overview_exams)
        ]

        # Empty year selection means all years.
        if overview_years:
            overview_df = overview_df[
                overview_df["year"].isin(overview_years)
            ]

        # Apply cycle filtering only to CDS rows.
        if overview_cycles and "cycle" in overview_df.columns:
            overview_df = overview_df[
                (overview_df["exam"] != "CDS")
                | (overview_df["cycle"].isin(overview_cycles))
            ]

    if overview_df.empty:
        st.info(
            "👆 Select one or more exams above to view the database overview. "
            "Year and CDS Cycle filters are optional."
        )
    else:
        m1, m2 = st.columns(2)
        m1.metric("Total Questions", len(overview_df))

        dataset_columns = ["exam", "year"]
        if "cycle" in overview_df.columns:
            dataset_columns.append("cycle")

        m2.metric(
            "Datasets Included",
            overview_df[dataset_columns].drop_duplicates().shape[0]
        )

        # ------------------------------------------
        # SUBJECT CHART
        # ------------------------------------------
        with c1:
            if "subject" in overview_df.columns:
                subject_chart = (
                    overview_df["subject"]
                    .fillna("Unclassified")
                    .astype(str).str.strip()
                    .replace({"": "Unclassified", "nan": "Unclassified"})
                    .value_counts()
                    .sort_values(ascending=True)
                    .rename_axis("Subject")
                    .reset_index(name="Questions")
                )

                fig_sub = px.bar(
                    subject_chart,
                    x="Questions",
                    y="Subject",
                    orientation="h",
                    title="Questions by Subject",
                    text="Questions"
                )
                fig_sub.update_traces(
                    textposition="outside",
                    cliponaxis=False,
                    hovertemplate="%{y}: %{x} Questions<extra></extra>"
                )
                fig_sub.update_layout(
                    showlegend=False,
                    dragmode=False,
                    margin=dict(t=55, b=25, l=10, r=45),
                    xaxis_title="Questions",
                    yaxis_title="",
                    height=320
                )
                fig_sub.update_xaxes(fixedrange=True)
                fig_sub.update_yaxes(fixedrange=True)
                st.plotly_chart(
                    fig_sub,
                    use_container_width=True,
                    config=chart_config,
                    key="database_overview_subject_chart"
                )

        # ------------------------------------------
        # PATTERN CHART
        # ------------------------------------------
        with c2:
            if "q_pattern" in overview_df.columns:
                pattern_chart = (
                    overview_df["q_pattern"]
                    .fillna("Unclassified")
                    .astype(str).str.strip()
                    .replace({"": "Unclassified", "nan": "Unclassified"})
                    .value_counts()
                    .sort_values(ascending=True)
                    .rename_axis("Pattern")
                    .reset_index(name="Questions")
                )

                fig_pattern = px.bar(
                    pattern_chart,
                    x="Questions",
                    y="Pattern",
                    orientation="h",
                    title="Questions by Pattern",
                    text="Questions"
                )
                fig_pattern.update_traces(
                    textposition="outside",
                    cliponaxis=False,
                    hovertemplate="%{y}: %{x} Questions<extra></extra>"
                )
                fig_pattern.update_layout(
                    showlegend=False,
                    dragmode=False,
                    margin=dict(t=55, b=25, l=10, r=45),
                    xaxis_title="Questions",
                    yaxis_title="",
                    height=320
                )
                fig_pattern.update_xaxes(fixedrange=True)
                fig_pattern.update_yaxes(fixedrange=True)
                st.plotly_chart(
                    fig_pattern,
                    use_container_width=True,
                    config=chart_config,
                    key="database_overview_pattern_chart"
                )

        # ------------------------------------------
        # DIFFICULTY — PROPERTY AC IS AUTHORITATIVE
        # ------------------------------------------
        with c3:
            if "difficulty_category" in overview_df.columns:
                difficulty_order = ["Easy", "Moderate", "Hard", "Very Hard"]
                diff_series = (
                    overview_df["difficulty_category"]
                    .astype("string")
                    .str.strip()
                    .str.replace(r"\s+", " ", regex=True)
                    .fillna("Unclassified")
                )
                diff_counts = diff_series.value_counts(dropna=False)
                ordered_labels = [x for x in difficulty_order if x in diff_counts.index]
                ordered_labels += [x for x in diff_counts.index if x not in ordered_labels]

                diff_chart_df = pd.DataFrame({
                    "Difficulty": ordered_labels,
                    "Questions": [int(diff_counts[x]) for x in ordered_labels]
                })

                if not diff_chart_df.empty:
                    fig_diff = px.pie(
                        diff_chart_df,
                        names="Difficulty",
                        values="Questions",
                        hole=0.58,
                        title="Difficulty Distribution"
                    )
                    fig_diff.update_traces(
                        textposition="inside",
                        texttemplate="%{label}<br>%{value}",
                        hovertemplate="%{label}: %{value} Questions (%{percent})<extra></extra>"
                    )
                    fig_diff.update_layout(
                        showlegend=False,
                        dragmode=False,
                        margin=dict(t=55, b=25, l=10, r=10),
                        height=320,
                        annotations=[dict(
                            text=f"{len(overview_df)}<br>Questions",
                            x=0.5, y=0.5,
                            font_size=12,
                            showarrow=False
                        )]
                    )
                    st.plotly_chart(
                        fig_diff,
                        use_container_width=True,
                        config=chart_config,
                        key="database_overview_difficulty_chart"
                    )

    st.markdown("---")

    # ==========================================
    # --- CONFIGURE MOCKS ---
    # ==========================================
    with st.expander("⚙️ Configure Mocks", expanded=True):

        # ==========================================
        # --- ATTEMPT FULL PAPER ---
        # ==========================================
        st.markdown("### ⏱️ Attempt Full Paper")
        st.caption("Select exactly one authentic paper and attempt it under timed conditions.")

        full_paper_exam_options = sorted(
            df["exam"].dropna().astype(str).str.strip().unique().tolist()
        ) if "exam" in df.columns else []

        current_full_exam = st.session_state.get("full_paper_exam_selection")
        if current_full_exam not in full_paper_exam_options:
            current_full_exam = full_paper_exam_options[0] if full_paper_exam_options else None

        full_paper_exam = st.selectbox(
            "Exam",
            options=full_paper_exam_options,
            index=(full_paper_exam_options.index(current_full_exam) if current_full_exam else 0),
            key="full_paper_exam_selection"
        )

        full_paper_year_options = sorted(
            df.loc[df["exam"].eq(full_paper_exam), "year"]
            .dropna().astype(str).str.strip().unique().tolist()
        ) if full_paper_exam and "year" in df.columns else []

        current_full_year = st.session_state.get("full_paper_year_selection")
        if current_full_year not in full_paper_year_options:
            current_full_year = full_paper_year_options[0] if full_paper_year_options else None

        full_paper_year = st.selectbox(
            "Year",
            options=full_paper_year_options,
            index=(full_paper_year_options.index(current_full_year) if current_full_year else 0),
            key="full_paper_year_selection"
        )

        full_paper_cycle = ""
        full_paper_cycle_options = []

        if full_paper_exam == "CDS" and "cycle" in df.columns:
            full_paper_cycle_options = sorted(
                df.loc[
                    df["exam"].eq("CDS") & df["year"].eq(full_paper_year),
                    "cycle"
                ].dropna().astype(str).str.strip().unique().tolist()
            )

            current_full_cycle = st.session_state.get("full_paper_cycle_selection")
            if current_full_cycle not in full_paper_cycle_options:
                current_full_cycle = full_paper_cycle_options[0] if full_paper_cycle_options else None

            if full_paper_cycle_options:
                full_paper_cycle = st.selectbox(
                    "Cycle",
                    options=full_paper_cycle_options,
                    index=full_paper_cycle_options.index(current_full_cycle),
                    key="full_paper_cycle_selection"
                )
            else:
                st.session_state["full_paper_cycle_selection"] = ""
        else:
            st.session_state["full_paper_cycle_selection"] = ""

        full_paper_df = df[
            (df["exam"] == full_paper_exam)
            & (df["year"] == full_paper_year)
        ].copy()

        if (
            full_paper_exam == "CDS"
            and full_paper_cycle
            and "cycle" in full_paper_df.columns
        ):
            full_paper_df = full_paper_df[
                full_paper_df["cycle"] == full_paper_cycle
            ].copy()

        paper_label = (
            f"{full_paper_exam} {full_paper_year}"
            + (f" {full_paper_cycle}" if full_paper_exam == "CDS" and full_paper_cycle else "")
        )

        st.info(
            f"Selected paper: **{paper_label}** · **{len(full_paper_df)} questions**"
        )

        if st.button(
            "🚀 Start Full Paper",
            type="primary",
            use_container_width=True,
            key="start_selected_full_paper"
        ):
            if full_paper_df.empty:
                st.error("No questions found for the selected paper.")
            else:
                reset_test_state()
                st.session_state["full_paper_active"] = True
                st.session_state["full_paper_exam"] = full_paper_exam
                st.session_state["full_paper_year"] = full_paper_year
                st.session_state["full_paper_cycle"] = full_paper_cycle
                st.session_state["exam_started"] = True
                st.session_state["exam_submitted"] = False
                st.session_state["start_time"] = time.time()
                st.rerun()

        st.markdown(
            "<div style='text-align:center; color:#64748B; font-weight:800; margin:20px 0 8px;'>OR</div>",
            unsafe_allow_html=True
        )

        # ==========================================
        # --- PRACTICE SET ---
        # ==========================================
        st.markdown("#### FILTER PRACTICE SET")
        st.caption(
            "Build a custom PYQ practice set across subjects, topics, exams, years, cycles and difficulty. "
            "Questions appear only after you click Let's Go."
        )

        def mark_practice_filters_dirty():
            """Hide the previously generated set when a filter changes."""
            st.session_state["practice_filters_applied"] = False
            st.session_state["practice_filter_signature"] = None

        st.markdown(
            "<div class='filter-panel'>"
            "<div class='filter-panel-title'>🎯 Build Your Practice Set</div>"
            "<div class='filter-panel-subtitle'>"
            "Query the PYQ database by exam, year, cycle, subject, topic and difficulty. "
            "Your questions will appear only after you click <strong>Let's Go</strong>."
            "</div></div>",
            unsafe_allow_html=True
        )

        practice_col1, practice_col2 = st.columns(2, gap="medium")

        with practice_col1:
            practice_exam_options = sorted(
                df["exam"].dropna().astype(str).str.strip().replace("", pd.NA).dropna().unique().tolist()
            ) if "exam" in df.columns else []
            practice_exam_selection = st.multiselect(
                "Select Exam(s)",
                options=practice_exam_options,
                default=st.session_state.get("practice_exam_selection", []),
                key="practice_exam_selection",
                help="Leave empty to include questions from every exam in the database.",
                on_change=mark_practice_filters_dirty
            )

        with practice_col2:
            practice_year_options = sorted(
                df["year"].dropna().astype(str).str.strip().replace("", pd.NA).dropna().unique().tolist()
            ) if "year" in df.columns else []
            practice_year_selection = st.multiselect(
                "Select Year(s)",
                options=practice_year_options,
                default=st.session_state.get("practice_year_selection", []),
                key="practice_year_selection",
                help="Leave empty to include questions from every year.",
                on_change=mark_practice_filters_dirty
            )

        practice_col3, practice_col4 = st.columns(2, gap="medium")
        show_practice_cycle = "CDS" in practice_exam_selection

        with practice_col3:
            if show_practice_cycle and "cycle" in df.columns:
                cycle_source = df[df["exam"].eq("CDS")].copy()
                if practice_year_selection:
                    cycle_source = cycle_source[cycle_source["year"].isin(practice_year_selection)]
                cycle_series = (
                    cycle_source["cycle"].astype("string").str.strip()
                    .replace({"": pd.NA, "nan": pd.NA, "None": pd.NA})
                )
                practice_cycle_values = sorted(cycle_series.dropna().unique().tolist())
                if cycle_series.isna().any():
                    practice_cycle_values.append("N/A")
                valid_previous_cycles = [
                    x for x in st.session_state.get("practice_cycle_selection", [])
                    if x in practice_cycle_values
                ]
                practice_cycle_selection = st.multiselect(
                    "Select Cycle(s)",
                    options=practice_cycle_values,
                    default=valid_previous_cycles,
                    key="practice_cycle_selection",
                    help="CDS cycles only. Leave empty to include every selected CDS cycle.",
                    on_change=mark_practice_filters_dirty
                )
            else:
                st.session_state["practice_cycle_selection"] = []
                practice_cycle_selection = []

        with practice_col4:
            practice_subject_options = sorted(
                df["subject"].dropna().astype(str).str.strip().replace("", pd.NA).dropna().unique().tolist()
            ) if "subject" in df.columns else []
            practice_subject_selection = st.multiselect(
                "Select Subject(s)",
                options=practice_subject_options,
                default=st.session_state.get("practice_subject_selection", []),
                key="practice_subject_selection",
                help="Example: select Polity to practice Polity PYQs across multiple exams.",
                on_change=mark_practice_filters_dirty
            )

        if "topic" in df.columns:
            topic_source = df.copy()
            if practice_subject_selection and "subject" in topic_source.columns:
                topic_source = topic_source[
                    topic_source["subject"].astype(str).str.strip().isin(practice_subject_selection)
                ]
            practice_topic_series = (
                topic_source["topic"].astype("string").str.strip()
                .replace({"": pd.NA, "nan": pd.NA, "None": pd.NA})
            )
            practice_topic_options = sorted(practice_topic_series.dropna().unique().tolist())
        else:
            practice_topic_options = []

        valid_previous_topics = [
            x for x in st.session_state.get("practice_topic_selection", [])
            if x in practice_topic_options
        ]
        practice_topic_selection = st.multiselect(
            "Select Topic(s)",
            options=practice_topic_options,
            default=valid_previous_topics,
            key="practice_topic_selection",
            help="Leave empty for all topics. Select a subject first to see only its topics.",
            on_change=mark_practice_filters_dirty
        )

        difficulty_order = ["Easy", "Moderate", "Hard", "Very Hard"]
        if "difficulty_category" in df.columns:
            practice_difficulty_values = (
                df["difficulty_category"].astype("string").str.strip()
                .str.replace(r"\s+", " ", regex=True).dropna().unique().tolist()
            )
            available_practice_difficulties = [x for x in difficulty_order if x in practice_difficulty_values]
            available_practice_difficulties += [
                x for x in sorted(practice_difficulty_values) if x not in available_practice_difficulties
            ]
        else:
            available_practice_difficulties = []

        valid_previous_difficulties = [
            x for x in st.session_state.get("practice_difficulty_selection", [])
            if x in available_practice_difficulties
        ]
        practice_difficulty_selection = st.multiselect(
            "Select Difficulty",
            options=available_practice_difficulties,
            default=valid_previous_difficulties,
            key="practice_difficulty_selection",
            help="Leave empty to include every difficulty.",
            on_change=mark_practice_filters_dirty
        )

        st.markdown("<div class='filter-divider'></div>", unsafe_allow_html=True)

        practice_mode = st.radio(
            "Testing Mode",
            [
                "Instant Feedback (Practice one by one)",
                "Full Mock Exam (Submit all at the end)"
            ],
            index=(
                1 if st.session_state.get("practice_testing_mode") == "Full Mock Exam (Submit all at the end)" else 0
            ),
            key="practice_testing_mode",
            horizontal=True,
            on_change=mark_practice_filters_dirty
        )

        st.caption(
            "💡 Example: select **Polity** and leave Exam, Year, Cycle, Topic and Difficulty empty "
            "to practice all available Polity PYQs across the database."
        )

        apply_practice_filters = st.button(
            "🚀 Let's Go",
            type="primary",
            use_container_width=True,
            key="apply_practice_filters"
        )

        if apply_practice_filters:
            practice_signature = (
                tuple(practice_exam_selection),
                tuple(practice_year_selection),
                tuple(practice_cycle_selection),
                tuple(practice_subject_selection),
                tuple(practice_topic_selection),
                tuple(practice_difficulty_selection),
                practice_mode
            )
            reset_test_state()
            st.session_state["practice_filters_applied"] = True
            st.session_state["practice_filter_signature"] = practice_signature
            st.session_state["full_paper_active"] = False
            st.rerun()

        if st.session_state.get("practice_filters_applied", False):
            (
                applied_exams,
                applied_years,
                applied_cycles,
                applied_subjects,
                applied_topics,
                applied_difficulties,
                applied_mode
            ) = st.session_state.get(
                "practice_filter_signature",
                ((), (), (), (), (), (), "Instant Feedback (Practice one by one)")
            )

            filtered_df = df.copy()

            if applied_exams and "exam" in filtered_df.columns:
                filtered_df = filtered_df[filtered_df["exam"].isin(applied_exams)]
            if applied_years and "year" in filtered_df.columns:
                filtered_df = filtered_df[filtered_df["year"].isin(applied_years)]
            if applied_cycles and "cycle" in filtered_df.columns:
                cycle_clean = filtered_df["cycle"].astype("string").str.strip().replace({"": pd.NA, "nan": pd.NA, "None": pd.NA})
                cycle_mask = cycle_clean.isin([x for x in applied_cycles if x != "N/A"])
                if "N/A" in applied_cycles:
                    cycle_mask = cycle_mask | cycle_clean.isna()
                filtered_df = filtered_df[cycle_mask]
            if applied_subjects and "subject" in filtered_df.columns:
                filtered_df = filtered_df[filtered_df["subject"].isin(applied_subjects)]
            if applied_topics and "topic" in filtered_df.columns:
                filtered_df = filtered_df[filtered_df["topic"].isin(applied_topics)]
            if applied_difficulties and "difficulty_category" in filtered_df.columns:
                difficulty_clean = filtered_df["difficulty_category"].astype("string").str.strip().str.replace(r"\s+", " ", regex=True)
                filtered_df = filtered_df[difficulty_clean.isin(applied_difficulties)]

            is_exam_mode = "Full Mock Exam" in applied_mode

            if not filtered_df.empty:
                selected_filter_parts = []
                if applied_exams:
                    selected_filter_parts.append(f"Exam: {', '.join(applied_exams)}")
                if applied_years:
                    selected_filter_parts.append(f"Year: {', '.join(applied_years)}")
                if applied_cycles:
                    selected_filter_parts.append(f"Cycle: {', '.join(applied_cycles)}")
                if applied_subjects:
                    selected_filter_parts.append(f"Subject: {', '.join(applied_subjects)}")
                if applied_topics:
                    selected_filter_parts.append(f"Topic: {', '.join(applied_topics)}")
                if applied_difficulties:
                    selected_filter_parts.append(f"Difficulty: {', '.join(applied_difficulties)}")
                st.success(
                    f"✅ Practice set ready — {len(filtered_df)} questions"
                    + (f"  |  {' · '.join(selected_filter_parts)}" if selected_filter_parts else "  |  All available PYQs")
                )
            else:
                st.warning("No questions match the selected filters. Modify the filters and click Let's Go again.")
        else:
            filtered_df = pd.DataFrame()
            is_exam_mode = False

else:
    # ==========================================
    # --- IMMERSIVE FULL PAPER / RESULTS STATE ---
    # ==========================================
    selected_exam = st.session_state.get("full_paper_exam", "CAPF-AC")
    selected_year = st.session_state.get("full_paper_year", "2025")
    selected_cycle = st.session_state.get("full_paper_cycle", "")

    full_paper_df = df[
        (df["exam"] == str(selected_exam).strip())
        & (df["year"] == str(selected_year).strip())
    ].copy()

    if (
        selected_exam == "CDS"
        and selected_cycle
        and "cycle" in full_paper_df.columns
    ):
        full_paper_df = full_paper_df[
            full_paper_df["cycle"] == str(selected_cycle).strip()
        ].copy()

    full_paper = True
    filtered_df = full_paper_df
    is_exam_mode = True

# Keep navigation out of the focused, timed examination state. Revision Notes
# has its own return action so the submitted analysis remains intact.
is_active_timed_test = full_paper and st.session_state['exam_started'] and not st.session_state['exam_submitted']
if not is_active_timed_test and not st.session_state['show_revision_notes']:
    nav_space, nav_back, nav_home = st.columns([4, 1, 1])
    with nav_back:
        st.button("← Go Back", key="go_back_button", use_container_width=True, on_click=go_back_to_pre_test)
    with nav_home:
        st.button("⌂ Home", key="home_button", use_container_width=True, on_click=go_home)

# ==========================================
# --- MAIN CONTENT RENDER (TEST ARENA) ---
# ==========================================
if filtered_df.empty and not full_paper:
    if st.session_state.get('practice_filters_applied', False):
        st.info("👆 No questions match the current practice filters. Adjust the filters above and click **Let's Go**.")
    else:
        st.info("👆 Configure your practice filters above and click **Let's Go** to generate the question set.")
elif filtered_df.empty and full_paper:
    st.error(f"🚨 **Dataset Empty:** No rows found in Google Sheet for `{selected_exam}` | Year: `{selected_year}` | Cycle: `{selected_cycle if selected_exam == 'CDS' else 'N/A'}`.")
else:
    if not is_active_full_mock:
        st.markdown("## 🎯 Test Arena")

    # ==========================================
    # --- GATEKEEPER / PRE-EXAM BRIEFING ---
    # ==========================================
    if full_paper and not st.session_state['exam_started']:
        if selected_exam == "CDS":
            pattern_info = "120 Questions | 100 Marks (typically) | 2 Hours (120 Minutes)."
            marking_info = "<strong>+0.83</strong> for correct answers, and <strong>-0.27</strong> negative marking penalty."
        else:
            pattern_info = "125 Questions | 250 Total Marks | 2 Hours (120 Minutes)."
            marking_info = "<strong>+2.0</strong> for correct answers, <strong>-0.67</strong> negative marking penalty for incorrect attempts, and <strong>0</strong> for unattempted questions."

        st.markdown(f"""
        <div class="briefing-card">
            <div class="briefing-header">📋 {selected_exam} Examination Guidelines & Protocol</div>
            <div class="briefing-item">• <strong>Exam Pattern:</strong> {pattern_info}</div>
            <div class="briefing-item">• <strong>Marking Scheme:</strong> {marking_info}</div>
            <div class="briefing-item">• <strong>Attempt Strategy:</strong> Execute a structured 3-Round elimination cycle:
                <br>&emsp;↳ <em>Round 1:</em> Secure 100% direct-hit questions.
                <br>&emsp;↳ <em>Round 2:</em> Solve 50-50 elimination questions.
                <br>&emsp;↳ <em>Round 3:</em> Execute strictly calculated risks to hit target cutoff.
            </div>
            <div class="briefing-item">• <strong>Timer Rules:</strong> The countdown clock runs continuously once initiated. Responses auto-lock upon timer expiration.</div>
        </div>
        """, unsafe_allow_html=True)

        st.button(
            "🚀 Let's Start Test",
            type="primary",
            use_container_width=True,
            on_click=start_full_paper
        )
    else:
        # ==========================================
        # --- JS FLOATING TIMER INJECTION ---
        # ==========================================
        if full_paper and st.session_state['exam_started']:
            if not st.session_state['exam_submitted']:
                elapsed_time = int(time.time() - st.session_state['start_time'])
                remaining_time = max(0, st.session_state['time_limit_seconds'] - elapsed_time)
                
                if remaining_time <= 0:
                    st.session_state['exam_submitted'] = True
                    st.session_state['auto_submitted'] = True
                    st.rerun()
                
                timer_js = """
                <script>
                    var parentDoc = window.parent.document;
                    var timerDiv = parentDoc.getElementById('floating-timer');

                    if (!timerDiv) {
                        timerDiv = parentDoc.createElement('div');
                        timerDiv.id = 'floating-timer';
                        timerDiv.style.position = 'fixed';
                        timerDiv.style.top = '70px';
                        timerDiv.style.right = '30px';
                        timerDiv.style.zIndex = '999999';
                        timerDiv.style.background = 'rgba(255,255,255,0.95)';
                        timerDiv.style.padding = '12px 20px';
                        timerDiv.style.border = '2px solid #3B82F6';
                        timerDiv.style.borderRadius = '8px';
                        timerDiv.style.fontWeight = 'bold';
                        timerDiv.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15)';
                        timerDiv.style.color = '#1E3A8A';
                        timerDiv.style.fontFamily = 'monospace';
                        timerDiv.style.fontSize = '1.2rem';
                        parentDoc.body.appendChild(timerDiv);
                    }

                    var remaining = __REMAINING_TIME__;

                    if (window.timerInterval) {
                        clearInterval(window.timerInterval);
                    }

                    window.timerInterval = setInterval(function() {
                        if (remaining <= 0) {
                            clearInterval(window.timerInterval);
                            timerDiv.innerHTML = "⏰ Time Expired!";
                            timerDiv.style.color = "#991B1B";
                            timerDiv.style.borderColor = "#FCA5A5";
                            timerDiv.style.backgroundColor = "#FEF2F2";
                            return;
                        }

                        remaining--;

                        var h = Math.floor(remaining / 3600);
                        var m = Math.floor((remaining % 3600) / 60);
                        var s = remaining % 60;

                        var hStr = h < 10 ? "0" + h : h;
                        var mStr = m < 10 ? "0" + m : m;
                        var sStr = s < 10 ? "0" + s : s;

                        timerDiv.innerHTML =
                            "⏳ " + hStr + ":" + mStr + ":" + sStr;

                        if (remaining < 900) {
                            timerDiv.style.color = "#991B1B";
                            timerDiv.style.borderColor = "#FCA5A5";
                            timerDiv.style.backgroundColor = "#FEF2F2";
                        }
                    }, 1000);
                </script>
                """.replace(
                    "__REMAINING_TIME__",
                    str(remaining_time)
                )

                components.html(timer_js, height=0, width=0)
            else:
                cleanup_js = """
                <script>
                    var parentDoc = window.parent.document;
                    var timerDiv = parentDoc.getElementById('floating-timer');
                    if (timerDiv) timerDiv.remove();
                    if (window.timerInterval) clearInterval(window.timerInterval);
                </script>
                """
                components.html(cleanup_js, height=0, width=0)

        if st.session_state['auto_submitted']:
            st.error("⏰ **Time Expired!** The 2-hour window has lapsed. Your responses have been automatically submitted.")

        if not st.session_state['exam_submitted']:
            st.button("🔄 Reset Test / Clear Answers", use_container_width=True, on_click=reset_test_state)
            st.markdown("---")

        should_show_analysis = is_exam_mode and st.session_state['exam_submitted']

        # ==========================================
        # --- PHASE 1: POST-TEST HIERARCHY ---
        # ==========================================
        if should_show_analysis:
            # ==========================================
            # --- POST-SUBMISSION NAVIGATOR GRID ---
            # ==========================================
            # Restore the question navigator after submission for Full Mock review.
            # It is intentionally not shown for Instant Feedback / practice mode.
            if full_paper:
                with st.expander("📊 Question Navigator (Click to Jump)", expanded=False):
                    def jump_to_review_page(position):
                        st.session_state['current_page'] = position // 5
                        st.session_state['scroll_trigger'] = True

                    st.markdown('<div class="active-grid-wrapper">', unsafe_allow_html=True)
                    nav_cols = st.columns(10)
                    run_id = st.session_state['test_run_id']

                    for i, row in filtered_df.reset_index(drop=True).iterrows():
                        qid = str(row['question_id'])
                        q_num = row['q_num']
                        user_pick = st.session_state['user_answers'].get(qid, "Unattempted")
                        correct_opt = str(row.get('final_opt', '')).strip()

                        if user_pick == "Unattempted":
                            btn_label = f"⚪ {q_num}"
                            btn_type = "secondary"
                        elif user_pick == correct_opt:
                            btn_label = f"🟢 {q_num}"
                            btn_type = "primary"
                        else:
                            btn_label = f"🔴 {q_num}"
                            btn_type = "secondary"

                        with nav_cols[i % 10]:
                            st.button(
                                label=btn_label,
                                key=f"post_nav_btn_{run_id}_{qid}",
                                type=btn_type,
                                on_click=jump_to_review_page,
                                args=(i,),
                                use_container_width=True
                            )

                    st.markdown('</div>', unsafe_allow_html=True)
                    st.caption("🟢 Correct  ·  🔴 Incorrect  ·  ⚪ Skipped")

            # 1. Evaluate Dataset First
            records = []
            eval_set = filtered_df if is_exam_mode else filtered_df[filtered_df['question_id'].astype(str).isin(st.session_state['checked_questions'])]

            for _, row in eval_set.iterrows():
                qid = str(row['question_id'])
                user_pick = st.session_state['user_answers'].get(qid, "Unattempted")
                correct_opt = str(row['final_opt']).strip()

                if user_pick == "Unattempted":
                    status = "Unattempted"
                    sort_val = 2 # Middle priority
                elif user_pick == correct_opt:
                    status = "Correct"
                    sort_val = 3 # Lowest priority
                else:
                    status = "Incorrect"
                    sort_val = 1 # Highest priority (rendered first)

                row_dict = row.to_dict()
                row_dict.update({
                    'User_Choice': user_pick,
                    'Status': status,
                    'Sort_Val': sort_val,
                    'Error_Type': resolve_error_type(row, qid) if status == "Incorrect" else "N/A"
                })
                records.append(row_dict)

            analysis_df = pd.DataFrame(records)

            # Ordered review is always defined before any post-submission
            # rendering. This avoids NameError on Streamlit Cloud and keeps
            # the intended order: Incorrect -> Unattempted -> Correct.
            ordered_analysis = analysis_df.copy()
            if not ordered_analysis.empty:
                sort_columns = ["Sort_Val"]
                if "q_num" in ordered_analysis.columns:
                    sort_columns.append("q_num")
                ordered_analysis = ordered_analysis.sort_values(
                    by=sort_columns, kind="stable"
                ).reset_index(drop=True)

            # Post-submission review uses these icons for every status.
            # Keep this local and explicit so the review section never depends
            # on a variable defined in another rendering branch.
            status_icons = {
                "Incorrect": "❌",
                "Correct": "✅",
                "Unattempted": "⚪",
            }

            if is_exam_mode and st.session_state['exam_submitted'] and st.session_state['show_revision_notes']:
                render_revision_notes(analysis_df)
                st.stop()
            
            # Metrics Calculations
            total_questions = len(analysis_df)
            attempted = len(analysis_df[analysis_df['Status'] != "Unattempted"])
            correct = len(analysis_df[analysis_df['Status'] == "Correct"])
            incorrect = len(analysis_df[analysis_df['Status'] == "Incorrect"])
            unattempted = total_questions - attempted
            
            if selected_exam == "CDS":
                pos_mark, neg_mark = 0.83, 0.27
            else:
                pos_mark, neg_mark = 2.0, 0.667
                
            net_score = (correct * pos_mark) - (incorrect * neg_mark)
            max_score = total_questions * pos_mark
            accuracy = (correct / attempted * 100) if attempted > 0 else 0

            # 2. Render Metrics Tabs Top Level
            st.markdown("## 📊 Performance Audit")
            tab_score, tab_subject, tab_vault, tab_roadmap = st.tabs(["Scorecard", "Subject Precision", "Mistake Vault", "Strategic Roadmap"])

            with tab_score:
                m1, m2 = st.columns(2)
                m1.metric("Net Score", f"{net_score:.2f} / {max_score:.0f}")
                m2.metric("Accuracy", f"{accuracy:.1f}%")
                m3, m4, m5 = st.columns(3)
                m3.metric("Correct", correct)
                m4.metric("Incorrect", incorrect)
                m5.metric("Blank", unattempted)

            with tab_subject:
                if attempted > 0:
                    subj_summary = analysis_df[analysis_df['Status'] != "Unattempted"].groupby('subject').agg(
                        Attempted=('Status', 'count'),
                        Correct=('Status', lambda x: (x == 'Correct').sum()),
                        Incorrect=('Status', lambda x: (x == 'Incorrect').sum())
                    )
                    subj_summary['Accuracy %'] = (subj_summary['Correct'] / subj_summary['Attempted'] * 100).round(1)
                    st.dataframe(subj_summary, use_container_width=True)
                else:
                    st.info("No questions attempted yet.")

            with tab_vault:
                mistakes_df = analysis_df[analysis_df['Status'] == "Incorrect"]
                if not mistakes_df.empty:
                    st.dataframe(
                        mistakes_df[['q_num', 'subject', 'theme', 'topic', 'subtopic', 'User_Choice', 'final_opt']],
                        use_container_width=True
                    )
                else:
                    st.success("🎯 No errors recorded in this test set!")

            with tab_roadmap:
                render_strategic_roadmap(
                    analysis_df,
                    selected_exam,
                    selected_year,
                    selected_cycle,
                    attempt_type="Full Paper" if is_exam_mode else "Practice Set"
                )

            if is_exam_mode and st.session_state['exam_submitted']:
                st.button(
                    "📚 Revision Notes",
                    type="primary",
                    use_container_width=True,
                    key=f"revision_notes_{st.session_state['test_run_id']}",
                    on_click=show_revision_notes
                )
            
            st.divider()

            # ==========================================
            # --- DETAILED REVIEW ---
            # ==========================================
            st.markdown("### 🔎 Detailed Review")
            for status, heading in (("Incorrect", "INCORRECT"), ("Correct", "CORRECT"), ("Unattempted", "SKIPPED / UNATTEMPTED")):
                status_rows = ordered_analysis[ordered_analysis['Status'] == status]
                if status_rows.empty:
                    continue
                st.markdown(f"#### {heading}")
                for _, review_row in status_rows.iterrows():
                    review_row = review_row.copy()
                    review_qid = str(review_row['question_id'])
                    review_user_pick = review_row['User_Choice']
                    review_correct_opt = str(review_row['final_opt']).strip()
                    with st.expander(
                        f"{status_icons[status]} Q{review_row['q_num']} | {display_value(review_row.get('subject'))}",
                        expanded=False
                    ):
                        st.markdown(f"<div class='question-number'>QUESTION {review_row['q_num']}</div>", unsafe_allow_html=True)
                        render_question_stem(review_row)
                        for opt_letter in ("A", "B", "C", "D"):
                            opt_text = display_value(review_row.get(f"opt_{opt_letter.lower()}"), "")
                            if opt_letter == review_correct_opt:
                                st.markdown(f"✓ {opt_letter}) {opt_text} — Correct Answer")
                            elif opt_letter == review_user_pick:
                                st.markdown(f"✕ {opt_letter}) {opt_text} — Your Answer")
                            else:
                                st.markdown(f"{opt_letter}) {opt_text}")

                        render_pyq_intelligence(review_row)

        # ==========================================
        # --- ACTIVE TEST RENDERING (PAGINATED) ---
        # ==========================================
        elif not st.session_state['exam_submitted']:
            
            # ==========================================
            # --- ACTIVE TEST NAVIGATOR GRID ---
            # ==========================================
            if full_paper:
                with st.expander("📊 Active Navigator Grid (Click to Jump)", expanded=False):
                    
                    def jump_to_page(position):
                        st.session_state['current_page'] = position // 5
                        st.session_state['scroll_trigger'] = True 
                    
                    st.markdown('<div class="active-grid-wrapper">', unsafe_allow_html=True)
                    cols = st.columns(10)
                    
                    run_id = st.session_state['test_run_id']
                    for i, row in filtered_df.reset_index(drop=True).iterrows():
                        qid = str(row['question_id'])
                        q_num = row['q_num']
                        
                        if qid in st.session_state['marked_for_review']:
                            btn_label = f"🔴 {q_num}"
                            btn_type = "secondary"
                        elif qid in st.session_state['user_answers']:
                            btn_label = f"✅ {q_num}"
                            btn_type = "primary" 
                        else:
                            btn_label = f"{q_num}"
                            btn_type = "secondary"
                            
                        with cols[i % 10]:
                            st.button(
                                label=btn_label,
                                key=f"nav_btn_{run_id}_{qid}",
                                type=btn_type,
                                on_click=jump_to_page,
                                args=(i,),
                                use_container_width=True
                            )
                    
                    st.markdown('</div>', unsafe_allow_html=True)
            
            questions_per_page = 5 if full_paper else len(filtered_df)
            total_pages = (len(filtered_df) - 1) // questions_per_page + 1
            
            if st.session_state['current_page'] >= total_pages:
                st.session_state['current_page'] = max(0, total_pages - 1)
                
            start_idx = st.session_state['current_page'] * questions_per_page
            end_idx = start_idx + questions_per_page
            page_df = filtered_df.iloc[start_idx:end_idx]

            st.markdown('<div id="question-area-top" class="anchor-offset"></div>', unsafe_allow_html=True)
            if st.session_state.get('scroll_trigger'):
                scroll_js = """
                <script>
                    const parentDoc = window.parent.document;
                    const target = parentDoc.getElementById('question-area-top');
                    if (target) {
                        target.scrollIntoView({block: 'start', behavior: 'smooth'});
                    } else {
                        const container = parentDoc.querySelector('[data-testid="stAppViewContainer"]');
                        if (container) container.scrollTo({top: 0, behavior: 'smooth'});
                    }
                </script>
                """
                components.html(scroll_js, height=0, width=0)
                st.session_state['scroll_trigger'] = False

            for index, row in page_df.iterrows():
                qid = str(row['question_id'])
                q_num = row['q_num']
                correct_opt = str(row['final_opt']).strip()

                with st.container(border=True):
                    st.markdown(
                        f"<div class='question-number'>QUESTION {q_num}</div>",
                        unsafe_allow_html=True
                    )
                    render_question_stem(row)

                    options = [
                        f"A) {display_value(row.get('opt_a'), '')}",
                        f"B) {display_value(row.get('opt_b'), '')}",
                        f"C) {display_value(row.get('opt_c'), '')}",
                        f"D) {display_value(row.get('opt_d'), '')}"
                    ]

                    saved_choice = st.session_state['user_answers'].get(qid, None)
                    saved_index = next(
                        (idx for idx, opt in enumerate(options)
                         if saved_choice and opt.startswith(saved_choice)),
                        None
                    )

                    selected_choice = st.radio(
                        "Select Option:",
                        options,
                        index=saved_index,
                        key=f"radio_{st.session_state['test_run_id']}_{qid}",
                        label_visibility="collapsed"
                    )

                    if selected_choice:
                        st.session_state['user_answers'][qid] = selected_choice[0]

                    if full_paper:
                        is_marked = qid in st.session_state['marked_for_review']
                        mark_review = st.checkbox(
                            "📌 Mark for Review",
                            value=is_marked,
                            key=f"review_{st.session_state['test_run_id']}_{qid}"
                        )
                        if mark_review:
                            st.session_state['marked_for_review'].add(qid)
                        elif qid in st.session_state['marked_for_review']:
                            st.session_state['marked_for_review'].discard(qid)

                    if not is_exam_mode:
                        if st.button(
                            "Check Answer",
                            key=f"btn_check_{st.session_state['test_run_id']}_{qid}",
                            type="primary"
                        ):
                            if qid in st.session_state['user_answers']:
                                st.session_state['checked_questions'].add(qid)
                            else:
                                st.warning("Select an option first.")

                        if qid in st.session_state['checked_questions']:
                            user_pick = st.session_state['user_answers'].get(qid)
                            feedback_row = row.copy()
                            feedback_row['User_Choice'] = user_pick
                            feedback_row['Status'] = (
                                "Correct" if user_pick == correct_opt else "Incorrect"
                            )

                            if feedback_row['Status'] == "Incorrect":
                                feedback_row['Error_Type'] = resolve_error_type(feedback_row, qid)
                            else:
                                feedback_row['Error_Type'] = "N/A"

                            render_pyq_intelligence(feedback_row)

                st.divider()
            
            # Pagination Buttons
            if full_paper:
                col_prev, col_spacer, col_next = st.columns([1, 2, 1])
                with col_prev:
                    if st.session_state['current_page'] > 0:
                        st.button("⬅️ Previous Page", use_container_width=True, on_click=change_mock_page, args=(-1,))
                with col_next:
                    if st.session_state['current_page'] < total_pages - 1:
                        st.button("Next Page ➡️", use_container_width=True, on_click=change_mock_page, args=(1,))
                st.markdown(f"<div style='text-align: center; color: gray;'>Page {st.session_state['current_page'] + 1} of {total_pages}</div>", unsafe_allow_html=True)
                st.markdown("---")

            if is_exam_mode and not st.session_state['exam_submitted']:
                st.button(
                    "🚀 Submit Mock Test & Generate Analysis",
                    type="primary",
                    use_container_width=True,
                    on_click=submit_mock
                )
