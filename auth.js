// Authentication page JavaScript
document.addEventListener("DOMContentLoaded", () => {
  // Tab switching functionality
  const tabBtns = document.querySelectorAll(".tab-btn")
  const tabContents = document.querySelectorAll(".tab-content")

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab")

      // Update active tab button
      tabBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

      // Show corresponding tab content
      tabContents.forEach((content) => {
        content.classList.remove("active")
        if (content.id === `${tabId}-tab`) {
          content.classList.add("active")
        }
      })
    })
  })

  // Toggle password visibility
  const togglePasswordBtns = document.querySelectorAll(".toggle-password")

  togglePasswordBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const passwordInput = btn.previousElementSibling

      if (passwordInput.type === "password") {
        passwordInput.type = "text"
        btn.classList.remove("fa-eye-slash")
        btn.classList.add("fa-eye")
      } else {
        passwordInput.type = "password"
        btn.classList.remove("fa-eye")
        btn.classList.add("fa-eye-slash")
      }
    })
  })

  // Form submission handling
  const doctorLoginForm = document.getElementById("doctor-login-form")
  const patientLoginForm = document.getElementById("patient-login-form")
  const doctorRegisterForm = document.getElementById("doctor-register-form")
  const patientRegisterForm = document.getElementById("patient-register-form")

  if (doctorLoginForm) {
    doctorLoginForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const email = document.getElementById("doctor-email").value
      const password = document.getElementById("doctor-password").value

      // In a real app, this would make an API call to authenticate
      console.log("Doctor login attempt:", { email, password })

      // Simulate successful login
      window.location.href = "doctor-dashboard.html"
    })
  }

  if (patientLoginForm) {
    patientLoginForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const patientId = document.getElementById("patient-id").value
      const password = document.getElementById("patient-password").value

      // In a real app, this would make an API call to authenticate
      console.log("Patient login attempt:", { patientId, password })

      // Simulate successful login
      window.location.href = "patient-portal.html"
    })
  }

  if (doctorRegisterForm) {
    doctorRegisterForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const firstName = document.getElementById("doctor-first-name").value
      const lastName = document.getElementById("doctor-last-name").value
      const email = document.getElementById("doctor-email").value
      const specialty = document.getElementById("doctor-specialty").value
      const password = document.getElementById("doctor-password").value
      const confirmPassword = document.getElementById("doctor-confirm-password").value

      if (password !== confirmPassword) {
        alert("Passwords do not match!")
        return
      }

      // In a real app, this would make an API call to register
      console.log("Doctor registration:", { firstName, lastName, email, specialty, password })

      // Simulate successful registration
      window.location.href = "doctor-dashboard.html"
    })
  }

  if (patientRegisterForm) {
    patientRegisterForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const firstName = document.getElementById("patient-first-name").value
      const lastName = document.getElementById("patient-last-name").value
      const email = document.getElementById("patient-email").value
      const dob = document.getElementById("patient-dob").value
      const password = document.getElementById("patient-password").value
      const confirmPassword = document.getElementById("patient-confirm-password").value

      if (password !== confirmPassword) {
        alert("Passwords do not match!")
        return
      }

      // In a real app, this would make an API call to register
      console.log("Patient registration:", { firstName, lastName, email, dob, password })

      // Simulate successful registration
      window.location.href = "patient-portal.html"
    })
  }
})
