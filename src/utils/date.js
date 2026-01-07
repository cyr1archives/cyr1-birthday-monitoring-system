export function calculateAge(birthday) {
  const dob = new Date(birthday);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;

  return age;
}

export function isBirthdayToday(birthday) {
  const today = new Date();
  const b = new Date(birthday);
  return (
    today.getDate() === b.getDate() &&
    today.getMonth() === b.getMonth()
  );
}

export function getUpcoming(employees, days = 3) {
  const today = new Date();
  const limit = new Date();
  limit.setDate(today.getDate() + days);

  return employees
    .map(e => {
      const next = new Date(
        today.getFullYear(),
        new Date(e.birthday).getMonth(),
        new Date(e.birthday).getDate()
      );
      if (next < today) next.setFullYear(today.getFullYear() + 1);
      return { ...e, nextBirthday: next };
    })
    .filter(e => e.nextBirthday <= limit)
    .sort((a, b) => a.nextBirthday - b.nextBirthday);
}
export function getMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay(); // Sun = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const matrix = [];
  let week = [];

  for (let i = 0; i < startDay; i++) {
    week.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    week.push(new Date(year, month, day));
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  }

  if (week.length) {
    while (week.length < 7) week.push(null);
    matrix.push(week);
  }

  return matrix;
}

export function getBirthdaysForDate(employees, date) {
  return employees.filter(e => {
    const b = new Date(e.birthday);
    return (
      b.getDate() === date.getDate() &&
      b.getMonth() === date.getMonth()
    );
  });
}

