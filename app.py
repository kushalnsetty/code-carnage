from flask import Flask, request, jsonify, render_template, redirect, url_for, session
from flask_cors import CORS
import sqlite3
import os
import json
import datetime
import hashlib
import uuid
import re

# Initialize Flask app
app = Flask(__name__, static_folder='.')
CORS(app)
app.secret_key = os.urandom(24)

# Database setup
def get_db_connection():
    conn = sqlite3.connect('smartcare.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_type TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        specialty TEXT,
        date_of_birth TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Create patients table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        patient_id TEXT UNIQUE NOT NULL,
        gender TEXT,
        phone TEXT,
        address TEXT,
        medical_conditions TEXT,
        allergies TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    ''')
    
    # Create medications table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS medications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER,
        name TEXT NOT NULL,
        dosage TEXT NOT NULL,
        frequency TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT,
        status TEXT DEFAULT 'active',
        FOREIGN KEY (patient_id) REFERENCES patients (id)
    )
    ''')
    
    # Create vitals table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS vitals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER,
        date TEXT NOT NULL,
        blood_pressure TEXT,
        pulse INTEGER,
        temperature REAL,
        respiratory_rate INTEGER,
        oxygen_saturation INTEGER,
        FOREIGN KEY (patient_id) REFERENCES patients (id)
    )
    ''')
    
    # Create symptoms table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS symptoms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER,
        date TEXT NOT NULL,
        symptom_type TEXT NOT NULL,
        severity TEXT NOT NULL,
        description TEXT,
        FOREIGN KEY (patient_id) REFERENCES patients (id)
    )
    ''')
    
    # Create visits table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS visits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER,
        doctor_id INTEGER,
        date TEXT NOT NULL,
        visit_type TEXT NOT NULL,
        chief_complaint TEXT,
        notes TEXT,
        FOREIGN KEY (patient_id) REFERENCES patients (id),
        FOREIGN KEY (doctor_id) REFERENCES users (id)
    )
    ''')
    
    # Create appointments table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER,
        doctor_id INTEGER,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        appointment_type TEXT NOT NULL,
        status TEXT DEFAULT 'scheduled',
        FOREIGN KEY (patient_id) REFERENCES patients (id),
        FOREIGN KEY (doctor_id) REFERENCES users (id)
    )
    ''')
    
    # Create alerts table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER,
        alert_type TEXT NOT NULL,
        severity TEXT NOT NULL,
        description TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        FOREIGN KEY (patient_id) REFERENCES patients (id)
    )
    ''')
    
    # Insert sample data for testing
    # Sample doctor
    cursor.execute("SELECT * FROM users WHERE email = 'dr.neha@example.com'")
    if not cursor.fetchone():
        password_hash = hashlib.sha256('password123'.encode()).hexdigest()
        cursor.execute('''
        INSERT INTO users (user_type, first_name, last_name, email, password_hash, specialty)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', ('doctor', 'Neha', 'Singh', 'dr.neha@example.com', password_hash, 'General Practitioner'))
    
    # Sample patient
    cursor.execute("SELECT * FROM users WHERE email = 'michael.chen@example.com'")
    if not cursor.fetchone():
        password_hash = hashlib.sha256('password123'.encode()).hexdigest()
        cursor.execute('''
        INSERT INTO users (user_type, first_name, last_name, email, password_hash, date_of_birth)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', ('patient', 'Michael', 'Chen', 'michael.chen@example.com', password_hash, '1960-05-12'))
        
        user_id = cursor.lastrowid
        patient_id = 'P' + str(user_id).zfill(3)
        
        cursor.execute('''
        INSERT INTO patients (user_id, patient_id, gender, phone, address, medical_conditions, allergies)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (user_id, patient_id, 'Male', '(555) 123-4567', '123 Main St, Anytown, CA 94321', 
              'COPD, Heart Failure', 'Penicillin, Sulfa drugs'))
        
        patient_db_id = cursor.lastrowid
        
        # Add medications
        medications = [
            (patient_db_id, 'Lisinopril', '10mg', 'Once daily', '2023-01-15', None, 'active'),
            (patient_db_id, 'Furosemide', '40mg', 'Twice daily', '2023-02-10', None, 'active'),
            (patient_db_id, 'Metoprolol', '25mg', 'Twice daily', '2023-03-05', None, 'active')
        ]
        
        cursor.executemany('''
        INSERT INTO medications (patient_id, name, dosage, frequency, start_date, end_date, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', medications)
        
        # Add vitals
        vitals = [
            (patient_db_id, '2023-04-10', '138/85', 78, 98.6, 18, 95),
            (patient_db_id, '2023-03-15', '142/88', 82, 98.4, 20, 94),
            (patient_db_id, '2023-02-20', '145/90', 85, 98.8, 22, 93)
        ]
        
        cursor.executemany('''
        INSERT INTO vitals (patient_id, date, blood_pressure, pulse, temperature, respiratory_rate, oxygen_saturation)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', vitals)
        
        # Add symptoms
        symptoms = [
            (patient_db_id, '2023-04-10', 'Shortness of breath', 'Moderate', 'When climbing stairs'),
            (patient_db_id, '2023-04-08', 'Ankle swelling', 'Mild', 'Mild ankle swelling'),
            (patient_db_id, '2023-04-05', 'Fatigue', 'Moderate', 'After minimal exertion')
        ]
        
        cursor.executemany('''
        INSERT INTO symptoms (patient_id, date, symptom_type, severity, description)
        VALUES (?, ?, ?, ?, ?)
        ''', symptoms)
        
        # Add alerts
        alerts = [
            (patient_db_id, 'ADR', 'High', 'Possible adverse reaction to Furosemide - increased fatigue and dizziness', '2023-04-09'),
            (patient_db_id, 'Symptom', 'Medium', 'Worsening shortness of breath over past week', '2023-04-08')
        ]
        
        cursor.executemany('''
        INSERT INTO alerts (patient_id, alert_type, severity, description, date)
        VALUES (?, ?, ?, ?, ?)
        ''', alerts)
    
    conn.commit()
    conn.close()

# Initialize database
init_db()

# Helper functions
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def generate_patient_id():
    return 'P' + str(uuid.uuid4().int)[:6]

def is_valid_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

# Routes
@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/<path:path>')
def static_files(path):
    return app.send_static_file(path)

# API Routes
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if 'email' in data:  # Doctor login
        email = data['email']
        password = data['password']
        
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
        conn.close()
        
        if user and user['password_hash'] == hash_password(password):
            session['user_id'] = user['id']
            session['user_type'] = user['user_type']
            session['name'] = f"{user['first_name']} {user['last_name']}"
            
            return jsonify({
                'success': True,
                'user_type': user['user_type'],
                'name': f"{user['first_name']} {user['last_name']}"
            })
    
    elif 'patient_id' in data:  # Patient login
        patient_id = data['patient_id']
        password = data['password']
        
        conn = get_db_connection()
        patient = conn.execute('''
            SELECT u.*, p.patient_id 
            FROM users u
            JOIN patients p ON u.id = p.user_id
            WHERE p.patient_id = ?
        ''', (patient_id,)).fetchone()
        conn.close()
        
        if patient and patient['password_hash'] == hash_password(password):
            session['user_id'] = patient['id']
            session['user_type'] = 'patient'
            session['name'] = f"{patient['first_name']} {patient['last_name']}"
            session['patient_id'] = patient['patient_id']
            
            return jsonify({
                'success': True,
                'user_type': 'patient',
                'name': f"{patient['first_name']} {patient['last_name']}"
            })
    
    return jsonify({'success': False, 'message': 'Invalid credentials'})

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['user_type', 'first_name', 'last_name', 'email', 'password']
    for field in required_fields:
        if field not in data:
            return jsonify({'success': False, 'message': f'Missing required field: {field}'})
    
    # Validate email format
    if not is_valid_email(data['email']):
        return jsonify({'success': False, 'message': 'Invalid email format'})
    
    # Check if email already exists
    conn = get_db_connection()
    existing_user = conn.execute('SELECT * FROM users WHERE email = ?', (data['email'],)).fetchone()
    
    if existing_user:
        conn.close()
        return jsonify({'success': False, 'message': 'Email already registered'})
    
    # Hash password
    password_hash = hash_password(data['password'])
    
    # Insert user based on type
    if data['user_type'] == 'doctor':
        cursor = conn.execute('''
        INSERT INTO users (user_type, first_name, last_name, email, password_hash, specialty)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', (data['user_type'], data['first_name'], data['last_name'], data['email'], password_hash, data.get('specialty', '')))
    
    elif data['user_type'] == 'patient':
        cursor = conn.execute('''
        INSERT INTO users (user_type, first_name, last_name, email, password_hash, date_of_birth)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', (data['user_type'], data['first_name'], data['last_name'], data['email'], password_hash, data.get('date_of_birth', '')))
        
        user_id = cursor.lastrowid
        patient_id = 'P' + str(user_id).zfill(3)
        
        conn.execute('''
        INSERT INTO patients (user_id, patient_id, gender)
        VALUES (?, ?, ?)
        ''', (user_id, patient_id, data.get('gender', '')))
    
    conn.commit()
    conn.close()
    
    return jsonify({'success': True, 'message': 'Registration successful'})

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'success': True})

