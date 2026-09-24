/**
 * SkillBridge Authentication & Form Validation
 * Supports Student and Manager logins with 1-click demo helpers
 */

document.addEventListener('DOMContentLoaded', () => {
  // Handle Student Login Form
  const studentLoginForm = document.getElementById('student-login-form');
  if (studentLoginForm) {
    studentLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleStudentLogin(studentLoginForm);
    });

    // 1-Click Demo Fill
    const demoFillBtn = document.getElementById('demo-student-fill-btn');
    if (demoFillBtn) {
      demoFillBtn.addEventListener('click', () => {
        document.getElementById('email').value = 'alex.rivera@campus.edu';
        document.getElementById('password').value = 'college123';
        showToast('Demo Credentials Filled', 'Click "Sign In as Student" to continue.', 'info');
      });
    }
  }

  // Handle Student Registration Form
  const registerForm = document.getElementById('student-register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleStudentRegister(registerForm);
    });
  }

  // Handle Manager Login Form
  const managerLoginForm = document.getElementById('manager-login-form');
  if (managerLoginForm) {
    managerLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleManagerLogin(managerLoginForm);
    });

    // 1-Click Demo Fill for Manager
    const demoManagerBtn = document.getElementById('demo-manager-fill-btn');
    if (demoManagerBtn) {
      demoManagerBtn.addEventListener('click', () => {
        document.getElementById('email').value = 'admin.hayes@campus.edu';
        document.getElementById('password').value = 'admin2026';
        showToast('Manager Demo Credentials Filled', 'Click "Sign In to Admin Portal" to continue.', 'info');
      });
    }
  }
});

/**
 * Handle Student Login with Validation
 */
function handleStudentLogin(form) {
  const emailInput = form.querySelector('#email');
  const passwordInput = form.querySelector('#password');

  let isValid = true;

  // Clear previous errors
  clearErrors(form);

  if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
    setFieldError(emailInput, 'Please enter a valid college email address.');
    isValid = false;
  }

  if (!passwordInput.value || passwordInput.value.length < 6) {
    setFieldError(passwordInput, 'Password must be at least 6 characters.');
    isValid = false;
  }

  if (isValid) {
    // Check or load existing student
    const currentUser = SkillBridgeDB.getCurrentUser();
    showToast('Login Successful', `Welcome back, ${currentUser.name}! Redirecting to dashboard...`, 'success');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1000);
  }
}

/**
 * Handle Student Registration with Validation
 */
function handleStudentRegister(form) {
  clearErrors(form);

  const fullName = form.querySelector('#fullName');
  const rollNo = form.querySelector('#rollNo');
  const email = form.querySelector('#email');
  const department = form.querySelector('#department');
  const year = form.querySelector('#year');
  const teachSkills = form.querySelector('#teachSkills');
  const learnSkills = form.querySelector('#learnSkills');
  const password = form.querySelector('#password');
  const confirmPassword = form.querySelector('#confirmPassword');
  const termsCheckbox = form.querySelector('#terms');

  let isValid = true;

  if (!fullName.value.trim()) {
    setFieldError(fullName, 'Full name is required.');
    isValid = false;
  }

  if (!rollNo.value.trim()) {
    setFieldError(rollNo, 'Student ID / Roll No is required.');
    isValid = false;
  }

  if (!email.value.trim() || !validateEmail(email.value.trim())) {
    setFieldError(email, 'Please enter a valid college email ending in .edu');
    isValid = false;
  }

  if (!department.value) {
    setFieldError(department, 'Please select your department.');
    isValid = false;
  }

  if (!year.value) {
    setFieldError(year, 'Please select your academic year.');
    isValid = false;
  }

  if (!teachSkills.value.trim()) {
    setFieldError(teachSkills, 'Please enter at least one skill you can teach.');
    isValid = false;
  }

  if (!learnSkills.value.trim()) {
    setFieldError(learnSkills, 'Please enter at least one skill you wish to learn.');
    isValid = false;
  }

  if (!password.value || password.value.length < 6) {
    setFieldError(password, 'Password must be at least 6 characters.');
    isValid = false;
  }

  if (password.value !== confirmPassword.value) {
    setFieldError(confirmPassword, 'Passwords do not match.');
    isValid = false;
  }

  if (termsCheckbox && !termsCheckbox.checked) {
    showToast('Terms Required', 'You must agree to the Student Exchange Code of Conduct.', 'error');
    isValid = false;
  }

  if (isValid) {
    const teachArray = teachSkills.value.split(',').map(s => s.trim()).filter(Boolean);
    const learnArray = learnSkills.value.split(',').map(s => s.trim()).filter(Boolean);

    const newStudent = {
      id: 'std_' + Date.now(),
      name: fullName.value.trim(),
      rollNo: rollNo.value.trim(),
      email: email.value.trim(),
      department: department.value,
      year: year.value,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
      bio: `Student at ${department.value} eager to exchange knowledge.`,
      rating: 5.0,
      reviewsCount: 0,
      exchangesCompleted: 0,
      credits: 100,
      verified: true,
      availability: 'Evenings & Weekends',
      teachSkills: teachArray,
      learnSkills: learnArray
    };

    // Save as current user
    SkillBridgeDB.updateCurrentUser(newStudent);

    // Also register in main students list
    const students = SkillBridgeDB.getStudents();
    students.unshift(newStudent);
    SkillBridgeDB.updateStudents(students);

    showToast('Account Created!', `Welcome to SkillBridge, ${newStudent.name}! Redirecting to dashboard...`, 'success');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1200);
  }
}

/**
 * Handle Manager Portal Login
 */
function handleManagerLogin(form) {
  clearErrors(form);

  const email = form.querySelector('#email');
  const password = form.querySelector('#password');

  let isValid = true;

  if (!email.value.trim() || !validateEmail(email.value.trim())) {
    setFieldError(email, 'Please enter a valid administrator email.');
    isValid = false;
  }

  if (!password.value || password.value.length < 6) {
    setFieldError(password, 'Password must be at least 6 characters.');
    isValid = false;
  }

  if (isValid) {
    localStorage.setItem(STORAGE_KEYS.MANAGER_LOGGED_IN, 'true');
    showToast('Manager Authenticated', 'Access granted to SkillBridge Administration. Redirecting...', 'success');
    setTimeout(() => {
      window.location.href = 'dashboard.html'; // In manager subdirectory
    }, 1000);
  }
}

// Helpers
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setFieldError(inputEl, message) {
  inputEl.classList.add('is-invalid');
  const feedback = inputEl.parentElement.querySelector('.form-feedback');
  if (feedback) {
    feedback.textContent = message;
    feedback.style.display = 'flex';
  }
}

function clearErrors(form) {
  form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
  form.querySelectorAll('.form-feedback').forEach(el => el.style.display = 'none');
}
