// Global variables
let currentUser = null;
let jobs = [];
let applications = [];
let currentJobId = null;
let users = []; // Store registered users

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadSampleData();
    displayJobs();
    checkUserSession();
});

// Sample data
function loadSampleData() {
    // Default users for testing
    users = [
        {
            email: "admin@jobhub.com",
            password: "admin123",
            name: "Administrator",
            type: "admin"
        },
        {
            email: "company1@techsolutions.com",
            password: "company123",
            name: "Tech Solutions",
            type: "company"
        },
        {
            email: "company2@creativeagency.com",
            password: "company123",
            name: "Creative Agency",
            type: "company"
        },
        {
            email: "company3@designstudio.com",
            password: "company123",
            name: "Design Studio",
            type: "company"
        },
        {
            email: "user1@gmail.com",
            password: "user123",
            name: "John Doe",
            type: "jobseeker"
        },
        {
            email: "user2@gmail.com",
            password: "user123",
            name: "Jane Smith",
            type: "jobseeker"
        }
    ];

    jobs = [
        {
            id: 1,
            title: "Frontend Developer",
            company: "Tech Solutions",
            location: "Jakarta",
            category: "IT",
            salary: "Rp 8.000.000 - 12.000.000",
            description: "Kami mencari Frontend Developer yang berpengalaman dengan React.js dan Vue.js. Kandidat yang ideal memiliki pengalaman minimal 2 tahun dalam pengembangan web modern.\n\nRequirements:\n- Pengalaman 2+ tahun dengan JavaScript\n- Familiar dengan React.js atau Vue.js\n- Menguasai HTML5, CSS3\n- Pengalaman dengan Git\n- Portfolio yang menarik",
            postedBy: "company1@techsolutions.com",
            postedDate: "2024-03-15",
            applicants: []
        },
        {
            id: 2,
            title: "Digital Marketing Specialist",
            company: "Creative Agency",
            location: "Bandung",
            category: "Marketing",
            salary: "Rp 5.000.000 - 8.000.000",
            description: "Bergabunglah dengan tim kreatif kami sebagai Digital Marketing Specialist. Bertanggung jawab untuk mengelola kampanye digital dan meningkatkan brand awareness.\n\nRequirements:\n- Pengalaman min. 1 tahun di digital marketing\n- Menguasai Google Ads, Facebook Ads\n- Familiar dengan analytics tools\n- Kreatif dan inovatif",
            postedBy: "company2@creativeagency.com",
            postedDate: "2024-03-14",
            applicants: []
        },
        {
            id: 3,
            title: "UI/UX Designer",
            company: "Design Studio",
            location: "Surabaya",
            category: "Design",
            salary: "Rp 6.000.000 - 10.000.000",
            description: "Kami membutuhkan UI/UX Designer yang kreatif untuk mengembangkan interface yang user-friendly dan menarik. Pengalaman dengan Figma dan Adobe Creative Suite diperlukan.\n\nRequirements:\n- Portfolio design yang strong\n- Menguasai Figma, Adobe XD\n- Pemahaman UX principles\n- Kemampuan prototyping",
            postedBy: "company3@designstudio.com",
            postedDate: "2024-03-13",
            applicants: []
        }
    ];

    // Sample applications
    applications = [
        {
            id: 1,
            jobId: 1,
            applicantName: "John Doe",
            applicantEmail: "user1@gmail.com",
            applicantPhone: "081234567890",
            cvFileName: "john_doe_cv.pdf",
            coverLetter: "Saya sangat tertarik dengan posisi Frontend Developer ini. Dengan pengalaman 3 tahun di bidang web development, saya yakin dapat berkontribusi untuk perusahaan.",
            appliedDate: "2024-03-16",
            status: "pending"
        },
        {
            id: 2,
            jobId: 2,
            applicantName: "Jane Smith",
            applicantEmail: "user2@gmail.com",
            applicantPhone: "081234567891",
            cvFileName: "jane_smith_cv.pdf",
            coverLetter: "Saya memiliki passion yang besar di bidang digital marketing dan siap bergabung dengan tim yang dinamis.",
            appliedDate: "2024-03-15",
            status: "accepted"
        }
    ];

    // Load from localStorage if available
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    }

    const savedJobs = localStorage.getItem('jobs');
    if (savedJobs) {
        jobs = JSON.parse(savedJobs);
    }

    const savedApplications = localStorage.getItem('applications');
    if (savedApplications) {
        applications = JSON.parse(savedApplications);
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('jobs', JSON.stringify(jobs));
    localStorage.setItem('applications', JSON.stringify(applications));
}

