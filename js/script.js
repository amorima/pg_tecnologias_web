/* js/script.js */

/* Chaves no localStorage */
const ADMIN_KEY = 'myAdmin';
const COURSES_KEY = 'myCourses';
const SUBJECTS_KEY = 'mySubjects';
const STUDENTS_KEY = 'myStudents';
const TEACHERS_KEY = 'myTeachers';
const GRADES_KEY = 'myGrades';
const NOTIFICATIONS_KEY = 'myNotifications';
const SCHEDULES_KEY = 'mySchedules';

/* Inicialização de dados padrão */
(function initializeDefaults(){
  // Admin default = ADMIN / ADMIN
  if (!localStorage.getItem(ADMIN_KEY)) {
    const adminData = { email: 'ADMIN', password: 'ADMIN' };
    localStorage.setItem(ADMIN_KEY, JSON.stringify(adminData));
  }

  // Cursos padrão
  if (!localStorage.getItem(COURSES_KEY)) {
    const defaultCourses = [
      "Licenciatura em Cinema e Audiovisual",
      "Licenciatura em Design",
      "Licenciatura em Fotografia",
      "Licenciatura em Multimédia",
      "Licenciatura em Tecnologias e Sistemas de Informação Para a Web",
      "Licenciatura em Tecnologias para a Educação STEAM"
    ];
    localStorage.setItem(COURSES_KEY, JSON.stringify(defaultCourses));
  }

  // Disciplinas padrão
  if (!localStorage.getItem(SUBJECTS_KEY)) {
    const defaultSubjects = [
      "Algoritmia e Estruturas de Dados",
      "Fundamentos de Design",
      "Matemática I",
      "Sistemas Computacionais",
      "Tecnologias Web",
      "Conceção e Produção Multimédia",
      "Interfaces e Design para Aplicações",
      "Matemática II",
      "Programação Orientada a Objetos"
    ];
    localStorage.setItem(SUBJECTS_KEY, JSON.stringify(defaultSubjects));
  }
})();

/* Util */
function loadData(key) {
  const str = localStorage.getItem(key);
  return str ? JSON.parse(str) : [];
}
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
function loadObj(key) {
  const str = localStorage.getItem(key);
  return str ? JSON.parse(str) : null;
}
function saveObj(key, obj) {
  localStorage.setItem(key, JSON.stringify(obj));
}
function generateId(arr) {
  let max = 0;
  for (const o of arr) if (o.id > max) max = o.id;
  return max + 1;
}

/* Admin */
function getAdmin() {
  return loadObj(ADMIN_KEY); // { email, password }
}

/* Estudantes */
function readAllStudents() {
  return loadData(STUDENTS_KEY);
}
function createStudent({ name, email, password, course, profilePicture }) {
  const all = readAllStudents();
  const newId = generateId(all);
  all.push({
    id: newId,
    name,
    email,
    password,
    course,
    profilePicture: profilePicture || '',
    infoExtra: '' // campo adicional
  });
  saveData(STUDENTS_KEY, all);
}
function getStudentById(id) {
  return readAllStudents().find(s => s.id === Number(id));
}
function updateStudent(std) {
  let all = readAllStudents();
  const idx = all.findIndex(s => s.id === std.id);
  if (idx !== -1) {
    all[idx] = std;
    saveData(STUDENTS_KEY, all);
  }
}
function deleteStudent(id) {
  let all = readAllStudents();
  all = all.filter(s => s.id !== id);
  saveData(STUDENTS_KEY, all);
}

/* Professores */
function readAllTeachers() {
  return loadData(TEACHERS_KEY);
}
function createTeacher({ name, email, password, subject, profilePicture }) {
  const all = readAllTeachers();
  const newId = generateId(all);
  all.push({
    id: newId,
    name,
    email,
    password,
    subject,
    profilePicture: profilePicture || '',
    infoContact: '',
    approved: false
  });
  saveData(TEACHERS_KEY, all);
}
function getTeacherById(id) {
  return readAllTeachers().find(t => t.id === Number(id));
}
function updateTeacher(tu) {
  let all = readAllTeachers();
  const idx = all.findIndex(x => x.id === tu.id);
  if (idx !== -1) {
    all[idx] = tu;
    saveData(TEACHERS_KEY, all);
  }
}
function deleteTeacher(id) {
  let all = readAllTeachers();
  all = all.filter(x => x.id !== id);
  saveData(TEACHERS_KEY, all);
}
function approveTeacher(id) {
  let all = readAllTeachers();
  const idx = all.findIndex(x => x.id === id);
  if (idx !== -1) {
    all[idx].approved = true;
    saveData(TEACHERS_KEY, all);
  }
}

/* Login */
function login(email, password) {
  // Admin
  const ad = getAdmin();
  if (ad && email === ad.email && password === ad.password) {
    return { success: true, role: 'admin', userId: 0 };
  }
  // Professor
  const tch = readAllTeachers();
  const foundT = tch.find(t => t.email === email && t.password === password);
  if (foundT) {
    if (!foundT.approved) {
      return { success: false, message: 'Professor não aprovado ainda!' };
    }
    return { success: true, role: 'teacher', userId: foundT.id };
  }
  // Estudante
  const std = readAllStudents();
  const foundS = std.find(s => s.email === email && s.password === password);
  if (foundS) {
    return { success: true, role: 'student', userId: foundS.id };
  }
  return { success: false, message: 'Credenciais inválidas!' };
}

