// Dashboard JavaScript
document.addEventListener("DOMContentLoaded", () => {
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

  // Voice recording modal
  const voiceBtn = document.getElementById("voice-btn")
  const voiceModal = document.getElementById("voice-modal")
  const closeVoiceModal = document.getElementById("close-voice-modal")
  const cancelRecording = document.getElementById("cancel-recording")
  const saveRecording = document.getElementById("save-recording")
  const recordingTranscript = document.getElementById("recording-transcript")

  if (voiceBtn && voiceModal) {
    voiceBtn.addEventListener("click", () => {
      voiceModal.classList.add("show")
      voiceBtn.classList.add("recording")

      // Simulate speech recognition
      simulateSpeechRecognition()
    })

    if (closeVoiceModal) {
      closeVoiceModal.addEventListener("click", () => {
        voiceModal.classList.remove("show")
        voiceBtn.classList.remove("recording")
        resetRecording()
      })
    }

    if (cancelRecording) {
      cancelRecording.addEventListener("click", () => {
        voiceModal.classList.remove("show")
        voiceBtn.classList.remove("recording")
        resetRecording()
      })
    }

    if (saveRecording) {
      saveRecording.addEventListener("click", () => {
        voiceModal.classList.remove("show")
        voiceBtn.classList.remove("recording")

        // In a real app, this would save the transcript to the patient record
        alert("Voice notes saved successfully!")
        resetRecording()
      })
    }
  }

  function resetRecording() {
    if (recordingTranscript) {
      recordingTranscript.textContent = "Speak now to record patient notes..."
    }
  }

  function simulateSpeechRecognition() {
    if (recordingTranscript) {
      // Simulate speech recognition with a delay
      setTimeout(() => {
        recordingTranscript.textContent = "Patient reports increased shortness of breath when climbing stairs..."
      }, 2000)

      setTimeout(() => {
        recordingTranscript.textContent += " Mild ankle swelling noted. Blood pressure is elevated at 142/88."
      }, 4000)

      setTimeout(() => {
        recordingTranscript.textContent +=
          " Consider adjusting medication dosage and scheduling follow-up in two weeks."
      }, 6000)
    }
  }

  // Search functionality
  const searchInput = document.querySelector(".search-bar input")

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase()
      const patientItems = document.querySelectorAll(".patient-item")

      patientItems.forEach((item) => {
        const patientName = item.querySelector("h4").textContent.toLowerCase()
        const patientInfo = item.querySelector("p").textContent.toLowerCase()

        if (patientName.includes(searchTerm) || patientInfo.includes(searchTerm)) {
          item.style.display = "flex"
        } else {
          item.style.display = "none"
        }
      })
    })
  }
})
