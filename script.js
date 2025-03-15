//  Storage functions
const STORAGE_KEY = 'tutoring-students';

const loadStudents = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveStudents = (students) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Handle notifications
const setupNotifications = () => {
  if (!('Notification' in window)) return;

  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      checkPaymentNotifications();
      setInterval(checkPaymentNotifications, 1000 * 60 * 60 * 24); // Check daily
    }
  });
};

const checkPaymentNotifications = () => {
  const students = loadStudents();
  const today = new Date();
  
  students.forEach(student => {
    const paymentDate = new Date(student.nextPaymentDate);
    const daysDiff = Math.ceil((paymentDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff <= 3 && daysDiff >= 0) {
      new Notification(`Pago Próximo - ${student.firstName} ${student.lastName}`, {
        body: `El pago vence en ${daysDiff} días`
      });
    }
  });
};

// Calculate next payment date
const calculateNextPaymentDate = (currentPaymentDate) => {
  const nextDate = new Date(currentPaymentDate);
  nextDate.setMonth(nextDate.getMonth() + 1);
  
  // If the day doesn't exist in the next month (e.g., Jan 31 -> Feb 31),
  // set it to the last day of the next month
  if (nextDate.getDate() !== new Date(currentPaymentDate).getDate()) {
    nextDate.setDate(0); // Set to last day of previous month
  }
  
  return nextDate.toISOString().split('T')[0];
};

// Page-specific functionality
document.addEventListener('DOMContentLoaded', () => {
  setupNotifications();
  
  // Form handling (index.html)
  const form = document.getElementById('studentForm');
  if (form) {
    const editingStudent = JSON.parse(localStorage.getItem('editing-student'));
    
    if (editingStudent) {
      form.firstName.value = editingStudent.firstName;
      form.lastName.value = editingStudent.lastName;
      form.startDate.value = editingStudent.startDate;
      form.nextPaymentDate.value = editingStudent.nextPaymentDate;
      form.monthlyFee.value = editingStudent.monthlyFee;
      form.subject.value = editingStudent.subject;
      form.querySelector('button').textContent = 'Guardar Cambios';
    }
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const studentData = {
        id: editingStudent ? editingStudent.id : generateId(),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        startDate: formData.get('startDate'),
        nextPaymentDate: formData.get('nextPaymentDate'),
        monthlyFee: Number(formData.get('monthlyFee')),
        subject: formData.get('subject')
      };
      
      const students = loadStudents();
      
      if (editingStudent) {
        const index = students.findIndex(s => s.id === editingStudent.id);
        students[index] = studentData;
        localStorage.removeItem('editing-student');
      } else {
        students.push(studentData);
      }
      
      saveStudents(students);
      window.location.href = 'lista.html';
    });
  }

  // Student list (lista.html)
  const tableBody = document.querySelector('#studentTable tbody');
  if (tableBody) {
    const renderStudents = () => {
      const students = loadStudents();
      tableBody.innerHTML = students.map(student => `
        <tr>
          <td>
            <div class="student-name">${student.firstName} ${student.lastName}</div>
            <div class="student-date">Desde: ${new Date(student.startDate).toLocaleDateString()}</div>
          </td>
          <td>${student.subject}</td>
          <td>
            <span class="payment-status ${new Date(student.nextPaymentDate) < new Date() ? 'overdue' : 'upcoming'}">
              ${new Date(student.nextPaymentDate).toLocaleDateString()}
            </span>
          </td>
          <td>$${student.monthlyFee}</td>
          <td>
            <div class="action-buttons">
              <button onclick="markPaymentReceived('${student.id}')" class="btn-icon success" title="Marcar pago">✓</button>
              <button onclick="editStudent('${student.id}')" class="btn-icon edit" title="Editar">✎</button>
              <button onclick="deleteStudent('${student.id}')" class="btn-icon delete" title="Eliminar">×</button>
            </div>
          </td>
        </tr>
      `).join('');
    };

    window.markPaymentReceived = (id) => {
      const students = loadStudents();
      const updatedStudents = students.map(student => {
        if (student.id === id) {
          return {
            ...student,
            lastPaymentDate: new Date().toISOString().split('T')[0],
            nextPaymentDate: calculateNextPaymentDate(student.nextPaymentDate)
          };
        }
        return student;
      });
      
      saveStudents(updatedStudents);
      renderStudents();
    };

    window.editStudent = (id) => {
      const student = loadStudents().find(s => s.id === id);
      localStorage.setItem('editing-student', JSON.stringify(student));
      window.location.href = 'index.html';
    };

    window.deleteStudent = (id) => {
      if (confirm('¿Estás seguro de que quieres eliminar este alumno?')) {
        const students = loadStudents().filter(s => s.id !== id);
        saveStudents(students);
        renderStudents();
      }
    };

    renderStudents();
  }

  // Statistics (estadisticas.html)
  const statsContainer = document.querySelector('.stats-grid');
  if (statsContainer) {
    const students = loadStudents();
    
    document.getElementById('totalStudents').textContent = students.length;
    
    const totalIncome = students.reduce((sum, student) => sum + student.monthlyFee, 0);
    document.getElementById('monthlyIncome').textContent = `$${totalIncome}`;
    
    const overduePayments = students.filter(
      student => new Date(student.nextPaymentDate) < new Date()
    ).length;
    document.getElementById('overduePayments').textContent = overduePayments;
  }
});
 