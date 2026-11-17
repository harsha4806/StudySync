# StudySync – Cloud-Based Study Planner

\<p align="center">
&#x20; \<strong>A smarter way to organize your studies, manage tasks, and track academic progress.\</strong>
\</p>

\<p align="center">
&#x20; \<img src="[https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge\&logo=html5\&logoColor=white)" alt="HTML5">
&#x20; \<img src="[https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge\&logo=css3\&logoColor=white)" alt="CSS3">
&#x20; \<img src="[https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge\&logo=javascript\&logoColor=black)" alt="JavaScript">
&#x20; \<img src="[https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge\&logo=firebase\&logoColor=black)" alt="Firebase">
\</p>

\<p align="center">
&#x20; \<a href="[https://studysync-77259.web.app](https://studysync-77259.web.app)">Live Website\</a> ·
&#x20; \<a href="[https://github.com/harsha4806/StudySync](https://github.com/harsha4806/StudySync)">GitHub Repository\</a>
\</p>

---

## 📌 About the Project

**StudySync** is a cloud-based study planner designed to help students organize their academic activities in one place.

It provides a simple and user-friendly dashboard where students can manage subjects, create study tasks, monitor task completion, and track their overall study progress.

The application uses Firebase Authentication for secure user login and registration, and Cloud Firestore to store student-specific academic data in the cloud.

StudySync is designed to make study planning easier, more organized, and accessible across multiple devices.

## ✨ Features

### 1. User Authentication

- Student registration using email and password.
- Existing student login.
- Student logout functionality.
- Student display name stored in Firebase Authentication profile.
- Individual student accounts.

### 2. Dashboard

- Overview of total tasks.
- Completed task count.
- Pending task count.
- Total subjects.
- Overall study progress percentage.
- Progress bar for visual progress tracking.
- Upcoming pending tasks.

### 3. Subject Management

- Add new subjects.
- View all added subjects.
- Prevent duplicate subject names.
- Delete subjects.
- Delete associated tasks when deleting a subject.

### 4. Task Management

- Create study tasks.
- Assign tasks to subjects.
- Set task due dates.
- Assign task priorities.
- Mark tasks as completed.
- Reopen completed tasks.
- Delete tasks.
- View tasks in date order.

### 5. Cloud Database

- Student data stored in Firebase Cloud Firestore.
- Each student's records are organized under their Firebase user ID.
- Data remains available after refreshing the website.
- Access personal study data after logging in from another device.

### 6. Responsive Interface

- Clean dashboard layout.
- Sidebar navigation.
- Responsive design for different screen sizes.
- Simple and easy-to-use interface.

## 🛠️ Technologies Used

| Technology              | Purpose                            |
| ----------------------- | ---------------------------------- |
| HTML5                   | Website structure                  |
| CSS3                    | Styling and responsive layout      |
| JavaScript              | Application logic and interactions |
| Firebase Authentication | User registration and login        |
| Cloud Firestore         | Cloud database                     |
| Firebase Hosting        | Website deployment                 |
| Git                     | Version control                    |
| GitHub                  | Source code management             |

## 🏗️ Project Structure

```text
StudySync/
│
├── public/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── firebase-config.js
│   └── 404.html
│
├── .firebaserc
├── .gitignore
├── firebase.json
└── README.md
```

### File Description

| File                 | Description                                                             |
| -------------------- | ----------------------------------------------------------------------- |
| `index.html`         | Main website structure                                                  |
| `style.css`          | Website styling and responsive design                                   |
| `script.js`          | Authentication, task management, subject management and dashboard logic |
| `firebase-config.js` | Firebase initialization and service imports                             |
| `404.html`           | Custom not-found page                                                   |
| `firebase.json`      | Firebase Hosting configuration                                          |
| `.firebaserc`        | Firebase project association                                            |
| `.gitignore`         | Files excluded from Git tracking                                        |
| `README.md`          | Project documentation                                                   |

## 🚀 Getting Started

Follow these steps to run StudySync locally.

### Prerequisites

Make sure you have the following installed:

- A modern web browser (Google Chrome recommended).
- Git.
- Node.js and npm.
- Firebase account.
- Firebase CLI.

