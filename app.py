import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import json
import base64
from datetime import datetime

# =====================================================
# PAGE CONFIG
# =====================================================
st.set_page_config(
    page_title="Spotify Dashed",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# =====================================================
# SESSION STATE INIT
# =====================================================
DEFAULTS = {
    "df": None,
    "from_date": None,
    "to_date": None,
    "unit": "Minutes",
    "top_mode": "Artists",
    "time_mode": "Week",
    "period_mode": "Songs",
    "selected_artist": None,
    "selected_track": None,
}
for k, v in DEFAULTS.items():
    st.session_state.setdefault(k, v)

# =====================================================
# STYLES
# =====================================================
st.markdown("""
<style>
/* Base styles */
html, body, .stApp {
  background: #000000 !important;
  color: white !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

#MainMenu, footer, header { display: none !important; }
.stDeployButton { display: none !important; }

/* Remove default Streamlit padding */
.block-container {
    padding: 2rem 3rem !important;
    max-width: 100% !important;
}

/* GREEN BORDERS - Direct targeting */
/* Filter card border */
div[data-testid="stHorizontalBlock"]:nth-of-type(2) > div[data-testid="column"]:first-child > div[data-testid="stVerticalBlock"] {
  border: 3px solid #1ED760 !important;
  border-radius: 25px !important;
  padding: 25px !important;
  background: #000000 !important;
}

/* Stats card border */
div[data-testid="stHorizontalBlock"]:nth-of-type(2) > div[data-testid="column"]:nth-child(2) > div[data-testid="stVerticalBlock"] {
  border: 3px solid #1ED760 !important;
  border-radius: 25px !important;
  padding: 25px !important;
  background: #000000 !important;
}

/* Top 10 card border */
div[data-testid="stHorizontalBlock"]:nth-of-type(3) > div[data-testid="column"]:first-child > div[data-testid="stVerticalBlock"] {
  border: 3px solid #1ED760 !important;
  border-radius: 25px !important;
  padding: 25px !important;
  background: #000000 !important;
}

/* Brand header */
.brand-header {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 36px;
  font-weight: 700;
  color: #1ED760;
  margin-bottom: 1rem;
}

/* Stats box */
.stat-box {
  background: rgba(30, 215, 96, 0.15);
  padding: 12px 16px;
  border-radius: 8px;
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: white;
  line-height: 1.2;
  margin-bottom: 3px;
}

.stat-label {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  margin-top: 3px;
}

/* Section titles */
.section-title {
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin-bottom: 12px;
}

/* Filter labels */
.filter-label {
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin-bottom: 6px;
}

/* Export buttons - hug content */
.stButton > button {
  background: rgba(255, 255, 255, 0.1) !important;
  color: white !important;
  border: none !important;
  border-radius: 8px !important;
  padding: 10px 20px !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  transition: all 0.2s !important;
  width: auto !important;
  white-space: nowrap !important;
}

.stButton > button:hover {
  background: rgba(30, 215, 96, 0.2) !important;
  color: #1ED760 !important;
}

/* Reset Filters button full width */
div[data-testid="column"]:nth-child(3) .stButton > button {
  width: 100% !important;
}

/* List item buttons full width */
div[data-testid="stHorizontalBlock"]:nth-of-type(3) .stButton > button {
  width: 100% !important;
  text-align: left !important;
}

/* Radio buttons - no wrap */
.stRadio > div {
  display: flex !important;
  gap: 8px !important;
  flex-wrap: nowrap !important;
}

.stRadio > div > label {
  background: rgba(255, 255, 255, 0.05) !important;
  color: white !important;
  padding: 6px 14px !important;
  border-radius: 8px !important;
  cursor: pointer !important;
  border: 1px solid transparent !important;
  font-size: 14px !important;
  white-space: nowrap !important;
}

.stRadio > div > label:has(input:checked) {
  background: rgba(30, 215, 96, 0.2) !important;
  color: #1ED760 !important;
  border: 1px solid #1ED760 !important;
}

/* Date inputs */
.stDateInput > div > div {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 8px !important;
}

.stDateInput input {
  color: white !important;
}

/* Charts */
.js-plotly-plot {
  border-radius: 12px;
}

/* List item styling */
.list-item-container {
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.list-item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  margin: 4px 0;
  border-radius: 8px;
  transition: all 0.2s;
  background: rgba(255, 255, 255, 0.05);
}

.list-item-container:hover .list-item-row {
  background: rgba(30, 215, 96, 0.1);
}

.list-item-container:active .list-item-row {
  transform: scale(0.98);
}

.list-item-row.selected {
  background: rgba(30, 215, 96, 0.2) !important;
  border: 1px solid #1ED760;
}

.list-item-name {
  color: white;
  font-size: 14px;
  font-weight: 500;
  flex: 1;
}

.list-item-value {
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  text-align: center;
  min-width: 100px;
}

/* Hide the hidden streamlit buttons */
.hidden-button {
  display: none !important;
}

/* Dataframe styling */
[data-testid="stDataFrame"] {
  background: transparent !important;
}

/* Remove extra margins */
.element-container {
  margin-bottom: 0 !important;
}

/* Upload screen */
.upload-container {
  text-align: center;
  padding: 100px 20px;
}

/* Hide widget labels */
label[data-testid="stWidgetLabel"] {
  display: none !important;
}

/* Time period table styling */
.time-period-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  font-size: 14px;
}

.time-period-row > div:first-child {
  flex: 0 0 120px;
  color: white;
}

.time-period-row > div:nth-child(2) {
  flex: 1;
  color: white;
  padding: 0 10px;
}

.time-period-row > div:last-child {
  flex: 0 0 80px;
  text-align: right;
  color: rgba(255,255,255,0.6);
}
</style>
""", unsafe_allow_html=True)

# =====================================================
# HELPERS
# =====================================================
def load_json(files):
    rows = []
    for f in files:
        rows.extend(json.load(f))
    df = pd.DataFrame(rows)
    df["endTime"] = pd.to_datetime(df["endTime"])
    df["minutes"] = df["msPlayed"] / 60000
    df["seconds"] = df["msPlayed"] / 1000
    df["hour"] = df["endTime"].dt.hour
    return df.sort_values("endTime")

def apply_filters(df):
    if st.session_state.from_date:
        df = df[df.endTime.dt.date >= st.session_state.from_date]
    if st.session_state.to_date:
        df = df[df.endTime.dt.date <= st.session_state.to_date]
    if st.session_state.selected_artist:
        df = df[df.artistName == st.session_state.selected_artist]
    if st.session_state.selected_track:
        df = df[df.trackName == st.session_state.selected_track]
    return df

def convert_time(val, unit):
    if unit == "Minutes": 
        return int(val)
    if unit == "Hours": 
        return int(val / 60)
    return int(val * 60)

def format_unit(unit):
    return unit.lower()

# =====================================================
# LOAD LOGO
# =====================================================
try:
    with open("spotify_logo_green.png", "rb") as f:
        logo = base64.b64encode(f.read()).decode()
except:
    logo = ""

# =====================================================
# UPLOAD SCREEN
# =====================================================
if st.session_state.df is None:
    st.markdown("<div class='upload-container'>", unsafe_allow_html=True)
    if logo:
        st.markdown(
            f"<div class='brand-header' style='justify-content: center;'><img src='data:image/png;base64,{logo}' width='60'>Spotify Dashed</div>",
            unsafe_allow_html=True
        )
    else:
        st.markdown("<div class='brand-header' style='justify-content: center;'>🎵 Spotify Dashed</div>", unsafe_allow_html=True)
    
    files = st.file_uploader(
        "Upload Spotify Streaming History JSON files",
        type="json",
        accept_multiple_files=True
    )
    if files:
        with st.spinner("Loading your data..."):
            df = load_json(files)
            st.session_state.df = df
            st.session_state.from_date = df.endTime.min().date()
            st.session_state.to_date = df.endTime.max().date()
        st.rerun()
    st.markdown("</div>", unsafe_allow_html=True)
    st.stop()

raw_df = st.session_state.df
filtered_df = apply_filters(raw_df)

# =====================================================
# HEADER
# =====================================================
header_col1, header_col2 = st.columns([3, 1])

with header_col1:
    if logo:
        st.markdown(
            f"<div class='brand-header'><img src='data:image/png;base64,{logo}' width='60'>Spotify Dashed</div>",
            unsafe_allow_html=True
        )
    else:
        st.markdown("<div class='brand-header'>🎵 Spotify Dashed</div>", unsafe_allow_html=True)

with header_col2:
    export_col1, export_col2 = st.columns(2)
    with export_col1:
        if st.button("Export data to CSV"):
            csv = filtered_df.to_csv(index=False)
            st.download_button(
                label="Download CSV",
                data=csv,
                file_name="spotify_data.csv",
                mime="text/csv"
            )
    with export_col2:
        if st.button("Export dashboard to PNG"):
            st.info("Screenshot functionality requires additional setup")

# =====================================================
# FILTERS AND STATS ROW
# =====================================================
filter_col, stats_col = st.columns([1, 2.5])

# FILTERS - Horizontal layout
with filter_col:
    filter_row = st.columns([1, 1, 1])
    
    with filter_row[0]:
        st.markdown("<div class='filter-label'>From</div>", unsafe_allow_html=True)
        new_from = st.date_input(
            "from_date",
            st.session_state.from_date,
            key="from_date_picker",
            min_value=raw_df.endTime.min().date(),
            max_value=raw_df.endTime.max().date()
        )
        if new_from != st.session_state.from_date:
            st.session_state.from_date = new_from
            st.rerun()
    
    with filter_row[1]:
        st.markdown("<div class='filter-label'>To</div>", unsafe_allow_html=True)
        new_to = st.date_input(
            "to_date",
            st.session_state.to_date,
            key="to_date_picker",
            min_value=raw_df.endTime.min().date(),
            max_value=raw_df.endTime.max().date()
        )
        if new_to != st.session_state.to_date:
            st.session_state.to_date = new_to
            st.rerun()
    
    with filter_row[2]:
        st.markdown("<div style='height: 28px;'></div>", unsafe_allow_html=True)
        if st.button("Reset Filters"):
            st.session_state.selected_artist = None
            st.session_state.selected_track = None
            st.session_state.from_date = raw_df.endTime.min().date()
            st.session_state.to_date = raw_df.endTime.max().date()
            st.rerun()

# STATS
with stats_col:
    stat_row = st.columns([2, 1, 1])
    
    total_minutes = filtered_df.minutes.sum()
    
    with stat_row[0]:
        display_val = convert_time(total_minutes, st.session_state.unit)
        st.markdown(
            f"<div class='stat-box'><div class='stat-value'>{display_val:,} {format_unit(st.session_state.unit)}</div></div>",
            unsafe_allow_html=True
        )
        
        unit_choice = st.radio(
            "unit_selector",
            ["Hours", "Minutes", "Seconds"],
            index=["Hours", "Minutes", "Seconds"].index(st.session_state.unit),
            key="unit_radio",
            horizontal=True
        )
        if unit_choice != st.session_state.unit:
            st.session_state.unit = unit_choice
            st.rerun()
    
    with stat_row[1]:
        st.markdown(
            f"<div class='stat-box'><div class='stat-value'>{filtered_df.artistName.nunique()}</div><div class='stat-label'>Unique Artists</div></div>",
            unsafe_allow_html=True
        )
    
    with stat_row[2]:
        st.markdown(
            f"<div class='stat-box'><div class='stat-value'>{filtered_df.trackName.nunique()}</div><div class='stat-label'>Unique Tracks</div></div>",
            unsafe_allow_html=True
        )

# =====================================================
# MAIN CONTENT: TOP 10 + CHARTS
# =====================================================
main_col1, main_col2 = st.columns([1, 2.5])

# TOP 10 LIST
with main_col1:
    st.markdown("<div class='section-title'>Top 10</div>", unsafe_allow_html=True)
    
    top_mode = st.radio(
        "top_mode_selector",
        ["Artists", "Songs"],
        key="top_toggle",
        horizontal=True
    )
    if top_mode != st.session_state.top_mode:
        st.session_state.top_mode = top_mode
        st.rerun()
    
    if st.session_state.top_mode == "Artists":
        top = (
            filtered_df.groupby("artistName")
            .agg({"minutes": "sum", "endTime": "max"})
            .sort_values(["minutes", "endTime"], ascending=[False, False])
            .head(10)
        )
        for idx, (artist, row) in enumerate(top.iterrows()):
            mins = row["minutes"]
            display_val = convert_time(mins, st.session_state.unit)
            is_selected = st.session_state.selected_artist == artist
            selected_class = "selected" if is_selected else ""
            
            # Create clickable div that acts like a button
            st.markdown(
                f"""<div class='list-item-container' id='artist-item-{idx}' 
                    onclick='document.getElementById("hidden-btn-artist-{idx}").click()'
                    onkeydown='if(event.key==="Enter"||event.key===" "){{event.preventDefault();this.click();}}'
                    role='button' 
                    tabindex='0'
                    aria-pressed='{str(is_selected).lower()}'>
                    <div class='list-item-row {selected_class}'>
                        <div class='list-item-name'>{artist}</div>
                        <div class='list-item-value'>{display_val} {format_unit(st.session_state.unit)}</div>
                    </div>
                </div>""",
                unsafe_allow_html=True
            )
            
            # Hidden button for Streamlit state management
            if st.button("hidden", key=f"artist_{idx}", help=None):
                if is_selected:
                    st.session_state.selected_artist = None
                else:
                    st.session_state.selected_artist = artist
                    st.session_state.selected_track = None
                st.rerun()
            
            # Hide the button with inline style
            st.markdown(f"<style>button[data-testid='baseButton-secondary'][kind='secondary']:has(div:contains('hidden')) {{ display: none !important; }}</style>", unsafe_allow_html=True)
            st.markdown(f"<div id='hidden-btn-artist-{idx}' style='display:none;'></div>", unsafe_allow_html=True)
            st.markdown(f"""<script>
                document.getElementById('hidden-btn-artist-{idx}').click = function() {{
                    const buttons = document.querySelectorAll('button[kind="secondary"]');
                    if (buttons[{idx}]) buttons[{idx}].click();
                }};
            </script>""", unsafe_allow_html=True)
            
    else:
        top = (
            filtered_df.groupby("trackName")
            .agg({"msPlayed": "sum", "trackName": "count", "endTime": "max"})
            .rename(columns={"trackName": "plays"})
            .sort_values(["plays", "endTime"], ascending=[False, False])
            .head(10)
        )
        for idx, (track, row) in enumerate(top.iterrows()):
            plays = int(row["plays"])
            is_selected = st.session_state.selected_track == track
            selected_class = "selected" if is_selected else ""
            
            # Create clickable div that acts like a button
            st.markdown(
                f"""<div class='list-item-container' id='track-item-{idx}' 
                    onclick='document.getElementById("hidden-btn-track-{idx}").click()'
                    onkeydown='if(event.key==="Enter"||event.key===" "){{event.preventDefault();this.click();}}'
                    role='button' 
                    tabindex='0'
                    aria-pressed='{str(is_selected).lower()}'>
                    <div class='list-item-row {selected_class}'>
                        <div class='list-item-name'>{track}</div>
                        <div class='list-item-value'>{plays} plays</div>
                    </div>
                </div>""",
                unsafe_allow_html=True
            )
            
            # Hidden button for Streamlit state management
            if st.button("hidden", key=f"track_{idx}", help=None):
                if is_selected:
                    st.session_state.selected_track = None
                else:
                    st.session_state.selected_track = track
                    st.session_state.selected_artist = None
                st.rerun()
            
            # Hide the button with inline style
            st.markdown(f"<style>button[data-testid='baseButton-secondary'][kind='secondary']:has(div:contains('hidden')) {{ display: none !important; }}</style>", unsafe_allow_html=True)
            st.markdown(f"<div id='hidden-btn-track-{idx}' style='display:none;'></div>", unsafe_allow_html=True)
            st.markdown(f"""<script>
                document.getElementById('hidden-btn-track-{idx}').click = function() {{
                    const buttons = document.querySelectorAll('button[kind="secondary"]');
                    const trackButtons = Array.from(buttons).filter(b => b.textContent.includes('hidden'));
                    if (trackButtons[{idx}]) trackButtons[{idx}].click();
                }};
            </script>""", unsafe_allow_html=True)

# CHARTS
with main_col2:
    # LISTENING OVER TIME
    st.markdown("<div class='section-title'>Listening Over Time</div>", unsafe_allow_html=True)
    
    time_mode = st.radio(
        "time_mode_selector",
        ["Day", "Week", "Month"],
        index=["Day", "Week", "Month"].index(st.session_state.time_mode),
        key="time_radio",
        horizontal=True
    )
    if time_mode != st.session_state.time_mode:
        st.session_state.time_mode = time_mode
        st.rerun()
    
    freq = {"Day": "D", "Week": "W", "Month": "M"}[st.session_state.time_mode]
    ts = (
        filtered_df
        .set_index("endTime")
        .resample(freq)["minutes"]
        .sum()
        .reset_index()
    )
    
    if len(ts) == 0 or ts["minutes"].sum() == 0:
        st.markdown("<div style='text-align: center; padding: 100px; color: rgba(255,255,255,0.5); font-size: 18px;'>No Data</div>", unsafe_allow_html=True)
    else:
        fig = px.line(ts, x="endTime", y="minutes")
        fig.update_traces(
            line_color="#1ED760",
            line_width=2
        )
        fig.update_layout(
            paper_bgcolor="#000000",
            plot_bgcolor="#000000",
            font=dict(color="white"),
            xaxis=dict(showgrid=True, gridcolor="rgba(255,255,255,0.1)", title=""),
            yaxis=dict(showgrid=True, gridcolor="rgba(255,255,255,0.1)", title="Minutes Played"),
            margin=dict(l=0, r=0, t=0, b=0),
            height=300
        )
        st.plotly_chart(fig, use_container_width=True)
    
    # BOTTOM ROW: CLOCK + TIME PERIOD
    chart_col1, chart_col2 = st.columns([1, 1])
    
    with chart_col1:
        # CLOCK CHART
        hour_data = filtered_df.groupby("hour")["minutes"].sum().reindex(range(24), fill_value=0)
        
        if hour_data.sum() == 0:
            st.markdown("<div style='text-align: center; padding: 100px; color: rgba(255,255,255,0.5); font-size: 18px;'>No Data</div>", unsafe_allow_html=True)
        else:
            fig_clock = go.Figure()
            
            fig_clock.add_trace(go.Barpolar(
                r=hour_data.values,
                theta=[(h * 15) for h in range(24)],
                width=[15] * 24,
                marker=dict(
                    color=hour_data.values,
                    colorscale=[[0, '#1ED760'], [1, '#1ED760']],
                    line=dict(color='#000000', width=2)
                ),
                hovertemplate='Hour %{theta}°: %{r:.0f} mins<extra></extra>',
            ))
            
            fig_clock.update_layout(
                polar=dict(
                    angularaxis=dict(
                        rotation=90,
                        direction="clockwise",
                        tickmode='array',
                        tickvals=[0, 90, 180, 270],
                        ticktext=['0:00', '6:00', '12:00', '18:00'],
                        showticklabels=True,
                        color='white'
                    ),
                    radialaxis=dict(
                        showticklabels=False,
                        showline=False,
                        gridcolor="rgba(255,255,255,0.1)"
                    ),
                    bgcolor='#000000'
                ),
                paper_bgcolor='#000000',
                height=350,
                margin=dict(l=40, r=40, t=20, b=20),
                showlegend=False
            )
            
            st.plotly_chart(fig_clock, use_container_width=True)
    
    with chart_col2:
        # TIME PERIOD
        st.markdown("<div class='section-title'>Time Period</div>", unsafe_allow_html=True)
        
        period_mode = st.radio(
            "period_mode_selector",
            ["Artists", "Songs"],
            key="period_toggle",
            horizontal=True
        )
        if period_mode != st.session_state.period_mode:
            st.session_state.period_mode = period_mode
            st.rerun()
        
        bins = [0, 6, 12, 18, 24]
        labels = ["12am-6am", "6am-12pm", "12pm-6pm", "6pm-12am"]
        icons = ["🌙", "☀️", "🌤", "🌆"]
        
        temp_df = filtered_df.copy()
        temp_df["period"] = pd.cut(
            temp_df.hour, bins, labels=labels, right=False
        )
        
        period_data = []
        for i, period in enumerate(labels):
            sub = temp_df[temp_df.period == period]
            if sub.empty:
                period_data.append({
                    "Time Period": f"{icons[i]} {period}",
                    st.session_state.period_mode[:-1]: "No Data",
                    "Plays": ""
                })
                continue
            
            if st.session_state.period_mode == "Artists":
                # Group by artist, get most recent play for each
                artist_data = sub.groupby("artistName").agg({
                    "endTime": "max",
                    "artistName": "count"
                }).rename(columns={"artistName": "count"})
                # Sort by count then by most recent
                artist_data = artist_data.sort_values(["count", "endTime"], ascending=[False, False])
                top_item = artist_data.index[0]
            else:
                # Group by track, get most recent play for each
                track_data = sub.groupby("trackName").agg({
                    "endTime": "max",
                    "trackName": "count"
                }).rename(columns={"trackName": "count"})
                # Sort by count then by most recent
                track_data = track_data.sort_values(["count", "endTime"], ascending=[False, False])
                top_item = track_data.index[0]
            
            plays = len(sub)
            period_data.append({
                "Time Period": f"{icons[i]} {period}",
                st.session_state.period_mode[:-1]: top_item,
                "Plays": f"{plays} plays"
            })
        
        # Display as simple HTML rows
        for item in period_data:
            st.markdown(
                f"""<div class='time-period-row'>
                    <div>{item['Time Period']}</div>
                    <div>{item[st.session_state.period_mode[:-1]]}</div>
                    <div>{item['Plays']}</div>
                </div>""",
                unsafe_allow_html=True
            )