// Database configuration
const DB_NAME = 'StudentDB';
const STORE_NAME = 'students';
const DB_VERSION = 1;

let db;
let deferredPrompt;

// Initialize the database
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = function(event) {
            console.error('Database error:', event.target.error);
            showToast('Error opening database', 'error');
            reject(event.target.error);
        };
        
        request.onsuccess = function(event) {
            db = event.target.result;
            console.log('Database opened successfully');
            loadStudents();
            resolve(db);
        };
        
        request.onupgradeneeded = function(event) {
            db = event.target.result;
            
            // Create object store if it doesn't exist
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const objectStore = db.createObjectStore(STORE_NAME, { 
                    keyPath: 'id', 
                    autoIncrement: true 
                });
                
                // Create indexes
                objectStore.createIndex('name', 'name', { unique: false });
                objectStore.createIndex('age', 'age', { unique: false });
                
                console.log('Object store created');
            }
        };
    });
}

// Add student to database
function addStudent(student) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.add(student);
        
        request.onsuccess = function() {
            console.log('Student added successfully');
            resolve(request.result);
        };
        
        request.onerror = function(event) {
            console.error('Error adding student:', event.target.error);
            showToast('Error adding student', 'error');
            reject(event.target.error);
        };
    });
}

// Get all students from database
function getAllStudents() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.getAll();
        
        request.onsuccess = function() {
            console.log('Students retrieved successfully');
            resolve(request.result);
        };
        
        request.onerror = function(event) {
            console.error('Error retrieving students:', event.target.error);
            showToast('Error retrieving students', 'error');
            reject(event.target.error);
        };
    });
}

// Update student in database
function updateStudent(student) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.put(student);
        
        request.onsuccess = function() {
            console.log('Student updated successfully');
            resolve(request.result);
        };
        
        request.onerror = function(event) {
            console.error('Error updating student:', event.target.error);
            showToast('Error updating student', 'error');
            reject(event.target.error);
        };
    });
}

// Delete student from database
function deleteStudent(id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.delete(id);
        
        request.onsuccess = function() {
            console.log('Student deleted successfully');
            resolve();
        };
        
        request.onerror = function(event) {
            console.error('Error deleting student:', event.target.error);
            showToast('Error deleting student', 'error');
            reject(event.target.error);
        };
    });
}

// Load students and display them
async function loadStudents(filterName = '', filterAge = '') {
    try {
        showLoading(true);
        const students = await getAllStudents();
        
        // Apply filters if provided
        let filteredStudents = students;
        
        if (filterName) {
            filteredStudents = filteredStudents.filter(student => 
                student.name.toLowerCase().includes(filterName.toLowerCase())
            );
        }
        
        if (filterAge) {
            const minAge = parseInt(filterAge);
            if (!isNaN(minAge)) {
                filteredStudents = filteredStudents.filter(student => 
                    student.age >= minAge
                );
            }
        }
        
        displayStudents(filteredStudents);
        showLoading(false);
    } catch (error) {
        console.error('Error loading students:', error);
        showLoading(false);
    }
}

// Display students in the table
function displayStudents(students) {
    const tbody = document.querySelector('#studentTable tbody');
    tbody.innerHTML = '';
    
    if (students.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4">
                    <div class="empty-state">
                        <svg class="empty-icon" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2V7zm0 8h2v2h-2v-2z"/>
                        </svg>
                        <h3>Belum ada data mahasiswa</h3>
                        <p>Tambahkan data mahasiswa baru menggunakan form di samping</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    students.forEach((student, index) => {
        const row = document.createElement('tr');
        row.style.animationDelay = `${index * 0.1}s`;
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td class="action-buttons">
                <button class="action-btn edit-btn" onclick="editStudent(${student.id})" aria-label="Edit mahasiswa">
                    <svg class="action-icon" viewBox="0 0 24 24">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                </button>
                <button class="action-btn delete-btn" onclick="deleteStudentConfirm(${student.id})" aria-label="Hapus mahasiswa">
                    <svg class="action-icon" viewBox="0 0 24 24">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Show/hide loading indicator
function showLoading(show) {
    const loadingElement = document.getElementById('loadingIndicator');
    if (loadingElement) {
        loadingElement.style.display = show ? 'inline-block' : 'none';
    }
}

// Handle form submission for adding/updating student
document.getElementById('studentForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const id = document.getElementById('studentId').value;
    const name = document.getElementById('studentName').value.trim();
    const age = parseInt(document.getElementById('studentAge').value);
    
    if (!name || isNaN(age) || age <= 0) {
        showToast('Nama dan umur harus diisi dengan benar', 'error');
        return;
    }
    
    const student = { name, age };
    
    try {
        if (id) {
            // Update existing student
            student.id = parseInt(id);
            await updateStudent(student);
            showToast('Data mahasiswa berhasil diperbarui', 'success');
        } else {
            // Add new student
            await addStudent(student);
            showToast('Data mahasiswa berhasil ditambahkan', 'success');
        }
        
        // Reset form
        this.reset();
        document.getElementById('studentId').value = '';
        
        // Reload students
        loadStudents();
    } catch (error) {
        console.error('Error saving student:', error);
    }
});

// Edit student
async function editStudent(id) {
    try {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const objectStore = transaction.objectStore(STORE_NAME);
        const request = objectStore.get(id);
        
        request.onsuccess = function() {
            const student = request.result;
            if (student) {
                document.getElementById('studentId').value = student.id;
                document.getElementById('studentName').value = student.name;
                document.getElementById('studentAge').value = student.age;
                
                // Scroll to form
                document.querySelector('.card').scrollIntoView({ behavior: 'smooth' });
            }
        };
        
        request.onerror = function(event) {
            console.error('Error retrieving student:', event.target.error);
            showToast('Error retrieving student', 'error');
        };
    } catch (error) {
        console.error('Error editing student:', error);
    }
}

// Delete student confirmation
function deleteStudentConfirm(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data mahasiswa ini?')) {
        deleteStudent(id).then(() => {
            showToast('Data mahasiswa berhasil dihapus', 'success');
            loadStudents();
        }).catch(error => {
            console.error('Error deleting student:', error);
        });
    }
}

// Search students by name
document.getElementById('searchInput').addEventListener('input', function() {
    const filterName = this.value;
    const filterAge = document.getElementById('ageFilter').value;
    loadStudents(filterName, filterAge);
});

// Filter students by age
document.getElementById('ageFilter').addEventListener('input', function() {
    const filterName = document.getElementById('searchInput').value;
    const filterAge = this.value;
    loadStudents(filterName, filterAge);
});

// Show toast notification
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} show`;
    
    let iconHtml = '';
    if (type === 'success') {
        iconHtml = `
            <svg class="toast-icon" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
        `;
    } else if (type === 'error') {
        iconHtml = `
            <svg class="toast-icon" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
        `;
    } else if (type === 'warning') {
        iconHtml = `
            <svg class="toast-icon" viewBox="0 0 24 24">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
            </svg>
        `;
    }
    
    toast.innerHTML = `
        ${iconHtml}
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Remove toast after animation
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Handle PWA installation
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Show the install button
    document.getElementById('installButton').style.display = 'flex';
});

document.getElementById('installButton').addEventListener('click', () => {
    // Hide the install button
    document.getElementById('installButton').style.display = 'none';
    // Show the install prompt
    if (deferredPrompt) {
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
        });
    }
});

// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./assets/service-worker.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Initialize database when page loads
window.addEventListener('DOMContentLoaded', () => {
    initDB().catch(error => {
        console.error('Failed to initialize database:', error);
        showToast('Failed to initialize database', 'error');
    });
});