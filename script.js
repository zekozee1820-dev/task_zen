const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const translations = {
  ar: {
    title: "📋 TaskZen",
    placeholder: "اكتب المهمة هنا",
    add: "إضافة"
  },
  en: {
    title: "📋 TaskZen",
    placeholder: "Write your task",
    add: "Add"
  }
};

// تحميل المهام
window.onload = () => {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(task => createTask(task.text, task.done));
  changeLang();
};

function addTask() {
  if (taskInput.value.trim() === "") return;
  createTask(taskInput.value, false);
  saveTasks();
  taskInput.value = "";
}

function createTask(text, done) {
  const li = document.createElement("li");
  li.textContent = text;

  if (done) li.classList.add("done");

  li.onclick = () => {
    li.classList.toggle("done");
    saveTasks();
  };

  const delBtn = document.createElement("button");
  delBtn.textContent = "❌";
  delBtn.onclick = (e) => {
    e.stopPropagation();
    li.remove();
    saveTasks();
  };

  li.appendChild(delBtn);
  taskList.appendChild(li);
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll("li").forEach(li => {
    tasks.push({
      text: li.firstChild.textContent,
      done: li.classList.contains("done")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function clearAll() {
  if (confirm("متأكد تحذف كل المهام؟")) {
    taskList.innerHTML = "";
    localStorage.removeItem("tasks");
  }
}

function exportPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  pdf.text("TaskZen - My Tasks", 10, 10);

  let y = 20;
  document.querySelectorAll("li").forEach((li, i) => {
    pdf.text(`${i + 1}. ${li.firstChild.textContent}`, 10, y);
    y += 10;
  });

  pdf.save("tasks.pdf");
}

function shareApp() {
  const text = "جرب تطبيق TaskZen لتنظيم مهامك اليومية 🔥";
  if (navigator.share) {
    navigator.share({
      title: "TaskZen",
      text: text,
      url: window.location.href
    });
  } else {
    alert("انسخ الرابط وابعته:\n" + window.location.href);
  }
}

function changeLang() {
  const lang = document.getElementById("langSelect").value;
  document.getElementById("title").textContent = translations[lang].title;
  taskInput.placeholder = translations[lang].placeholder;
  document.getElementById("addBtn").textContent = translations[lang].add;
}