// Check user session
function checkUserSession() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    }
}

// Authentication functions
function login(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const userType = document.getElementById('loginUserType').value;
    
    // Check against registered users
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        alert('Email atau password salah!');
        return;
    }
    
    if (user.type !== userType) {
        alert('Tipe pengguna tidak sesuai!');
        return;
    }
    
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateAuthUI();
    closeModal('loginModal');
    
    // Pre-fill application form if jobseeker
    if (userType === 'jobseeker') {
        document.getElementById('applicantEmail').value = email;
        document.getElementById('applicantName').value = currentUser.name;
    }
    
    alert(`Login berhasil! Selamat datang, ${currentUser.name}`);
}

function register(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const userType = document.getElementById('registerUserType').value;
    
    // Check if email already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        alert('Email sudah terdaftar! Silakan gunakan email lain.');
        return;
    }
    
    const newUser = {
        email: email,
        password: password,
        name: name,
        type: userType
    };
    
    users.push(newUser);
    currentUser = newUser;
    
    saveData();
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateAuthUI();
    closeModal('registerModal');
    
    alert(`Registrasi berhasil! Selamat datang, ${currentUser.name}`);
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    showSection('home');
    alert('Anda telah logout!');
}

function updateAuthUI() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userWelcome = document.getElementById('userWelcome');
    
    if (currentUser) {
        authButtons.classList.add('hidden');
        userMenu.classList.remove('hidden');
        userWelcome.textContent = `Halo, ${currentUser.name}`;
        
        // Update dashboard tabs based on user type
        updateDashboardTabs();
    } else {
        authButtons.classList.remove('hidden');
        userMenu.classList.add('hidden');
    }
}

function updateDashboardTabs() {
    const jobsTab = document.getElementById('jobsTab');
    const applicationsTab = document.getElementById('applicationsTab');
    const postJobTab = document.getElementById('postJobTab');
    
    if (currentUser.type === 'company') {
        jobsTab.textContent = 'Lowongan Saya';
        applicationsTab.textContent = 'Pelamar';
        postJobTab.classList.remove('hidden');
        postJobTab.style.display = 'block';
    } else if (currentUser.type === 'admin') {
        jobsTab.textContent = 'Semua Lowongan';
        applicationsTab.textContent = 'Semua Lamaran';
        postJobTab.classList.add('hidden');
        postJobTab.style.display = 'none';
    } else {
        jobsTab.classList.add('hidden');
        jobsTab.style.display = 'none';
        applicationsTab.textContent = 'Lamaran Saya';
        postJobTab.classList.add('hidden');
        postJobTab.style.display = 'none';
    }
}

// Modal functions
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Navigation functions
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.style.display = 'none');
    
    // Show requested section
    document.getElementById(sectionId).style.display = 'block';
}

function showDashboard() {
    if (!currentUser) {
        alert('Silakan login terlebih dahulu!');
        showModal('loginModal');
        return;
    }
    
    showSection('dashboard');
    loadDashboardData();
}

function showTab(tabId) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabId).classList.add('active');
    event.target.classList.add('active');
    
    // Load specific data based on tab
    if (tabId === 'jobs') {
        loadMyJobs();
    } else if (tabId === 'applications') {
        loadMyApplications();
    } else if (tabId === 'overview') {
        loadOverviewStats();
    }
}

// Dashboard functions
function loadDashboardData() {
    loadOverviewStats();
}