# Doctor API Routes
@app.route('/api/doctor/patients', methods=['GET'])
def get_patients():
    if 'user_id' not in session or session['user_type'] != 'doctor':
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    
    conn = get_db_connection()
    patients = conn.execute('''
        SELECT p.*, u.first_name, u.last_name, u.date_of_birth,
               (SELECT COUNT(*) FROM alerts WHERE patient_id = p.id AND status = 'active') as alert_count
        FROM patients p
        JOIN users u ON p.user_id = u.id
        ORDER BY u.last_name, u.first_name
    ''').fetchall()
    
    result = []
    for patient in patients:
        # Calculate age from date of birth
        dob = datetime.datetime.strptime(patient['date_of_birth'], '%Y-%m-%d')
        today = datetime.datetime.today()
        age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
        
        result.append({
            'id': patient['id'],
            'patient_id': patient['patient_id'],
            'name': f"{patient['first_name']} {patient['last_name']}",
            'age': age,
            'gender': patient['gender'],
            'medical_conditions': patient['medical_conditions'],
            'allergies': json.loads(patient['allergies']) if patient['allergies'] else [],
            'alert_count': patient['alert_count']
        })
    
    conn.close()
    return jsonify({'success': True, 'patients': result})

@app.route('/api/doctor/patient/<patient_id>', methods=['GET'])
def get_patient(patient_id):
    if 'user_id' not in session or session['user_type'] != 'doctor':
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    
    conn = get_db_connection()
    patient = conn.execute('''
        SELECT p.*, u.first_name, u.last_name, u.date_of_birth, u.email
        FROM patients p
        JOIN users u ON p.user_id = u.id
        WHERE p.patient_id = ?
    ''', (patient_id,)).fetchone()
    
    if not patient:
        conn.close()
        return jsonify({'success': False, 'message': 'Patient not found'}), 404
    
    # Get medications
    medications = conn.execute('''
        SELECT * FROM medications
        WHERE patient_id = ? AND status = 'active'
        ORDER BY start_date DESC
    ''', (patient['id'],)).fetchall()
    
    # Get vitals
    vitals = conn.execute('''
        SELECT * FROM vitals
        WHERE patient_id = ?
