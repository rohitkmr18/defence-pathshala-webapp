import streamlit as st
import pandas as pd
import plotly.express as px
import time
import streamlit.components.v1 as components
import base64
import requests
import io

# ==========================================
# --- PAGE CONFIG ---
# ==========================================
st.set_page_config(page_title="Defence Pathshala | PYQ Engine", layout="centered", initial_sidebar_state="collapsed")

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
camo_img_base64 = get_base64_of_bin_file('images.jpg')

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
    font-family: 'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', sans-serif !important;
    color: #1E3A8A;
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


def render_pyq_intelligence(row):
    st.markdown("#### 🎯 PYQ Intelligence")
    c1, c2 = st.columns(2)
    with c1:
        st.markdown(f"**Subject:** {display_value(row.get('subject'))}")
        st.markdown(f"**Topic:** {display_value(row.get('topic'))}")
    with c2:
        st.markdown(f"**Subtopic:** {display_value(row.get('subtopic'))}")
        st.markdown(f"**Source:** {display_value(row.get('source'))}")

    st.markdown("#### 📝 Answer Analysis")
    user_choice = display_value(row.get("User_Choice"), "Unattempted")
    correct_opt = display_value(row.get("final_opt"), "")
    user_answer = "Unattempted" if user_choice == "Unattempted" else format_answer(row, user_choice)
    correct_answer = format_answer(row, correct_opt)

    a1, a2 = st.columns(2)
    with a1:
        st.markdown(f"**Your Answer:** {user_answer}")
    with a2:
        st.markdown(f"**Correct Answer:** {correct_answer}")

    status = display_value(row.get("Status"))
    if status == "Correct":
        st.success("🎯 **Status:** Correct")
    elif status == "Incorrect":
        st.error("🚨 **Status:** Incorrect")
        st.markdown(f"**Error Type:** {display_value(row.get('Error_Type'), ERROR_TYPE_FALLBACK)}")
    else:
        st.warning("⚠️ **Status:** Unattempted")

    st.markdown("#### 💡 Explanation")
    st.info(f"**Explanation:**\n{clean_text(row.get('explanation', ''))}")


ERROR_TYPE_FALLBACK = "Unrecognised"
ERROR_TYPE_OPTIONS = ["Conceptual Gap", "Factual Recall Failure", "Silly Mistake / Misread"]


def resolve_error_type(row, question_id):
    """Returns the one authoritative error type for an incorrect question."""
    for column in ("Error_Type", "error_type"):
        value = display_value(row.get(column), "")
        if value and value != ERROR_TYPE_FALLBACK:
            return value
    return st.session_state['error_tags'].get(question_id, ERROR_TYPE_FALLBACK)


def revision_bullet(row):
    """Produces a compact deterministic revision point from existing PYQ data."""
    explanation = clean_text(row.get('explanation', '')).replace('  \n', ' ').strip()
    if explanation:
        sentence = explanation.split('. ')[0].strip().rstrip('.')
        if sentence:
            return f"{sentence[:240]}{'…' if len(sentence) > 240 else ''}."
    topic = display_value(row.get('topic'), '')
    subtopic = display_value(row.get('subtopic'), '')
    return " — ".join(part for part in (topic, subtopic) if part) or "Review this question's core concept."


def render_revision_notes(analysis_df):
    """Renders subject-wise, concise revision notes without external AI calls."""
    st.markdown("## 📚 Revision Notes")
    st.caption("Quick subject-wise recall points generated from this submitted paper's explanations.")
    for subject, subject_df in analysis_df.groupby('subject', sort=True):
        st.markdown(f"### {display_value(subject)}")
        seen = set()
        points = []
        for _, row in subject_df.iterrows():
            point = revision_bullet(row)
            normalized = point.casefold()
            if normalized not in seen:
                seen.add(normalized)
                points.append(point)
        for point in points[:6]:
            st.markdown(f"- {point}")
    st.button("← Go Back to Analysis", type="primary", use_container_width=True, on_click=hide_revision_notes)


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

df = st.session_state['master_db']

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