function loadOverviewStats() {
    const statsContainer = document.getElementById('overviewStats');
    let statsHTML = '';
    
    if (currentUser.type === 'company') {
        const myJobs = jobs.filter(job => job.postedBy === currentUser.email);
        const totalApplications = applications.filter(app => 
            myJobs.some(job => job.id === app.jobId)
        ).length;
        
        statsHTML = `
            <div class="job-card">
                <h3>Lowongan Aktif</h3>
                <p style="font-size: 2rem; font-weight: bold; color: #667eea;">${myJobs.length}</p>
            </div>
            <div class="job-card">
                <h3>Total Pelamar</h3>
                <p style="font-size: 2rem; font-weight: bold; color: #28a745;">${totalApplications}</p>
            </div>
        `;
    } else {
        const myApplications = applications.filter(app => app.applicantEmail === currentUser.email);
        const pendingApps = myApplications.filter(app => app.status === 'pending').length;
        const acceptedApps = myApplications.filter(app => app.status === 'accepted').length;
        
        statsHTML = `
            <div class="job-card">
                <h3>Lamaran Dikirim</h3>
                <p style="font-size: 2rem; font-weight: bold; color: #667eea;">${myApplications.length}</p>
            </div>
            <div class="job-card">
                <h3>Menunggu Review</h3>
                <p style="font-size: 2rem; font-weight: bold; color: #ffc107;">${pendingApps}</p>
            </div>
            <div class="job-card">
                <h3>Diterima</h3>
                <p style="font-size: 2rem; font-weight: bold; color: #28a745;">${acceptedApps}</p>
            </div>
        `;
    }
    
    statsContainer.innerHTML = statsHTML;
}

function loadMyJobs() {
    const container = document.getElementById('myJobsContainer');
    
    if (currentUser.type === 'company') {
        const myJobs = jobs.filter(job => job.postedBy === currentUser.email);
        
        let jobsHTML = '<table class="table"><thead><tr><th>Judul</th><th>Kategori</th><th>Lokasi</th><th>Tanggal Posting</th><th>Pelamar</th><th>Aksi</th></tr></thead><tbody>';
        
        myJobs.forEach(job => {
            const applicantCount = applications.filter(app => app.jobId === job.id).length;
            jobsHTML += `
                <tr>
                    <td>${job.title}</td>
                    <td>${job.category}</td>
                    <td>${job.location}</td>
                    <td>${new Date(job.postedDate).toLocaleDateString('id-ID')}</td>
                    <td>${applicantCount}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="viewApplicants(${job.id})">Lihat Pelamar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteJob(${job.id})">Hapus</button>
                    </td>
                </tr>
            `;
        });
        
        jobsHTML += '</tbody></table>';
        container.innerHTML = jobsHTML;
    } else if (currentUser.type === 'admin') {
        // Admin can see all jobs
        let jobsHTML = '<table class="table"><thead><tr><th>Judul</th><th>Perusahaan</th><th>Kategori</th><th>Lokasi</th><th>Tanggal Posting</th><th>Pelamar</th><th>Aksi</th></tr></thead><tbody>';
        
        jobs.forEach(job => {
            const applicantCount = applications.filter(app => app.jobId === job.id).length;
            jobsHTML += `
                <tr>
                    <td>${job.title}</td>
                    <td>${job.company}</td>
                    <td>${job.category}</td>
                    <td>${job.location}</td>
                    <td>${new Date(job.postedDate).toLocaleDateString('id-ID')}</td>
                    <td>${applicantCount}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="viewApplicants(${job.id})">Lihat Pelamar</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteJob(${job.id})">Hapus</button>
                    </td>
                </tr>
            `;
        });
        
        jobsHTML += '</tbody></table>';
        container.innerHTML = jobsHTML;
    }
}