### 1. Clone the Repository

Open your terminal and execute:

```bash
git clone https://github.com/harsha4806/StudySync.git
```

Navigate into the project:

```bash
cd StudySync
```

### 2. Install Firebase CLI

If Firebase CLI is not installed, run:

```bash
npm install -g firebase-tools
```

Verify the installation:

```bash
firebase --version
```

### 3. Configure Firebase

Create a Firebase project through the [Firebase Console](https://console.firebase.google.com/).

Enable the following services:

**Firebase Authentication**

1. Open Authentication in Firebase Console.
2. Select Sign-in method.
3. Enable Email/Password authentication.

**Cloud Firestore**

1. Open Firestore Database.
2. Create a database.
3. Select a suitable database location.
4. Configure the database security rules.

### 4. Configure Firebase Credentials

Open:

```text
public/firebase-config.js
```

Replace the placeholder configuration values with your own Firebase Web App configuration.

Example:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Obtain these values from:

Firebase Console → Project Settings → General → Your Apps → Web App.

Save the file after updating the configuration.

**Important:** Do not add Firebase Admin SDK private keys, service-account credentials, passwords, or other private secrets to the public repository.

### 5. Configure Firestore Security Rules

Use the following rules to restrict each authenticated student to their own data:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId}/{document=**} {

      allow read, write:
        if request.auth != null
        && request.auth.uid == userId;

    }
  }
}
```

Publish the rules through Firebase Console → Firestore Database → Rules.

### 6. Run the Project Locally

From the project root, authenticate with Firebase:

```bash
firebase login
```

For local development, you can use a local web server such as VS Code Live Server.

Open the `public` folder with Live Server and access the local URL displayed by the extension.

### 7. Deploy to Firebase Hosting

To deploy the website:

```bash
firebase deploy
```

After deployment, Firebase provides a hosting URL.

## 🌐 Live Demo

**Visit StudySync:**

[https://studysync-77259.web.app](https://studysync-77259.web.app)

The website can be accessed from computers, tablets, and mobile devices with an internet connection.

Students can register and log in using their own accounts.

## 🔐 Data Organization

StudySync uses Cloud Firestore to organize student information.

The database structure is:

```text
users/
  └── userId/
      ├── subjects/
      │   └── subjectId
      │       ├── name
      │       └── createdAt
      │
      └── tasks/
          └── taskId
              ├── title
              ├── subject
              ├── date
              ├── priority
              ├── completed
              └── createdAt
```

Each student's subjects and tasks are stored under their unique Firebase Authentication UID.

This structure helps keep student records separated.

## 🔄 Version Control

This project uses Git and GitHub for source code management.

To upload future changes:

```bash
git add .
git commit -m "Describe your changes"
git push origin main
```

The latest source code is maintained in the GitHub repository.

## 🎯 Future Improvements

The following features are potential enhancements for future versions:

- [ ] Automatic study reminders and notifications.
- [ ] Weekly and monthly study calendars.
- [ ] Advanced progress analytics and charts.
- [ ] Search and filter functionality for tasks.
- [ ] Edit existing subjects and tasks.
- [ ] Study session timer.
- [ ] Dark mode.
- [ ] Improved mobile navigation.
- [ ] Automatic deployment through GitHub Actions.
- [ ] Password reset and account recovery improvements.

## 🎓 Project Purpose

StudySync was developed as a project to demonstrate practical web development skills and the integration of frontend technologies with Firebase backend services.

The project demonstrates:

- Frontend development using HTML, CSS, and JavaScript.
- User authentication using Firebase.
- Cloud database integration using Firestore.
- CRUD operations for subjects and tasks.
- User-specific data organization.
- Responsive web design.
- Version control using Git and GitHub.
- Deployment using Firebase Hosting.

## 👨‍💻 Author

**Harsha**

GitHub: [@harsha4806](https://github.com/harsha4806)

Project: [StudySync](https://github.com/harsha4806/StudySync)

## 📄 License

This project is currently published without a specified open-source license.

All rights are reserved by the author unless a license is added to the repository.

---

\<p align="center">
&#x20; \<strong>StudySync – Plan Better. Study Smarter. Achieve More.\</strong>
\</p>
