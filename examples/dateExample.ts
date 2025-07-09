import {
  listDaysCurrentToNextMonth,
  listDaysInMonth,
  listDaysBetween,
  formatDateString,
  filterWeekdays,
  filterWeekends,
  groupDaysByMonth
} from "@/utils/dateUtils";

// Exemplo 1: Listar todos os dias do mês atual até o próximo
console.log("=== DIAS DO MÊS ATUAL ATÉ O PRÓXIMO ===");
const allDays = listDaysCurrentToNextMonth(true);
console.log(`Total de dias: ${allDays.length}`);

// Mostrar alguns exemplos
allDays.slice(0, 5).forEach(day => {
  console.log(`${formatDateString(day.date)} - ${day.isWeekend ? 'Final de semana' : 'Dia útil'}`);
});

// Exemplo 2: Apenas dias úteis
console.log("\n=== APENAS DIAS ÚTEIS ===");
const weekdays = filterWeekdays(allDays);
console.log(`Dias úteis: ${weekdays.length}`);

// Exemplo 3: Apenas finais de semana
console.log("\n=== APENAS FINAIS DE SEMANA ===");
const weekends = filterWeekends(allDays);
console.log(`Finais de semana: ${weekends.length}`);

// Exemplo 4: Dias de um mês específico
console.log("\n=== JANEIRO 2024 ===");
const january2024 = listDaysInMonth(0, 2024); // Janeiro = 0
console.log(`Dias em Janeiro 2024: ${january2024.length}`);

// Exemplo 5: Próximos 7 dias
console.log("\n=== PRÓXIMOS 7 DIAS ===");
const next7Days = listDaysBetween(
  new Date(),
  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
);
next7Days.forEach(day => {
  console.log(`${formatDateString(day.date)} ${day.isToday ? '(HOJE)' : ''}`);
});

// Exemplo 6: Agrupar por mês
console.log("\n=== AGRUPADO POR MÊS ===");
const grouped = groupDaysByMonth(allDays);
Object.entries(grouped).forEach(([monthKey, days]) => {
  console.log(`${monthKey}: ${days.length} dias`);
});

// Exemplo 7: Encontrar o próximo final de semana
console.log("\n=== PRÓXIMO FINAL DE SEMANA ===");
const nextWeekend = allDays.find(day => day.isWeekend && day.date > new Date());
if (nextWeekend) {
  console.log(`Próximo final de semana: ${formatDateString(nextWeekend.date)}`);
}

// Exemplo 8: Contar dias úteis restantes no mês
console.log("\n=== DIAS ÚTEIS RESTANTES NO MÊS ===");
const today = new Date();
const remainingWeekdays = weekdays.filter(day => day.date >= today);
console.log(`Dias úteis restantes no mês: ${remainingWeekdays.length}`);

export {
  allDays,
  weekdays,
  weekends,
  january2024,
  next7Days,
  grouped
}; 