function loadMyApplications() {
    const container = document.getElementById('myApplicationsContainer');
    
    if (currentUser.type === 'jobseeker') {
        const myApplications = applications.filter(app => app.applicantEmail === currentUser.email);
        
        let appsHTML = '<table class="table"><thead><tr><th>Pekerjaan</th><th>Perusahaan</th><th>Tanggal Lamar</th><th>Status</th></tr></thead><tbody>';
        
        myApplications.forEach(app => {
            const job = jobs.find(j => j.id === app.jobId);
            if (job) {
                appsHTML += `
                    <tr>
                        <td>${job.title}</td>
                        <td>${job.company}</td>
                        <td>${new Date(app.appliedDate).toLocaleDateString('id-ID')}</td>
                        <td><span class="status-badge status-${app.status}">${getStatusText(app.status)}</span></td>
                    </tr>
                `;
            }
        });
        
        appsHTML += '</tbody></table>';
        container.innerHTML = appsHTML;
    } else if (currentUser.type === 'company') {
        // Show applicants for company's jobs
        const myJobs = jobs.filter(job => job.postedBy === currentUser.email);
        const myApplications = applications.filter(app => 
            myJobs.some(job => job.id === app.jobId)
        );
        
        let appsHTML = '<table class="table"><thead><tr><th>Nama</th><th>Email</th><th>Pekerjaan</th><th>Tanggal Lamar</th><th>Status</th><th>Aksi</th></tr></thead><tbody>';
        
        myApplications.forEach(app => {
            const job = jobs.find(j => j.id === app.jobId);
            if (job) {
                appsHTML += `
                    <tr>
                        <td>${app.applicantName}</td>
                        <td>${app.applicantEmail}</td>
                        <td>${job.title}</td>
                        <td>${new Date(app.appliedDate).toLocaleDateString('id-ID')}</td>
                        <td><span class="status-badge status-${app.status}">${getStatusText(app.status)}</span></td>
                        <td>
                            ${app.status === 'pending' ? `
                                <button class="btn btn-success btn-sm" onclick="updateApplicationStatus(${app.id}, 'accepted')">Terima</button>
                                <button class="btn btn-danger btn-sm" onclick="updateApplicationStatus(${app.id}, 'rejected')">Tolak</button>
                            ` : ''}
                            <button class="btn btn-primary btn-sm" onclick="viewApplicationDetail(${app.id})">Detail</button>
                        </td>
                    </tr>
                `;
            }
        });
        
        appsHTML += '</tbody></table>';
        container.innerHTML = appsHTML;
    } else if (currentUser.type === 'admin') {
        // Admin can see all applications
        let appsHTML = '<table class="table"><thead><tr><th>Nama</th><th>Email</th><th>Pekerjaan</th><th>Perusahaan</th><th>Tanggal Lamar</th><th>Status</th><th>Aksi</th></tr></thead><tbody>';
        
        applications.forEach(app => {
            const job = jobs.find(j => j.id === app.jobId);
            if (job) {
                appsHTML += `
                    <tr>
                        <td>${app.applicantName}</td>
                        <td>${app.applicantEmail}</td>
                        <td>${job.title}</td>
                        <td>${job.company}</td>
                        <td>${new Date(app.appliedDate).toLocaleDateString('id-ID')}</td>
                        <td><span class="status-badge status-${app.status}">${getStatusText(app.status)}</span></td>
                        <td>
                            <button class="btn btn-primary btn-sm" onclick="viewApplicationDetail(${app.id})">Detail</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteApplication(${app.id})">Hapus</button>
                        </td>
                    </tr>
                `;
            }
        });
        
        appsHTML += '</tbody></table>';
        container.innerHTML = appsHTML;
    }
}

function getStatusText(status) {
    switch(status) {
        case 'pending': return 'Menunggu';
        case 'accepted': return 'Diterima';
        case 'rejected': return 'Ditolak';
        default: return status;
    }
}

function viewApplicants(jobId) {
    showTab('applications');
    document.querySelector('button[onclick="showTab(\'applications\')"]').classList.add('active');
}

