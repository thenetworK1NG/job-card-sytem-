// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcxQLLka_eZ5tduUW3zEAKKdKMvebeXRI",
  authDomain: "job-card-8bb4b.firebaseapp.com",
  databaseURL: "https://job-card-8bb4b-default-rtdb.firebaseio.com",
  projectId: "job-card-8bb4b",
  storageBucket: "job-card-8bb4b.firebasestorage.app",
  messagingSenderId: "355622785459",
  appId: "1:355622785459:web:fc49655132c77fb9cbfbc6",
  measurementId: "G-T7EET4NRQR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.getElementById('jobCardForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const customerName = document.getElementById('customerName').value.trim();
    if (!customerName) {
        document.getElementById('status').textContent = 'Customer Name is required.';
        return;
    }
    // Show assignment modal
    document.getElementById('assignModal').style.display = 'flex';
});

// Assignment modal logic
const assignModal = document.getElementById('assignModal');
const closeAssignModalBtn = document.getElementById('closeAssignModalBtn');
const assignToSelect = document.getElementById('assignToSelect');
const confirmAssignBtn = document.getElementById('confirmAssignBtn');

closeAssignModalBtn.addEventListener('click', () => {
    assignModal.style.display = 'none';
});

// Add log writing function (same as in view-jobs.js)
function writeLog({user, action, jobName, details}) {
    const logRef = ref(database, 'logs');
    const entry = {
        timestamp: Date.now(),
        user: user || '—',
        action,
        jobName: jobName || '—',
        details: details || ''
    };
    push(logRef, entry);
}

confirmAssignBtn.addEventListener('click', () => {
    const assignedTo = assignToSelect.value;
    if (!assignedTo) {
        assignToSelect.style.border = '2px solid #b23c3c';
        return;
    }
    assignToSelect.style.border = '';
    assignModal.style.display = 'none';
    // Gather all form data
    const customerName = document.getElementById('customerName').value.trim();
    const date = document.getElementById('date').value;
    const customerCell = document.getElementById('customerCell').value;
    const email = document.getElementById('email').value;
    const jobTotal = document.getElementById('jobTotal').value;
    const deposit = document.getElementById('deposit').value;
    const balanceDue = document.getElementById('balanceDue').value;
    const jobDescription = document.getElementById('jobDescription').value;
    // Collect tickbox values
    const getCheckedValues = (name) =>
        Array.from(document.querySelectorAll(`input[name='${name}[]']:checked`)).map(cb => cb.value);
    const stickers = getCheckedValues('stickers');
    const other = getCheckedValues('other');
    const banner_canvas = getCheckedValues('banner_canvas');
    const boards = getCheckedValues('boards');

    push(ref(database, 'jobCards'), {
        customerName,
        date,
        customerCell,
        email,
        jobTotal,
        deposit,
        balanceDue,
        jobDescription,
        assignedTo,
        stickers,
        other,
        banner_canvas,
        boards
    })
    .then(() => {
        document.getElementById('status').textContent = 'Saved successfully!';
        document.getElementById('jobCardForm').reset();
        writeLog({user: assignedTo, action: 'created', jobName: customerName});
    })
    .catch((error) => {
        document.getElementById('status').textContent = 'Error: ' + error.message;
    });
});

// Note: You must include the Firebase JS SDK in your HTML before this script:
// <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
// <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js"></script> 