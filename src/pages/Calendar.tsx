
import React from 'react';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from '@/components/Layout';
import { useRoutes } from '@/hooks/useRoutes';

const Calendar = () => {
  const { groupedRoutes, loading, error } = useRoutes();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = monthStart;
  const endDate = monthEnd;
  
  const dateFormat = "MMMM yyyy";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayIndices = [0, 1, 2, 3, 4, 5, 6];
  
  const previousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  
  // Generate dates for the current month view
  const getDaysInMonth = () => {
    const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });
    
    // Calculate days from previous month to fill first week
    const firstDayOfMonth = getDay(monthStart);
    
    const allDays = [];
    
    // Add previous month days
    const prevMonthDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      const prevDate = new Date(monthStart);
      prevDate.setDate(prevDate.getDate() - (firstDayOfMonth - i));
      prevMonthDays.push({
        date: prevDate,
        isCurrentMonth: false,
        isToday: false,
      });
    }
    
    allDays.push(...prevMonthDays);
    
    // Add current month days
    const currentMonthDays = daysInMonth.map(date => ({
      date,
      isCurrentMonth: true,
      isToday: format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'),
    }));
    
    allDays.push(...currentMonthDays);
    
    // Add next month days to complete grid
    const totalCells = Math.ceil(allDays.length / 7) * 7;
    const nextMonthDays = [];
    for (let i = allDays.length; i < totalCells; i++) {
      const nextDate = new Date(monthEnd);
      nextDate.setDate(nextDate.getDate() + (i - allDays.length + 1));
      nextMonthDays.push({
        date: nextDate,
        isCurrentMonth: false,
        isToday: false,
      });
    }
    
    allDays.push(...nextMonthDays);
    
    // Group days into weeks
    const weeks = [];
    for (let i = 0; i < allDays.length; i += 7) {
      weeks.push(allDays.slice(i, i + 7));
    }
    
    return weeks;
  };
  
  // Find routes that fall on a given date
  const getRoutesForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const group = groupedRoutes.find(group => group.date === dateStr);
    return group ? group.routes : [];
  };
  
  const weeks = getDaysInMonth();
  
  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Calendar</h1>
          <p className="text-muted-foreground">View your scheduled routes by date</p>
        </div>
        
        <div className="glass-panel flex items-center p-1">
          <button 
            onClick={previousMonth}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="mx-4 font-medium">{format(currentMonth, dateFormat)}</h2>
          <button 
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="glass-panel p-12 flex justify-center">
          <div className="animate-pulse">Loading calendar data...</div>
        </div>
      ) : error ? (
        <div className="glass-panel p-6 bg-destructive/10 text-destructive">
          {error}
        </div>
      ) : (
        <div className="glass-panel p-4">
          <div className="grid grid-cols-7 mb-4">
            {days.map(day => (
              <div key={day} className="text-center font-medium py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid gap-2">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-2">
                {week.map((day, dayIndex) => {
                  const routes = getRoutesForDate(day.date);
                  return (
                    <div 
                      key={dayIndex} 
                      className={`min-h-[100px] p-2 rounded-lg border ${
                        day.isCurrentMonth 
                          ? day.isToday
                            ? 'bg-primary/10 border-primary'
                            : 'bg-white dark:bg-black/20 border-border'
                          : 'bg-secondary/20 border-transparent text-muted-foreground'
                      }`}
                    >
                      <div className="text-right mb-1">
                        {format(day.date, 'd')}
                      </div>
                      
                      <div className="space-y-1">
                        {routes.slice(0, 3).map(route => (
                          <Link 
                            key={route.id}
                            to={`/routes/edit/${route.id}`}
                            className="block text-xs bg-primary/10 text-primary px-2 py-1 rounded truncate hover:bg-primary/20 transition-colors"
                          >
                            {route.name}
                          </Link>
                        ))}
                        {routes.length > 3 && (
                          <div className="text-xs text-muted-foreground text-center">
                            +{routes.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Calendar;