function deleteJob(jobId) {
    if (confirm('Apakah Anda yakin ingin menghapus lowongan ini?')) {
        jobs = jobs.filter(job => job.id !== jobId);
        applications = applications.filter(app => app.jobId !== jobId);
        saveData();
        loadMyJobs();
        loadOverviewStats();
        alert('Lowongan berhasil dihapus!');
    }
}

function updateApplicationStatus(appId, status) {
    const app = applications.find(a => a.id === appId);
    if (app) {
        app.status = status;
        saveData();
        loadMyApplications();
        loadOverviewStats();
        alert(`Status lamaran berhasil diubah menjadi ${getStatusText(status)}!`);
    }
}

function deleteApplication(appId) {
    if (confirm('Apakah Anda yakin ingin menghapus lamaran ini?')) {
        applications = applications.filter(app => app.id !== appId);
        saveData();
        loadMyApplications();
        loadOverviewStats();
        alert('Lamaran berhasil dihapus!');
    }
}

function viewApplicationDetail(appId) {
    const app = applications.find(a => a.id === appId);
    if (app) {
        alert(`Detail Lamaran:\n\nNama: ${app.applicantName}\nEmail: ${app.applicantEmail}\nTelepon: ${app.applicantPhone}\n\nCover Letter:\n${app.coverLetter || 'Tidak ada cover letter'}`);
    }
}

