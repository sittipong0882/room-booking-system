import './App.css';
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const localizer = momentLocalizer(moment);

function Room2Admin() {
  const [events, setEvents] = useState([]);
  const [weekdaySummary, setWeekdaySummary] = useState([]);
  const [popularTimes, setPopularTimes] = useState([]);
  const [equipmentUsage, setEquipmentUsage] = useState({ 'ไมโครโฟน': 0, 'โปเจคเตอร์': 0, 'พอยเตอร์': 0 });
  const [orders, setOrders] = useState([]);

  const session = useSession();
  const supabase = useSupabaseClient();
  const { isLoading } = useSessionContext();

  useEffect(() => {
    if (session) {
      getCalendarEvents().then(fetchedEvents => {
        setEvents(fetchedEvents);
        summarizeWeekdays(fetchedEvents);
        findTopPopularTimes(fetchedEvents);
        summarizeEquipmentUsage(fetchedEvents);
      });
      fetchOrders();
    }
  }, [session]);

  // ฟังก์ชันดึงข้อมูลการจอง
  async function fetchOrders() {
    try {
      const { data, error } = await supabase
        .from('orders') // ชื่อของตารางที่เก็บออเดอร์
        .select();
        
      if (error) throw error;
      
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }

  // ฟังก์ชันลบออเดอร์จากฐานข้อมูลและปฏิทิน
  const deleteOrder = async (orderId) => {
    try {
      const { error } = await supabase
        .from('orders') // ชื่อตารางที่เก็บข้อมูลออเดอร์
        .delete()
        .eq('id', orderId);

      if (error) throw error;

      // อัปเดต state หลังการลบ
      setOrders(orders.filter(order => order.id !== orderId));

      // ลบการจองจากปฏิทิน
      setEvents(events.filter(event => event.id !== orderId));

      alert('Order deleted successfully');
    } catch (error) {
      alert('Failed to delete order: ' + error.message);
      console.error('Error deleting order:', error);
    }
  };

  if (isLoading) {
    return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"><span className="sr-only">Loading...</span></div></div>;
  }

  // ฟังก์ชันดึงข้อมูลจาก Google Calendar
  async function getCalendarEvents() {
    try {
      const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/c_25bfaeb567556c4aed4f440ca9db7ce5f37cbc568a81925cad22b591894e96bb@group.calendar.google.com/events", {
        method: "GET",
        headers: {
          Authorization: 'Bearer ' + session.provider_token,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error fetching events:', errorData); // Log the error details
        throw new Error('ข้อผิดพลาดในการดึงข้อมูลกิจกรรม');
      }
  
      const data = await response.json();
      return data.items.map(event => ({
        id: event.id, // Add unique ID from Google Calendar
        title: event.summary,
        start: new Date(event.start.dateTime || event.start.date),
        end: new Date(event.end.dateTime || event.end.date),
        description: event.description || '', // บันทึก description ถ้ามี
        location: event.location || '', // บันทึกสถานที่
        attendees: event.attendees || [], // ข้อมูลผู้เข้าร่วม
      }));
    } catch (error) {
      console.error('Caught an error:', error); // Log more information for debugging
      throw error;
    }
  }
  
  // สรุปจำนวนการจองในแต่ละวันของสัปดาห์
  function summarizeWeekdays(events) {
    const weekdayCounts = Array(5).fill(0); // Monday to Friday

    events.forEach(event => {
      const day = event.start.getDay();
      if (day >= 1 && day <= 5) { // Monday to Friday
        weekdayCounts[day - 1]++;
      }
    });

    const weekdays = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์'];
    const summary = weekdays.map((name, index) => ({
      day: name,
      count: weekdayCounts[index]
    }));

    setWeekdaySummary(summary);
  }

  // หาช่วงเวลาที่ได้รับการจองมากที่สุด
  function findTopPopularTimes(events) {
    const timeSummary = {};

    events.forEach(event => {
      const startHour = event.start.getHours();
      const endHour = event.end.getHours();

      for (let hour = startHour; hour < endHour; hour++) {
        if (!timeSummary[hour]) {
          timeSummary[hour] = 0;
        }
        timeSummary[hour]++;
      }
    });

    const sortedTimes = Object.entries(timeSummary)
      .map(([hour, count]) => ({ time: `${hour}:00 - ${parseInt(hour) + 1}:00`, count }))
      .sort((a, b) => b.count - a.count);

    setPopularTimes(sortedTimes.slice(0, 5)); // Top 5 popular times
  }

  // สรุปการใช้วัสดุอุปกรณ์
  function summarizeEquipmentUsage(events) {
    const equipmentUsage = { 'ไมโครโฟน': 0, 'โปเจคเตอร์': 0, 'พอยเตอร์': 0 };

    events.forEach(event => {
      if (event.description) {
        // ใช้ regular expression เพื่อจับคำอุปกรณ์และตัวเลขใน description
        const microphoneMatch = event.description.match(/ไมโครโฟน:\s*(\d+)/);
        const projectorMatch = event.description.match(/โปเจคเตอร์:\s*(\d+)/);
        const pointerMatch = event.description.match(/พอยเตอร์:\s*(\d+)/);

        if (microphoneMatch) {
          equipmentUsage['ไมโครโฟน'] += parseInt(microphoneMatch[1]);
        }
        if (projectorMatch) {
          equipmentUsage['โปเจคเตอร์'] += parseInt(projectorMatch[1]);
        }
        if (pointerMatch) {
          equipmentUsage['พอยเตอร์'] += parseInt(pointerMatch[1]);
        }
      }
    });

    setEquipmentUsage(equipmentUsage);
  }

  const handleEventSelect = event => {
    alert(`
      Title: ${event.title}
      Description: ${event.description}
      Location: ${event.location}
      Attendees: ${event.attendees.map(attendee => attendee.email).join(", ")}
    `);
  };

  return (
    <div className="App">
      <div className="container mt-5">
        {session ? (
          <>
            <div className="mb-4">
              <h2 className="text-primary text-center">ยินดีต้อนรับ Admin, <span className="text-success">{session.user.email}</span></h2>
            </div>

            <div className="card shadow-lg mb-4">
              <div className="card-body">
                <h3 className="text-center text-info">ปฏิทินการจองห้องประชุมหมายเลข 1 (ที่ผู้ใช้จองเข้ามา)</h3>
                <BigCalendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 500, marginTop: '20px' }}
                  defaultView="week"
                  className="border border-light rounded"
                  onSelectEvent={handleEventSelect}
                />
              </div>
            </div>
            <div className="card shadow-lg mb-4">
              <div className="card-header text-center bg-warning text-white rounded">สรุปข้อมูลการจองทั้งหมด</div>
              <ul className="list-group list-group-flush">
                {orders.map(order => (
                  <li key={order.id} className="list-group-item d-flex justify-content-between">
                    <span>{order.name}</span> 
                    <span className="badge bg-danger">
                      <button onClick={() => deleteOrder(order.id)} className="btn btn-sm btn-light">ลบ</button>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="card shadow-lg">
                  <div className="card-header text-center bg-primary text-white rounded">การจองแยกตามวันในสัปดาห์</div>
                  <ul className="list-group list-group-flush">
                    {weekdaySummary.map(item => (
                      <li key={item.day} className="list-group-item d-flex justify-content-between">
                        <span>{item.day}</span> 
                        <span className="badge bg-info">{item.count} การจอง</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="col-md-6 mb-4">
                <div className="card shadow-lg">
                  <div className="card-header text-center bg-success text-white rounded">ช่วงเวลาที่จองมากที่สุด 5 อันดับ</div>
                  <ol className="list-group list-group-numbered">
                    {popularTimes.map(item => (
                      <li key={item.time} className="list-group-item d-flex justify-content-between">
                        <span>{item.time}</span> 
                        <span className="badge bg-warning">{item.count} การจอง</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            <div className="card shadow-lg mb-4">
              <div className="card-header text-center bg-danger text-white rounded">การใช้วัสดุอุปกรณ์</div>
              <ul className="list-group list-group-flush">
                {Object.entries(equipmentUsage).map(([equipment, usage]) => (
                  <li key={equipment} className="list-group-item d-flex justify-content-between">
                    <span>{equipment}</span> 
                    <span className="badge bg-info">{usage} ครั้ง</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center mt-4">
        <button className="btn btn-secondary btn-lg" onClick={() => alert('กำลังนำคุณไปที่หน้าจัดการห้อง 2')}>
          จัดการห้อง 2
        </button>
      </div>
          </>

   
     


        ) : (
          <div className="text-center">
            <h3>กรุณาเข้าสู่ระบบเพื่อใช้งานระบบ</h3>
            <button className="btn btn-primary rounded-pill px-4 py-2" onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}>
              เข้าสู่ระบบด้วย Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Room2Admin;
