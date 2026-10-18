# Eight Kilometers: Suburban Survival Training

**Eight Kilometers** is an interactive, gamified web application designed to teach suburban residents essential survival techniques. Based on the scenario of evacuating from a suburb to a safe zone 8 kilometers away, users face a series of high-pressure decisions involving water safety, navigation, hypothermia, first aid, and community resilience.

## 🎯 Features

- **Scenario-Based Learning:** 10 distinct survival nodes covering topics from water purification to wildlife encounters and riots.
- **Immediate Feedback:** Correct answers provide validation; incorrect answers provide the correct action, a detailed explanation, and a link to official survival sources (CDC, Red Cross, NPS, etc.).
- **Gamified Experience:** Randomly selects a subset of questions per playthrough so the game stays fresh.
- **Quit Anytime:** Users can quit mid-session to immediately see their score and a personalized review of their mistakes.
- **Responsive Design:** Styled with a "Creamy Avocado" palette (#DCF4A2) for a calm, readable interface.

## 🛠️ Tech Stack

This project is built with lightweight, dependency-free web technologies:
- **HTML5** (Structure)
- **CSS3** (Styling & Avocado color scheme)
- **Vanilla JavaScript** (Game logic, shuffling, score tracking)
- **JSON** (Question database)
- **Python** (For local development server)

## 🚀 How to Run Locally

Because the game fetches a JSON file, it requires a local HTTP server to run (you cannot simply double-click `index.html`).

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR-USERNAME/eight-km.git
   cd eight-km