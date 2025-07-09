"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  listDaysCurrentToNextMonth,
  listDaysInMonth,
  listDaysBetween,
  formatDateString,
  filterWeekdays,
  filterWeekends,
  groupDaysByMonth,
  DayInfo,
} from "@/utils/dateUtils";

export function CalendarExample() {
  const [days, setDays] = useState<DayInfo[]>([]);
  const [filter, setFilter] = useState<"all" | "weekdays" | "weekends">("all");
  const [groupByMonth, setGroupByMonth] = useState(false);

  useEffect(() => {
    // Lista todos os dias do mês atual até o próximo
    const allDays = listDaysCurrentToNextMonth(true);
    setDays(allDays);
  }, []);

  const getFilteredDays = () => {
    switch (filter) {
      case "weekdays":
        return filterWeekdays(days);
      case "weekends":
        return filterWeekends(days);
      default:
        return days;
    }
  };

  const renderDays = () => {
    const filteredDays = getFilteredDays();

    if (groupByMonth) {
      const grouped = groupDaysByMonth(filteredDays);
      return Object.entries(grouped).map(([monthKey, monthDays]) => (
        <div key={monthKey} className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            {monthDays[0].month} de {monthDays[0].year}
          </h3>
          <div className="grid grid-cols-7 gap-2">
            {monthDays.map((day, index) => (
              <DayCard key={index} day={day} />
            ))}
          </div>
        </div>
      ));
    }

    return (
      <div className="grid grid-cols-7 gap-2">
        {filteredDays.map((day, index) => (
          <DayCard key={index} day={day} />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Calendário - Mês Atual até Próximo</CardTitle>
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              Todos os dias ({days.length})
            </Button>
            <Button
              variant={filter === "weekdays" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("weekdays")}
            >
              Dias úteis ({filterWeekdays(days).length})
            </Button>
            <Button
              variant={filter === "weekends" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("weekends")}
            >
              Finais de semana ({filterWeekends(days).length})
            </Button>
            <Button
              variant={groupByMonth ? "default" : "outline"}
              size="sm"
              onClick={() => setGroupByMonth(!groupByMonth)}
            >
              {groupByMonth ? "Desagrupar" : "Agrupar por mês"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>{renderDays()}</CardContent>
      </Card>

      {/* Exemplos de outras funções */}
      <div className="mt-8 space-y-4">
        <ExampleCard
          title="Exemplo: Apenas Janeiro 2024"
          days={listDaysInMonth(0, 2024)} // Janeiro = 0
        />

        <ExampleCard
          title="Exemplo: Próximos 7 dias"
          days={listDaysBetween(
            new Date(),
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          )}
        />
      </div>
    </div>
  );
}

function DayCard({ day }: { day: DayInfo }) {
  return (
    <div
      className={`
      p-2 border rounded-lg text-center text-sm
      ${day.isToday ? "bg-blue-100 border-blue-300" : "bg-white"}
      ${day.isWeekend ? "bg-gray-50" : ""}
    `}
    >
      <div className="font-medium">{day.dayOfMonth}</div>
      <div className="text-xs text-gray-600 truncate">
        {day.dayOfWeek.slice(0, 3)}
      </div>
      <div className="text-xs text-gray-500">{day.month.slice(0, 3)}</div>
      {day.isToday && (
        <Badge variant="default" className="text-xs mt-1">
          Hoje
        </Badge>
      )}
    </div>
  );
}

function ExampleCard({ title, days }: { title: string; days: DayInfo[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {days.slice(0, 5).map((day, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 bg-gray-50 rounded"
            >
              <span>{formatDateString(day.date)}</span>
              <div className="flex gap-1">
                {day.isToday && <Badge variant="default">Hoje</Badge>}
                {day.isWeekend && (
                  <Badge variant="secondary">Final de semana</Badge>
                )}
              </div>
            </div>
          ))}
          {days.length > 5 && (
            <div className="text-sm text-gray-500 text-center">
              ... e mais {days.length - 5} dias
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
