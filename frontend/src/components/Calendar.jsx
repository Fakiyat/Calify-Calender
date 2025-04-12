import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../store/slices/eventsSlice';
import { Box, Paper, useTheme, Typography, IconButton, Tooltip, ToggleButton, ToggleButtonGroup, Fade, Popper } from '@mui/material';
import NewEventModal from './NewEventModal';
import './Calendar.css';
import { ChevronLeft, ChevronRight, Today, CalendarViewDay, CalendarViewWeek, CalendarMonth, ViewList } from '@mui/icons-material';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CustomToolbar = (toolbar) => {
  const theme = useTheme();
  const viewNames = {
    month: 'Month',
    week: 'Week',
    day: 'Day',
    agenda: 'Agenda'
  };

  const goToBack = () => {
    toolbar.onNavigate('PREV');
  };

  const goToNext = () => {
    toolbar.onNavigate('NEXT');
  };

  const goToCurrent = () => {
    toolbar.onNavigate('TODAY');
  };

  const ViewIcon = {
    month: CalendarMonth,
    week: CalendarViewWeek,
    day: CalendarViewDay,
    agenda: ViewList
  };

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      mb: 3,
      px: 2,
      flexWrap: 'wrap',
      gap: 2
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="Previous">
          <IconButton onClick={goToBack} size="small" sx={{ 
            backgroundColor: 'background.paper',
            boxShadow: 1,
            '&:hover': { backgroundColor: 'primary.light' }
          }}>
            <ChevronLeft />
          </IconButton>
        </Tooltip>
        <Tooltip title="Next">
          <IconButton onClick={goToNext} size="small" sx={{ 
            backgroundColor: 'background.paper',
            boxShadow: 1,
            '&:hover': { backgroundColor: 'primary.light' }
          }}>
            <ChevronRight />
          </IconButton>
        </Tooltip>
        <Tooltip title="Today">
          <IconButton onClick={goToCurrent} size="small" sx={{ 
            backgroundColor: 'background.paper',
            boxShadow: 1,
            '&:hover': { backgroundColor: 'primary.light' }
          }}>
            <Today />
          </IconButton>
        </Tooltip>
      </Box>

      <Typography variant="h5" sx={{ 
        fontWeight: 600,
        color: 'primary.main',
        textTransform: 'capitalize',
      }}>
        {toolbar.label}
      </Typography>

      <ToggleButtonGroup
        value={toolbar.view}
        exclusive
        onChange={(_, newView) => {
          if (newView !== null) {
            toolbar.onView(newView);
          }
        }}
        aria-label="calendar view"
        size="small"
        sx={{
          '& .MuiToggleButton-root': {
            px: 2,
            py: 0.5,
            textTransform: 'none',
            '&.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                backgroundColor: 'primary.dark',
              }
            }
          }
        }}
      >
        {Object.keys(viewNames).map(viewKey => {
          const Icon = ViewIcon[viewKey];
          return (
            <ToggleButton 
              key={viewKey} 
              value={viewKey}
              aria-label={viewNames[viewKey]}
            >
              <Icon sx={{ mr: 1 }} fontSize="small" />
              {viewNames[viewKey]}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </Box>
  );
};

const EventTooltip = ({ event }) => {
  const formatDateTime = (date) => {
    return format(new Date(date), 'MMM dd, yyyy hh:mm a');
  };

  return (
    <Box sx={{
      p: 2,
      bgcolor: 'background.paper',
      borderRadius: 2,
      boxShadow: 4,
      maxWidth: 320,
      minWidth: 250,
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    }}>
      <Typography variant="h6" sx={{ 
        fontWeight: 600, 
        mb: 1,
        color: event.color || 'primary.main',
      }}>
        {event.title}
      </Typography>
      {event.description && (
        <Typography variant="body2" sx={{ mb: 1.5, color: 'text.secondary' }}>
          {event.description}
        </Typography>
      )}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 0.5,
        bgcolor: 'background.default',
        p: 1,
        borderRadius: 1,
      }}>
        <Typography variant="caption" sx={{ 
          display: 'flex', 
          alignItems: 'center',
          color: 'text.secondary',
          '& strong': { color: 'text.primary', ml: 1 }
        }}>
          Start: <strong>{formatDateTime(event.start)}</strong>
        </Typography>
        <Typography variant="caption" sx={{ 
          display: 'flex', 
          alignItems: 'center',
          color: 'text.secondary',
          '& strong': { color: 'text.primary', ml: 1 }
        }}>
          End: <strong>{formatDateTime(event.end)}</strong>
        </Typography>
      </Box>
    </Box>
  );
};

