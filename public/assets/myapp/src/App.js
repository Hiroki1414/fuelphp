import React from 'react';
import MainApp from "./components/mainapp";

function App() {
  const fetchEvents = async (setEvents) => {
    try {
      const response = await fetch('http://localhost:8888/rest/calendar/list');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Received data:", result); 
      if (Array.isArray(result.data)) {
        setEvents(result.data);
      } else {
          console.error('Data is not an array:', result.data);
      }
    } catch (error) {
        console.error("Fetching events failed:", error);
    }
  };

  const handleEdit = (event, setEditingEvent) => {
    setEditingEvent({ ...event });
  };

  const handleUpdate = async (id, editingEvent, setEvents, setEditingEvent) => {
    try {
      const eventDetails = {
        start: editingEvent.start,
        end: editingEvent.end,
        title: editingEvent.title,
        color: editingEvent.color,
      };

      const response = await fetch(`http://localhost:8888/rest/calendar/update/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventDetails),
      });
      if (!response.ok) throw new Error('Network response was not ok.');
      const result = await response.json(); // 更新されたイベントデータを取得
      if (result.status === 'success') {
      setEvents(prevEvents => prevEvents.map(event => 
        event.schedule_id === id ? { ...event, ...result.data[0] }: event)); // イベントリストを更新
      setEditingEvent(null); 
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Updating event failed:", error);
    }
  };

  const handleDelete = async (id, setEvents) => {
    try {
      const response = await fetch(`http://localhost:8888/rest/calendar/delete/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Network response was not ok.');
      window.location.reload()
      setEvents(prevEvents => prevEvents.filter(event => event.schedule_id !== id)); // イベントリストから削除
    } catch (error) {
      console.error("Deleting event failed:", error);
    }
  };  

  return <MainApp 
    fetchEvents={fetchEvents} 
    handleUpdate={handleUpdate} 
    handleEdit={handleEdit} 
    handleDelete={handleDelete} 
  />;
}

export default App;