// Job functions
function displayJobs(jobsToShow = jobs) {
    const container = document.getElementById('jobsContainer');
    
    if (jobsToShow.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">Tidak ada lowongan yang ditemukan.</p>';
        return;
    }
    
    let jobsHTML = '';
    jobsToShow.forEach(job => {
        jobsHTML += `
            <div class="job-card">
                <div class="job-title">${job.title}</div>
                <div class="company-name">${job.company}</div>
                <div class="job-meta">
                    <span>📍 ${job.location}</span>
                    <span>🏷️ ${job.category}</span>
                    ${job.salary ? `<span>💰 ${job.salary}</span>` : ''}
                </div>
                <div class="job-description">${job.description}</div>
                <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                    <button class="btn btn-primary" onclick="showJobDetail(${job.id})">Lihat Detail</button>
                    ${currentUser && currentUser.type === 'jobseeker' ? 
                        `<button class="btn btn-success" onclick="showApplyModal(${job.id})">Lamar</button>` : ''}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = jobsHTML;
}

function searchJobs(event) {
    event.preventDefault();
    
    const keyword = document.getElementById('searchKeyword').value.toLowerCase();
    const location = document.getElementById('searchLocation').value.toLowerCase();
    const category = document.getElementById('searchCategory').value;
    
    let filteredJobs = jobs.filter(job => {
        const matchKeyword = !keyword || 
            job.title.toLowerCase().includes(keyword) || 
            job.description.toLowerCase().includes(keyword) ||
            job.company.toLowerCase().includes(keyword);
        
        const matchLocation = !location || 
            job.location.toLowerCase().includes(location);
        
        const matchCategory = !category || job.category === category;
        
        return matchKeyword && matchLocation && matchCategory;
    });
    
    displayJobs(filteredJobs);
}

function showJobDetail(jobId) {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    
    const modal = document.getElementById('jobDetailModal');
    const content = document.getElementById('jobDetailContent');
    
    content.innerHTML = `
        <div class="job-card" style="margin: 0;">
            <div class="job-title" style="font-size: 1.5rem; margin-bottom: 1rem;">${job.title}</div>
            <div class="company-name" style="font-size: 1.2rem; margin-bottom: 1rem;">${job.company}</div>
            <div class="job-meta" style="margin-bottom: 1.5rem;">
                <span>📍 ${job.location}</span>
                <span>🏷️ ${job.category}</span>
                ${job.salary ? `<span>💰 ${job.salary}</span>` : ''}
                <span>📅 ${new Date(job.postedDate).toLocaleDateString('id-ID')}</span>
            </div>
            <h4>Deskripsi Pekerjaan:</h4>
            <p style="white-space: pre-line; margin-bottom: 1.5rem;">${job.description}</p>
            ${currentUser && currentUser.type === 'jobseeker' ? 
                `<button class="btn btn-success" onclick="showApplyModal(${job.id}); closeModal('jobDetailModal');">Lamar Sekarang</button>` : ''}
        </div>
    `;
    
    showModal('jobDetailModal');
}

function showApplyModal(jobId) {
    if (!currentUser) {
        alert('Silakan login terlebih dahulu untuk melamar pekerjaan!');
        showModal('loginModal');
        return;
    }
    
    if (currentUser.type !== 'jobseeker') {
        alert('Hanya pencari kerja yang dapat melamar pekerjaan!');
        return;
    }
    
    // Check if already applied
    const existingApplication = applications.find(app => 
        app.jobId === jobId && app.applicantEmail === currentUser.email
    );
    
    if (existingApplication) {
        alert('Anda sudah melamar pekerjaan ini sebelumnya!');
        return;
    }
    
    currentJobId = jobId;
    
    // Pre-fill form
    document.getElementById('applicantName').value = currentUser.name;
    document.getElementById('applicantEmail').value = currentUser.email;
    
    showModal('applyJobModal');
}

function applyJob(event) {
    event.preventDefault();
    
    const name = document.getElementById('applicantName').value;
    const email = document.getElementById('applicantEmail').value;
    const phone = document.getElementById('applicantPhone').value;
    const cvFile = document.getElementById('applicantCV').files[0];
    const coverLetter = document.getElementById('coverLetter').value;
    
    if (!cvFile) {
        alert('Silakan upload file CV!');
        return;
    }
    
    if (cvFile.type !== 'application/pdf') {
        alert('File CV harus berformat PDF!');
        return;
    }
    
    // Create new application
    const newApplication = {
        id: applications.length + 1,
        jobId: currentJobId,
        applicantName: name,
        applicantEmail: email,
        applicantPhone: phone,
        cvFileName: cvFile.name,
        coverLetter: coverLetter,
        appliedDate: new Date().toISOString().split('T')[0],
        status: 'pending'
    };
    
    applications.push(newApplication);
    saveData();
    
    closeModal('applyJobModal');
    
    // Reset form
    document.getElementById('applicantPhone').value = '';
    document.getElementById('applicantCV').value = '';
    document.getElementById('coverLetter').value = '';
    
    alert('Lamaran berhasil dikirim!');
}

function postJob(event) {
    event.preventDefault();
    
    if (!currentUser || currentUser.type !== 'company') {
        alert('Hanya perusahaan yang dapat memposting lowongan!');
        return;
    }
    
    const title = document.getElementById('jobTitle').value;
    const category = document.getElementById('jobCategory').value;
    const location = document.getElementById('jobLocation').value;
    const salary = document.getElementById('jobSalary').value;
    const description = document.getElementById('jobDescription').value;
    
    const newJob = {
        id: Math.max(...jobs.map(j => j.id), 0) + 1,
        title: title,
        company: currentUser.name,
        location: location,
        category: category,
        salary: salary,
        description: description,
        postedBy: currentUser.email,
        postedDate: new Date().toISOString().split('T')[0],
        applicants: []
    };
    
    jobs.push(newJob);
    saveData();
    
    // Reset form
    document.getElementById('jobTitle').value = '';
    document.getElementById('jobCategory').value = '';
    document.getElementById('jobLocation').value = '';
    document.getElementById('jobSalary').value = '';
    document.getElementById('jobDescription').value = '';
    
    alert('Lowongan berhasil diposting!');
    displayJobs(); // Refresh job display
    loadOverviewStats(); // Refresh stats
}

// File upload handler
document.addEventListener('change', function(e) {
    if (e.target.type === 'file') {
        const fileLabel = e.target.parentElement.querySelector('.file-upload-btn span');
        if (e.target.files.length > 0) {
            fileLabel.textContent = e.target.files[0].name;
        } else {
            fileLabel.textContent = 'Pilih file CV (PDF)';
        }
    }
});

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});