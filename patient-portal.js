import { Chart } from "@/components/ui/chart"
// Patient Portal JavaScript
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

  // Medication "Mark as Taken" functionality
  const medicationButtons = document.querySelectorAll(".medication-item .btn-outline")

  medicationButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const medicationItem = this.closest(".medication-item")
      medicationItem.classList.add("taken")
      this.textContent = "Taken"
      this.classList.remove("btn-outline")
      this.classList.add("btn-success")
      this.disabled = true

      // Update progress bar
      updateMedicationProgress()
    })
  })

  function updateMedicationProgress() {
    const totalMedications = document.querySelectorAll(".medication-item").length
    const takenMedications = document.querySelectorAll(".medication-item.taken").length
    const progressPercentage = (takenMedications / totalMedications) * 100

    const progressBar = document.querySelector(".progress")
    const progressText = document.querySelector(".medications-card .subtitle")

    if (progressBar) {
      progressBar.style.width = `${progressPercentage}%`
    }

    if (progressText) {
      progressText.textContent = `${takenMedications} of ${totalMedications} taken`
    }
  }

  // Symptom form submission
  const symptomForm = document.getElementById("symptom-form")

  if (symptomForm) {
    symptomForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const symptomType = document.getElementById("symptom-type").value
      const symptomSeverity = document.getElementById("symptom-severity").value
      const symptomDescription = document.getElementById("symptom-description").value

      // In a real app, this would make an API call to save the symptom
      console.log("Symptom logged:", { symptomType, symptomSeverity, symptomDescription })

      // Show success message
      alert("Symptom logged successfully!")

      // Reset form
      this.reset()
    })
  }

  // Charts
  const bpChartCanvas = document.getElementById("bp-chart")
  const weightChartCanvas = document.getElementById("weight-chart")
  const symptomChartCanvas = document.getElementById("symptom-chart")

  if (bpChartCanvas) {
    const ctx = bpChartCanvas.getContext("2d")

    const bpChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Feb 20", "Mar 5", "Mar 15", "Apr 1", "Apr 10"],
        datasets: [
          {
            label: "Systolic",
            data: [145, 140, 142, 139, 138],
            borderColor: "#e63946",
            backgroundColor: "rgba(230, 57, 70, 0.1)",
            tension: 0.3,
            fill: false,
          },
          {
            label: "Diastolic",
            data: [90, 88, 88, 86, 85],
            borderColor: "#457b9d",
            backgroundColor: "rgba(69, 123, 157, 0.1)",
            tension: 0.3,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            min: 60,
            max: 160,
          },
        },
      },
    })
  }

  if (weightChartCanvas) {
    const ctx = weightChartCanvas.getContext("2d")

    const weightChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr"],
        datasets: [
          {
            label: "Weight (kg)",
            data: [82, 80, 79, 78],
            borderColor: "#2a9d8f",
            backgroundColor: "rgba(42, 157, 143, 0.1)",
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            min: 70,
            max: 90,
          },
        },
      },
    })
  }

  if (symptomChartCanvas) {
    const ctx = symptomChartCanvas.getContext("2d")

    const symptomChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Shortness of breath", "Fatigue", "Ankle swelling"],
        datasets: [
          {
            label: "Frequency (last 30 days)",
            data: [8, 12, 5],
            backgroundColor: ["rgba(230, 57, 70, 0.7)", "rgba(69, 123, 157, 0.7)", "rgba(241, 196, 15, 0.7)"],
            borderColor: ["rgba(230, 57, 70, 1)", "rgba(69, 123, 157, 1)", "rgba(241, 196, 15, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    })
  }

  // Sidebar toggle
  const sidebarToggle = document.getElementById("sidebar-toggle")
  const sidebar = document.querySelector(".sidebar")

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("show")
    })
  }

  // Dropdown toggle
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle")

  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation()
      const dropdown = toggle.nextElementSibling
      dropdown.classList.toggle("show")
    })
  })

  // Close dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    const dropdownMenus = document.querySelectorAll(".dropdown-menu")
    dropdownMenus.forEach((menu) => {
      if (menu.classList.contains("show") && !menu.contains(e.target)) {
        menu.classList.remove("show")
      }
    })

    const notificationDropdown = document.querySelector(".notification-dropdown")
    if (
      notificationDropdown &&
      notificationDropdown.classList.contains("show") &&
      !notificationDropdown.contains(e.target) &&
      !e.target.classList.contains("notification-btn")
    ) {
      notificationDropdown.classList.remove("show")
    }
  })

  // Notification toggle
  const notificationBtn = document.querySelector(".notification-btn")

  if (notificationBtn) {
    notificationBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      const dropdown = document.querySelector(".notification-dropdown")
      dropdown.classList.toggle("show")
    })
  }
})
