import { useEffect, useState } from "react";
import { useEmployees } from "../../context/EmployeesContext.jsx";

export function useNotifications() {
  const { employees } = useEmployees();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const today = new Date();

    const todaysBirthdays = employees.filter(e => {
      const d = new Date(e.birthday);
      return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth()
      );
    });

    if (todaysBirthdays.length > 0) {
      setNotifications(
        todaysBirthdays.map(e => ({
          id: `bday-${e.id}`,
          message: `🎉 Today is ${e.name}'s birthday`
        }))
      );
    }
  }, [employees]);

  function dismissNotification(id) {
    setNotifications(n => n.filter(x => x.id !== id));
  }

  function clearAllNotifications() {
    setNotifications([]);
  }

  return {
    notifications,
    dismissNotification,
    clearAllNotifications
  };
}
