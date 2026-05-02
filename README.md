
#  Online Quiz Platform

A full-stack web application for creating, managing, and attempting quizzes with dedicated **Admin** and **Student** dashboards. The platform supports timed quizzes, automatic evaluation, and performance tracking.


# Features

The system is divided into two main modules:

**Admin Dashboard:**
Admins can create, update, and delete quizzes, add multiple-choice questions, and set time limits. This allows complete control over quiz content and structure.

**Student Dashboard:**
Students can register, log in, attempt quizzes, and view results. Each quiz is timed and automatically submitted, with instant feedback on performance.

##  Tech Stack
* **Frontend:** HTML, CSS, JavaScript, Bootstrap
* **Backend:** Node.js (Express.js)
* **Database:** MongoDB

##  Installation & Setup

Clone the repository:
```bash
git clone https://github.com/your-username/online-quiz-platform.git
cd online-quiz-platform
```

Install dependencies:
```bash
npm install
```

Create a `.env` file:
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Run the application:
```bash
npm start
```

Open in browser:
[http://localhost:5000](http://localhost:5000)

