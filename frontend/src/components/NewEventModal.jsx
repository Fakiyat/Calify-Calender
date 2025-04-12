import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { addEvent, updateEvent, deleteEvent } from '../store/slices/eventsSlice';

const CATEGORIES = [
  { value: 'exercise', label: 'Exercise', color: '#FF4B4B' },
  { value: 'eating', label: 'Eating', color: '#4CAF50' },
  { value: 'work', label: 'Work', color: '#2196F3' },
  { value: 'relax', label: 'Relax', color: '#9C27B0' },
  { value: 'family', label: 'Family', color: '#FF9800' },
  { value: 'social', label: 'Social', color: '#00BCD4' },
];

function NewEventModal({ open, onClose, selectedSlot, selectedEvent }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'work',
    start_date: '',
    end_date: '',
    start_time: '09:00',
    end_time: '10:00',
  });

  useEffect(() => {
    if (open) {
      if (selectedSlot) {
        const startDate = new Date(selectedSlot.start);
        const endDate = new Date(selectedSlot.end);
        
        setFormData({
          title: '',
          description: '',
          category: 'work',
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          start_time: startDate.toTimeString().slice(0, 5),
          end_time: endDate.toTimeString().slice(0, 5),
          color: CATEGORIES.find(cat => cat.value === 'work')?.color,
        });
      } else if (selectedEvent) {
        const startDate = new Date(selectedEvent.start_time);
        const endDate = new Date(selectedEvent.end_time);
        
        setFormData({
          title: selectedEvent.title,
          description: selectedEvent.description || '',
          category: selectedEvent.category || 'work',
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          start_time: startDate.toTimeString().slice(0, 5),
          end_time: endDate.toTimeString().slice(0, 5),
          color: selectedEvent.color || CATEGORIES.find(cat => cat.value === 'work')?.color,
        });
      } else {
        // Default values for new event without selected slot
        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
        
        setFormData({
          title: '',
          description: '',
          category: 'work',
          start_date: now.toISOString().split('T')[0],
          end_date: now.toISOString().split('T')[0],
          start_time: now.toTimeString().slice(0, 5),
          end_time: oneHourLater.toTimeString().slice(0, 5),
          color: CATEGORIES.find(cat => cat.value === 'work')?.color,
        });
      }
    }
  }, [open, selectedSlot, selectedEvent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'category' && { color: CATEGORIES.find(cat => cat.value === value)?.color }),
    }));
  };

  const handleSubmit = () => {
    try {
      const startDateTime = new Date(`${formData.start_date}T${formData.start_time}`);
      const endDateTime = new Date(`${formData.end_date}T${formData.end_time}`);

      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        console.error('Invalid date/time values');
        return;
      }

      const eventData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        color: formData.color,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
      };

      if (selectedEvent) {
        dispatch(updateEvent({
          id: selectedEvent.id,
          event: eventData,
        }));
      } else {
        dispatch(addEvent(eventData));
      }
      onClose();
    } catch (error) {
      console.error('Error creating/updating event:', error);
    }
  };

  const handleDelete = () => {
    if (selectedEvent) {
      dispatch(deleteEvent(selectedEvent.id));
    }
    onClose();
    
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
        }
      }}
    >
      <DialogTitle sx={{
        fontSize: '1.5rem',
        fontWeight: 600,
        color: '#1a237e',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        pb: 2
      }}>
        {selectedEvent ? 'Edit Event' : 'New Event'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 3, 
          mt: 3,
          '& .MuiTextField-root': {
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.01)',
              },
              '&.Mui-focused': {
                boxShadow: '0 0 0 2px rgba(25,118,210,0.2)',
              }
            }
          }
        }}>
          <TextField
            name="title"
            label="Event Title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
          />
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Category"
              sx={{
                borderRadius: '12px',
                '& .MuiOutlinedInput-notchedOutline': {
                  transition: 'all 0.2s ease',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  boxShadow: '0 0 0 2px rgba(25,118,210,0.2)',
                }
              }}
            >
              {CATEGORIES.map((category) => (
                <MenuItem 
                  key={category.value} 
                  value={category.value}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 1.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: `${category.color}15`,
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: category.color,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  />
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              }
            }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Start Date"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Start Time"
              name="start_time"
              type="time"
              value={formData.start_time}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{
                step: 300, // 5 minutes
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="End Date"
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Time"
              name="end_time"
              type="time"
              value={formData.end_time}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{
                step: 300, // 5 minutes
              }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ 
        p: 3, 
        gap: 1,
        borderTop: '1px solid rgba(0,0,0,0.1)',
      }}>
        {selectedEvent && (
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="outlined"
            sx={{ 
              mr: 'auto',
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'error.light',
                color: 'error.contrastText',
                borderColor: 'error.light',
              }
            }}
          >
            Delete
          </Button>
        )}
        <Button 
          onClick={onClose}
          sx={{ 
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          sx={{ 
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 500,
            boxShadow: '0 4px 12px rgba(25,118,210,0.2)',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(25,118,210,0.3)',
            }
          }}
        >
          {selectedEvent ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NewEventModal; 