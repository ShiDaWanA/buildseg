// 获取日期列表所在的行
const dateRow = document.getElementById('dateRow');

// 获取当前日期
const currentDate = new Date();

// 获取本周的星期一日期
const firstDayOfWeek = new Date(currentDate);
firstDayOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);

// 填充日期和星期
for (let i = 0; i < 7; i++) {
  const cell = document.createElement('td');
  const date = new Date(firstDayOfWeek);
  date.setDate(firstDayOfWeek.getDate() + i);

  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
  const dayOfMonth = date.getDate();

  cell.textContent = `${dayOfWeek} ${dayOfMonth}`;
  dateRow.appendChild(cell);
}
