import { Chart } from "@/components/ui/chart"
// Patient Record JavaScript
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

  // Voice notes functionality
  const voiceNotesBtn = document.getElementById("voice-notes-btn")
  const voiceModal = document.getElementById("voice-modal")
  const closeVoiceModal = document.getElementById("close-voice-modal")
  const cancelRecording = document.getElementById("cancel-recording")
  const saveRecording = document.getElementById("save-recording")
  const recordingTranscript = document.getElementById("recording-transcript")
  const clinicalNotes = document.getElementById("clinical-notes")

  if (voiceNotesBtn && voiceModal) {
    voiceNotesBtn.addEventListener("click", () => {
      voiceModal.classList.add("show")

      // Simulate speech recognition
      simulateSpeechRecognition()
    })

    if (closeVoiceModal) {
      closeVoiceModal.addEventListener("click", () => {
        voiceModal.classList.remove("show")
        resetRecording()
      })
    }

    if (cancelRecording) {
      cancelRecording.addEventListener("click", () => {
        voiceModal.classList.remove("show")
        resetRecording()
      })
    }

    if (saveRecording && clinicalNotes) {
      saveRecording.addEventListener("click", () => {
        voiceModal.classList.remove("show")

        // Add the transcript to the clinical notes
        clinicalNotes.value += (clinicalNotes.value ? "\n\n" : "") + recordingTranscript.textContent

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

  // Display current date and time
  const currentDateTimeElement = document.getElementById("current-date-time")

  if (currentDateTimeElement) {
    const now = new Date()
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    currentDateTimeElement.textContent = now.toLocaleDateString("en-US", options)
  }

  // Blood pressure chart
  const bpChartCanvas = document.getElementById("bp-chart")

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
})
