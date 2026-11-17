
// ==========================================
// 1. FIREBASE IMPORTS
// ==========================================

import {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "./firebase-config.js";


// ==========================================
// 2. HTML ELEMENT REFERENCES
// ==========================================

const authScreen = document.getElementById("authScreen");
const appScreen = document.querySelector(".app");

const loginForm = document.getElementById("login");
const registerForm = document.getElementById("register");

const loginSection = document.getElementById("loginForm");
const registerSection = document.getElementById("registerForm");

const authMessage = document.getElementById("authMessage");

const userEmail = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");


// ==========================================
// 3. APPLICATION VARIABLES
// ==========================================

let currentUser = null;

let subjects = [];
let tasks = [];


// ==========================================
// 4. AUTHENTICATION FORM NAVIGATION
// ==========================================

// Switch to registration screen

document.getElementById("showRegister")
  .addEventListener("click", event => {

    event.preventDefault();

    loginSection.hidden = true;
    registerSection.hidden = false;

    authMessage.textContent = "";
  });


// Switch to login screen

document.getElementById("showLogin")
  .addEventListener("click", event => {

    event.preventDefault();

    registerSection.hidden = true;
    loginSection.hidden = false;

    authMessage.textContent = "";
  });


// ==========================================
// 5. STUDENT REGISTRATION
// ==========================================

registerForm.addEventListener("submit", async event => {

  event.preventDefault();

  const name = document.getElementById("registerName")
    .value.trim();

  const email = document.getElementById("registerEmail")
    .value.trim();

  const password = document.getElementById("registerPassword")
    .value;

  if (!name || !email || !password) {
    authMessage.textContent = "Please fill in all fields.";
    return;
  }

  try {

    authMessage.textContent = "Creating your account...";

    const result = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Save student's name in Firebase profile

    await updateProfile(result.user, {
      displayName: name
    });

    authMessage.textContent = "Account created successfully!";

    registerForm.reset();

  } catch (error) {

    console.error("Registration error:", error);

    authMessage.textContent = error.message;

  }

});


// ==========================================
// 6. STUDENT LOGIN
// ==========================================

loginForm.addEventListener("submit", async event => {

  event.preventDefault();

  const email = document.getElementById("loginEmail")
    .value.trim();

  const password = document.getElementById("loginPassword")
    .value;

  try {

    authMessage.textContent = "Logging in...";

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    authMessage.textContent = "";

    loginForm.reset();

  } catch (error) {

    console.error("Login error:", error);

    authMessage.textContent = error.message;

  }

});


// ==========================================
// 7. STUDENT LOGOUT
// ==========================================

logoutBtn.addEventListener("click", async () => {

  try {

    await signOut(auth);

    // Firebase authentication listener
    // automatically returns the user to login.

  } catch (error) {

    console.error("Logout error:", error);

    alert("Unable to log out: " + error.message);

  }

});


// ==========================================
// 8. FIREBASE AUTHENTICATION STATE
// ==========================================

onAuthStateChanged(auth, async user => {

  currentUser = user;

  if (user) {

    // Show application

    authScreen.hidden = true;
    appScreen.hidden = false;

    userEmail.textContent = user.email || "";

    // Clear previous account's data

    subjects = [];
    tasks = [];

    render();

    try {

      await loadCloudData();

      render();

    } catch (error) {

      console.error("Cloud data loading error:", error);

      alert(
        "Unable to load your cloud data: " + error.message
      );

    }

  } else {

    // Show authentication screen

    authScreen.hidden = false;
    appScreen.hidden = true;

    userEmail.textContent = "";

    // Clear application data on logout

    subjects = [];
    tasks = [];

    render();

  }

});


// ==========================================
// 9. FIRESTORE COLLECTION REFERENCES
// ==========================================

function getSubjectsCollection() {

  if (!currentUser) {
    throw new Error("No authenticated user.");
  }

  return collection(
    db,
    "users",
    currentUser.uid,
    "subjects"
  );

}


function getTasksCollection() {

  if (!currentUser) {
    throw new Error("No authenticated user.");
  }

  return collection(
    db,
    "users",
    currentUser.uid,
    "tasks"
  );

}


// ==========================================
// 10. LOAD DATA FROM FIRESTORE
// ==========================================

async function loadCloudData() {

  if (!currentUser) {
    return;
  }

  // Keep reference to the account being loaded

  const loadingUser = currentUser;

  const [subjectSnapshot, taskSnapshot] =
    await Promise.all([

      getDocs(getSubjectsCollection()),

      getDocs(getTasksCollection())

    ]);

  // Prevent old account data from replacing
  // the currently authenticated account's data.

  if (
    !currentUser ||
    currentUser.uid !== loadingUser.uid
  ) {
    return;
  }

  subjects = subjectSnapshot.docs.map(item => ({

    id: item.id,

    ...item.data()

  }));

  tasks = taskSnapshot.docs.map(item => ({

    id: item.id,

    ...item.data()

  }));

}


// ==========================================
// 11. ADD SUBJECT TO FIRESTORE
// ==========================================

document.getElementById("subjectForm")
  .addEventListener("submit", async event => {

    event.preventDefault();

    if (!currentUser) {
      alert("Please log in first.");
      return;
    }

    const input = document.getElementById("subjectName");

    const name = input.value.trim();

    if (!name) {
      return;
    }

    // Check duplicate subjects

    const duplicate = subjects.some(subject =>
      typeof subject.name === "string" &&
      subject.name.toLowerCase() === name.toLowerCase()
    );

    if (duplicate) {

      alert("Subject already exists.");

      return;

    }

    try {

      await addDoc(getSubjectsCollection(), {

        name: name,

        createdAt: new Date().toISOString()

      });

      input.value = "";

      await loadCloudData();

      render();

    } catch (error) {

      console.error("Add subject error:", error);

      alert(
        "Unable to add subject: " + error.message
      );

    }

  });


// ==========================================
// 12. ADD TASK TO FIRESTORE
// ==========================================

document.getElementById("taskForm")
  .addEventListener("submit", async event => {

    event.preventDefault();

    if (!currentUser) {
      alert("Please log in first.");
      return;
    }

    const title = document.getElementById("taskTitle")
      .value.trim();

    const subject = document.getElementById("taskSubject")
      .value;

    const date = document.getElementById("taskDate")
      .value;

    const priority = document.getElementById("taskPriority")
      .value;

    if (!title || !subject || !date) {
      alert("Please complete all task fields.");
      return;
    }

    // Ensure the selected subject exists

    if (!subjects.some(s => s.name === subject)) {

      alert("Please select a valid subject.");

      return;

    }

    try {

      await addDoc(getTasksCollection(), {

        title: title,

        subject: subject,

        date: date,

        priority: priority,

        completed: false,

        createdAt: new Date().toISOString()

      });

      document.getElementById("taskForm").reset();

      await loadCloudData();

      render();

    } catch (error) {

      console.error("Add task error:", error);

      alert(
        "Unable to add task: " + error.message
      );

    }

  });


// ==========================================
// 13. COMPLETE OR REOPEN TASK
// ==========================================

async function toggleTask(id) {

  if (!currentUser) {
    return;
  }

  const task = tasks.find(t => t.id === id);

  if (!task) {
    return;
  }

  try {

    await updateDoc(

      doc(
        db,
        "users",
        currentUser.uid,
        "tasks",
        id
      ),

      {
        completed: !task.completed
      }

    );

    await loadCloudData();

    render();

  } catch (error) {

    console.error("Task update error:", error);

    alert(
      "Unable to update task: " + error.message
    );

  }

}


// ==========================================
// 14. DELETE TASK FROM FIRESTORE
// ==========================================

async function deleteTask(id) {

  if (!currentUser) {
    return;
  }

  if (!confirm("Are you sure you want to delete this task?")) {
    return;
  }

  try {

    await deleteDoc(

      doc(
        db,
        "users",
        currentUser.uid,
        "tasks",
        id
      )

    );

    await loadCloudData();

    render();

  } catch (error) {

    console.error("Delete task error:", error);

    alert(
      "Unable to delete task: " + error.message
    );

  }

}


// ==========================================
// 15. DELETE SUBJECT AND RELATED TASKS
// ==========================================

async function deleteSubject(id) {

  if (!currentUser) {
    return;
  }

  const subject = subjects.find(s => s.id === id);

  if (!subject) {
    return;
  }

  if (!confirm(
    "Delete this subject and all its associated tasks?"
  )) {
    return;
  }

  try {

    // Find all tasks belonging to this subject

    const relatedTasks = tasks.filter(
      task => task.subject === subject.name
    );

    // Delete related tasks first

    await Promise.all(

      relatedTasks.map(task =>

        deleteDoc(

          doc(
            db,
            "users",
            currentUser.uid,
            "tasks",
            task.id
          )

        )

      )

    );

    // Delete the subject

    await deleteDoc(

      doc(
        db,
        "users",
        currentUser.uid,
        "subjects",
        id
      )

    );

    await loadCloudData();

    render();

  } catch (error) {

    console.error("Delete subject error:", error);

    alert(
      "Unable to delete subject: " + error.message
    );

  }

}


// ==========================================
// 16. SAFE HTML ELEMENT CREATION
// ==========================================

function createElement(tag, text, className = "") {

  const element = document.createElement(tag);

  element.textContent = text;

  if (className) {

    element.className = className;

  }

  return element;

}


// ==========================================
// 17. CREATE TASK ROW
// ==========================================

function createTaskRow(task, showActions = true) {

  const row = createElement(

    "div",

    "",

    task.completed ? "item done" : "item"

  );

  const info = createElement(
    "div",
    "",
    "item-info"
  );

  info.appendChild(

    createElement(
      "strong",
      task.title || "Untitled task"
    )

  );

  info.appendChild(

    createElement(

      "small",

      `${task.subject || "No subject"} • ${task.date || "No date"} • ${task.priority || "Normal"}`

    )

  );

  row.appendChild(info);


  if (showActions) {

    const actions = createElement(
      "div",
      "",
      "actions"
    );

    // Complete / Reopen button

    const toggle = createElement(

      "button",

      task.completed ? "Reopen" : "Complete"

    );

    toggle.type = "button";

    toggle.addEventListener("click", () => {

      toggleTask(task.id);

    });


    // Delete button

    const remove = createElement(

      "button",

      "Delete",

      "delete"

    );

    remove.type = "button";

    remove.addEventListener("click", () => {

      deleteTask(task.id);

    });


    actions.append(toggle, remove);

    row.appendChild(actions);

  }

  return row;

}


// ==========================================
// 18. RENDER DASHBOARD STATISTICS
// ==========================================

function render() {

  const completed = tasks.filter(

    task => task.completed === true

  ).length;

  const pending = tasks.length - completed;


  // Update statistics

  document.getElementById("totalTasks").textContent =
    tasks.length;

  document.getElementById("completedTasks").textContent =
    completed;

  document.getElementById("pendingTasks").textContent =
    pending;

  document.getElementById("totalSubjects").textContent =
    subjects.length;


  // Calculate progress percentage

  const progress = tasks.length > 0

    ? Math.round(
        (completed / tasks.length) * 100
      )

    : 0;


  document.getElementById("progressText").textContent =
    `${progress}% completed`;


  document.getElementById("progressBar").style.width =
    `${progress}%`;


  // Update accessibility information

  document.querySelector(".progress-track")
    .setAttribute("aria-valuenow", progress);


  // ========================================
  // SUBJECT DROPDOWN
  // ========================================

  const subjectSelect =
    document.getElementById("taskSubject");

  subjectSelect.replaceChildren(

    new Option("Select subject", "")

  );

  subjects.forEach(subject => {

    subjectSelect.add(

      new Option(
        subject.name,
        subject.name
      )

    );

  });


  // ========================================
  // SUBJECT LIST
  // ========================================

  const subjectList =
    document.getElementById("subjectList");

  subjectList.replaceChildren();

  subjects.forEach(subject => {

    const row = createElement(
      "div",
      "",
      "item"
    );

    row.appendChild(

      createElement(
        "strong",
        subject.name
      )

    );

    const remove = createElement(
      "button",
      "Delete",
      "delete"
    );

    remove.type = "button";

    remove.addEventListener("click", () => {

      deleteSubject(subject.id);

    });

    row.appendChild(remove);

    subjectList.appendChild(row);

  });


  if (subjects.length === 0) {

    subjectList.appendChild(

      createElement(
        "p",
        "No subjects yet. Add your first subject!",
        "empty"
      )

    );

  }


  // ========================================
  // TASK LIST
  // ========================================

  const taskList =
    document.getElementById("taskList");

  taskList.replaceChildren();

  const sortedTasks = [...tasks].sort(

    (a, b) => {

      const dateA = a.date || "";
      const dateB = b.date || "";

      return dateA.localeCompare(dateB);

    }

  );

  sortedTasks.forEach(task => {

    taskList.appendChild(

      createTaskRow(task)

    );

  });


  if (tasks.length === 0) {

    taskList.appendChild(

      createElement(
        "p",
        "No tasks yet. Start planning your studies!",
        "empty"
      )

    );

  }


  // ========================================
  // UPCOMING PENDING TASKS
  // ========================================

  const upcoming =
    document.getElementById("upcomingTasks");

  upcoming.replaceChildren();

  const upcomingList = sortedTasks

    .filter(task => !task.completed)

    .slice(0, 5);


  upcomingList.forEach(task => {

    upcoming.appendChild(

      createTaskRow(task, false)

    );

  });


  if (upcomingList.length === 0) {

    upcoming.appendChild(

      createElement(
        "p",
        "No pending tasks. Great work!",
        "empty"
      )

    );

  }

}


// ==========================================
// 19. PAGE NAVIGATION
// ==========================================

document.querySelectorAll(".nav-btn[data-page]")

  .forEach(button => {

    button.addEventListener("click", () => {

      // Remove active state from navigation buttons

      document.querySelectorAll(".nav-btn[data-page]")

        .forEach(item => {

          item.classList.remove("active");

        });


      // Hide all pages

      document.querySelectorAll(".page")

        .forEach(page => {

          page.classList.remove("active");

        });


      // Activate selected navigation button

      button.classList.add("active");


      // Display selected page

      const selectedPage = document.getElementById(
        button.dataset.page
      );

      if (selectedPage) {

        selectedPage.classList.add("active");

      }

    });

  });