/* Registo */
function registerStudent({ name, email, password, course }) {
  const ad = getAdmin();
  if (ad && ad.email === email) return { success: false, message: 'Email já registado!' };
  const tch = readAllTeachers();
  const std = readAllStudents();
  if (tch.some(t => t.email === email) || std.some(s => s.email === email)) {
    return { success: false, message: 'Email já registado!' };
  }
  createStudent({ name, email, password, course });
  return { success: true, message: 'Estudante registado com sucesso!' };
}
function registerTeacher({ name, email, password, subject }) {
  const ad = getAdmin();
  if (ad && ad.email === email) return { success: false, message: 'Email já registado!' };
  const tch = readAllTeachers();
  const std = readAllStudents();
  if (tch.some(t => t.email === email) || std.some(s => s.email === email)) {
    return { success: false, message: 'Email já registado!' };
  }
  createTeacher({ name, email, password, subject });
  return { success: true, message: 'Docente registado, aguarde aprovação do admin!' };
}

/* Sessão */
function setLoggedUser(id, role) {
  localStorage.setItem('loggedUserId', id);
  localStorage.setItem('loggedUserRole', role);
}
function getLoggedUser() {
  return {
    id: localStorage.getItem('loggedUserId'),
    role: localStorage.getItem('loggedUserRole')
  };
}
function clearLoggedUser() {
  localStorage.removeItem('loggedUserId');
  localStorage.removeItem('loggedUserRole');
}

/* Notificações */
function loadNotifications() {
  const str = localStorage.getItem(NOTIFICATIONS_KEY);
  return str ? JSON.parse(str) : [];
}
function saveNotifications(arr) {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(arr));
}
function createNotification({ userId, message }) {
  const arr = loadNotifications();
  const newId = generateId(arr);
  arr.push({ id: newId, userId: Number(userId), message, read: false });
  saveNotifications(arr);
}
function readNotifications(userId) {
  const arr = loadNotifications();
  return arr.filter(n => n.userId === Number(userId));
}
function markNotificationAsRead(id) {
  const arr = loadNotifications();
  const idx = arr.findIndex(x => x.id === id);
  if (idx !== -1) {
    arr[idx].read = true;
    saveNotifications(arr);
  }
}

/* Notas: { id, studentId, subject, evaluation, grade, date } */
function loadGrades() {
  const str = localStorage.getItem(GRADES_KEY);
  return str ? JSON.parse(str) : [];
}
function saveGrades(arr) {
  localStorage.setItem(GRADES_KEY, JSON.stringify(arr));
}
function createGrade({ studentId, subject, evaluation, grade }) {
  const all = loadGrades();
  const newId = generateId(all);
  all.push({
    id: newId,
    studentId: Number(studentId),
    subject,
    evaluation,
    grade: Number(grade),
    date: new Date().toISOString()
  });
  saveGrades(all);
  // Notificar
  createNotification({
    userId: Number(studentId),
    message: `Nova nota lançada em ${subject} (${evaluation}): ${grade}`
  });
}
function readAllGrades() {
  return loadGrades();
}
function readGradesByStudent(sid) {
  return loadGrades().filter(x => x.studentId === Number(sid));
}
function deleteGrade(id) {
  let all = loadGrades();
  all = all.filter(x => x.id !== id);
  saveGrades(all);
}

/* Horários: { id, course, day, startTime, endTime, subject } */
function loadSchedules() {
  const str = localStorage.getItem(SCHEDULES_KEY);
  return str ? JSON.parse(str) : [];
}
function saveSchedules(arr) {
  localStorage.setItem(SCHEDULES_KEY, JSON.stringify(arr));
}
function createSchedule({ course, day, startTime, endTime, subject }) {
  const all = loadSchedules();
  const newId = generateId(all);
  all.push({ id: newId, course, day, startTime, endTime, subject });
  saveSchedules(all);
}
function readAllSchedules() {
  return loadSchedules();
}
function deleteSchedule(id) {
  let all = loadSchedules();
  all = all.filter(s => s.id !== id);
  saveSchedules(all);
}

/* Cursos e Disciplinas */
function getCoursesList() {
  return loadData(COURSES_KEY);
}
function getSubjectsList() {
  return loadData(SUBJECTS_KEY);
}

/* Avatar e infos */
function updateProfilePicture(userId, role, base64) {
  if (role === 'student') {
    const st = getStudentById(userId);
    if (st) {
      st.profilePicture = base64;
      updateStudent(st);
    }
  } else if (role === 'teacher') {
    const t = getTeacherById(userId);
    if (t) {
      t.profilePicture = base64;
      updateTeacher(t);
    }
  }
}
function updateTeacherContact(userId, newInfo) {
  const t = getTeacherById(userId);
  if (t) {
    t.infoContact = newInfo;
    updateTeacher(t);
  }
}
function updateStudentInfoExtra(userId, info) {
  const st = getStudentById(userId);
  if (st) {
    st.infoExtra = info;
    updateStudent(st);
  }
}
