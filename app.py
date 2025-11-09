
from flask import Flask, render_template, request, jsonify, send_from_directory, redirect, url_for, session, flash
import json
import os,time
from datetime import datetime
import sqlite3
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

STORE = os.path.join(os.path.dirname(__file__), 'sessions_store.json')

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['UPLOAD_FOLDER'] = 'uploads'

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Database initialization
def init_db():
    conn = sqlite3.connect('drowsiness_data.db')
    cursor = conn.cursor()
    
    # Create sessions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            start_time TIMESTAMP,
            end_time TIMESTAMP,
            duration INTEGER,
            alert_count INTEGER,
            avg_ear REAL,
            drowsiness_score REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create alerts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id INTEGER,
            timestamp TIMESTAMP,
            duration REAL,
            ear_value REAL,
            FOREIGN KEY (session_id) REFERENCES sessions (id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

# Simple user store (for demo; use DB for production)
USERS = {}

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('user_id'):
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def index():
    if not session.get('user_id'):
        return redirect(url_for('login'))
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = USERS.get(username)
        if user and check_password_hash(user['password'], password):
            session['user_id'] = username
            flash('Login successful!', 'success')
            return redirect(url_for('index'))
        else:
            flash('Invalid username or password', 'danger')
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        if username in USERS:
            flash('Username already exists', 'danger')
        else:
            USERS[username] = {
                'email': email,
                'password': generate_password_hash(password)
            }
            flash('Registration successful! Please login.', 'success')
            return redirect(url_for('login'))
    return render_template('register.html')

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    flash('Logged out successfully.', 'info')
    return redirect(url_for('login'))

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html')

@app.route('/analytics')
@login_required
def analytics():
    return render_template('analytics.html')

@app.route('/settings')
@login_required
def settings():
    return render_template('settings.html')

@app.route('/about')
@login_required
def about():
    return render_template('about.html')

@app.route('/api/sessions', methods=['POST'])
def save_session():
    try:
        data = request.json
        conn = sqlite3.connect('drowsiness_data.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO sessions (user_id, start_time, end_time, duration, alert_count, avg_ear, drowsiness_score)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get('user_id', 'anonymous'),
            data.get('start_time'),
            data.get('end_time'),
            data.get('duration'),
            data.get('alert_count'),
            data.get('avg_ear'),
            data.get('drowsiness_score')
        ))
        
        session_id = cursor.lastrowid
        
        # Save alerts
        for alert in data.get('alerts', []):
            cursor.execute('''
                INSERT INTO alerts (session_id, timestamp, duration, ear_value)
                VALUES (?, ?, ?, ?)
            ''', (session_id, alert.get('timestamp'), alert.get('duration'), alert.get('ear_value')))
        
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'session_id': session_id})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/sessions', methods=['GET'])
def get_sessions():
    try:
        conn = sqlite3.connect('drowsiness_data.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, user_id, start_time, end_time, duration, alert_count, avg_ear, drowsiness_score, created_at
            FROM sessions
            ORDER BY created_at DESC
            LIMIT 50
        ''')
        
        sessions = []
        for row in cursor.fetchall():
            sessions.append({
                'id': row[0],
                'user_id': row[1],
                'start_time': row[2],
                'end_time': row[3],
                'duration': row[4],
                'alert_count': row[5],
                'avg_ear': row[6],
                'drowsiness_score': row[7],
                'created_at': row[8]
            })
        
        conn.close()
        return jsonify({'success': True, 'sessions': sessions})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/analytics')
def get_analytics():
    try:
        conn = sqlite3.connect('drowsiness_data.db')
        cursor = conn.cursor()
        
        # Get summary statistics
        cursor.execute('''
            SELECT 
                COUNT(*) as total_sessions,
                AVG(duration) as avg_duration,
                SUM(alert_count) as total_alerts,
                AVG(drowsiness_score) as avg_drowsiness_score
            FROM sessions
        ''')
        
        summary = cursor.fetchone()
        
        # Get daily statistics for the last 30 days
        cursor.execute('''
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as session_count,
                AVG(drowsiness_score) as avg_score,
                SUM(alert_count) as total_alerts
            FROM sessions
            WHERE created_at >= datetime('now', '-30 days')
            GROUP BY DATE(created_at)
            ORDER BY date
        ''')
        
        daily_stats = []
        for row in cursor.fetchall():
            daily_stats.append({
                'date': row[0],
                'session_count': row[1],
                'avg_score': row[2],
                'total_alerts': row[3]
            })
        
        conn.close()
        
        return jsonify({
            'success': True,
            'summary': {
                'total_sessions': summary[0] or 0,
                'avg_duration': summary[1] or 0,
                'total_alerts': summary[2] or 0,
                'avg_drowsiness_score': summary[3] or 0
            },
            'daily_stats': daily_stats
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

def load_sessions():
    if not os.path.exists(STORE): return []
    with open(STORE, 'r', encoding='utf-8') as f: return json.load(f)

def save_sessions(data):
    with open(STORE, 'w', encoding='utf-8') as f: json.dump(data, f, ensure_ascii=False, indent=2)

@app.route('/api/sessions', methods=['GET', 'POST'])
def sessions_api():
    if request.method == 'POST':
        s = request.get_json(force=True) or {}
        s['id'] = int(time.time()*1000)
        data = load_sessions()
        data.append(s)
        save_sessions(data)
        return jsonify(success=True, id=s['id'])
    # GET
    limit = int(request.args.get('limit', 50))
    data = load_sessions()
    return jsonify(success=True, sessions=sorted(data, key=lambda x: x.get('start_time',''), reverse=True)[:limit])

@app.route('/api/analytics')
def analytics_api():
    data = load_sessions()
    total_sessions = len(data)
    total_alerts = sum(int(s.get('alert_count',0)) for s in data)
    avg_duration = (sum(int(s.get('duration',0)) for s in data)/total_sessions) if total_sessions else 0
    scores = [float(s.get('drowsiness_score',0)) for s in data if 'drowsiness_score' in s]
    avg_score = (sum(scores)/len(scores)) if scores else 0

    # last 30 days
    from datetime import datetime, timedelta
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    buckets = []
    for i in range(29, -1, -1):
        d = (today - timedelta(days=i))
        label = d.strftime('%Y-%m-%d')
        day_sessions = [s for s in data if (s.get('start_time','')[:10] == label)]
        if day_sessions:
            day_scores = [float(s.get('drowsiness_score',0)) for s in day_sessions]
            avg_day_score = sum(day_scores)/len(day_scores) if day_scores else 0
        else:
            avg_day_score = 0
        buckets.append({'date': label, 'session_count': len(day_sessions), 'avg_score': avg_day_score})

    return jsonify(
        success=True,
        summary={
            'total_sessions': total_sessions,
            'avg_duration': avg_duration,            # ms (your JS formats it)
            'total_alerts': total_alerts,
            'avg_drowsiness_score': avg_score
        },
        daily_stats=buckets
    )


# Contact page
@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        mobile = request.form.get('mobile')
        message = request.form.get('message')
        # You can add logic to save or send the message here
        flash('Your message has been sent!', 'success')
        return redirect(url_for('contact'))
    return render_template('contact.html')



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
