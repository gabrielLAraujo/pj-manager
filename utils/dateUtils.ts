export interface DayInfo {
  date: Date;
  dayOfWeek: string;
  dayOfMonth: number;
  month: string;
  year: number;
  isToday: boolean;
  isWeekend: boolean;
}

/**
 * Lista todos os dias do mês atual até o próximo mês
 * @param includeNextMonth - Se deve incluir os dias do próximo mês (padrão: true)
 * @returns Array com informações de cada dia
 */
export function listDaysCurrentToNextMonth(includeNextMonth: boolean = true): DayInfo[] {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const days: DayInfo[] = [];
  
  // Dias do mês atual
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  for (let day = 1; day <= daysInCurrentMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    days.push(createDayInfo(date, today));
  }
  
  // Dias do próximo mês (se solicitado)
  if (includeNextMonth) {
    const nextMonth = currentMonth + 1;
    const nextYear = nextMonth > 11 ? currentYear + 1 : currentYear;
    const adjustedNextMonth = nextMonth > 11 ? 0 : nextMonth;
    
    const daysInNextMonth = new Date(nextYear, adjustedNextMonth + 1, 0).getDate();
    
    for (let day = 1; day <= daysInNextMonth; day++) {
      const date = new Date(nextYear, adjustedNextMonth, day);
      days.push(createDayInfo(date, today));
    }
  }
  
  return days;
}

/**
 * Lista todos os dias de um mês específico
 * @param month - Mês (0-11)
 * @param year - Ano
 * @returns Array com informações de cada dia do mês
 */
export function listDaysInMonth(month: number, year: number): DayInfo[] {
  const today = new Date();
  const days: DayInfo[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    days.push(createDayInfo(date, today));
  }
  
  return days;
}

/**
 * Lista todos os dias entre duas datas
 * @param startDate - Data inicial
 * @param endDate - Data final
 * @returns Array com informações de cada dia no período
 */
export function listDaysBetween(startDate: Date, endDate: Date): DayInfo[] {
  const days: DayInfo[] = [];
  const today = new Date();
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    days.push(createDayInfo(new Date(currentDate), today));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return days;
}

/**
 * Cria objeto com informações do dia
 */
function createDayInfo(date: Date, today: Date): DayInfo {
  const dayNames = [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 
    'Quinta-feira', 'Sexta-feira', 'Sábado'
  ];
  
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  const dayOfWeek = date.getDay();
  
  return {
    date: new Date(date),
    dayOfWeek: dayNames[dayOfWeek],
    dayOfMonth: date.getDate(),
    month: monthNames[date.getMonth()],
    year: date.getFullYear(),
    isToday: date.toDateString() === today.toDateString(),
    isWeekend: dayOfWeek === 0 || dayOfWeek === 6
  };
}

/**
 * Formata uma data para string legível
 * @param date - Data para formatar
 * @returns String formatada (ex: "Segunda-feira, 15 de Janeiro de 2024")
 */
export function formatDateString(date: Date): string {
  const dayInfo = createDayInfo(date, new Date());
  return `${dayInfo.dayOfWeek}, ${dayInfo.dayOfMonth} de ${dayInfo.month} de ${dayInfo.year}`;
}

/**
 * Filtra apenas dias úteis (segunda a sexta)
 * @param days - Array de dias
 * @returns Array apenas com dias úteis
 */
export function filterWeekdays(days: DayInfo[]): DayInfo[] {
  return days.filter(day => !day.isWeekend);
}

/**
 * Filtra apenas finais de semana
 * @param days - Array de dias
 * @returns Array apenas com finais de semana
 */
export function filterWeekends(days: DayInfo[]): DayInfo[] {
  return days.filter(day => day.isWeekend);
}

/**
 * Agrupa dias por mês
 * @param days - Array de dias
 * @returns Objeto com dias agrupados por mês
 */
export function groupDaysByMonth(days: DayInfo[]): Record<string, DayInfo[]> {
  return days.reduce((acc, day) => {
    const monthKey = `${day.year}-${day.month}`;
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(day);
    return acc;
  }, {} as Record<string, DayInfo[]>);
} 