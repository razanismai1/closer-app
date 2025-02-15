# Thinking of You - Web App

A simple and fun web app that lets users in a pair track how often they think about each other. Each time a user clicks the "Thinking of You" button, the counter for their partner increases. The app provides a dashboard to display the stats in a meaningful way.

---

## Features

1. **Pair Tracking**: Each user is linked with their partner.
2. **'Thinking of You' Button**: A simple button for users to express their thoughts about their partner.
3. **Counters**: Separate counters for each user in the pair, tracking how many times they've thought about each other.
4. **Stats Dashboard**: Displays stats like:
   - Total thoughts today, this week, and all time.
   - A summary text, e.g., "John thought about you 10 times this week."
   - A basic bar chart for weekly trends.

---

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Firebase (or any backend of choice for managing user pairs and counters)
- **Optional Library**: Chart.js for visualizing weekly trends

---

## How It Works

### 1. User Linking

- Users can generate a unique pair code to link with their partner.
- Alternatively, they can use Firebase's real-time database to link pairs.

### 2. Tracking Thoughts

- When a user clicks the "Thinking of You" button, a request is sent to update their partner's counter in the backend.

### 3. Stats Display

- The dashboard fetches data from the backend to display stats and trends.

---

## Setup

### Prerequisites

1. Node.js (optional, for local development with live-server)
2. Firebase account (for backend and hosting)

### Steps to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/thinking-of-you.git
   cd thinking-of-you
   ```