# ==========================================
# --- HERO SECTION ---
# ==========================================
st.markdown("""
<div class="hero-banner">
    <div class="hero-title">DEFENCE PATHSHALA</div>
    <div class="hero-tagline">PYQ Intelligence Engine</div>
</div>
""", unsafe_allow_html=True)

st.markdown('<div class="dash-intro">Transform raw PYQs into a tactical, data-driven preparation engine. Stop passive reading and start actively eliminating. This intelligence dashboard analyzes your performance patterns, isolates specific examiner traps, and dynamically builds a personalized syllabus roadmap to maximize your final score.</div>', unsafe_allow_html=True)

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
        col_m2.metric("Active Dataset", f"{selected_exam} {selected_year}")

        c1, c2, c3 = st.columns(3)
        chart_config = {'displayModeBar': False}
        with c1:
            if 'subject' in exam_df.columns:
                fig_sub = px.pie(exam_df, names='subject', hole=0.5, title="")
                fig_sub.update_traces(textposition='inside', textinfo='label+value', hovertemplate="%{label}: %{value} Questions<extra></extra>")
                fig_sub.update_layout(dragmode=False, showlegend=False, margin=dict(t=20, b=20, l=10, r=10), annotations=[dict(text="Subject", x=0.5, y=0.5, font_size=12, showarrow=False, font_weight="bold")])
                st.plotly_chart(fig_sub, use_container_width=True, config=chart_config, key="global_subject_chart")
        with c2:
            if 'q_pattern' in exam_df.columns:
                fig_pattern = px.pie(exam_df, names='q_pattern', hole=0.5, title="")
                fig_pattern.update_traces(textposition='inside', textinfo='label+value', hovertemplate="%{label}: %{value} Questions<extra></extra>")
                fig_pattern.update_layout(dragmode=False, showlegend=False, margin=dict(t=20, b=20, l=10, r=10), annotations=[dict(text="Pattern", x=0.5, y=0.5, font_size=12, showarrow=False, font_weight="bold")])
                st.plotly_chart(fig_pattern, use_container_width=True, config=chart_config, key="global_pattern_chart")
        with c3:
            if 'difficulty' in exam_df.columns:
                fig_diff = px.pie(exam_df, names='difficulty', hole=0.5, title="")
                fig_diff.update_traces(textposition='inside', textinfo='label+value', hovertemplate="%{label}: %{value} Questions<extra></extra>")
                fig_diff.update_layout(dragmode=False, showlegend=False, margin=dict(t=20, b=20, l=10, r=10), annotations=[dict(text="Difficulty", x=0.5, y=0.5, font_size=12, showarrow=False, font_weight="bold")])
                st.plotly_chart(fig_diff, use_container_width=True, config=chart_config, key="global_difficulty_chart")

    st.markdown("---")
    with st.expander("⚙️ Configure Mocks", expanded=True):
        full_paper_label = "Begin 120-question timed assessment (2 hours)" if selected_exam == "CDS" else "Begin 125-question timed assessment (2 hours)"
        st.markdown("### ⏱️ Attempt Full Paper")
        st.caption("Start a complete, timed assessment using every question in the selected paper.")
        
        # Use a secondary persistent state flag to manage the checkbox safely
        if 'full_paper_toggle' not in st.session_state:
            st.session_state['full_paper_toggle'] = False
            
        full_paper = st.checkbox(
            full_paper_label,
            key="full_paper_toggle",
            on_change=reset_test_state
        )
        
        if not full_paper:
            st.markdown("<div style='text-align:center; color:#64748B; font-weight:800; margin:20px 0 8px;'>OR</div>", unsafe_allow_html=True)
            st.markdown("#### FILTER PRACTICE SET")
            st.caption("Choose a focused set of questions. These controls are optional alternatives to the timed full paper.")
            selected_subject = st.multiselect("Select Subject", exam_df['subject'].unique() if 'subject' in exam_df.columns else [], default=[], key="subject_selection", on_change=reset_test_state)
            selected_difficulty = st.multiselect("Select Difficulty", exam_df['difficulty'].unique() if 'difficulty' in exam_df.columns else [], default=[], key="difficulty_selection", on_change=reset_test_state)
            
            if 'subject' in exam_df.columns and 'difficulty' in exam_df.columns and selected_subject and selected_difficulty:
                filtered_df = exam_df[(exam_df['subject'].isin(selected_subject)) & (exam_df['difficulty'].isin(selected_difficulty))]
            else:
                filtered_df = pd.DataFrame()
            
            st.markdown("---")
            mode = st.radio(
                "Testing Mode:",
                ["Instant Feedback (Practice one by one)", "Full Mock Exam (Submit all at the end)"],
                index=0,
                key="testing_mode",
                on_change=reset_test_state
            )
            is_exam_mode = "Full Mock Exam" in mode
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
    st.info("👆 Select subjects and difficulty levels in the configuration menu above to generate your custom practice set of PYQ.")
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

        should_show_analysis = (is_exam_mode and st.session_state['exam_submitted']) or \
                               (not is_exam_mode and len(st.session_state['checked_questions']) > 0)

        # ==========================================
        # --- PHASE 1: POST-TEST HIERARCHY ---
        # ==========================================
        if should_show_analysis:
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
                        mistakes_df[['q_num', 'subject', 'topic', 'User_Choice', 'final_opt', 'Error_Type']],
                        use_container_width=True
                    )
                    error_counts = mistakes_df['Error_Type'].fillna(ERROR_TYPE_FALLBACK).replace('', ERROR_TYPE_FALLBACK).value_counts()
                    fig_errors = px.pie(
                        values=error_counts.values,
                        names=error_counts.index,
                        hole=0.5,
                        title="Mistake Type Distribution"
                    )
                    fig_errors.update_traces(textposition='inside', textinfo='label+value')
                    fig_errors.update_layout(
                        dragmode=False,
                        margin=dict(t=50, b=20, l=10, r=10),
                        showlegend=True
                    )
                    st.plotly_chart(
                        fig_errors,
                        use_container_width=True,
                        config={'displayModeBar': False},
                        key=f"error_type_chart_{st.session_state['test_run_id']}"
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
                        elif top_error == "Factual Recall Failure":
                            roadmap_points.append("📝 **Active Recall Drill:** Build 1-page cheat sheets for dates/articles.")
                        elif top_error == "Silly Mistake / Misread":
                            roadmap_points.append("🔍 **Question Decoupling:** Highlight 'NOT' and 'INCORRECT' before answering.")

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
            # --- POST-SUBMISSION NAVIGATION GRID ---
            # ==========================================
            status_order = {"Incorrect": 0, "Correct": 1, "Unattempted": 2}
            ordered_analysis = analysis_df.assign(
                _review_order=analysis_df['Status'].map(status_order)
            ).sort_values(['_review_order', 'q_num', 'question_id'], kind='stable').copy()
            review_qids = ordered_analysis['question_id'].astype(str).tolist()
            run_id = st.session_state['test_run_id']
            jump_key = f"jump_to_question_{run_id}"

            if st.session_state['review_selected_qid'] not in review_qids:
                st.session_state['review_selected_qid'] = None
            if st.session_state.get(jump_key) not in review_qids:
                st.session_state[jump_key] = None

            def select_review_question(qid):
                st.session_state['review_selected_qid'] = qid
                st.session_state[jump_key] = qid

            def sync_review_question():
                st.session_state['review_selected_qid'] = st.session_state[jump_key]

            status_icons = {"Correct": "🟢", "Incorrect": "🔴", "Unattempted": "⚪"}
            question_labels = {
                str(row['question_id']): f"Q{row['q_num']} · {row['Status']}"
                for _, row in ordered_analysis.iterrows()
            }

            with st.expander("▸ Question Navigation", expanded=False):
                st.caption("🟢 Correct · 🔴 Incorrect · ⚪ Skipped · ➜ Selected")
                grid_columns = st.columns(10)
                for position, (_, grid_row) in enumerate(ordered_analysis.iterrows()):
                    grid_qid = str(grid_row['question_id'])
                    is_selected = grid_qid == st.session_state['review_selected_qid']
                    label = f"{'➜ ' if is_selected else ''}{status_icons[grid_row['Status']]} {grid_row['q_num']}"
                    with grid_columns[position % 10]:
                        st.button(
                            label,
                            key=f"review_grid_{run_id}_{grid_qid}",
                            help=f"Q{grid_row['q_num']}: {grid_row['Status']}",
                            type="primary" if is_selected else "secondary",
                            use_container_width=True,
                            on_click=select_review_question,
                            args=(grid_qid,)
                        )

                st.selectbox(
                    "Jump to Question",
                    options=[None] + review_qids,
                    format_func=lambda qid: "Select a question" if qid is None else question_labels[qid],
                    key=jump_key,
                    on_change=sync_review_question
                )

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
                        expanded=review_qid == st.session_state['review_selected_qid']
                    ):
                        st.markdown(f"**Q{review_row['q_num']}. {clean_text(review_row['question'])}**")
                        for opt_letter in ("A", "B", "C", "D"):
                            opt_text = display_value(review_row.get(f"opt_{opt_letter.lower()}"), "")
                            if opt_letter == review_correct_opt:
                                st.markdown(f"✅ **{opt_letter}) {opt_text}** (Correct Answer)")
                            elif opt_letter == review_user_pick:
                                st.markdown(f"❌ **{opt_letter}) {opt_text}** (Your Answer)")
                            else:
                                st.markdown(f"{opt_letter}) {opt_text}")

                        if status == "Incorrect":
                            error_type = resolve_error_type(review_row, review_qid)
                            review_row['Error_Type'] = error_type
                            if error_type == ERROR_TYPE_FALLBACK:
                                selected_tag = st.selectbox(
                                    "Categorize this mistake:",
                                    ERROR_TYPE_OPTIONS,
                                    key=f"review_tag_{run_id}_{review_qid}"
                                )
                                st.session_state['error_tags'][review_qid] = selected_tag
                                review_row['Error_Type'] = selected_tag

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

                cleaned_question = clean_text(row['question'])
                st.markdown(f"**Q{q_num}. {cleaned_question}**")

                options = [
                    f"A) {row['opt_a']}",
                    f"B) {row['opt_b']}",
                    f"C) {row['opt_c']}",
                    f"D) {row['opt_d']}"
                ]

                saved_choice = st.session_state['user_answers'].get(qid, None)
                saved_index = next((idx for idx, opt in enumerate(options) if saved_choice and opt.startswith(saved_choice)), None)

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
                    mark_review = st.checkbox("📌 Mark for Review", value=is_marked, key=f"review_{st.session_state['test_run_id']}_{qid}")
                    if mark_review:
                        st.session_state['marked_for_review'].add(qid)
                    elif qid in st.session_state['marked_for_review']:
                        st.session_state['marked_for_review'].discard(qid)

                if not is_exam_mode:
                    if st.button(f"Check Answer", key=f"btn_check_{st.session_state['test_run_id']}_{qid}"):
                        if qid in st.session_state['user_answers']:
                            st.session_state['checked_questions'].add(qid)
                        else:
                            st.warning("Select an option first.")

                    if qid in st.session_state['checked_questions']:
                        user_pick = st.session_state['user_answers'].get(qid)
                        feedback_row = row.copy()
                        feedback_row['User_Choice'] = user_pick
                        feedback_row['Status'] = "Correct" if user_pick == correct_opt else "Incorrect"

                        if feedback_row['Status'] == "Incorrect":
                            error_type = resolve_error_type(feedback_row, qid)
                            feedback_row['Error_Type'] = error_type
                            if error_type == ERROR_TYPE_FALLBACK:
                                selected_tag = st.selectbox(
                                    "Categorize this mistake:",
                                    ERROR_TYPE_OPTIONS,
                                    key=f"tag_{st.session_state['test_run_id']}_{qid}"
                                )
                                st.session_state['error_tags'][qid] = selected_tag
                                feedback_row['Error_Type'] = selected_tag
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
