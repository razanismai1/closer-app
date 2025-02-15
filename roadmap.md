# Thinking of You - Web App

A web app that allows paired users to express and track how often they think about each other. Users can interact through a "Thinking of You" button and view meaningful statistics in a clean, minimal dashboard.

---

## Key Features

1. **Two Tabs on the Dashboard**:

   - **Tab 1: 'Thinking of You' Button**
     - A central interactive button that users click to send a 'thought' to their paired partner.
   - **Tab 2: Data and Stats**
     - Includes visualizations and counters to track:
       - Number of 'thoughts' sent and received today, this week, and all time.
       - Weekly trends displayed via graphs (e.g., bar chart, line graph).
       - A summary text like: "John thought about you X times in the past week."

2. **User Linking**:

   - Users can link with their partner using a unique pair code.

3. **Real-Time Updates**:

   - Ensure counters and data update dynamically whenever a button click occurs.

4. **Clean and Minimal UI**:
   - Simple, intuitive, and visually appealing design with a focus on usability.

---

## User Flow

### 1. Pair Creation

- **Step 1**: User A generates a unique pair code.
- **Step 2**: User B enters the code to link with User A.
- **Step 3**: Both users are now paired, and data is synced between them.

### 2. Using the 'Thinking of You' Button

- **Step 1**: The user navigates to Tab 1 on the dashboard.
- **Step 2**: They click the "Thinking of You" button.
- **Step 3**:
  - The action increments their partner's counter.
  - The data is updated in real-time and reflected in Tab 2.

### 3. Viewing Stats and Graphs

- **Step 1**: The user navigates to Tab 2.
- **Step 2**: They view personalized stats, including:
  - Number of times they’ve been thought about today, this week, and all time.
  - A chart showing weekly trends.

---

## Technical Details

### Frontend

- **Cursor for Development**:
  - Use HTML, CSS, and JavaScript.
  - Implement a tab-based layout for the dashboard (e.g., a simple navigation bar).

### Backend

- **Firebase or Supabase** for:
  - User authentication and pairing functionality.
  - Real-time database updates for counters.

### Additional Tools

- **Chart.js**: For rendering visualizations in Tab 2.

---

## Tabs Overview

### Tab 1: 'Thinking of You' Button

- A large button at the center of the screen.
- On click:
  - Increment the counter for the paired user.
  - Show a subtle animation or feedback, e.g., a heart animation.

### Tab 2: Data and Stats

- **Counters**: Display the number of thoughts sent and received today, this week, and all time.
- **Graphs**:
  - Weekly trends visualized with bar or line charts.
- **Summary Text**:
  - Example: "John thought about you 10 times this week!"

---

## Implementation Details

### Project Structure

thinking-of-you/
├── index.html # Main HTML file for structure
├── style.css # CSS file for styling
├── script.js # Core JavaScript logic
├── firebase.js # Firebase integration (optional)
├── README.md # Project documentation

### Cursor-Specific Requirements

1. **Page Structure**:

   - Use a tab-based navigation bar for switching between the two tabs.
   - Design Tab 1 for interaction and Tab 2 for data visualization.

2. **Dynamic Updates**:

   - Ensure counters update dynamically using JavaScript and backend integration.

3. **Responsive Design**:
   - The app should work on desktop and mobile browsers.

---

## Features to Add in Future Versions

1. **Notifications**: Notify users when their partner clicks the "Thinking of You" button.
2. **More Visualizations**: Add monthly or yearly trends.
3. **Authentication**: Use email or social login to improve the pairing process.

---

## Design Notes

### Style

- Clean and modern with pastel colors.
- Use playful elements like hearts for animations.

### Feedback for Users

- Tab 1: Include subtle animations (e.g., a bouncing heart) when the button is clicked.
- Tab 2: Display charts and meaningful text summaries in an engaging way.

---

Happy building! ❤️
