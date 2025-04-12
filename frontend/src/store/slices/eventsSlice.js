import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchEvents = createAsyncThunk('events/fetchEvents', 
  async ({ start_date, end_date }) => {
    const response = await fetch(
      `http://localhost:8000/api/events/?start_date=${start_date}&end_date=${end_date}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    return response.json();
});

export const addEvent = createAsyncThunk('events/addEvent', 
  async (event) => {
    console.log('Sending event data:', event);
    const response = await fetch('http://localhost:8000/api/events/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server error:', errorData);
      throw new Error(JSON.stringify(errorData));
    }
    return response.json();
});

export const updateEvent = createAsyncThunk('events/updateEvent',
  async ({ id, event }) => {
    const response = await fetch(`http://localhost:8000/api/events/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    if (!response.ok) {
      throw new Error('Failed to update event');
    }
    return response.json();
});

export const deleteEvent = createAsyncThunk('events/deleteEvent',
  async (id) => {
    const response = await fetch(`http://localhost:8000/api/events/${id}/`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete event');
    }
    return id;
});

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.items.findIndex(event => event.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.items = state.items.filter(event => event.id !== action.payload);
      });
  },
});

export default eventsSlice.reducer; 