const CustomEvent = ({ event }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMouseEnter = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          height: '100%',
          width: '100%',
          padding: '4px',
        }}
      >
        {event.title}
      </div>
      <Popper
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        placement="top"
        transition
        sx={{ 
          zIndex: 1300,
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
        }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <div>
              <EventTooltip event={event} />
            </div>
          </Fade>
        )}
      </Popper>
    </>
  );
};

function Calendar() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const events = useSelector(state => state.events.items);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState('month');

  useEffect(() => {
    const fetchEventsForView = () => {
      const start = new Date();
      const end = new Date();
      
      // Adjust the date range based on the current view
      switch (view) {
        case 'month':
          start.setDate(1);
          end.setMonth(end.getMonth() + 1);
          end.setDate(0); // Last day of the month
          break;
        case 'week':
          start.setDate(start.getDate() - start.getDay()); // Start of week
          end.setDate(start.getDate() + 6); // End of week
          break;
        case 'day':
          end.setDate(start.getDate() + 1);
          break;
        case 'agenda':
          start.setMonth(start.getMonth() - 1); // Show past month
          end.setMonth(end.getMonth() + 2); // Show next 2 months
          break;
      }
      
      dispatch(fetchEvents({
        start_date: start.toISOString(),
        end_date: end.toISOString(),
      }));
    };

    fetchEventsForView();
  }, [dispatch, view]); // Re-fetch when view changes

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setSelectedSlot(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
    setSelectedEvent(null);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const eventStyleGetter = (event) => {
    const isSelected = selectedEvent && selectedEvent.id === event.id;
    return {
      style: {
        backgroundColor: event.color || theme.palette.primary.main,
        borderRadius: '8px',
        opacity: isSelected ? 1 : 0.9,
        color: '#fff',
        border: 'none',
        fontWeight: '500',
        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
        transition: 'all 0.2s ease',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isSelected 
          ? '0 4px 12px rgba(0,0,0,0.2)' 
          : '0 2px 4px rgba(0,0,0,0.1)',
        cursor: 'pointer',
      },
    };
  };

  const calendarEvents = events.map((event) => ({
    ...event,
    start: new Date(event.start_time),
    end: new Date(event.end_time),
    title: event.title,
    allDay: false, // Set this based on your needs
  }));

  return (
    <Box sx={{ 
      height: 'calc(100vh - 64px)', 
      p: 3,
      background: 'linear-gradient(145deg, #f0f4ff 0%, #f7f9ff 100%)',
      transition: 'all 0.3s ease',
      position: 'relative',
    }}>
      <Paper sx={{ 
        height: '100%', 
        p: 2,
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        background: '#ffffff',
        overflow: 'hidden',
        '& .rbc-event': {
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.02)',
          }
        },
        '& .rbc-agenda-view': {
          margin: '0',
          '& table.rbc-agenda-table': {
            border: 'none',
            '& thead': {
              '& th': {
                padding: '12px 8px',
                fontWeight: 600,
                backgroundColor: 'background.paper',
                borderBottom: '2px solid',
                borderBottomColor: 'divider',
              }
            },
            '& tbody > tr > td': {
              padding: '12px 8px',
              borderBottom: '1px solid',
              borderBottomColor: 'divider',
            },
            '& tbody > tr:hover': {
              backgroundColor: 'action.hover',
            }
          }
        }
      }}>
        <BigCalendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          selectable
          resizable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          style={{ height: '100%' }}
          view={view}
          onView={handleViewChange}
          components={{
            toolbar: CustomToolbar,
            event: CustomEvent,
          }}
          views={['month', 'week', 'day', 'agenda']}
          defaultView="month"
          popup
          length={30}
        />
      </Paper>
      <NewEventModal
        open={isModalOpen}
        onClose={handleCloseModal}
        selectedSlot={selectedSlot}
        selectedEvent={selectedEvent}
      />
    </Box>
  );
}

export default Calendar; 