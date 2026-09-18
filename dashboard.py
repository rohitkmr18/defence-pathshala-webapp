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
    """Leaves results without submitting or retaining the completed attempt."""
    reset_test_state()
    st.session_state['full_paper_toggle'] = False


def go_home():
    """Returns to the initial selection view and clears test-specific state."""
    reset_test_state()
    st.session_state['full_paper_toggle'] = False
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
">🧠 Built by: UPSC CAPF AC AIR 163 &nbsp;|&nbsp; IIT Kanpur Graduate &nbsp;|&nbsp; Qualified CDS-AFA 4 times</div>

<div class="dash-intro">Transform raw PYQs into a tactical, data-driven preparation engine. Stop passive reading and start actively eliminating. This intelligence dashboard analyzes your performance patterns, isolates specific examiner traps, and dynamically builds a personalized syllabus roadmap to maximize your final score.</div>
""", unsafe_allow_html=True)

# ==========================================
# --- EXAM, YEAR, & CYCLE SELECTION ---
# ==========================================

# Clean dataframe columns to prevent hidden space bugs
if 'exam' in df.columns:
    df['exam'] = df['exam'].astype(str).str.strip()
if 'year' in df.columns:
    df['year'] = df['year'].astype(str).str.strip()
if 'cycle' in df.columns:
    df['cycle'] = df['cycle'].astype(str).str.strip()

# Initialize permanent session state locks for parameters if not present
if 'locked_exam' not in st.session_state:
    st.session_state['locked_exam'] = "CAPF-AC"
if 'locked_year' not in st.session_state:
    st.session_state['locked_year'] = "2025"
if 'locked_cycle' not in st.session_state:
    st.session_state['locked_cycle'] = "I"

selected_exam = st.session_state.get('locked_exam', "CAPF-AC")
selected_year = st.session_state.get('locked_year', "2025")
selected_cycle = st.session_state.get('locked_cycle', "I")

# ==========================================
# --- IMMERSIVE MODE (HIDE UI) LOGIC ---
# ==========================================
# Rely only on exam_started. Do not rely on the checkbox widget key, 
# because Streamlit deletes widget keys from memory when they are hidden!
is_active_full_mock = st.session_state.get('exam_started', False)

if not is_active_full_mock:
    st.markdown("### 🎯 Select Database Parameters")
    col1, col2, col3 = st.columns(3)
    
    with col1:
        exam_options = list(df['exam'].dropna().unique()) if 'exam' in df.columns else ["CAPF-AC", "CDS"]
        default_exam_idx = exam_options.index(st.session_state['locked_exam']) if st.session_state['locked_exam'] in exam_options else 0
        selected_exam = st.selectbox("Target Exam:", options=exam_options, index=default_exam_idx, key="exam_selection", on_change=reset_for_exam_change)
        st.session_state['locked_exam'] = selected_exam

    with col2:
        available_years = list(df[df['exam'] == selected_exam]['year'].dropna().unique()) if 'exam' in df.columns and 'year' in df.columns else ["2025", "2026"]
        default_year_idx = available_years.index(st.session_state['locked_year']) if st.session_state['locked_year'] in available_years else 0
        selected_year = st.selectbox("Exam Year:", options=available_years, index=default_year_idx, key="year_selection", on_change=reset_for_year_change)
        st.session_state['locked_year'] = selected_year

    with col3:
        if selected_exam == "CDS":
            cycle_options = list(
                df[(df['exam'] == selected_exam) & (df['year'] == selected_year)]['cycle'].dropna().unique()
            ) if 'cycle' in df.columns else []
            if cycle_options:
                default_cycle_idx = cycle_options.index(st.session_state['locked_cycle']) if st.session_state['locked_cycle'] in cycle_options else 0
                selected_cycle = st.selectbox("Exam Cycle:", options=cycle_options, index=default_cycle_idx, key="cycle_selection", on_change=reset_test_state)
                st.session_state['locked_cycle'] = selected_cycle
            else:
                selected_cycle = ""
                st.session_state['locked_cycle'] = selected_cycle

    # Filter only after the current widget values have been resolved. Previously
    # this happened above the widgets, so the first rerun after a selection used
    # the previous exam/year/cycle and could make CDS II 2026 look unavailable.
    if 'exam' in df.columns and 'year' in df.columns:
        exam_df = df[(df['exam'] == str(selected_exam).strip()) & (df['year'] == str(selected_year).strip())]
        if selected_exam == "CDS" and selected_cycle and 'cycle' in exam_df.columns:
            exam_df = exam_df[exam_df['cycle'] == str(selected_cycle).strip()]
    else:
        exam_df = df

    st.markdown("---")
    st.markdown(f"### 📊 Database Overview: {selected_exam} {selected_year}")

    if not exam_df.empty:
        col_m1, col_m2 = st.columns(2)
        col_m1.metric("Total Questions", len(exam_df))
        dataset_label = f"{selected_exam} {selected_year}" + (f" {selected_cycle}" if selected_exam == "CDS" and selected_cycle else "")
        col_m2.metric("Active Dataset", dataset_label)

        # Use a dataset-specific key so Streamlit cannot retain a chart from a
        # previously selected exam/year/cycle. All charts below are built from
        # the CURRENT exam_df, never from the master database.
        chart_suffix = "_".join(str(x).strip().replace(" ", "_") for x in (selected_exam, selected_year, selected_cycle or "NA"))
        chart_config = {
            "displayModeBar": False,
            "responsive": True,
            "scrollZoom": False,
            "doubleClick": False,
            "showTips": False
        }

        c1, c2, c3 = st.columns(3)

        with c1:
            if "subject" in exam_df.columns:
                subject_counts = (
                    exam_df["subject"].fillna("Unclassified").astype(str).str.strip()
                    .replace({"": "Unclassified", "nan": "Unclassified"})
                    .value_counts()
                    .sort_values(ascending=True)
                )
                subject_chart = subject_counts.rename_axis("Subject").reset_index(name="Questions")
                fig_sub = px.bar(
                    subject_chart, x="Questions", y="Subject", orientation="h",
                    title="Questions by Subject"
                )
                fig_sub.update_traces(hovertemplate="%{y}: %{x} Questions<extra></extra>")
                fig_sub.update_layout(
                    showlegend=False, margin=dict(t=55, b=25, l=10, r=35),
                    xaxis_title="Questions", yaxis_title="", height=320,
                    dragmode=False
                )
                st.plotly_chart(fig_sub, use_container_width=True, config=chart_config, key=f"subject_chart_{chart_suffix}")

        with c2:
            if "q_pattern" in exam_df.columns:
                pattern_counts = (
                    exam_df["q_pattern"].fillna("Unclassified").astype(str).str.strip()
                    .replace({"": "Unclassified", "nan": "Unclassified"})
                    .value_counts()
                    .sort_values(ascending=True)
                )
                pattern_chart = pattern_counts.rename_axis("Pattern").reset_index(name="Questions")
                fig_pattern = px.bar(
                    pattern_chart, x="Questions", y="Pattern", orientation="h",
                    title="Questions by Pattern"
                )
                fig_pattern.update_traces(hovertemplate="%{y}: %{x} Questions<extra></extra>")
                fig_pattern.update_layout(
                    showlegend=False, margin=dict(t=55, b=25, l=10, r=35),
                    xaxis_title="Questions", yaxis_title="", height=320,
                    dragmode=False
                )
                st.plotly_chart(fig_pattern, use_container_width=True, config=chart_config, key=f"pattern_chart_{chart_suffix}")

        with c3:
            # Property AC = difficulty_category is authoritative. This chart
            # counts the category values from the CURRENT selected dataset only.
            if 'difficulty_category' in exam_df.columns:
                difficulty_order = ['Easy', 'Moderate', 'Hard', 'Very Hard']

                diff_series = (
                    exam_df['difficulty_category']
                    .astype('string')
                    .str.strip()
                    .str.replace(r'\s+', ' ', regex=True)
                )
                diff_series = diff_series.fillna('Unclassified')

                # Exact category counts from property AC; no score-based
                # reclassification and no use of the master database.
                diff_counts = diff_series.value_counts(dropna=False)
                ordered_labels = [label for label in difficulty_order if label in diff_counts.index]
                ordered_labels += [
                    label for label in diff_counts.index
                    if label not in ordered_labels
                ]

                diff_chart_df = pd.DataFrame({
                    'Difficulty': ordered_labels,
                    'Questions': [int(diff_counts[label]) for label in ordered_labels]
                })

                if not diff_chart_df.empty:
                    fig_diff = px.pie(
                        diff_chart_df,
                        names='Difficulty',
                        values='Questions',
                        hole=0.58,
                        title='Difficulty Distribution'
                    )
                    fig_diff.update_traces(
                        textposition='inside',
                        textinfo='none',
                        hovertemplate='%{label}: %{value} Questions (%{percent})<extra></extra>'
                    )
                    fig_diff.update_layout(
                        showlegend=False,
                        margin=dict(t=55, b=25, l=10, r=10),
                        height=320,
                        dragmode=False
                    )
                    st.plotly_chart(
                        fig_diff,
                        use_container_width=True,
                        config=chart_config,
                        key=f"difficulty_chart_{chart_suffix}"
                    )

    st.markdown("---")
    with st.expander("⚙️ Configure Mocks", expanded=True):
        full_paper_label = "Begin 120-question timed assessment (2 hours)" if selected_exam == "CDS" else "Begin 125-question timed assessment (2 hours)"
        st.markdown("### ⏱️ Attempt Full Paper")
        st.caption("Start a complete, timed assessment using every question in the selected paper.")

        if 'full_paper_toggle' not in st.session_state:
            st.session_state['full_paper_toggle'] = False

        full_paper = st.checkbox(
            full_paper_label,
            key="full_paper_toggle",
            on_change=reset_test_state
        )

        if not full_paper:
            st.markdown(
                "<div style='text-align:center; color:#64748B; font-weight:800; margin:20px 0 8px;'>OR</div>",
                unsafe_allow_html=True
            )
            st.markdown("#### FILTER PRACTICE SET")
            st.caption(
                "Build a custom PYQ practice set across subjects, topics, exams, years, "
                "cycles and difficulty. Questions appear only after you click Let's Go."
            )

            # --------------------------------------------------------
            # PRACTICE SET FILTERS
            # --------------------------------------------------------
            # These controls intentionally live outside a Streamlit form so
            # dependent filters (especially Topic and Cycle) update immediately.
            def mark_practice_filters_dirty():
                """Hide the previously generated set when a filter changes."""
                st.session_state['practice_filters_applied'] = False
                st.session_state['practice_filter_signature'] = None

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
                    df['exam'].dropna().astype(str).str.strip().replace("", pd.NA).dropna().unique().tolist()
                ) if 'exam' in df.columns else []

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
                    df['year'].dropna().astype(str).str.strip().replace("", pd.NA).dropna().unique().tolist()
                ) if 'year' in df.columns else []

                practice_year_selection = st.multiselect(
                    "Select Year(s)",
                    options=practice_year_options,
                    default=st.session_state.get("practice_year_selection", []),
                    key="practice_year_selection",
                    help="Leave empty to include questions from every year.",
                    on_change=mark_practice_filters_dirty
                )

            practice_col3, practice_col4 = st.columns(2, gap="medium")

            # Cycle is meaningful for CDS. Do not clutter the interface with
            # a cycle selector when CAPF (or another non-CDS exam) is selected.
            show_practice_cycle = "CDS" in practice_exam_selection

            with practice_col3:
                if show_practice_cycle and 'cycle' in df.columns:
                    cycle_source = df.copy()
                    cycle_source['exam'] = cycle_source['exam'].astype(str).str.strip()
                    cycle_source['year'] = cycle_source['year'].astype(str).str.strip()
                    cycle_source = cycle_source[cycle_source['exam'].eq("CDS")]

                    if practice_year_selection:
                        cycle_source = cycle_source[
                            cycle_source['year'].isin(practice_year_selection)
                        ]

                    cycle_series = (
                        cycle_source['cycle']
                        .astype('string')
                        .str.strip()
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
                    # Clear stale CDS cycle selections when the user switches
                    # back to CAPF or another non-CDS-only selection.
                    st.session_state['practice_cycle_selection'] = []
                    practice_cycle_selection = []

            with practice_col4:
                practice_subject_options = sorted(
                    df['subject'].dropna().astype(str).str.strip().replace("", pd.NA).dropna().unique().tolist()
                ) if 'subject' in df.columns else []

                practice_subject_selection = st.multiselect(
                    "Select Subject(s)",
                    options=practice_subject_options,
                    default=st.session_state.get("practice_subject_selection", []),
                    key="practice_subject_selection",
                    help="Example: select Polity to practice Polity PYQs across multiple exams.",
                    on_change=mark_practice_filters_dirty
                )

            # Topic options are dynamically scoped to the currently selected
            # subject(s). Selecting History therefore shows History topics only.
            if 'topic' in df.columns:
                topic_source = df.copy()
                if practice_subject_selection and 'subject' in topic_source.columns:
                    topic_source = topic_source[
                        topic_source['subject'].astype(str).str.strip().isin(practice_subject_selection)
                    ]

                practice_topic_series = (
                    topic_source['topic']
                    .astype('string')
                    .str.strip()
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
                help=(
                    "Leave empty for all topics. Select a subject first to see only "
                    "the topics belonging to that subject."
                ),
                on_change=mark_practice_filters_dirty
            )

            difficulty_order = ['Easy', 'Moderate', 'Hard', 'Very Hard']
            if 'difficulty_category' in df.columns:
                practice_difficulty_values = (
                    df['difficulty_category']
                    .astype('string')
                    .str.strip()
                    .str.replace(r'\s+', ' ', regex=True)
                    .dropna()
                    .unique()
                    .tolist()
                )
                available_practice_difficulties = [
                    x for x in difficulty_order if x in practice_difficulty_values
                ]
                available_practice_difficulties += [
                    x for x in sorted(practice_difficulty_values)
                    if x not in available_practice_difficulties
                ]
            else:
                available_practice_difficulties = []

            practice_difficulty_selection = st.multiselect(
                "Select Difficulty",
                options=available_practice_difficulties,
                default=st.session_state.get("practice_difficulty_selection", []),
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
                    1
                    if st.session_state.get("practice_testing_mode") == "Full Mock Exam (Submit all at the end)"
                    else 0
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
                st.session_state['practice_filters_applied'] = True
                st.session_state['practice_filter_signature'] = (
                    tuple(practice_exam_selection),
                    tuple(practice_year_selection),
                    tuple(practice_cycle_selection),
                    tuple(practice_subject_selection),
                    tuple(practice_topic_selection),
                    tuple(practice_difficulty_selection),
                    practice_mode
                )
                # Ensure a newly generated practice set starts from a clean attempt.
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
                st.session_state['test_run_id'] = st.session_state.get('test_run_id', 0) + 1
                st.rerun()

            # --------------------------------------------------------
            # BUILD PRACTICE DATASET ONLY AFTER "LET'S GO"
            # --------------------------------------------------------
            if st.session_state.get('practice_filters_applied', False):
                (
                    applied_exams,
                    applied_years,
                    applied_cycles,
                    applied_subjects,
                    applied_topics,
                    applied_difficulties,
                    applied_mode
                ) = st.session_state.get(
                    'practice_filter_signature',
                    ((), (), (), (), (), (), "Instant Feedback (Practice one by one)")
                )

                filtered_df = df.copy()

                if applied_exams and 'exam' in filtered_df.columns:
                    filtered_df = filtered_df[
                        filtered_df['exam'].astype(str).str.strip().isin(applied_exams)
                    ]

                if applied_years and 'year' in filtered_df.columns:
                    filtered_df = filtered_df[
                        filtered_df['year'].astype(str).str.strip().isin(applied_years)
                    ]

                if applied_cycles and 'cycle' in filtered_df.columns:
                    cycle_clean = (
                        filtered_df['cycle']
                        .astype('string')
                        .str.strip()
                        .replace({"": pd.NA, "nan": pd.NA, "None": pd.NA})
                    )
                    cycle_mask = cycle_clean.isin([x for x in applied_cycles if x != "N/A"])
                    if "N/A" in applied_cycles:
                        cycle_mask = cycle_mask | cycle_clean.isna()
                    filtered_df = filtered_df[cycle_mask]

                if applied_subjects and 'subject' in filtered_df.columns:
                    filtered_df = filtered_df[
                        filtered_df['subject'].astype(str).str.strip().isin(applied_subjects)
                    ]

                if applied_topics and 'topic' in filtered_df.columns:
                    filtered_df = filtered_df[
                        filtered_df['topic'].astype(str).str.strip().isin(applied_topics)
                    ]

                if applied_difficulties and 'difficulty_category' in filtered_df.columns:
                    difficulty_clean = (
                        filtered_df['difficulty_category']
                        .astype('string')
                        .str.strip()
                        .str.replace(r'\s+', ' ', regex=True)
                    )
                    filtered_df = filtered_df[
                        difficulty_clean.isin(applied_difficulties)
                    ]

                is_exam_mode = "Full Mock Exam" in applied_mode

                # Make the active practice set visible before the test starts.
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
                        + (
                            f"  |  {' · '.join(selected_filter_parts)}"
                            if selected_filter_parts else "  |  All available PYQs"
                        )
                    )
                else:
                    st.warning(
                        "No questions match the selected filters. Modify the filters and click "
                        "Let's Go again."
                    )
            else:
                filtered_df = pd.DataFrame()
                is_exam_mode = False

        else:
            filtered_df = exam_df
            is_exam_mode = True

else:
    # IMMERSIVE MODE IS ACTIVE - Setup variables silently without showing the UI
    if 'exam' in df.columns and 'year' in df.columns:
        exam_df = df[(df['exam'] == str(selected_exam).strip()) & (df['year'] == str(selected_year).strip())]
        if selected_exam == "CDS" and selected_cycle and 'cycle' in exam_df.columns:
            exam_df = exam_df[exam_df['cycle'] == str(selected_cycle).strip()]
    else:
        exam_df = df
    full_paper = True
    filtered_df = exam_df
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
                
                timer_js = f"""
                <script>
                    var parentDoc = window.parent.document;
                    var timerDiv = parentDoc.getElementById('floating-timer');
                    if (!timerDiv) {{
                        timerDiv = parentDoc.createElement('div');
                        timerDiv.id = 'floating-timer';
                        timerDiv.style.position = 'fixed';
                        timerDiv.style.top = '70px';
                        timerDiv.style.right = '30px';
                        timerDiv.style.zIndex = '999999';
                        timerDiv.style.background = 'rgba(255, 255, 255, 0.95)';
                        timerDiv.style.padding = '12px 20px';
                        timerDiv.style.border = '2px solid #3B82F6';
                        timerDiv.style.borderRadius = '8px';
                        timerDiv.style.fontWeight = 'bold';
                        timerDiv.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15)';
                        timerDiv.style.color = '#1E3A8A';
                        timerDiv.style.fontFamily = 'monospace';
                        timerDiv.style.fontSize = '1.2rem';
                        parentDoc.body.appendChild(timerDiv);
                    }}
                    
                    var remaining = {remaining_time};
                    if (window.timerInterval) clearInterval(window.timerInterval);
                    
                    window.timerInterval = setInterval(function() {{
                        if (remaining <= 0) {{
                            clearInterval(window.timerInterval);
                            timerDiv.innerHTML = "⏰ Time Expired!";
                            timerDiv.style.color = "#991B1B";
                            timerDiv.style.borderColor = "#FCA5A5";
                            timerDiv.style.backgroundColor = "#FEF2F2";
                        }} else {{
                            remaining--;
                            var h = Math.floor(remaining / 3600);
                            var m = Math.floor((remaining % 3600) / 60);
                            var s = remaining % 60;
                            var hStr = (h < 10 ? "0"+h : h);
                            var mStr = (m < 10 ? "0"+m : m);
                            var sStr = (s < 10 ? "0"+s : s);
                            timerDiv.innerHTML = "⏳ " + hStr + ":" + mStr + ":" + sStr;
                            
                            if (remaining < 900) {{
                                timerDiv.style.color = "#991B1B";
                                timerDiv.style.borderColor = "#FCA5A5";
                                timerDiv.style.backgroundColor = "#FEF2F2";
                            }}
                        }}
                    }}, 1000);
                </script>
                """
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
                roadmap_points = []
                if attempted > 0 and accuracy < 60:
                    roadmap_points.append("⚠️ **Elimination Discipline:** Overall accuracy below 60%. Restrict speculative guessing.")
                
                if 'subj_summary' in locals() and not subj_summary.empty:
                    weak_subjects = subj_summary[subj_summary['Accuracy %'] < 60].index.tolist()
                    if weak_subjects:
                        roadmap_points.append(f"📚 **Priority Revision:** Focus on **{', '.join(weak_subjects)}** (<60% accuracy).")

                if not mistakes_df.empty:
                    error_counts = mistakes_df['Error_Type'].value_counts()
                    if not error_counts.empty:
                        top_error = error_counts.idxmax()
                        if top_error == "Conceptual Gap":
                            roadmap_points.append("🧠 **Theory Re-anchoring:** 'Conceptual Gap' is dominant. Re-read standard sources for these topics.")
                        elif top_error == "Lack of Revision":
                            roadmap_points.append("📝 **Active Recall Drill:** Revisit factual areas represented by the missed questions.")
                        elif top_error == "Analytical Error":
                            roadmap_points.append("🔍 **Analytical Practice:** Rework the reasoning chain behind the missed analytical questions.")

                if not roadmap_points:
                    roadmap_points.append("🔥 **Maintain Consistency:** Excellent performance! Continue timed drills.")

                for pt in roadmap_points:
                    st.markdown(f"- {pt}")

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
